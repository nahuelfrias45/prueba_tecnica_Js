let map = L.map('map').setView([-34.60526945844889, -58.42289744529594], 18)
let marker = L.marker([-34.60526945844889, -58.42289744529594]).addTo(map);
marker.bindPopup("<b>Casa</b><br>")


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);


map.doubleClickZoom.disable()

map.on('dblclick', e => {
    let latLng = map.mouseEventToLatLng(e.originalEvent)
    L.marker(latLng).addTo(map)
})


//aca consigo "mis" cordenadas  
/*
navigator.geolocation.getCurrentPosition(
    (pos) => {
        const { coords } = pos
        console.log(coords)
        L.marker([coords.latitude, coords.longitude]).addTo(map)
        L.map('map').setView([coords.latitude, coords.longitude], 15)
    },
    (err) => {
        console.log(err)
    },
    {
        enableHighAcurracy:true,
        timeout: 5000,
        maximumAge: 0
    }
)
*/