document.addEventListener("DOMContentLoaded", () => {
    cargarLibros();
    document.getElementById("filtro-genero").addEventListener("change", filtrarLibros);
});

// Array para almacenar los libros agregados al carrito
let carrito = [];

// Función para cargar los libros desde el JSON
function cargarLibros() {
    fetch("../data/libros.json")
        .then(response => response.json())
        .then(libros => {
            window.libros = libros; // Guardamos los libros globalmente para acceder a ellos
            mostrarLibros(libros); // Muestra todos los libros al principio
        })
        .catch(error => console.error("Error cargando libros:", error));
}

// Función para mostrar los libros en el catálogo
function mostrarLibros(libros) {
    let contenedor = document.getElementById("libros-container");
    contenedor.innerHTML = ""; // Limpiar el contenido del contenedor

    libros.forEach((libro, index) => {
        let div = document.createElement("div");
        div.classList.add("libro");
        div.innerHTML = `
            <img src="${libro.imagen}" alt="${libro.titulo}" class="libro-img">
            <p>${libro.titulo} - ${libro.autor}</p>
            <p>Precio: $${libro.precio}</p>
            <button onclick="agregarAlCarrito('${libro.titulo}', '${libro.autor}', '${libro.imagen}', ${libro.precio})">Comprar</button>
        `;
        contenedor.appendChild(div);

        // Efecto de animación de aparición
        setTimeout(() => {
            div.classList.add("mostrar");
        }, index * 100);
    });
}

// Función para filtrar los libros por género
function filtrarLibros() {
    const generoSeleccionado = document.getElementById("filtro-genero").value;

    // Filtra los libros por género
    let librosFiltrados;
    if (generoSeleccionado === "todos") {
        librosFiltrados = window.libros; // Si se selecciona "Todos", muestra todos los libros
    } else {
        librosFiltrados = window.libros.filter(libro => libro.genero === generoSeleccionado);
    }

    // Muestra los libros filtrados
    mostrarLibros(librosFiltrados);
}

// Función para agregar libros al carrito
function agregarAlCarrito(titulo, autor, imagen, precio) {
    let libro = { titulo, autor, imagen, precio }; // Crear objeto de libro completo
    carrito.push(libro); // Agregar objeto de libro al carrito
    alert(`"${titulo}" agregado al carrito!`); // Muestra una alerta
    actualizarCarrito(); // Llama a la función para actualizar el contador y el contenido del carrito
}

// Función para actualizar el contador del carrito y el total
function actualizarCarrito() {
    let contador = document.getElementById("contador-carrito");
    contador.innerText = carrito.length; // Actualiza el contador con la longitud del carrito

    let totalCarrito = 0;
    carrito.forEach(libro => {
        totalCarrito += libro.precio; // Suma los precios de los libros en el carrito
    });

    let totalPagar = document.getElementById("total-carrito");
    totalPagar.innerText = `$${totalCarrito.toFixed(2)}`; // Actualiza el total a pagar

    let listaCarrito = document.getElementById("lista-carrito");
    listaCarrito.innerHTML = ""; // Limpiar la lista

    carrito.forEach(libro => {
        let li = document.createElement("li");
        li.innerHTML = `
            <img src="${libro.imagen}" alt="${libro.titulo}" style="width: 50px; height: 70px; margin-right: 10px;">
            ${libro.titulo} - $${libro.precio}
            <button onclick="eliminarDelCarrito('${libro.titulo}')">Eliminar</button>
        `;
        listaCarrito.appendChild(li);
    });
}

// Función para eliminar libros del carrito
function eliminarDelCarrito(titulo) {
    carrito = carrito.filter(libro => libro.titulo !== titulo);
    actualizarCarrito();
}

// Función para mostrar/ocultar el carrito
function toggleCarrito() {
    let carritoContenido = document.getElementById("carrito-contenido");

    if (carritoContenido.style.display === "none" || carritoContenido.style.display === "") {
        carritoContenido.style.display = "block"; // Abrir carrito
        actualizarCarrito();  // Actualizar el carrito al abrirlo
    } else {
        carritoContenido.style.display = "none"; // Cerrar carrito
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        toggleCarrito();
        alert("El carrito está vacío.");
        return;
    }

    let totalCarrito = 0;
    carrito.forEach(libro => {
        totalCarrito += libro.precio;
    });

    toggleCarrito();

    alert(`El total a pagar es: $${totalCarrito.toFixed(2)}`);

    let confirmacion = confirm("¿Deseas proceder con el pago?");
    if (confirmacion) {
        let nombre = prompt("Ingresa tu nombre:");
        let tarjeta = prompt("Ingresa tu número de tarjeta (simulación):");

        if (nombre && tarjeta && tarjeta.length === 16) {
            alert(`Gracias por tu compra, ${nombre}. El pago fue procesado.`);
            carrito = [];
            actualizarCarrito();
        } else {
            alert("Pago cancelado. Asegúrate de ingresar un número de tarjeta válido.");
        }
    }
}
