const search = document.getElementById("search");
const reserva = document.getElementById("reserva");
const formSearch = document.getElementById("form-search");
const formReserva = document.getElementById("form-reserva");
const tabla = document.getElementById("tabla");
const msg = document.getElementById("msg");


search.addEventListener("click", () =>{
    formReserva.style.display = "none"
    formSearch.style.display = "flex"

})

reserva.addEventListener("click", () =>{
    formSearch.style.display = "none"
    formReserva.style.display = "flex"

})

function ShowNoResult(state){
    if(state == false){
        resultSearch.innerHTML = "";
        tabla.style.display = "none"
        msg.style.display = "flex"
    }
    else{
        tabla.style.display = "flex"
        msg.style.display = "none"
    }
}

