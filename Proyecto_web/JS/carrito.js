let carrito = [];

function agregarAlCarrito(titulo, imagen, precio) {
    const libroExistente = carrito.find(item => item.titulo === titulo);

    if (libroExistente) {
        libroExistente.cantidad++;
    } else {
        carrito.push({ titulo, imagen, precio, cantidad: 1 });
    }

    actualizarCarrito();
}

function eliminarDelCarrito(titulo) {
    carrito = carrito.filter(item => item.titulo !== titulo);
    actualizarCarrito();
}

function actualizarCantidad(titulo, nuevaCantidad) {
    const libro = carrito.find(item => item.titulo === titulo);
    if (libro) {
        libro.cantidad = nuevaCantidad > 0 ? nuevaCantidad : 1;
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const contadorCarrito = document.getElementById("contador-carrito");

    listaCarrito.innerHTML = "";
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${item.imagen}" alt="${item.titulo}" class="miniatura">
            <span>${item.titulo}</span>
            <span>$${item.precio} x </span>
            <input type="number" min="1" value="${item.cantidad}" class="cantidad-input" 
                onchange="actualizarCantidad('${item.titulo}', this.value)">
            <span> = $${item.precio * item.cantidad}</span>
            <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.titulo}')">❌</button>
        `;
        listaCarrito.appendChild(li);

        total += item.precio * item.cantidad;
        cantidadTotal += item.cantidad;
    });

    totalCarrito.textContent = `$${total.toFixed(2)}`;
    contadorCarrito.textContent = cantidadTotal;
}

function toggleCarrito() {
    const carritoContenedor = document.getElementById("carrito-contenedor");
    carritoContenedor.classList.toggle("oculto");
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    alert("¡Compra realizada con éxito!");
    carrito = [];
    actualizarCarrito();
    toggleCarrito();
}
