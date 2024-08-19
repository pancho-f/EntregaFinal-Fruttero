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