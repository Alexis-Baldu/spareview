// Variables globales.
let totalNeto = 0;
// Cargar Cotización.
window.onload = function() {
  const scriptContent = sessionStorage.getItem("cotizacionScript");
  if (!scriptContent) {
    console.error("No se encontró el script en sessionStorage.");
    return;
  }
  const script = document.createElement("script");
  script.textContent = scriptContent;
  document.head.appendChild(script);
  setTimeout(() => {
    if (typeof cotizacionGuardada !== "undefined") {
      document.getElementById("numero-cotizacion").value = cotizacionGuardada.numeroCotizacion;
      document.getElementById("fecha-cotizacion").value = cotizacionGuardada.fechaCotizacion;
      document.getElementById("nombre_cliente").value = cotizacionGuardada.cliente;
      document.getElementById("email").value = cotizacionGuardada.email;
      document.getElementById("casino").value = cotizacionGuardada.casino;
      document.getElementById("direccion").value = cotizacionGuardada.direccion;
      document.getElementById("contacto").value = cotizacionGuardada.contacto;
      document.getElementById("ciudad").value = cotizacionGuardada.ciudad;
      document.getElementById("telefono").value = cotizacionGuardada.telefono;
      document.getElementById("comentario").value = cotizacionGuardada.comentario;
      document.getElementById("email-ejecutivo").textContent = cotizacionGuardada.emailEjecutivo;
      document.getElementById("telefono-ejecutivo").textContent = cotizacionGuardada.telefonoEjecutivo;
      document.getElementById("Ejecutivo").textContent = cotizacionGuardada.Ejecutivo;
      document.getElementById("Subtotal").textContent = cotizacionGuardada.subtotal;
      document.getElementById("descuento").value = cotizacionGuardada.descuento;
      document.getElementById("descuento-clp").textContent = cotizacionGuardada.descuentoCLP;
      document.getElementById("total-neto").textContent = cotizacionGuardada.totalNeto;
      document.getElementById("iva").textContent = cotizacionGuardada.iva;
      document.getElementById("total-con-iva").textContent = cotizacionGuardada.totalConIva;
      const tbody = document.getElementById("grilla-cotizador-body");
      cotizacionGuardada.grilla.forEach(fila => {
        const tr = document.createElement("tr");
        let colIndex = 0;
        fila.forEach(valor => {
          const td = document.createElement("td");
          if (colIndex === 0) {
            // Insertar botón de eliminar en la columna "Imagen"
            td.innerHTML = `<button onclick="eliminarFila(this)">🗑️</button> ` + valor;
          } else {
            td.textContent = valor;
          }
          tr.appendChild(td);
          colIndex++;
        });
        tbody.appendChild(tr);
      });
    } else {
      console.error("cotizacionGuardada no está definido.");
    }
  }, 100);
}

//Agregar Servicio.
document.getElementById("agregar-fila").addEventListener("click", () => {
  const cuerpo = document.querySelector("#grilla-cotizador tbody");
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td><button onclick="eliminarFila(this)">🗑️</button></td>
    <td>
      <select class="select-servicio">
        <option value="">Seleccione</option>
        ${window.servicios.map(s => `<option value="${s.codigoSAP}">${s.codigoSAP}</option>`).join("")}
      </select>
    </td>
    <td><input class="input-descripcion" type="text" placeholder="Descripción"></td>
    <td><input id="servicio-descripcion" class="input-cantidad" type="number" value="1" min="1" max="1" onchange="recalcularTotales()"></td>
    <td>
      <span class="simbolo-moneda">$</span>
      <input class="input-precio" type="number" placeholder="Precio" onchange="recalcularTotales()">
    </td>
    <td class="precio-total">$0</td>
  `;
  cuerpo.appendChild(fila);
  recalcularTotales();
  const select = fila.querySelector(".select-servicio");
  const descripcionInput = fila.querySelector(".input-descripcion");
  select.addEventListener("change", () => {
    const servicio = window.servicios.find(s => s.codigoSAP === select.value);
    descripcionInput.value = servicio ? servicio.descripcion : "";
  });
});

//Agregar Repuesto.
document.getElementById("agregar-repuesto").addEventListener("click", () => {
    const cuerpo = document.querySelector("#grilla-cotizador tbody");
    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td><button onclick="eliminarFila(this)">🗑️</button></td>
        <td>
            <select class="select-repuesto">
                <option value="">Seleccione</option>
                ${window.repuestos.map(r => `<option value="${r.codigoSAP}">${r.codigoSAP}</option>`).join("")}
            </select>
        </td>
        <td><input class="input-descripcion-repuesto" type="text" placeholder="Descripción"></td>
        <td><input id="repuesto-descripcion" class="input-cantidad" type="number" value="1" min="1" max="1" onchange="recalcularTotales()"></td>
        <td>
          <span class="simbolo-moneda">$</span>
          <input class="input-precio" type="number" placeholder="Precio" onchange="recalcularTotales()">
        </td>
        <td class="precio-total">$0</td>
    `;
    cuerpo.appendChild(fila);
    recalcularTotales();
    const select = fila.querySelector(".select-repuesto");
    const descripcionInputRepuesto = fila.querySelector(".input-descripcion-repuesto");
    select.addEventListener("change", () => {
      const repuesto = window.repuestos.find(r => r.codigoSAP === Number(select.value));
      descripcionInputRepuesto.value = repuesto ? repuesto.descripcion : "";
    });
});

function recalcularTotales() {
  const filas = document.querySelectorAll("#grilla-cotizador tbody tr");
  let totalNeto = 0;
  filas.forEach(fila => {
    let cantidad = 0;
    let precio = 0;
    const cantidadInput = fila.querySelector("td:nth-child(4) input");
    const precioInput = fila.querySelector("td:nth-child(5) input");
    if (cantidadInput && precioInput) {
      cantidad = parseFloat(cantidadInput.value) || 0;
      precio = parseFloat(precioInput.value) || 0;
    } else {
      const cantidadTexto = fila.children[3]?.textContent?.replace(/\D/g, "") || "0";
      const precioTexto = fila.children[4]?.textContent?.replace(/[^\d,]/g, "").replace(",", ".") || "0";
      cantidad = parseFloat(cantidadTexto) || 0;
      precio = parseFloat(precioTexto) || 0;
    }
    const subtotal = cantidad * precio;
    const celdaTotal = fila.querySelector(".precio-total");
    if (celdaTotal) {
      celdaTotal.textContent = subtotal.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
    }
    totalNeto += subtotal;
  });
  const descuentoPorcentaje = parseFloat(document.getElementById("descuento").value) || 0;
  const descuentoCLP = totalNeto * (descuentoPorcentaje / 100);
  const netoConDescuento = totalNeto - descuentoCLP;
  const iva = netoConDescuento * 0.19;
  const totalConIva = netoConDescuento + iva;
  document.getElementById("Subtotal").textContent = totalNeto.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
  document.getElementById("descuento-clp").textContent = descuentoCLP.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
  document.getElementById("total-neto").textContent = netoConDescuento.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
  document.getElementById("iva").textContent = iva.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
  document.getElementById("total-con-iva").textContent = totalConIva.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}

function eliminarFila(boton) {
  const fila = boton.closest("tr");
  fila.remove();
  recalcularTotales();
}

//Función Abrir Cotización
function abrirVisor() {
  const input = document.getElementById("archivoJS");
  const archivo = input.files[0];
  if (!archivo) {
    alert("Selecciona un archivo .js primero.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const contenido = e.target.result;
    sessionStorage.setItem("cotizacionScript", contenido);
    window.open("Visor.html", "_blank");
  };
  reader.readAsText(archivo);
}

//Función Guardar Cotización
async function guardarCotizacion() {
  const datos = {
    numeroCotizacion: document.getElementById("numero-cotizacion")?.value || "cotizacion",
    fechaCotizacion: document.getElementById("fecha-cotizacion")?.value || "",
    cliente: document.getElementById("nombre_cliente")?.value || "",
    email: document.getElementById("email")?.value || "",
    casino: document.getElementById("casino")?.value || "",
    direccion: document.getElementById("direccion")?.value || "",
    contacto: document.getElementById("contacto")?.value || "",
    ciudad: document.getElementById("ciudad")?.value || "",
    telefono: document.getElementById("telefono")?.value || "",
    subtotal: document.getElementById("Subtotal")?.textContent || "",
    descuento: document.getElementById("descuento")?.value || "",
    descuentoCLP: document.getElementById("descuento-clp")?.textContent || "",
    totalNeto: document.getElementById("total-neto")?.textContent || "",
    iva: document.getElementById("iva")?.textContent || "",
    totalConIva: document.getElementById("total-con-iva")?.textContent || "",
    comentario: document.getElementById("comentario")?.value || "",
    Ejecutivo: document.getElementById("filtro-ejecutivo")?.value || "",
    emailEjecutivo: document.getElementById("email-ejecutivo")?.textContent || "",
    telefonoEjecutivo: document.getElementById("telefono-ejecutivo")?.textContent || "",
    grilla: []
  };

  const filas = document.querySelectorAll("#grilla-cotizador tbody tr");
  filas.forEach(fila => {
    const columnas = fila.querySelectorAll("td");
    const filaData = [];
    columnas.forEach((col, index) => filaData.push(index === 0 ? '' : col.textContent.trim()));
    //columnas.forEach(col => filaData.push(col.textContent.trim()));
    datos.grilla.push(filaData);
  });
  const contenido = "const cotizacionGuardada = " + JSON.stringify(datos, null, 2);
  try {
    const opciones = {
      types: [{
        description: "Archivo JavaScript",
        accept: { "application/javascript": [".js"] }
      }]
    };
    const handle = await window.showSaveFilePicker({
      suggestedName: datos.numeroCotizacion + ".js",
      ...opciones
    });
    const writable = await handle.createWritable();
    await writable.write(contenido);
    await writable.close();
    alert("Cotización guardada exitosamente.");
  } catch (err) {
    console.error("Error al guardar:", err);
    alert("No se pudo guardar el archivo.");
  }
}

//Función Imprimir Cotización
function imprimirCotizacion() {
    window.print();
}
window.imprimirCotizacion = imprimirCotizacion;