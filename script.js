// Variables globales
let imagenes = []; // Almacena los archivos de imagen seleccionados.
let grilla = []; // Almacena los datos de despiece filtrados.
let archivosCargados = JSON.parse(localStorage.getItem("archivosCargados") || "[]"); // Recupera archivos guardados previamente del almacenamiento local
let stock1409Map = {};
let stock1506Map = {};
let stock1524Map = {};
if (typeof datosMb52 !== "undefined") {
  datosMb52.forEach(item => {
    const codigo = item.codigoSAP;
    if (item.almacen == "1409") {
      stock1409Map[codigo] =
        (stock1409Map[codigo] || 0) +
        Number(item.Stock || 0);
    }
    if (item.almacen == "1506") {
      stock1506Map[codigo] =
        (stock1506Map[codigo] || 0) +
        Number(item.Stock || 0);
    }
    if (item.almacen == "1524") {
      stock1524Map[codigo] =
        (stock1524Map[codigo] || 0) +
        Number(item.Stock || 0);
    }
  });
}
let precioMap = {}; // Mapa para asociar código SAP con los precios
  if (typeof precioData !== "undefined") {
    precioData.forEach(item => {
      const codigo = item.codigoSAP;
      precioMap[codigo] = {
        precio24: item.precio24,
        precio28: item.precio28,
        precio29: item.precio29,
        precio30: item.precio30
      };
    });
  }
const filtroMarca = document.getElementById("filtro-marca");
const filtroModelo = document.getElementById("filtro-modelo");

function cargarModelosPorMarca() {
  if (typeof modelosPorMarca !== "undefined") {
    // Llenar marcas
    filtroMarca.innerHTML = "";
    Object.keys(modelosPorMarca).forEach(marca => {
      const option = document.createElement("option");
      option.value = marca;
      option.textContent = marca;
      filtroMarca.appendChild(option);
    });

    // Actualizar modelos al seleccionar una marca
    filtroMarca.addEventListener("change", () => {
      const marcaSeleccionada = filtroMarca.value;
      filtroModelo.innerHTML = "";
      const modelos = modelosPorMarca[marcaSeleccionada] || [];
      modelos.forEach(modelo => {
        const option = document.createElement("option");
        option.value = modelo;
        option.textContent = modelo;
        filtroModelo.appendChild(option);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", cargarModelosPorMarca);

function obtenerReemplazo(codigoSAP) {
  const item = reemplazosData.find(r => r.codigoSAP == codigoSAP);
  return item ? item.reemplazo : "";
}

function obtenerReposicion(codigoSAP) {
  if (typeof datosComex === "undefined") return { fecha: "", cantidad: "" };

  const hoy = new Date();

  // Filtrar por SAP y solicitante
  const registros = datosComex.filter(item =>
    item.codigoSAP == codigoSAP &&
    (item.Solicitante === "STOCK" || item.Solicitante === "STOCK2")
  );

  if (registros.length === 0) {
    return { fecha: "", cantidad: "" };
  }

  // Separar los que tienen fecha válida
  const conFecha = registros.filter(r => r.FechaLlegada && r.FechaLlegada !== "");

  if (conFecha.length > 0) {
    let mejor = null;
    let menorDiferencia = Infinity;

    conFecha.forEach(r => {
      const partes = r.FechaLlegada.split("-");
      const fecha = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);

      const diff = Math.abs(fecha - hoy);

      if (diff < menorDiferencia) {
        menorDiferencia = diff;
        mejor = r;
      }
    });

    if (!mejor) {
      return {
        fecha: "",
        cantidad: ""
      };
    }

    return {
      fecha: mejor.FechaLlegada,
      cantidad: mejor.Cantidad
    };
  }

  // Si no hay fechas → buscar OrdenCompra más alta
  const mayorOC = registros.reduce((max, actual) =>
    actual.OrdenCompra > max.OrdenCompra ? actual : max
  );

  return {
    fecha: "",
    cantidad: mayorOC.Cantidad
  };
}

// Datos de despiece
filtroModelo.addEventListener("change", () => {
  const modeloSeleccionado = filtroModelo.value;
  const canalSeleccionado = document.getElementById("filtro-canal").value;
  const datosFiltrados = datosDespiece.filter(d => d.modelo === modeloSeleccionado);
  const cuerpoTabla = document.getElementById("grilla-body");
  cuerpoTabla.innerHTML = ""; // Limpiar tabla
  if (datosFiltrados.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 7;
    celda.textContent = "No hay datos para este modelo.";
    fila.appendChild(celda);
    cuerpoTabla.appendChild(fila);
    return;
  }
  // Agregar filas
  datosFiltrados.forEach(dato => {
    const fila = document.createElement("tr");
    const Stock_1409 = stock1409Map[dato.codigoSAP] ?? "0"; // Muestra cero si no hay stock
    const Stock_1524 = stock1524Map[dato.codigoSAP] ?? "0";
    const Stock_1506 = stock1506Map[dato.codigoSAP] ?? "0";
    const precios = precioMap[dato.codigoSAP] ?? {};
    const reposicion = obtenerReposicion(dato.codigoSAP);
    const reemplazo = obtenerReemplazo(dato.codigoSAP);
    const repuesto = window.repuestos?.find(
      r => Number(r.codigoSAP) === Number(dato.codigoSAP)
    );
    const descripcion = repuesto?.descripcion || dato.descripcion || "-";

    let precioCanal = "-";
      if (canalSeleccionado === "24") precioCanal = precios.precio24 ?? "-";
      else if (canalSeleccionado === "28") precioCanal = precios.precio28 ?? "-";
      else if (canalSeleccionado === "29") precioCanal = precios.precio29 ?? "-";
      else if (canalSeleccionado === "30") precioCanal = precios.precio30 ?? "-";
    
      fila.innerHTML = `
      <td>
        <img
          src="imagenes/${dato.codigoSAP}.jpg"
          alt=""
          style="width:40px;height:auto;cursor:pointer"
          onclick="window.open(this.src, '_blank')"
          onerror="
            if(!this.dataset.step){
              this.dataset.step='1';
              this.src='imagenes/${dato.codigoSAP}.JPG';
            }else if(this.dataset.step==='1'){
              this.dataset.step='2';
              this.src='imagenes2/${dato.codigoSAP}.jpg';
            }else if(this.dataset.step==='2'){
              this.dataset.step='3';
              this.src='imagenes2/${dato.codigoSAP}.JPG';
            }else if(this.dataset.step==='3'){
              this.dataset.step='4';
              this.src='imagenes3/${dato.codigoSAP}.jpg';
            }else if(this.dataset.step==='4'){
              this.dataset.step='5';
              this.src='imagenes3/${dato.codigoSAP}.JPG';
            }else{
              this.closest('td').innerHTML='';
            }
          "
        >
      </td>
      <td>${dato.codigoFabrica}</td>
      <td>${dato.codigoSAP}</a></td>
      <td>${reemplazo}</td>
      <td>${descripcion}</td>
      <td>${dato.cantidad}</td>
      <td>${precioCanal}</td>
      <td>${Stock_1409}</td>
      <td>${Stock_1524}</td>
      <td>${Stock_1506}</td>
      <td>${reposicion.fecha}</td>
      <td>${reposicion.cantidad}</td>
      <td>
        <a href="" target="_blank">
          <img src="Icon/cart_add.png" alt="carrito" style="width: 20px; height: auto;">
        </a>
      </td>
      `;
    cuerpoTabla.appendChild(fila);
  });
});

// Escuchar cambios en el canal y recargar la tabla
document.getElementById("filtro-canal").addEventListener("change", () => {
  const evento = new Event("change");
  filtroModelo.dispatchEvent(evento);
});

const contenedorImagen = document.getElementById("imagen");

filtroModelo.addEventListener("change", () => {
  const modeloSeleccionado = filtroModelo.value;
  const visor = document.getElementById("visor-despiece");
  const embed = document.getElementById("embed-despiece");

  if (!modeloSeleccionado) {
    visor.style.display = "none";
    embed.src = "";
    return;
  }

  const archivo = `despieces/${modeloSeleccionado}.pdf`;

  // Crear un objeto temporal para probar si el archivo existe
  const testEmbed = document.createElement("embed");
  testEmbed.src = archivo;
  testEmbed.type = "application/pdf";

  testEmbed.onload = () => {
    embed.src = archivo;
    embed.style.display = "block";
    visor.style.display = "block";
  };

  testEmbed.onerror = () => {
    embed.src = "";
    embed.style.display = "none";
    visor.style.display = "none";
  };

  // Forzar carga para activar onload/onerror
  document.body.appendChild(testEmbed);
  setTimeout(() => document.body.removeChild(testEmbed), 100);
});

document.getElementById("filtro-modelo").addEventListener("change", () => {
  const modeloSeleccionado = document.getElementById("filtro-modelo").value;
  const contenedorImagen = document.getElementById("imagen");
  if (!contenedorImagen) return;
  contenedorImagen.innerHTML = "";
  const archivo = archivosCargados.find(a => a.nombre === modeloSeleccionado);
  if (archivo) {
    if (archivo.tipo.includes("image")) {
      const img = document.createElement("img");
      img.src = archivo.url;
      img.style.maxWidth = "100%";
      contenedorImagen.appendChild(img);
    } else if (archivo.tipo === "application/pdf") {
      const iframe = document.createElement("iframe");
      iframe.src = archivo.url;
      iframe.width = "100%";
      iframe.height = "500px";
      contenedorImagen.appendChild(iframe);
    }
  }
});

function filtrarTabla(input) {
  const th = input.closest("th");
  const tabla = document.getElementById("grilla");
  const filtros = tabla.querySelectorAll("thead input.filtro-columna");
  const filas = tabla.querySelectorAll("tbody tr");

  filas.forEach(fila => {
    let mostrar = true;

    filtros.forEach((input, index) => {
      const valor = input.value.toLowerCase();
      const celda = fila.querySelectorAll("td")[index + 1]; // +1 para saltar la columna de imagen

      if (celda) {
        const textoCelda = celda.textContent.trim().toLowerCase()
          .replace(/[^a-z0-9áéíóúüñ]/gi, ''); // elimina símbolos

        // Soporte para múltiples valores separados por coma
        const valoresFiltro = valor.split(',').map(v => 
          v.trim().replace(/[^a-z0-9áéíóúüñ]/gi, '')
        );

        const coincide = valoresFiltro.some(filtro => 
          textoCelda.includes(filtro)
        );

        if (!coincide) {
          mostrar = false;
        }
        
      }
    });

      fila.style.display = mostrar ? "" : "none";
  });

  if (input.value.trim() !== "") {
      th.classList.add("activo");
  } else {
      th.classList.remove("activo");
  }
}

document.addEventListener("click", function(e) {
    const ths = document.querySelectorAll("#grilla thead th");
    ths.forEach(th => {
        const input = th.querySelector(".filtro-columna");
        if (!th.contains(e.target) && (!input || input.value.trim() === "")) {
            th.classList.remove("activo");
        }
    });

    if (e.target.closest("th") && e.target.closest("th").querySelector(".filtro-columna")) {
        e.target.closest("th").classList.add("activo");
        const input = e.target.closest("th").querySelector(".filtro-columna");
        if (input) input.focus();
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const marca = document.getElementById("filtro-marca");
  const modelo = document.getElementById("filtro-modelo");
  const canal = document.getElementById("filtro-canal")

  // Agregar opción vacía como placeholder
  if (marca) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Selecciona una Marca";
    option.disabled = true;
    option.selected = true;
    marca.insertBefore(option, marca.firstChild);
  }
  if (modelo) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Selecciona un Modelo";
    option.disabled = true;
    option.selected = true;
    modelo.insertBefore(option, modelo.firstChild);
  }
  if (canal) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Selecciona un Canal";
    option.disabled = true;
    option.selected = true;
    canal.insertBefore(option, canal.firstChild);
  }
});

let carrito = JSON.parse(localStorage.getItem("carrito") || "{}");

function agregarAlCarrito(codigoSAP, descripcion, precio) {
  if (carrito[codigoSAP]) {
    carrito[codigoSAP].cantidad += 1;
  } else {
    carrito[codigoSAP] = {
      codigoSAP,
      descripcion,
      precio,
      cantidad: 1
    };
  }

  actualizarCarritoUI();
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Mostrar el carrito al agregar un ítem
  document.getElementById("lista-carrito").style.display = "block";
  const totalDiv = document.getElementById("total-carrito");
  if (totalDiv) totalDiv.style.display = "block";

  const toggleBtn = document.getElementById("toggle-carrito");
  if (toggleBtn) toggleBtn.textContent = "🛒";

}

function eliminarDelCarrito(codigoSAP) {
  delete carrito[codigoSAP];
  actualizarCarritoUI();
  
  localStorage.setItem("carrito", JSON.stringify(carrito));

}

function actualizarCarritoUI() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  let total = 0;

  for (const codigo in carrito) {
    const item = carrito[codigo];
    // Convertir precio con separador de miles a número
    const precioNumerico = parseFloat(item.precio.toString().replace(/\./g, '').replace(',', '.'));
    const subtotal = precioNumerico * item.cantidad;
    total += subtotal;

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${item.codigoSAP} ~ ${item.descripcion} ~ ${item.cantidad} X $${item.precio} = $${subtotal.toLocaleString("es-CL")}`;
    
    const btnMenos = document.createElement("button");
    btnMenos.textContent = "−";
    btnMenos.className = "btn-menos";
    btnMenos.onclick = () => {
        if (item.cantidad > 1) {
          item.cantidad -= 1;
          actualizarCarritoUI();
        } 
      };

    const cantidadSpan = document.createElement("span");
    cantidadSpan.textContent = item.cantidad;
    cantidadSpan.style.margin = "0 6px";

    const btnMas = document.createElement("button");
    btnMas.textContent = "+";
    btnMas.className = "btn-mas";
    btnMas.onclick = () => {
        item.cantidad += 1;
        actualizarCarritoUI();
    };

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "eliminar";
    btnEliminar.textContent = "X";
    btnEliminar.onclick = () => eliminarDelCarrito(codigo);

    li.appendChild(span);
    li.appendChild(btnMenos);
    li.appendChild(btnMas);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  }

  // Mostrar total acumulado
  let totalDiv = document.getElementById("total-carrito");
  if (!totalDiv) {
    totalDiv = document.createElement("div");
    totalDiv.id = "total-carrito";
    totalDiv.style.marginTop = "10px";
    totalDiv.style.fontWeight = "bold";
    lista.parentElement.appendChild(totalDiv);
  }
  totalDiv.textContent = `Total: $${total.toLocaleString("es-CL")}`;
  
  let botonExtra = document.getElementById("boton-extra-carrito"); // Crear botón adicional junto al total del carrito
  if (!botonExtra) {
      botonExtra = document.createElement("button");
      botonExtra.id = "boton-extra-carrito";
      botonExtra.textContent = "Cotizar"; // Puedes cambiar el texto
      totalDiv.parentElement.insertBefore(botonExtra, totalDiv.nextSibling);
      botonExtra.onclick = redirigirACotizador;
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  
  // Actualizar contador visual en el botón
  const toggleBtn = document.getElementById("toggle-carrito");
  if (toggleBtn) {
      const totalProductos = Object.values(carrito).reduce((sum, item) => sum + item.cantidad, 0);
      
      let contador = toggleBtn.querySelector(".contador-productos");
      if (!contador) {
          contador = document.createElement("span");
          contador.className = "contador-productos";
          toggleBtn.appendChild(contador);
      }

      // Actualiza el contenido correctamente
      contador.textContent = totalProductos;

      // ✅ Se asegura que se oculte si no hay productos
      contador.style.display = totalProductos > 0 ? "flex" : "none";
  }
 
}

// Evento para íconos de carrito
document.addEventListener("click", function(e) { //Escucha todos los clics que ocurren en la página.
  if (e.target.matches("img[alt='carrito']")) { //Verifica si el clic fue sobre la imagen con el atributo alt="carrito".
    e.preventDefault(); //Previene el comportamiento por defecto del clic (por ejemplo, si el ícono está dentro de un enlace <a>, evita que se abra una nueva página).
    const fila = e.target.closest("tr"); //Busca la fila (<tr>) más cercana al ícono clicado. Esto permite acceder a los datos del producto en esa fila.
    const codigoSAP = fila.children[2].textContent.trim(); //Extrae el código SAP del producto de la 3ra columna.
    const descripcion = fila.children[4].textContent.trim(); //Extrae la descripción del producto desde la 5ta columna.
    const precio = fila.children[6].textContent.trim().replace('$', ''); //Extrae el precio desde la 8va columna. Elimina el símbolo $ para dejar solo el número.
    agregarAlCarrito(codigoSAP, descripcion, precio); //Llama a la función agregarAlCarrito pasando los datos del producto para que se agregue al carrito.
  }
});

// Botón para minimizar o expandir el carrito
document.addEventListener("DOMContentLoaded", () => { //Espera a que todo el HTML esté cargado antes de ejecutar el código JavaScript.
  const toggleBtn = document.getElementById("toggle-carrito"); //Obtiene el botón que se usará para mostrar/ocultar el carrito.
  const lista = document.getElementById("lista-carrito"); //Obtiene la lista de productos dentro del carrito.
  const total = document.getElementById("total-carrito"); //Obtiene el contenedor donde se muestra el total del carrito.
  const titulo = document.querySelector("#carrito-flotante h3"); //Obtiene el título del carrito <h3>.
  const carrito = document.getElementById("carrito-flotante"); //Obtiene el contenedor principal del carrito flotante.
  if (toggleBtn) { //Verifica que el botón exista antes de intentar usarlo.
    
    toggleBtn.addEventListener("click", () => { //Agrega un evento que se ejecuta cuando se hace clic en el botón.
      const oculto = carrito.classList.toggle("oculto"); //Alterna la clase oculto en el carrito. Si la tiene, la quita; si no la tiene, la agrega.
      const visible = lista.style.display === "none"; //Verifica si la lista de productos está visible.
      lista.style.display = visible ? "none" : "block"; //Si está visible, la oculta; si está oculta, la muestra.
      total.style.display = visible ? "none" : "block"; //Hace lo mismo con el total del carrito.
      titulo.style.display = visible ? "none" : "block"; //También alterna la visibilidad del título.
      toggleBtn.textContent = visible ? "🛒" : "🛒"; //Cambia el ícono del botón según el estado: 🛒 si está cerrado, − si está abierto.

      // Asegurar que el contador siga visible
      const contador = toggleBtn.querySelector(".contador-productos");
      if (contador) {
        contador.style.display = "flex";
      }
    });
  }
  actualizarCarritoUI(); //Llama a la función que actualiza visualmente el contenido del carrito con los datos guardados.
  
});

function redirigirACotizador() {
    const datosCotizador = [];

    for (const codigo in carrito) {
        const item = carrito[codigo];
        const precioNumerico = parseFloat(item.precio.toString().replace(/\./g, '').replace(',', '.'));
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

// buscador dinamico, no utilizado todavía.
// <input type="text" id="busqueda-general" placeholder="Buscar por código SAP o descripción..." style="width: 99%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("busqueda-general");
    if (!buscador) return;

    buscador.addEventListener("input", function () {
        const filtro = this.value.toLowerCase().trim();
        const filas = document.querySelectorAll("#grilla tbody tr");

        filas.forEach(fila => {
            const celdas = fila.querySelectorAll("td");
            const codigoSAP = celdas[2]?.textContent.toLowerCase() || "";
            const descripcion = celdas[3]?.textContent.toLowerCase() || "";
            const modelo = celdas[1]?.textContent.toLowerCase() || "";

            const coincide = codigoSAP.includes(filtro) || descripcion.includes(filtro) || modelo.includes(filtro);
            fila.style.display = coincide ? "" : "none";
        });
    });
});

function exportarAExcel() {
  const tabla = document.getElementById("grilla");
  const wb = XLSX.utils.table_to_book(tabla, { sheet: "Detalle", raw: true });
  XLSX.writeFile(wb, "Detalle.xlsx");
}

function abrirPdfModelo(){
    const modelo = document.getElementById("filtro-modelo").value;
    if(!modelo){
        alert(
            "Debe seleccionar un modelo."
        );
        return;
    }
    const pdf =
        `despieces/${modelo}.pdf`;
    window.open(
        pdf,
        "_blank"
    );
}
