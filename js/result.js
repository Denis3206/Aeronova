
let HoraGuardada;
const resultSearch = document.querySelector(".result-panel");
const mainBanner = document.querySelector(".main-banner2");

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
    HoraGuardada = data;
    localStorage.setItem("Hora", HoraGuardada)
}


function ShowReserva(codigo, origen, destino, fecha, hora, vuelo, nombre, apellido, dni){
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
                <p>Vuelo: ${vuelo}</p>
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