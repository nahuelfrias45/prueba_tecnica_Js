const map = L.map('map');//indico en donde se va a mostrar el mapa (en este caso en el div map)
const mapGlobal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);// establesco el mapa a utilizar

const form = document.getElementById('form');
const marcadorDatos = [];

map.doubleClickZoom.disable()

// recupero una cordenada cerca del usuario y la uso como posición default
const posicionDefault = navigator.geolocation.getCurrentPosition(
    (pos) => {
        const { coords } = pos
        map.setView([coords.latitude, coords.longitude], 15)
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

//Leo el archivo JSON, recupero la informacion y creo marcadores con los datos 
const xhttp = new XMLHttpRequest();
xhttp.open('GET', 'coordenadas.json', true);
xhttp.send();
xhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200) {
        let datos = JSON.parse(this.responseText)
        datos.forEach(coords => {
            let data = coords.coordenadas
            let arr = data.split(",")
            let posicion = {
                lat: arr[0],
                lng: arr[1]
            }
            let marker = L.marker(posicion).addTo(map);
            marker.bindPopup(`<b>Nombre: ${coords.nombre}</b><br><b>Dirección: ${coords.direccion}</b><br><b>Teléfono: ${coords.telefono}</b><br><b>Categoria: ${coords.categoria}</b><br><b>(x , Y): ${coords.coordenadas}</b><br><button id="btn-eliminar" data-name="${coords.nombre}" data-id="${coords.coordenadas}" onclick="eliminar()">Eliminar</button>`)
        });
        
    }
}

form.addEventListener('submit', function(event) {
    event.preventDefault()
    let nombre = document.getElementById('nombre').value;
    let direccion = document.getElementById('direccion').value;
    let telefono = document.getElementById('telefono').value;
    let coordenadas = document.getElementById('coordenadas').value;
    let categoria = document.getElementById('categoria').value;

    if (telefono == "") {
        telefono = "no tiene numero"
    }// llenamos el campo de telefono si este mismo no es completado

    let arr = coordenadas.split(",")// utilizo split para separar las coordenadas por su " , " que vuelven como strings 
    let posicion = {
        lat: arr[0],
        lng: arr[1]
    }//la libreria para marcar una posicion busca en un objeto las keys 'lat' y 'lng'
    let marker = L.marker(posicion).addTo(map);
    marker.bindPopup(`<b>Nombre: ${nombre}</b><br><b>Dirección: ${direccion}</b><br><b>Teléfono: ${telefono}</b><br><b>Categoria: ${categoria}</b><br><b>(x , Y): ${coordenadas}</b><br><button id="btn-eliminar" data-name="${nombre}" data-id="${coordenadas}" onclick="eliminar()">Eliminar</button>`)

    map.flyTo(posicion, 18)//te traslada al lugar del marcador agregado

    marcadorDatos.push({nombre: nombre, coordenadas: coordenadas, direccion: direccion})// guardo los marcadores creado por el form en un array
    
    let marcadoresHTML = "";
    marcadorDatos.forEach(marcadorD => {
        let marcador = marcadorD.nombre;
        let coordenadas = marcadorD.coordenadas;
        let direccion = marcadorD.direccion;
        marcadoresHTML += `<div id="${marcador}" class="contenedor-m"><span><i class="bi bi-geo-alt" id="moverMapa" onclick="mover()" data-id="${coordenadas}"></i><b>${marcador}</b> (${direccion})</span></div>`;
        let marcadores = document.getElementById('marcadores');
        marcadores.innerHTML = marcadoresHTML;
    });

    //limpio los inputs
    document.getElementById('nombre').value = "";
    document.getElementById('direccion').value = "";
    document.getElementById('telefono').value = "";
    document.getElementById('coordenadas').value = "";
    document.getElementById('categoria').value = "";
})

function mover(){
    let btnMover = document.getElementById('moverMapa')
    let coordenadas = btnMover.dataset.id
    let arr = coordenadas.split(",")
    let posicion = {
        lat: arr[0],
        lng: arr[1]
    }
    map.flyTo(posicion, 18)
}

function eliminar() {
    let btnEliminar = document.getElementById('btn-eliminar')
    let divId = document.getElementById(btnEliminar.dataset.name)
    let coordenadas = btnEliminar.dataset.id
    let arr = coordenadas.split(",")
    let latitud = parseFloat(arr[0]);//paso las cordenadas a float 
    let longitud = parseFloat(arr[1]);

    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            let marcador = layer;
            let marcadorLatitud = marcador.getLatLng().lat;//getLatLng()recibe cordenadas en float y compara 
            let marcadorLongitud = marcador.getLatLng().lng;

            if (marcadorLatitud === latitud && marcadorLongitud === longitud) {
                map.removeLayer(marcador);
            }
        }
    });

    divId.remove()
}



map.on('dblclick', e => {
    let latLng = map.mouseEventToLatLng(e.originalEvent)
    let marker = L.marker(latLng).addTo(map)

    //adapto el objeto de la variable latLng para que pueda ser utilizada en la funcion eliminar()
    let markerLat = `${latLng.lat}`
    let markerLng = `${latLng.lng}`
    let markerString = markerLat+","+markerLng

    //la funcion eliminar() lee el string del data-id y busca una " , " para hacer el split
    marker.bindPopup(`<button id="btn-eliminar" data-id="${markerString}" onclick="eliminar()">Eliminar</button>`)
})

  
