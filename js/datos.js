import { supabase } from "../src/supabase.js";

const origenSelect = document.querySelector("#origen-ciudad");
const destinoSelect = document.querySelector("#destino-ciudad");
const dateInput = document.querySelector(".date");
const buttonSearch = document.querySelector("#button");
const codigo = document.querySelector(".code");
const lastname = document.querySelector(".lastname");
const boton2 = document.querySelector("#button2");

let ciudades;
let rutas;
let ciudadesDestino;
let citySelected1;
let citySelected2;
let idRutaSelected;
let fechaSeleccionada;
let resultsVuelos;
let nombre1, nombre2, fecha, disponi, hora, idVuelo;
let infoReserva, infoVuelo, infoRuta, nombreCiudad1, nombreCiudad2, infoPasajero;


async function fetchCiudad() {
    const { data, error } = await supabase
        .from('Ciudad')
        .select('*')

    if (error) throw error

    console.log(data)
    ciudades = data;
    fillSelect1(ciudades)
}

async function fetchRuta() {
    const { data, error } = await supabase
        .from('Ruta')
        .select('*')

    if (error) throw error
    rutas = data;
    console.log(rutas.map(r => r.ciudadOrigen))
}

async function obtenerCiudadesDestino(idCiudadOrigen) {
    const { data: rutas, error: errorRutas } = await supabase
      .from('Ruta')
      .select('ciudadDestino')
      .eq('ciudadOrigen', idCiudadOrigen)
  
    if (errorRutas) {
      console.error('Error al obtener rutas:', errorRutas)
      return
    }
  
    const idsCiudadesDestino = rutas.map((ruta) => ruta.ciudadDestino)
  
    const { data, error } = await supabase
      .from('Ciudad')
      .select('*')
      .in('id_ciudad', idsCiudadesDestino)
  
      if (error) throw error
      ciudadesDestino = data;
    
    console.log(ciudadesDestino)
    return ciudadesDestino;
}

function fillSelect1(ciudades){
    console.log(ciudades)
    ciudades.forEach(ciudad => {
        const origen = document.createElement('option')
        origen.value = ciudad.id_ciudad;
        origen.textContent = ciudad.ciudad;
        origenSelect.appendChild(origen);
    })
}

function fillSelects2(ciudades, select){
    select.innerHTML = ""; 
    ciudades.forEach(ciudad => {
        const option = document.createElement('option')
        option.value = ciudad.id_ciudad;
        option.textContent = ciudad.ciudad;
        select.appendChild(option);
    })
}


origenSelect.addEventListener('change', async (e)=>{
    citySelected1 = e.target.value;
    nombre1 = ciudades.filter(c=> c.id_ciudad == citySelected1).map(c=> c.ciudad);
    localStorage.setItem("Origen", nombre1)
    const destinos = await obtenerCiudadesDestino(citySelected1);
    fillSelects2(destinos, destinoSelect)
})

destinoSelect.addEventListener('change', async (e)=>{
    citySelected2 = e.target.value;
    nombre2 = ciudades.filter(c=> c.id_ciudad == citySelected2).map(c=> c.ciudad);
    localStorage.setItem("Destino", nombre2)
    idRutaSelected = await saveRuta(citySelected1, citySelected2);
})

function saveRuta(origen, destino){
    let rutaFinal = rutas.filter(r=> r.ciudadOrigen == origen && r.ciudadDestino == destino).map(r => r.id_ruta);
    console.log(rutaFinal)
    return rutaFinal
}


dateInput.addEventListener('change', (e) => {
    fechaSeleccionada = e.target.value;
    localStorage.setItem("Fecha", fechaSeleccionada)
    console.log('Fecha seleccionada:', fechaSeleccionada);
});

async function searchVuelo(r, f){
    const { data, error } = await supabase
    .from('Vuelos')
    .select('*')
    .eq('id_ruta', r)
    .eq('Fecha', f)
    .gt('Disponibles', 0)
    
    if (error) throw error
    resultsVuelos = data;
    
}


buttonSearch.addEventListener("click", async (e) => {
    e.preventDefault();
    await searchVuelo(idRutaSelected, fechaSeleccionada);
    resultSearch.innerHTML = ""
    if (resultsVuelos.length == 0){
        ShowNoResult(false);
    }else{
        ShowNoResult(true);
    }
    for (let i = 0; i < resultsVuelos.length; i++) {
        let vuelo = resultsVuelos[i]
        idVuelo = vuelo.id_vuelo
        console.log(idVuelo)
        let fecha = vuelo.Fecha;
        let hora = vuelo.Hora;
        let disponi = vuelo.Disponibles;

        console.log(resultsVuelos)
            ShowResultPanel(nombre1, nombre2, fecha, hora, disponi, idVuelo);
    }
    
});

boton2.addEventListener("click", async(e) =>{
    e.preventDefault();
    await searchReserva(codigo.value, lastname.value);
    await allInfo();
    window.location.href = "reserva.html";
    ShowReserva(codigo.value, nombreCiudad1, nombreCiudad2, infoVuelo.Fecha, infoVuelo.Hora, infoVuelo.id_vuelo, infoPasajero.Nombre, infoPasajero.Apellido, lastname.value)

})


fetchCiudad();
fetchRuta();

//_--------------------- result.js --------------------


let HoraGuardada;
const resultSearch = document.querySelector(".result-panel");

function ShowResultPanel(origen, destino, date, time, asientos, numero){ 
    resultSearch.innerHTML += `
    <tr>    
        <td>${origen}</td>
        <td>${destino}</td>
        <td>${date}</td>
        <td>${time}</td>
        <td>${asientos}</td>
        <td>
        <a href="compra.html">
        <button id=${numero} class="btnReservar">Comprar</button>
        </a>
    </td>
    </tr>
    `;
}

resultSearch.addEventListener("click", async (e) => {
    e.preventDefault();
    localStorage.setItem('Nombre', "");    
    localStorage.setItem('Apellido', "");
    const numeroVuelo = e.target.id;
    await catchTime(numeroVuelo);
    localStorage.setItem('idVuelo', numeroVuelo);
    window.location.href = "compra.html";
})

async function catchTime(i){
    
    const { data, error } = await supabase
    .from('Vuelos')
    .select('Hora')
    .eq('id_vuelo', i)

    if (error) throw error
    HoraGuardada = data[0].Hora;
    console.log(HoraGuardada);

    localStorage.setItem("Hora", HoraGuardada)
}

async function searchReserva(i, d){
    const { data, error } = await supabase
    .from('Reserva')
    .select('*')
    .eq('id_reserva', i)
    .eq('DNI', d)


    if (error) throw error
    infoReserva = data;
}

async function allInfo(){
    console.log(infoReserva[0])
    const { data, error } = await supabase
    .from('Vuelos')
    .select('*')
    .eq('id_vuelo', infoReserva[0].id_vuelo)


    if (error) throw error
    infoVuelo = data

    console.log(infoVuelo[0]    )
    const {data: data1, error: error1} = await supabase
    .from('Ruta')
    .select('*')
    if (error1) throw error1
    infoRuta = data1;
    console.log(data1);

    const {data: data2, error: error2} = await supabase
    .from('Ciudad')
    .select('*')
    .eq('id_ciudad', infoRuta[0].ciudadOrigen)
    if (error2) throw error2
    nombreCiudad1 = data2

    const {data: data3, error: error3} = await supabase
    .from('Ciudad')
    .select('*')
    .eq('id_ciudad', infoRuta[0].ciudadDestino)
    if (error3) throw error3
    nombreCiudad2 = data3

    const {data: data4, error: error4} = await supabase
    .from('Pasajero')
    .select('*')
    .eq('DNI', infoReserva[0].DNI)
    if (error4) throw error4
    infoPasajero = data4
}