let ubicacionMap = {};// Mapa para asociar código SAP con las ubicaciones
if (typeof ubicacionData !== "undefined") {
  ubicacionData.forEach(item => {
    ubicacionMap[item.codigoSAP] = item.ubicacion;
  });
}
// inicio gráfico Códigos SAP con imagenes
function imprimirEnPantalla(mensaje, tipo = 'log') {
    const contenedor = document.getElementById('logConsola');
    if (contenedor) {
        const p = document.createElement('p');
        p.textContent = mensaje;
        p.style.color = tipo === 'warn' ? 'red' : 'black';
        contenedor.appendChild(p);
    }
}
function verificarImagenesFaltantes() {
  const faltantes = [];
  let revisados = 0;

  // Eliminar duplicados
  const codigosUnicos = {};
  datosDespiece.forEach(dato => {
    codigosUnicos[dato.codigoSAP] = dato;
  });
  const datosFiltrados = Object.values(codigosUnicos);

  datosFiltrados.forEach(dato => {
    verificarImagen(dato.codigoSAP, (existe) => {
        if (!existe) {
            faltantes.push(dato.codigoSAP);
            console.warn(`Falta imagen para: ${dato.codigoSAP}`);
            //imprimirEnPantalla(`Falta imagen para: ${dato.codigoSAP}`, 'warn');
        } else {
            console.log(`Imagen encontrada para: ${dato.codigoSAP}`);
            //imprimirEnPantalla(`Imagen encontrada para: ${dato.codigoSAP}`, 'log');
        }
        revisados++;
        if (revisados === datosFiltrados.length) {
            mostrargraficoImagen(faltantes, datosFiltrados.length);
            mostrarCodigosSAPSinImagenes(faltantes);
        }
    });
  });
}

function verificarImagen(codigoSAP, callback) {
  const extensiones = ['jpg', 'jpeg', 'png', 'JPG'];
  let index = 0;

  function intentarCargar() {
    if (index >= extensiones.length) {
      callback(false); // No se encontró ninguna imagen
      return;
    }

    const img = new Image();
    img.src = `imagenes/${codigoSAP}.${extensiones[index]}`;
    img.onload = () => callback(true);
    img.onerror = () => {
      index++;
      intentarCargar();
    };
  }
  intentarCargar();
}

function mostrargraficoImagen(faltantes, total) {
  const sinImagen = faltantes.length;
  const conImagen = total - sinImagen;
  
  // Mostrar total
  document.getElementById('totalSAP').textContent = `Total Repuestos cargados: ${total}`;

  // Mostrar gráfico
  const ctx = document.getElementById('graficoImagen').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [`Repuestos con imágen ${conImagen}`, `Repuestos sin imágen ${sinImagen}`],
      datasets: [{
        data: [conImagen, sinImagen],
        backgroundColor: ['#36A2EB', '#fa1043ff']
      }]
    },
  options: {
    plugins: {
      title: {
        display: true,
        text: `Disponibilidad de Repuestos con Imágen`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const porcentaje = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${porcentaje}%`;
          }
        }
      }
    }
  }
});
}
// Fin gráfico Códigos SAP sin imagenes.
// Inicio mostrar Códigos SAP con imagenes.
function mostrarCodigosSAPSinImagenes(faltantes) {
  const lista = document.getElementById('listaCodigosSAPSinImagen');
  if (lista) {
    lista.innerHTML = ''; // Limpiar contenido previo
    faltantes.forEach(codigo => {
      const li = document.createElement('li');
      li.textContent = codigo;
      lista.appendChild(li);
    });
  }
  console.log(`Total códigos SAP sin imagen: ${faltantes.length}`);
}
// Fin mostrar Códigos SAP sin imagenes.
// inicio gráfico modelos con despieces.
const cantidadModelosConDespiece = 666; // Cantidad fija de modelos con despiece

const totalModelos = Object.values( // Calcular total de modelos únicos desde datosDespiece
  datosDespiece.reduce((acc, item) => {
    if (item.modelo && item.modelo.trim() !== "") {
      const modeloLimpio = item.modelo.trim().toUpperCase(); // normaliza
      acc[modeloLimpio] = item;
    }
    return acc;
  }, {})
).length;

function mostrargraficoDespieceManual(conDespiece, total) { // Mostrar gráfico con la cantidad fija
  const sinDespiece = total - conDespiece;
  document.getElementById('totalModelos').textContent = `Total Modelos cargados: ${total}`;
  const ctx = document.getElementById('graficoDespiece').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [`Modelos con Despiece: ${conDespiece}`, `Modelos sin Despiece: ${sinDespiece}`],
      datasets: [{
        data: [conDespiece, sinDespiece],
        backgroundColor: ['#36A2EB', '#fa1043ff']
      }]
    },
  options: {
    plugins: {
      title: {
        display: true,
        text: `Disponibilidad de Modelos con Despiece`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const porcentaje = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${porcentaje}%`;
          }
        }
      }
    }
  }
});

}
// Fin gráfico modelos con despieces.
// Inicio mostrar modelos con despieces.
function mostrarModelosUnicos() {
  const modelosUnicos = new Set();

  datosDespiece.forEach(item => {
    if (item.modelo && item.modelo.trim() !== "") {
      const modeloNormalizado = item.modelo.trim().toUpperCase();
      modelosUnicos.add(modeloNormalizado);
    }
  });

  const lista = document.getElementById('listaModelosUnicos');
  if (lista) {
    modelosUnicos.forEach(modelo => {
      const li = document.createElement('li');
      li.textContent = modelo;
      lista.appendChild(li);
    });
  }

  console.log(`Total modelos únicos: ${modelosUnicos.size}`);
}

document.addEventListener("DOMContentLoaded", function () {
  mostrarModelosUnicos();
});
// Fin mostrar modelos con despieces.
// inicio gráfico códigos con Ubicación.
function mostrargraficoUbicacion() {
  const codigosStock = new Set();
  stock1506Data.forEach(item => {
    if (item.codigoSAP) {
      codigosStock.add(item.codigoSAP);
    }
  });

  const codigosUbicados = new Set();
  ubicacionData.forEach(item => {
    if (item.codigoSAP) {
      codigosUbicados.add(item.codigoSAP);
    }
  });

  const codigosSinUbicacion = [];
  codigosStock.forEach(codigo => {
    if (!codigosUbicados.has(codigo)) {
      codigosSinUbicacion.push(codigo);
    }
  });

  const total = codigosStock.size;
  const conUbicacion = total - codigosSinUbicacion.length;
  const sinUbicacion = codigosSinUbicacion.length;

  // Mostrar total
  document.getElementById('totalUbicacion').textContent = `Total Repuestos con stock: ${total}`;

  // Mostrar gráfico
  const ctx = document.getElementById('graficoUbicacion').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [`Repuestos con Ubicación: ${conUbicacion}`, `Repuestos sin Ubicación: ${sinUbicacion}`],
      datasets: [{
        data: [conUbicacion, sinUbicacion],
        backgroundColor: ['#36A2EB', '#fa1043ff']
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Disponibilidad de Repuestos con Ubicación'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.raw;
              const porcentaje = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${porcentaje}%`;
            }
          }
        }
      }
    }
  });

  // Mostrar códigos sin ubicación en pantalla
  const contenedor = document.getElementById('codigosSinUbicacion');
  contenedor.innerHTML = `<ol>` +
    codigosSinUbicacion.map(codigo => `<li>${codigo}</li>`).join('') +
    `</ol>`;
}
// Fin gráfico códigos con Ubicación.
// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  verificarImagenesFaltantes(); // Ejecuta el gáfico de Imagenes.
  mostrargraficoDespieceManual(cantidadModelosConDespiece, totalModelos); // Ejecuta el gáfico de Despieces.
  mostrargraficoUbicacion(); // Ejecuta el gáfico de Ubicacioes.
});

document.addEventListener("DOMContentLoaded", function () {
  // Mostrar listas al hacer clic en el encabezado
  document.querySelectorAll(".toggle-header").forEach(header => {
    header.addEventListener("click", () => {
      const targetId = header.getAttribute("data-target");
      const lista = document.getElementById(targetId);
      if (lista) {
        lista.style.display = lista.style.display === "none" ? "block" : "none";
      }
    });
  });
});

// TODOS los SAP de datosDespiece
const sapDespiece = new Set(datosDespiece.map(d => Number(d.codigoSAP)));

// TODOS los reemplazos
const reemplazos = reemplazosData.map(r => Number(r.reemplazo));

// BUSCAR los que NO existen
const noExistentes = reemplazos.filter(r => !sapDespiece.has(r));

// eliminar repetidos
const unicos = [...new Set(noExistentes)];

console.log("❌ Reemplazos que NO están en datos_despiece:", unicos);
