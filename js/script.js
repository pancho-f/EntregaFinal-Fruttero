// se declaran arrays
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

//  es llamado por otras funciones para actualizar la cantidad de items en el carrito
const actualizarItemsCarrito = () => {document.getElementById('carritoItems').innerHTML = carritoItems;}
//  es llamado por otras funciones para actualizar el precio total
const actualizarPrecioTotal = () => {document.getElementById('precioTotal').innerHTML = precioTotal;}

//  elimina el producto deseado y resta el precio del total
let botonRestar = () => {
    botonCross = document.querySelectorAll('.botonEliminar');
    botonCross.forEach(boton => {
        boton.onclick = (e) => {
            const productoId = e.currentTarget.id.replace("boton", "carrito");  //me devuelve 'carritoItemX'
            carritoItems -=1; actualizarItemsCarrito();
            let precio = document.querySelector(`#${productoId} .precio`).innerText;
            precioTotal -= precio; actualizarPrecioTotal();
            document.getElementById(productoId).remove();
            let idProducto = itemsCarrito.indexOf(itemsCarrito.find(num => num.idSesion === parseInt(productoId.replace("carritoItem", "")))) ;
            itemsCarrito.splice(idProducto, 1);
            localStorage.setItem(`carritoStorage`, JSON.stringify(itemsCarrito));
        }});
};

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

//  altera la lista del carrito agregando el producto elegido
let botonAgregar = () => {
    botonCheck = document.querySelectorAll('.botonCheck');
    botonCheck.forEach(boton => {
        boton.onclick = (e) => {
            const productoId = e.currentTarget.id;
            let contenedor = document.createElement('li');
            let productoAComprar = {...productos[productoId]} ;
            productoAComprar["idSesion"] = carritoItemsSesion + 1;
            itemsCarrito.push(productoAComprar);
            carritoItems +=1; actualizarItemsCarrito();
            carritoItemsSesion +=1; contenedor.id = "carritoItem"+carritoItemsSesion;
            contenedor.innerHTML = `<span class="productoSpan">
                                        <img src="${productos[productoId].imagen}" class="imagenProducto" alt="imagen de ${productos[productoId].nombre}">
                                        <p class="nombreProductoCarrito">${productos[productoId].nombre}</p>
                                    </span>
                                    <span class="productoSpan">
                                        <p class="precio">${productos[productoId].precio}</p>
                                        <img id=botonItem${carritoItemsSesion} class="botonEliminar" src="assets/cross.png" alt="eliminar producto">
                                    </span>`
            document.querySelector('#listaCarrito').append(contenedor)
            precioTotal += productos[productoId].precio; actualizarPrecioTotal();
            botonRestar();
            localStorage.setItem(`carritoStorage`, JSON.stringify(itemsCarrito));
        }});
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

//  altera la lista a solo la categoria elegida
document.getElementById('filtroReset').onclick = () => listarProductos(productos);
let filtrar = () =>{
    let botones = document.querySelectorAll('.filtroCategoria')
    botones.forEach(boton =>{
        boton.onclick = (e) => {
            let categoriaElegida = e.currentTarget.innerText;
            document.querySelector('#listaCatalogo').innerHTML = '';
            let categoriaProductos = productos.filter(cat => cat.categoria === categoriaElegida) ;
            listarProductos(categoriaProductos);
            botonAgregar();
}})};

//  funciones para la lista de órdenes;
//  envia la compra del carrito a la lista de ordenes
document.getElementById('botonComprar').onclick = () => {
if (carritoItems > 0 && carritoItems < 7){
    let precio = itemsCarrito.map(el => el.precio);
    precio = precio.reduce((acc, el) => acc + el, 0);
    ordenCount +=1;
    const orden = new Orden(itemsCarrito, precio, ordenCount);
    ordenes.push(orden);
    let container = document.createElement('li');
    container.innerHTML = `<p>Orden Nº${orden.numero}</p><p class="precio">[${orden.productos.length} Items]</p>`
    document.querySelector('#listaOrdenes').append(container)
    document.querySelector('#listaCarrito').innerHTML = '';
    carritoItems = 0; actualizarItemsCarrito();
    precioTotal = 0; actualizarPrecioTotal();
    localStorage.setItem(`orden${orden.numero}`, JSON.stringify(orden));
    itemsCarrito = [];
    localStorage.removeItem(`carritoStorage`);
    Swal.fire({
        title: "Compra exitosa",
        text: "Muchas gracias por tu compra.",
        icon: "success",
        iconColor: "darkgreen",
        animation: false,
        width: "24em",
        allowOutsideClick: false,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
            popup: 'alertContainer',
        },
      }); mostrarOrden();
}};
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
//  muestra los contenidos de una orden al hacerle clic
let mostrarOrden = () => {
    botonOrden = document.querySelectorAll('#listaOrdenes li');
    botonOrden.forEach(orden => {
        orden.onclick = (e) => {
            let ordenSeleccionada = e.currentTarget.firstChild.innerText.replace("Orden Nº", "") -1
            ordenSeleccionada = ordenes[ordenSeleccionada].productos
            ordenSeleccionada = ordenSeleccionada.map((el) => el.nombre)
            Swal.fire({
                html: `<p>La orden seleccionada contiene los siguientes items:</p><p style="justify-content: center;">-${ordenSeleccionada.join(`<br>-`)}</p>`,
                customClass: {
                    popup: 'alertContainer',
                },
                confirmButtonColor: "darkgreen",
              })
        }});
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