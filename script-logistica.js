// Variables globales
let imagenes = []; // Almacena los archivos de imagen seleccionados
let grilla = []; // Almacena los datos de despiece filtrados
let stock1506Map = {};
let stock1524Map = {};
let stock1409Map = {};
if (typeof datosMb52 !== "undefined") {
  datosMb52.forEach(item => {
    const codigo = item.codigoSAP;
    if (String(item.almacen) === "1506") {
      stock1506Map[codigo] =
        (stock1506Map[codigo] || 0) +
        Number(item.Stock || 0);
    }
    if (String(item.almacen) === "1524") {
      stock1524Map[codigo] =
        (stock1524Map[codigo] || 0) +
        Number(item.Stock || 0);
    }
    if (String(item.almacen) === "1409") {
      stock1409Map[codigo] =
        (stock1409Map[codigo] || 0) +
        Number(item.Stock || 0);
    }
  });
}
let ubicacionMap = {}; // Mapa para asociar código SAP con las ubicaciones
  if (typeof ubicacionData !== "undefined") {
    ubicacionData.forEach(item => {
      ubicacionMap[item.codigoSAP] = item.ubicacion;
    });
  }
let medidaMap = {}; // Mapa para asociar código SAP con las medidas
  medidaData.forEach(item => {
    medidaMap[item.codigoSAP] = item;
  });
document.addEventListener("DOMContentLoaded", mostrarTodosLosDatos);// muestra todos los datos al cargar

function filtrarTabla(input) {
  const th = input.closest("th");
  const tabla = document.getElementById("grilla-logistica");
  const filtros = tabla.querySelectorAll("thead input.filtro-columna");
  const filas = tabla.querySelectorAll("tbody tr");
  
  filas.forEach(fila => {
    let mostrar = true;

    filtros.forEach((input, index) => {
      const valor = input.value.toLowerCase();
      const celda = fila.querySelectorAll("td")[index + 1]; // +1 para saltar la columna de imagen

      if (celda) {
        const textoCelda = celda.textContent.trim().toLowerCase()
          .replace(/[^a-z0-9áéíóúüñ]/gi, '');
        
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


function mostrarTodosLosDatos() {
  const cuerpoTabla = document.getElementById("grilla-body");
  cuerpoTabla.innerHTML = "";

  // Filtrar datos únicos por codigoSAP
  const codigosVistos = new Set();
  const datosUnicos = datosDespiece.filter(dato => {
    if (codigosVistos.has(dato.codigoSAP)) {
      return false;
    } else {
      codigosVistos.add(dato.codigoSAP);
      return true;
    }
  });

  // Ordenar por codigoSAP como número
  datosUnicos.sort((a, b) => {
    return Number(a.codigoSAP) - Number(b.codigoSAP);
  });

  // Mostrar los datos ordenados
  datosUnicos.forEach(dato => {
    const fila = document.createElement("tr");
    const medida = medidaMap[dato.codigoSAP] ?? {};
    const largo = medida.largo ?? "-";
    const ancho = medida.ancho ?? "-";
    const alto = medida.alto ?? "-";
    const m3 = medida.m3 ?? "-";
    const peso = medida.peso ?? "-";
    const Stock_1409 = stock1409Map[dato.codigoSAP] ?? "0";
    const Stock_1524 = stock1524Map[dato.codigoSAP] ?? "0";
    const Stock_1506 = stock1506Map[dato.codigoSAP] ?? "0";
    const ubicacion = ubicacionMap[dato.codigoSAP] ?? "-";
    const repuesto = window.repuestos?.find(
      r => Number(r.codigoSAP) === Number(dato.codigoSAP)
    );
    const descripcion = repuesto?.descripcion || dato.descripcion || "-";

    fila.innerHTML = `
      <td>
        <a target="_blank">
          <img
            src="imagenes/${dato.codigoSAP}.jpg"
            alt=""
            style="width:40px;height:auto"
            onload="this.parentElement.href=this.src"
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
        </a>
      </td>
      <td>${dato.codigoSAP}</td>
      <td>${dato.codigoFabrica}</td>
      <td>${descripcion}</td>
      <td>${dato.modelo}</td>
      <td>${largo}</td>
      <td>${ancho}</td>
      <td>${alto}</td>
      <td>${m3}</td>
      <td>${peso}</td>
      <td>${Stock_1409}</td>
      <td>${Stock_1524}</td>
      <td>${Stock_1506}</td>
      <td>${ubicacion}</td>
      `;
      cuerpoTabla.appendChild(fila);
  });
}

function exportarAExcel() {
  const tabla = document.getElementById("grilla-logistica");
  const wb = XLSX.utils.table_to_book(tabla, { sheet: "Logística", raw: true });
  XLSX.writeFile(wb, "Datos.xlsx");
}
