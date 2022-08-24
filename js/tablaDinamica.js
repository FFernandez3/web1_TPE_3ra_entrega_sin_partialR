document.addEventListener("DOMContentLoaded", iniciarPagina);
function iniciarPagina() {
    "use strict";
    const tabla = document.querySelector("#cuerpoTabla");
    const URL = "https://62b617a46999cce2e8fee570.mockapi.io/Dramas";
    let divErrores = document.querySelector("#divErrores");
    let botonTres = document.querySelector("#btn-agregar3");
    botonTres.addEventListener("click", agregarTres);
    let form = document.querySelector(".formTabla");
    form.addEventListener("submit", agregar);

    mostrar_tabla();

    async function mostrar_tabla() {
        /*  event.preventDefault(); */
        try {
            let response = await fetch(URL); /* pedido http al servidor (GET) */
            if (response.ok) {
                let json = await response.json(); /*lo q trae es el json stringifiado que le mande en cargar_datos, y lo vuelve a convertir a json */
                tabla.innerHTML = " ";
                divErrores.classList.remove("mostrarResultado");
                console.log(json);
                for (const drama of json) {
                    mostrarLinea(drama);

                }
                asignar_listener_editar();
                asignar_listener_eliminar();


            }

        }
        catch (error) {
            console.log(error);
            divErrores.classList.add("mostrarResultado");
            divErrores.innerHTML = "ERROR: No se puede cargar la tabla."
        }
    }

    function mostrarLinea(drama) {

        tabla.innerHTML += `<tr id="drama${drama.id}">
                                <td>${drama.generoDrama}</td>
                                <td>${drama.tituloDrama}</td>
                                <td>${drama.anioDrama}</td>
                                <td>${drama.capDrama}</td>
                                <td>${drama.estadoDrama}</td>
                                <td class="celdaBotones">
                                 <button data-id="${drama.id}" class="btn-editar">Editar</button>
                                 <button data-id="${drama.id}" class="btn-borrarFila">Eliminar</button>
                                 </td>
                        </tr>`

        if ((drama.estadoDrama === "finalizado") || (drama.estadoDrama === "Finalizado")) {
            let dramaFinalizado = document.querySelector(`#drama${drama.id}`);
            dramaFinalizado.classList.add("resaltado");
        }

    }

    async function agregar(event) {

        /* event.preventDefault(); */ /*Si lo pongo no anda agregar 3 */
        let drama = obtener_datos_inputs();

        try {
            let response = await fetch(URL, {         //debo darle un parametro de opciones que es un json, 
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },

                "body": JSON.stringify(drama)        //esto es un string que adentro tiene escrito un json, no un objeto    
            });
            if (response.status == 201) {
                let nuevoDrama = await response.json(); //(lo q recibo lo desconvierto de texto a json) ESTO LO HAGO DESPUES  EN OBTENER DATOS     
                mostrarLinea(nuevoDrama);
                asignar_listener_editar();
                asignar_listener_eliminar();

            }


        }
        catch (error) {
            console.log(error);
            divErrores.classList.add("mostrarResultado");
            divErrores.innerHTML = "ERROR: No pudo cargarse el drama a la tabla."
            setTimeout(mostrar_tabla, 2000);
        }
    }
    function obtener_datos_inputs() {
        let formData = new FormData(form);
        let genero = formData.get("genero");
        let titulo = formData.get("titulo");
        let anio = formData.get("año");
        let capitulos = formData.get("capitulos");
        let estado = formData.get("estado");

        let drama = {
            "generoDrama": genero,
            "tituloDrama": titulo,
            "anioDrama": anio,
            "capDrama": capitulos,
            "estadoDrama": estado
        }
        return drama;
    }

    async function eliminar_fila_en_servidor(boton) { //lo borra de la api
        /*  let id=this.dataset.dramaId;  */
        let id = boton.getAttribute("data-id");
        /*  console.log(id); */
        try {
            let response = await fetch(URL + "/" + id, {
                method: "DELETE",
            });
            if (response.ok) {
                let json = response.json();
                borrar_fila_en_html(boton); //con esto evito borrar toda la tabla y mostrarla otra ve

            }
            else {
                divErrores.innerHTML = "Error: este drama ya fue eliminado. Volviendo a cargar tabla..."
                divErrores.classList.add("mostrarResultado");
                setTimeout(mostrar_tabla, 2000);
            }
        }
        catch (error) {
            console.log(error);
            divErrores.innerHTML = "ERROR: No pudo eliminarse el drama de la tabla."
            divErrores.classList.add("mostrarResultado");
            setTimeout(mostrar_tabla, 2000);
        }
    }
    function borrar_fila_en_html(boton) { //borra la fila de la vista
        let fila = boton.parentNode.parentNode;
        fila.remove();
    }

    async function editar_fila_en_servidor(boton) {
        let id = boton.getAttribute("data-id");
        event.preventDefault();
        let drama = obtener_datos_inputs();
        try {
            let response = await fetch(URL + "/" + id, {         //debo darle un parametro de opciones que es un json, 
                "method": "PUT",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(drama)        //esto es un string que adentro tiene escrito un json, no un objeto    
            });

            if (response.ok) {
                let nuevoDrama = await response.json();
                mostrar_fila_editada(boton, nuevoDrama);
                asignar_listener_editar();
                asignar_listener_eliminar();
            }


        }
        catch (error) {
            console.log(error);
            divErrores.classList.add("mostrarResultado");
            divErrores.innerHTML = "ERROR: No pudo editarse este drama de la tabla."
            setTimeOut(mostrar_tabla, 2000);

        }
    }
    function mostrar_fila_editada(boton, nuevoDrama) { //actualizo la fila en la vista 
        let fila = boton.parentNode.parentNode;
        fila.innerHTML = `<tr id="drama${nuevoDrama.id}">
                             <td>${nuevoDrama.generoDrama}</td>
                             <td>${nuevoDrama.tituloDrama}</td>
                             <td>${nuevoDrama.anioDrama}</td>
                             <td>${nuevoDrama.capDrama}</td>
                             <td>${nuevoDrama.estadoDrama}</td>
                             <td class="celdaBotones">
                                 <button data-id="${nuevoDrama.id}" class="btn-editar">Editar</button>
                                 <button data-id="${nuevoDrama.id}" class="btn-borrarFila">Eliminar</button>
                            </td>
                        </tr>`
        if ((nuevoDrama.estadoDrama === "finalizado") || (nuevoDrama.estadoDrama === "Finalizado")) {
            fila.classList.add("resaltado");
        }
        else {
            fila.classList.remove("resaltado"); /*si no pongo esto sigue resaltando si edito una fila q era finalizado y ahora en emision */
        }
    }


    function agregarTres() {
        setTimeout(agregar, 2000);
        setTimeout(agregar, 2000);
        setTimeout(agregar, 2000);
        /*  let i = 0;
         while (i < 3) {
             
            setTimeout(() => {
                 agregar();
               
             }, 4000);
             i++;
         } */
    }
    function asignar_listener_eliminar() {
        document.querySelectorAll(".btn-borrarFila").forEach(boton => boton.addEventListener("click", function () {
            eliminar_fila_en_servidor(boton)
        }));
    }
    function asignar_listener_editar() {
        document.querySelectorAll(".btn-editar").forEach(boton => boton.addEventListener("click", function () {
            editar_fila_en_servidor(boton)
        }));
    }

}
