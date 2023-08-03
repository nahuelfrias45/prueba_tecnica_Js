
const xhttp = new XMLHttpRequest();

xhttp.open('GET', 'coordenadas.json', true);

xhttp.send();

xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200) {
        let datos = JSON.parse(this.responseText)
        console.log(datos)
    }
}

const marcadorDatos = [];
const map = L.map('map');//indico en donde se va a mostrar el mapa (en este caso en el div map)
const mapGlobal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);// establesco el mapa a utilizar
const agregar = document.getElementById('btn-agregar');

// recupero una cordenada cerca del usuario y la uso como posición default
const firstPosition = navigator.geolocation.getCurrentPosition(
    (pos) => {
        const { coords } = pos
        console.log(coords)
        map.setView([coords.latitude, coords.longitude], 16)
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

agregar.addEventListener('click', function(event) {
    event.preventDefault()
    let nombre = document.getElementById('nombre').value;
    let direccion = document.getElementById('direccion').value;
    let telefono = document.getElementById('telefono').value;
    let coordenadas = document.getElementById('coordenadas').value;
    let categoria = document.getElementById('categoria').value;

    if (telefono == "") {
        telefono = "no tiene numero"
    }// llenamos el campo de telefono si este mismo no es completado

    console.log(nombre)
    console.log(direccion)
    console.log(telefono)
    console.log(coordenadas)
    console.log(categoria)

    let arr = coordenadas.split(",")// utilizo split para separar las coordenadas por su " , " que vuelven como strings 
    let posicion = {
        lat: arr[0],
        lng: arr[1]
    }//la libreria para marcar una posicion busca en un objeto las keys 'lat' y 'lng'
    let marker = L.marker(posicion).addTo(map);
    marker.bindPopup(`<b>Nombre: ${nombre}</b><br><b>Dirección: ${direccion}</b><br><b>Teléfono: ${telefono}</b><br><b>Categoria: ${categoria}</b><br><b>(x , Y): ${coordenadas}</b><br><button id="btn-eliminar" data-id="${coordenadas}" onclick="eliminar()">Eliminar</button>`)

    map.flyTo(posicion, 18)//te traslada al lugar del marcador agregado

    marcadorDatos.push({nombre: nombre, direccion: direccion, telefono: telefono, categoria: categoria, coordenadas: coordenadas})
    console.log(marcadorDatos)
})

function eliminar() {
    let btnEliminar = document.getElementById('btn-eliminar')
    let coordenadas = btnEliminar.dataset.id
    let arr = coordenadas.split(",")
    let latitud = parseFloat(arr[0]);//paso las cordenadas a float 
    let longitud = parseFloat(arr[1]);

    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            let marcador = layer;
            let marcadorLatitud = marcador.getLatLng().lat;//getLatLng()recibe cordenadas en float y compara con otro numero float
            let marcadorLongitud = marcador.getLatLng().lng;

            if (marcadorLatitud === latitud && marcadorLongitud === longitud) {
                // Remover el marcador del mapa
                map.removeLayer(marcador);
            }
        }
    });
}

map.doubleClickZoom.disable()

map.on('dblclick', e => {
    let latLng = map.mouseEventToLatLng(e.originalEvent)
    L.marker(latLng).addTo(map)
    console.log(latLng)
})