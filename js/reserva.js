const mainBanner = document.querySelector(".main-banner2");

let origenSeleccionada = localStorage.getItem("Origen");
let destinoSeleccionada = localStorage.getItem("Destino");
let fechaElegida = localStorage.getItem("Fecha");
let nombrePasajero = localStorage.getItem("Nombre");
let apellidoPasajero = localStorage.getItem("Apellido");
let dniPasajero2 = localStorage.getItem("DNI");
let horaElegida = localStorage.getItem("Hora");
let codigoReserva = localStorage.getItem("codigo");
let vueloID = localStorage.getItem("idVuelo")


function ShowReserva(codigo, origen, destino, fecha, hora, flight, nombre, apellido, dni){
    console.log("hola");
    mainBanner.innerHTML += `
    <section class="resumen">
            <h1>TU RESERVA</h1>
            <h3>Codigo de reserva: ${codigo}</h3>

            <section class="vueloInfo">
                <span class="material-symbols-outlined">
                    travel
                </span>
                <h3>${origen} a ${destino}</h3>
                <p>${fecha}</p>
                <p>${hora}</p>
                <br>
                <p>Vuelo: ${flight}</p>
            </section>
            <section class="pasajeroInfo">
                <span class="material-symbols-outlined">
                    person
                </span>
                <h3>Pasajero</h3>
                <p>${nombre} ${apellido}</p>
                <p>DNI: ${dni}</p>
                <br>
            </section>
        </section>
        `;
}

ShowReserva(codigoReserva, origenSeleccionada, destinoSeleccionada, fechaElegida, horaElegida, vueloID, nombrePasajero, apellidoPasajero, dniPasajero2);