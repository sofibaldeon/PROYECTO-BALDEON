
let productos = [];
let usuario;

let formularioIdentificacion;
let contenedorIdentificacion;
let contenedorUsuario;
let textoUsuario;
let botonLimpiarStorage;


let modalAddProduct;
let botonAgregarProducto;
let formulario;
let inputId;
let inputNombre;
let inputPrecioCompra;
let inputPrecioVenta;
let inputCantidad;
let contenedorProductos;
let botonesCerrarModalAgregarProducto;
let modal

class Producto {
constructor(id, nombre, precioCompra, precioVenta, cantidad) {
    this.id = id;
    this.nombre = nombre.toUpperCase();
    this.precioCompra = precioCompra;
    this.precioVenta = precioVenta;
    this.cantidad = cantidad;
}
}

function inicializarElementos() {
formularioIdentificacion = document.getElementById(
    "formularioIdentificacion"
);
inputUsuario = document.getElementById("inputUsuario");
contenedorIdentificacion = document.getElementById(
    "contenedorIdentificacion"
);
contenedorUsuario = document.getElementById("contenedorUsuario");
textoUsuario = document.getElementById("textoUsuario");

botonLimpiarStorage = document.getElementById("limpiarStorage");
formulario = document.getElementById("formularioAgregarProducto");
inputId = document.getElementById("inputId");
inputNombre = document.getElementById("inputNombreProducto");
inputPrecioCompra = document.getElementById("inputPrecioCompra");
inputPrecioVenta = document.getElementById("inputPrecioVenta");
inputCantidad = document.getElementById("inputCantidad");
contenedorProductos = document.getElementById("contenedorProductos");

botonesCerrarModalAgregarProducto = document.getElementsByClassName(
    "btnCerrarModalAgregarProducto"
  );
  modalAddProduct = document.getElementById("modalAddProduct");
  botonAgregarProducto = document.getElementById("btnAgregarProducto");
  modal = new bootstrap.Modal(modalAddProduct);
}

function inicializarEventos() {
  formulario.onsubmit = (event) => validarFormulario(event);
  formularioIdentificacion.onsubmit = (event) => identificarUsuario(event);
  botonLimpiarStorage.onclick = eliminarStorage;
  botonAgregarProducto.onclick = abrirModalAgregarProducto;

  for (const boton of botonesCerrarModalAgregarProducto) {
    boton.onclick = cerrarModalAgregarProducto;
  }
}

function abrirModalAgregarProducto() {
  if (usuario) {
    modal.show();
  } else {
    Swal.fire('Se requiere identificaci??n antes de agregar un producto')
  }
}

function cerrarModalAgregarProducto() {
  formulario.reset();
  modal.hide();
}

function eliminarStorage() {
  localStorage.clear();
  usuario = "";
  productos = [];
  mostrarFormularioIdentificacion();
  pintarProductos();
}

function identificarUsuario(event) {
  event.preventDefault();
  usuario = inputUsuario.value;
  formularioIdentificacion.reset();
  actualizarUsuarioStorage();
  mostrarTextoUsuario();
}

function mostrarTextoUsuario() {
  contenedorIdentificacion.hidden = true;
  contenedorUsuario.hidden = false;
  textoUsuario.innerHTML += ` ${usuario}`;
}

function mostrarFormularioIdentificacion() {
  contenedorIdentificacion.hidden = false;
  contenedorUsuario.hidden = true;
  textoUsuario.innerHTML = ``;
}

function validarFormulario(event) {
  event.preventDefault();
  let idProducto = inputId.value;
  let nombre = inputNombre.value;
  let precioCompra = parseFloat(inputPrecioCompra.value);
  let precioVenta = parseFloat(inputPrecioVenta.value);
  let cantidad = parseInt(inputCantidad.value);

  const idExiste = productos.some((producto) => producto.id === idProducto);
  if (!idExiste) {
    let producto = new Producto(
      idProducto,
      nombre,
      precioCompra,
      precioVenta,
      cantidad
    );

    productos.push(producto);
    formulario.reset();
    //alert("Producto agregado exitosamente");
    actualizarProductosStorage();
    pintarProductos();
    mostrarMensajeConfirmacion(`El producto ${nombre} fue agregado`);
  } else {
    alert("El id ya existe");
  }
}

function confirmarEliminacion(idProducto) {
  Swal.fire({
    icon: "question",
    title: "??Desea eliminar el producto?",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarProducto(idProducto)
    } 
  })
}

function eliminarProducto(idProducto) {
  let columnaBorrar = document.getElementById(`columna-${idProducto}`);
  let indiceBorrar = productos.findIndex(
    (producto) => Number(producto.id) === Number(idProducto)
  );

  let nombreProductoEliminado = productos [indiceBorrar].nombre
  productos.splice(indiceBorrar, 1);
  columnaBorrar.remove();
  actualizarProductosStorage();
  mostrarMensajeConfirmacion(`El producto ${nombreProductoEliminado} fue eliminado`);
}

function pintarProductos() {
  contenedorProductos.innerHTML = "";
  productos.forEach((producto) => {
    let column = document.createElement("div");
    column.className = "col-md-4 mt-3";
    column.id = `columna-${producto.id}`;
    column.innerHTML = `
            <div class="card">
                <div class="card-body">
                <p class="card-text">ID:
                    <b>${producto.id}</b>
                </p>
                <p class="card-text">Nombre:
                    <b>${producto.nombre}</b>
                </p>
                <p class="card-text">Precio compra:
                    <b>${producto.precioCompra}</b>
                </p>
                <p class="card-text">Precio venta:
                    <b>${producto.precioVenta}</b>
                </p>
                <p class="card-text">Cantidad:
                    <b>${producto.cantidad}</b>
                </p>
                </div>
                <div class="card-footer">
                  <button class="btn btn-danger" id="botonEliminar-${producto.id}" >Eliminar</button>
                </div>
            </div>`;

    contenedorProductos.append(column);

    let botonEliminar = document.getElementById(`botonEliminar-${producto.id}`);
    botonEliminar.onclick = () => confirmarEliminacion(producto.id);
  });
}

function actualizarProductosStorage() {
  let productosJSON = JSON.stringify(productos);
  localStorage.setItem("productos", productosJSON);
}

function actualizarUsuarioStorage() {
  localStorage.setItem("usuario", usuario);
}

function obtenerProductosStorage() {
  let productosJSON = localStorage.getItem("productos");
  if (productosJSON) {
    productos = JSON.parse(productosJSON);
    pintarProductos();
  }
}

function obtenerUsuarioStorage() {
  let usuarioAlmacenado = localStorage.getItem("usuario");
  if (usuarioAlmacenado) {
    usuario = usuarioAlmacenado;
    mostrarTextoUsuario();
  }
}
const botonSwal = document.getElementById("btnSwal")
botonSwal.onclick = mostrarSwal
function mostrarSwal () {
  Swal.fire({
    title: 'Acceso a Tienda Veterinaria Gaud??',
    text: 'Haz click para ingresar',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUkq-nivArwO0bk9CbAS9uTQg1FbcYDMvFfjkHK89wrlieylq4QgnpJo0ANbXcnP8vsoo&usqp=CAU',
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
    backdrop: `
    rgba(66, 186, 193,0.4)
  `
  })
}

function mostrarMensajeConfirmacion(mensaje) {
  Toastify({
    text: mensaje,
    duration: 3000,
    close: true,
    gravity: "top", 
    position: "right", 
    style: {
      background: "linear-gradient(to left,  #94298d , #88b5be  )",
    },
  }).showToast();
}

function consultarProductosServer(){
  fetch("https://6351ee6b9d64d7c7130ace4e.mockapi.io/productos")
  .then((response) => response.json() )
  .then((data) => {
    productos = [...data]
    pintarProductos();
  })
  .catch ((error) => console.log(error))
}

function main() {

  inicializarElementos();
  inicializarEventos();
  obtenerUsuarioStorage();
  consultarProductosServer();
  mostrarSwal();
  mostrarMensajeConfirmacion();
}


main();

