// se declaran arrays y variables
let ordenes = []
let itemsCarrito = []
let carritoItems = 0;
let carritoItemsSesion = 0;
let precioTotal = 0;
let ordenCount = 0;
class Orden {
    constructor(productos, precio, num) {
        this.productos = productos
        this.precio = precio
        this.numero = num
    }
}
const productos = []

//  recupera la lista del carrito de localstorage
let recuperoCarrito = () => {
    let carritoStorage = localStorage.getItem(`carritoStorage`);
    if (carritoStorage != null) {
        carritoStorage = JSON.parse(carritoStorage);
        carritoStorage.forEach(item => {
            let itemNuevo = {...item};
            itemNuevo["idSesion"] = carritoItemsSesion + 1;
            itemsCarrito.push(itemNuevo);
            let contenedor = document.createElement('li');
            carritoItems +=1; actualizarItemsCarrito();
            carritoItemsSesion +=1; contenedor.id = "carritoItem"+carritoItemsSesion;
            contenedor.innerHTML = `<span class="productoSpan">
                                        <img src="${productos[item.id].imagen}" class="imagenProducto" alt="imagen de ${productos[item.id].nombre}">
                                        <p class="nombreProductoCarrito">${productos[item.id].nombre}</p>
                                    </span>
                                    <span class="productoSpan">
                                        <p class="precio">${productos[item.id].precio}</p>
                                        <img id=botonItem${carritoItemsSesion} class="botonEliminar" src="assets/cross.png" alt="eliminar producto">
                                    </span>`
            document.querySelector('#listaCarrito').append(contenedor)
            precioTotal += productos[item.id].precio; actualizarPrecioTotal();
            botonRestar();
            localStorage.setItem(`carritoStorage`, JSON.stringify(itemsCarrito));
        });
    }
};

//  genera la lista completa al inicio y al hacer clic en 'todos'
let listarProductos = (productsArray) => {
    document.querySelector('#listaCatalogo').innerHTML = '';
    productsArray.forEach(producto => {
        const contenedor = document.createElement('li');
        contenedor.innerHTML = `<span class="productoSpan">
                                    <img src="${producto.imagen}" class="imagenProducto" alt="imagen de ${producto.nombre}">
                                    <p>${producto.nombre}</p>
                                </span>
                                <span class="productoSpan">
                                    <p class="precio">${producto.precio}</p>
                                    <img id=${producto.id} class="botonCheck" src="assets/check.png" alt="boton de confirmacion">
                                </span>`;
        document.querySelector('#listaCatalogo').append(contenedor);
    });botonAgregar();
};

//  recupera las ordenes de localstorage
let recuperoStorage = () => {
    let num = 0
    while (num < 20) {
        num++;
        let ordenStorage = localStorage.getItem('orden'+num);
        if (ordenStorage != null) {
            ordenStorage = JSON.parse(ordenStorage);
            ordenes.push(ordenStorage);
            ordenCount += 1;
            let item = document.createElement('li');
            item.innerHTML = `<p>Orden Nº${ordenStorage.numero}</p><p class="precio">[${ordenStorage.productos.length} Items]</p>`
            document.querySelector('#listaOrdenes').append(item)
        }}
};

//llena la lista de productos desde la base de datos y luego inicializa las funciones. en caso de no cumplir la promesa muestra un error de SweetAlert
const fetchProductos = async () => {
    await fetch("./db/data.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            productos.push(item);
        });
    });
    try {
        recuperoCarrito()
        listarProductos(productos)
        filtrar()
        recuperoStorage()
        mostrarOrden()
    } catch (err) {
        Swal.fire({
            title: "ERROR AL CARGAR: Intenta refrescar la página.",
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            background: "darkred",
            customClass: {
                popup: 'errorAlert',
            }
            })
    }
}; fetchProductos();