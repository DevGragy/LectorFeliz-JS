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
        alert("No hay productos, selecciona algún libro...");
        window.location = "index.html"; // Redirige inmediatamente
        return;
    }

    // Validar si los campos requeridos están completos
    if (cliente.value.trim() === "" || correo.value.trim() === "") {
        alert("Todos los campos son requeridos.");
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
        await new Promise((resolve) => setTimeout(resolve, 2000));

        cargandoGif.style.display = "none";
        document.querySelector("#loaders").appendChild(enviado);

        alert(
            `Se ha enviado un email de confirmacion a ${emailValue}, gracias por tu compra ${clienteValue}! Disfruta tu lectura :)`
        );

        setTimeout(() => {
            // Vaciar el carrito y redirigir
            compra.vaciarLocalStorage();
            enviado.remove();
            window.location = "index.html";
        }, 1000);
    } catch (err) {
        alert("Error al enviar el email:\n" + JSON.stringify(err));
    }
}
