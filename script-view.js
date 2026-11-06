// buscar producto
function buscarSAP() {
  const input = document.getElementById("inputSAP").value.trim();

  if (input === "") return;

  // Buscar directamente en repuestos.js
  const repuesto = window.repuestos?.find(
    r => Number(r.codigoSAP) === Number(input)
  );

  if (!repuesto) {
    alert("No encontrado");
    return;
  }

  // Datos principales desde repuestos.js
  document.getElementById("descripcion").textContent =
    repuesto.descripcion || "";

  document.getElementById("sap").textContent =
    repuesto.codigoSAP || "";

  // Buscar información complementaria en datosDespiece
  const item = datosDespiece.find(
    d => Number(d.codigoSAP) === Number(repuesto.codigoSAP)
  );

  document.getElementById("fabrica").textContent =
    item?.codigoFabrica || "";

  // precio
  let precio = 0;

  if (typeof precioData !== "undefined") { 
    const precioObj = precioData.find(p => p.codigoSAP == repuesto.codigoSAP
);


    if (precioObj) {
      if (precioObj.precio24) {
        precio = precioObj.precio24;
      }
    }

    document.getElementById("precio").textContent = precio || "$0";
  }
  
  // Stock 1506
  let stock = "-";

  if (typeof stock1506Data !== "undefined") {
    const stockObj = stock1506Data.find(s => s.codigoSAP == repuesto.codigoSAP
);

    if (stockObj) {
      stock = stockObj.Stock;
    }
  }

  document.getElementById("stock").textContent = stock; // insertar en pantalla

  // reemplazo
  let reemplazo = "-";

  if (typeof reemplazosData !== "undefined") {
    const rep = reemplazosData.find(r => r.codigoSAP == repuesto.codigoSAP
);

    if (rep) {
      reemplazo = rep.reemplazo;
    }
  }

  const reemplazoElemento = document.getElementById("reemplazo");

  if (reemplazo && reemplazo !== "-") {

    const link = document.createElement("a");
    link.textContent = reemplazo;
    link.href = "javascript:void(0)";

    link.addEventListener("click", () => {
      irAReemplazo(reemplazo);
    });

    reemplazoElemento.innerHTML = "";
    reemplazoElemento.appendChild(link);

  } else {
    reemplazoElemento.textContent = "-";
  }

  // búsqueda del reemplazo
  function irAReemplazo(codigo) {
    const input = document.getElementById("inputSAP");
    input.value = codigo;
    buscarSAP();            
  }

  // medidas
  const medida = medidaData.find(m => m.codigoSAP == repuesto.codigoSAP);

  if (medida) {
    document.getElementById('largo').textContent = medida.largo;
    document.getElementById('ancho').textContent = medida.ancho;
    document.getElementById('alto').textContent = medida.alto;
    document.getElementById('peso').textContent = medida.peso;
  }

  // imagen
  const img = document.getElementById("imgProducto");
  const link = document.getElementById("linkImagen");
  const codigo = document.getElementById("sap").textContent.trim();
  const ruta = `imagenes/${codigo}.jpg`;
  const fallback = `imagenes/no-image.png`;

  img.style.display = "block";

  if (!codigo) {
    img.src = fallback;
    link.href = fallback;
    return;
  }

  const testImg = new Image();

  testImg.onload = function () {
    // La imagen existe
    img.src = ruta;
    link.href = ruta;
  };

  testImg.onerror = function () {
    img.src = fallback;
    link.href = fallback;
  };

  testImg.src = ruta;

  // modelos asociados a repuesto buscado
  const modelos = datosDespiece
    .filter(d => d.codigoSAP == repuesto.codigoSAP)
    .map(d => d.modelo);
  const modelosUnicos = [...new Set(modelos)]; // eliminar repetidos

  console.log("Modelos asociados:", modelosUnicos);

  const contenedorModelos = document.getElementById("modelos"); // Mostrar los modelos en pantalla

  contenedorModelos.innerHTML = `
    <p></p>
    <span class="valorDescripcion">Equipos asociados</span>
    <ul>
      ${modelosUnicos.map(m => `
        <li>
          <a href="despieces/${m}.pdf" target="_blank">
            ${m}
          </a>
        </li>
      `).join("")}
    </ul>
  `;
}

// evento enter
document.addEventListener("DOMContentLoaded", function () {

  const input = document.getElementById("inputSAP");

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      buscarSAP();
    }
  });

});

// evento icono busqueda
document.querySelector(".icono-lupa")
  .addEventListener("click", buscarSAP);

// ampliar imagen
function abrirImagen() {
  const src = document.getElementById("imgProducto").src;
  const modal = document.getElementById("modalImagen");

  document.getElementById("imgAmpliada").src = src;
  modal.style.display = "flex";
}

function cerrarImagen() {
  document.getElementById("modalImagen").style.display = "none";
}

document.getElementById("modalImagen").addEventListener("click", function(e) {
  if (e.target.id === "modalImagen") {
    cerrarImagen();
  }
});

// evento carrito
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");

  let carrito = JSON.parse(localStorage.getItem("carrito") || "{}");

  let total = 0;
  Object.values(carrito).forEach(item => {
    total += item.cantidad;
  });

  if (contador) {
    contador.textContent = total;
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const inputCantidad = document.getElementById("cantidad");
  const btnMas = document.getElementById("btn-mas");
  const btnMenos = document.getElementById("btn-menos");
  const btnAgregar = document.getElementById("btn-agregar");

  if (!btnMas) return;

  // 🔥 función para bloquear/desbloquear botón "-"
  function actualizarEstadoBotones() {
    let valor = parseInt(inputCantidad.value) || 1;

    if (valor <= 1) {
      btnMenos.classList.add("disabled");
      btnMenos.disabled = true;
    } else {
      btnMenos.classList.remove("disabled");
      btnMenos.disabled = false;
    }
}

  // ➕ SUMAR
  btnMas.addEventListener("click", () => {
    let valor = parseInt(inputCantidad.value) || 1;
    valor++;
    inputCantidad.value = valor;
    actualizarEstadoBotones();
  });

  // ➖ RESTAR
  btnMenos.addEventListener("click", () => {
    let valor = parseInt(inputCantidad.value) || 1;

    if (valor > 1) {
      valor--;
      inputCantidad.value = valor;
      actualizarEstadoBotones();
    }
  });

  // AGREGAR AL CARRITO
  btnAgregar.addEventListener("click", () => {

    let cantidad = parseInt(inputCantidad.value) || 1;

    const codigo = document.getElementById("sap").textContent.trim();
    const descripcion = document.getElementById("descripcion")?.textContent.trim() || "";
    const precio = document.getElementById("precio").textContent.trim().replace('$','');

    let carrito = JSON.parse(localStorage.getItem("carrito") || "{}");

    if (carrito[codigo]) {
      carrito[codigo].cantidad += cantidad;
    } else {
      carrito[codigo] = {
        codigoSAP: codigo,
        descripcion: descripcion,
        precio: precio,
        cantidad: cantidad
      };
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // ACTUALIZAR CONTADOR
    actualizarContadorCarrito();
    renderizarCarrito()

    // reset
    setTimeout(() => {
      cantidad = 1;
      inputCantidad.value = 1;
      actualizarEstadoBotones();
    }, 0);
  });

  // estado inicial
  actualizarEstadoBotones();
});

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("toggle-carrito");
  const panel = document.getElementById("carrito-flotante");

  if (btn && panel) {
    btn.addEventListener("click", () => {
      panel.classList.toggle("oculto");

      setTimeout(() => {
        renderizarCarrito();
      }, 50);
    });
  }

});

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  renderizarCarrito();
});

function renderizarCarrito() {
 const lista = document.getElementById("lista-carrito");
 const totalDiv = document.getElementById("total-carrito");
 if (!lista) return;

 let carrito = JSON.parse(localStorage.getItem("carrito") || "{}");

 lista.innerHTML = "";
 let total = 0;

 for (const codigo in carrito) {
    const item = carrito[codigo];
    const precioNumerico = parseFloat(item.precio.toString().replace(/\./g, '').replace(',', '.')) || 0;
    const subtotal = precioNumerico * item.cantidad;
    total += subtotal;
    const li = document.createElement("li");
    const span = document.createElement("span");
    const precioFormateado = precioNumerico.toLocaleString("es-CL");
    const subtotalFormateado = subtotal.toLocaleString("es-CL");

    span.textContent = `${item.codigoSAP} ~ ${item.descripcion} ~ ${item.cantidad} X $${precioFormateado} = $${subtotalFormateado}`;

    const btnMenos = document.createElement("button");
    btnMenos.textContent = "−";
    btnMenos.className = "btn-menos";
    btnMenos.onclick = () => {
      if (item.cantidad > 1) {
        item.cantidad--;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContadorCarrito();
      }
    };

    const btnMas = document.createElement("button");
    btnMas.textContent = "+";
    btnMas.className = "btn-mas";
    btnMas.onclick = () => {
      item.cantidad++;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderizarCarrito();
      actualizarContadorCarrito();
    };

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "X";
    btnEliminar.className = "eliminar";
    btnEliminar.onclick = () => {
      delete carrito[codigo];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderizarCarrito();
      actualizarContadorCarrito();
    };

    li.appendChild(span);
    li.appendChild(btnMenos);
    li.appendChild(btnMas);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
 }

  if (totalDiv) {
    totalDiv.textContent = "Total: $" + total.toLocaleString("es-CL");
    totalDiv.style.display = "block";
  }
}

// evento botón cotizar del carrito
let botonExtra = document.getElementById("boton-extra-carrito");

if (!botonExtra) {
 botonExtra = document.createElement("button");
 botonExtra.id = "boton-extra-carrito";
 botonExtra.textContent = "Cotizar";
 botonExtra.onclick = redirigirACotizador;

 document.getElementById("carrito-flotante").appendChild(botonExtra);
}

function redirigirACotizador() {
 const datosCotizador = [];

 let carrito = JSON.parse(localStorage.getItem("carrito") || "{}");

 for (const codigo in carrito) {
  const item = carrito[codigo];

  const precioNumerico = parseFloat(
   item.precio.toString().replace(/\./g, '').replace(',', '.')
  );

  const subtotal = precioNumerico * item.cantidad;

  datosCotizador.push({
   codigoSAP: item.codigoSAP,
   descripcion: item.descripcion,
   precio: item.precio,
   cantidad: item.cantidad,
   subtotal: subtotal.toLocaleString("es-CL")
  });
 }

 localStorage.setItem("cotizadorDatos", JSON.stringify(datosCotizador));
 window.open("Cotizador/index.html", "_blank");
}

//Cuenta Regresiva
const fechaObjetivo = new Date('2026-09-18T00:00:00');
const cuentaRegresiva = document.getElementById('cuenta-regresiva');
const diasElement = document.getElementById('dias');
const horasElement = document.getElementById('horas');
const minutosElement = document.getElementById('minutos');
const segundosElement = document.getElementById('segundos');

function actualizarCuentaRegresiva() {
const ahora = new Date();
const diferencia = fechaObjetivo.getTime() - ahora.getTime();
  if (diferencia < 0) {
  cuentaRegresiva.innerHTML = '¡La fecha ha llegado!';
  return;
}

const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  diasElement.innerHTML = `${dias} días,`;
  horasElement.innerHTML = `${horas} horas,`;
  minutosElement.innerHTML = `${minutos} minutos`;
  segundosElement.innerHTML = `y ${segundos} segundos.`;
}

setInterval(actualizarCuentaRegresiva, 1000);
actualizarCuentaRegresiva();