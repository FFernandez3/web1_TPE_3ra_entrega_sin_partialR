document.addEventListener("DOMContentLoaded", iniciarPagina);
function iniciarPagina() {
    "use strict";
    let btnCargar = document.querySelector("#nuevoCaptcha");
    let ingreso = document.querySelector("#resultadoUsuario");
    let btncheck = document.querySelector("#comprobar");
    let res = document.querySelector("#resultado");

    valorAletorio(); //llamo a la funcion cuando la pag se abre
    ocultarBoton(); //oculta el boton desde el inicio
    console.log("aplica ocultar boton");
    btnCargar.addEventListener("click", recargarValor);

    function recargarValor() {
        valorAletorio();
        ocultarBoton();
        res.innerHTML = "";
    }


    function valorAletorio() {
        let num = Math.floor((Math.random() * 100) + 1);
        let random = document.querySelector("#aleatorio");
        /* console.log(num); */
        random.innerHTML = num;


        btncheck.addEventListener("click", validarCaptcha);
        function validarCaptcha() {
            event.preventDefault();
            let entrada = ingreso.value;
            /* console.log(entrada); */

            if (entrada == num) {
                res.innerHTML = "¡Correcto! No sos un robot.";
                mostrarBoton();
            }
            else {
                res.innerHTML = "¡Incorrecto! Volve a intentarlo.";
                ocultarBoton();
            }

        }
        document.querySelector(".formulario").reset();
    }

    function mostrarBoton() {
        document.getElementById("enviar").classList.remove("ocultar");
    }
    function ocultarBoton() {
        document.getElementById("enviar").classList.add("ocultar");
    }
}



