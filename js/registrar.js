/* import { c } from "vite/dist/node/types.d-aGj9QkWt.js"; */
import { supabase } from "../src/supabase.js";


let apellidoToSave, nombreToSave;


const namePasajero = document.querySelector("#name");
const lastnamePasajero = document.querySelector("#lastname");
const mailPasajero = document.querySelector("#mail");
const dniPasajero = document.querySelector("#DNI");
const btnConfirm = document.querySelector("#btnConfirm");

async function registrarDatos(dni, name, lastname, mail) {
    const { error } = await supabase
        .from('Pasajero')
        .insert([
            { DNI: dni, Nombre: name, Apellido: lastname, Email: mail },
        ])

    if (error) {
        console.error('Error al registrar datos:', error)
    } else {
        console.log('Datos registrados exitosamente.')
    }

    localStorage.setItem("Nombre", name);
    localStorage.setItem("Apellido", lastname);
}


btnConfirm.addEventListener("click", async (e) => {
    e.preventDefault()  // Evitar que el formulario se recargu
    const dni = document.querySelector("#DNI").value
    const name = document.querySelector("#name").value
    const lastname = document.querySelector("#lastname").value
    const mail = document.querySelector("#mail").value

    await verifyDNI(dni, name, lastname, mail)  // Pasar los valores al verificar el DNI
})

function generarCodigoAleatorio() {
    let codigo = Math.floor(100000 + Math.random()*900000)
    return codigo
}


async function generarReserva(){
    const dni = document.querySelector("#DNI").value
    let idVuelo = localStorage.getItem('idVuelo')
    let codigo = generarCodigoAleatorio()
    localStorage.setItem("codigo", codigo)
    localStorage.setItem("DNI", dni)
    console.log(dni, idVuelo, codigo);

    const { error } = await supabase
        .from('Reserva')
        .insert([
            { id_reserva: codigo, DNI: dni, id_vuelo: idVuelo},
        ])

    if (error) {
        console.error('Error al registrar datos:', error)
    } else {
        console.log('Datos registrados exitosamente.')
        await restarAsiento()
        window.location.href = "reserva.html";
        
    }
}

async function restarAsiento(){
    let idVuelo = localStorage.getItem('idVuelo')

    const { data: cantDisponibles, error: errorCant } = await supabase
    .from('Vuelos')
    .select('Disponibles')
    .eq('id_vuelo', idVuelo)

    if (errorCant) {
     console.error('Error al verificar DNI:', errorCant)
    }else{
        let newDisponibles = cantDisponibles[0].Disponibles - 1
        console.log(cantDisponibles[0].Disponibles)
        console.log(newDisponibles)
        const { error } = await supabase
            .from('Vuelos')
            .update({ Disponibles: newDisponibles})
            .eq('id_vuelo', idVuelo)
    
        if (error) {
            console.error('Error al registrar datos:', error)
        } else {
            console.log('Datos registrados exitosamente.')
        }
    }
}


async function verifyDNI(dni, name, lastname, mail) {
    const { data, error } = await supabase
        .from('Pasajero')
        .select('*')
        .eq('DNI', dni)
        if(data.length > 0){
            nombreToSave = data[0].Nombre;
            apellidoToSave = data[0].Apellido;
    
            localStorage.setItem("Nombre", nombreToSave);
            localStorage.setItem("Apellido", apellidoToSave);
        } 
            


    if (error) {
        console.error('Error al verificar DNI:', error)
        return
    }

    if (data.length > 0) {
        console.log('El DNI existe en la base de datos.')
/*         window.location.href = "reserva.html"
 */    } else {
        console.log('El DNI no existe en la base de datos. Registrando datos...')
        await registrarDatos(dni, name, lastname, mail)
/*         window.location.href = "reserva.html"
 */    }
    generarReserva()
}

