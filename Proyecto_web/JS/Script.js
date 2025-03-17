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
            window.libros = libros; 
            mostrarLibros(libros); 
        })
        .catch(error => console.error("Error cargando libros:", error));
}

// Función para mostrar los libros en el catálogo
function mostrarLibros(libros) {
    let contenedor = document.getElementById("libros-container");
    contenedor.innerHTML = ""; 

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
        librosFiltrados = window.libros; 
    } else {
        librosFiltrados = window.libros.filter(libro => libro.genero === generoSeleccionado);
    }

    // Muestra los libros filtrados
    mostrarLibros(librosFiltrados);
}

// Función para agregar libros al carrito
function agregarAlCarrito(titulo, autor, imagen, precio) {
    let libro = { titulo, autor, imagen, precio }; 
    carrito.push(libro); 
    alert(`"${titulo}" agregado al carrito!`); 
    actualizarCarrito(); 
}

// Función para actualizar el contador del carrito y el total
function actualizarCarrito() {
    let contador = document.getElementById("contador-carrito");
    contador.innerText = carrito.length; 
    let totalCarrito = 0;
    carrito.forEach(libro => {
        totalCarrito += libro.precio; 
    });

    let totalPagar = document.getElementById("total-carrito");
    totalPagar.innerText = `$${totalCarrito.toFixed(2)}`; 

    let listaCarrito = document.getElementById("lista-carrito");
    listaCarrito.innerHTML = ""; 

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
        carritoContenido.style.display = "block";
        actualizarCarrito();  
    } else {
        carritoContenido.style.display = "none"; 
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
