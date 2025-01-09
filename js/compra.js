const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById("carrito");
const procesarCompraBtn = document.getElementById("procesar-compra");
const cliente = document.getElementById("cliente");
const correo = document.getElementById("correo");

cargarEventos();

function cargarEventos() {
    // Cargar datos del localStorage al cargar la página
    document.addEventListener("DOMContentLoaded", () =>
        compra.leerLocalStorageCompra()
    );

    // Eliminar productos del carrito
    carrito.addEventListener("click", (e) => compra.eliminarProducto(e));

    // Calcular el total del carrito
    compra.calcularTotal();

    // Procesar compra al hacer clic en el botón
    procesarCompraBtn.addEventListener("click", procesarCompra);

    // Unificar eventos para capturar cambios en el carrito
    carrito.addEventListener("input", (e) => compra.obtenerEvento(e));
}

function procesarCompra(e) {
    e.preventDefault();

    // Validar si hay productos en el carrito
    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            type: "error",
            title: "No hay productos",
            text: "Selecciona algún libro...",
            showConfirmButton: false,
            timer: 1000,
        });
        window.location = "index.html"; // Redirige inmediatamente
        return;
    }

    // Validar si los campos requeridos están completos
    if (cliente.value.trim() === "" || correo.value.trim() === "") {
        Swal.fire({
            type: "error",
            title: "Llene los campos",
            text: "Todos los campos son requeridos.",
            showConfirmButton: false,
            timer: 1000,
        });
        return;
    }

    // Mostrar indicador de carga
    const cargandoGif = document.querySelector("#cargando");
    cargandoGif.style.display = "block";

    const enviado = document.createElement("img");
    enviado.src = "img/mail.gif";
    enviado.style.display = "block";
    enviado.width = "150";

    const clienteValue = cliente.value;
    const emailValue = correo.value;
    const clienteData = {clienteValue, emailValue};

    enviarFormulario(cargandoGif, enviado, clienteData);
}

async function enviarFormulario(cargandoGif, enviado, clientData) {
    const {clienteValue, emailValue} = clientData;

    try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        cargandoGif.style.display = "none";
        document.querySelector("#loaders").appendChild(enviado);

        Swal.fire({
            type: "success",
            title: "Gracias por tu compra",
            text: `Se ha enviado un email de confirmacion a ${emailValue}, gracias por tu compra ${clienteValue}!`,
            showConfirmButton: true,
        }).then((result) => {
                if (result.value || result.dismiss) {
                    // Vaciar el carrito y redirigir
                    compra.vaciarLocalStorage();
                    enviado.remove();
                    window.location = "index.html";
                }
            }
        )
    } catch (err) {
        Swal.fire({
            type: "error",
            title: "Hubo un error",
            text: "Error al enviar el email:\n" + JSON.stringify(err),
            showConfirmButton: false,
            timer: 1000,
        });
    }
}
