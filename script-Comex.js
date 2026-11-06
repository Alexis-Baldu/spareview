document.addEventListener("DOMContentLoaded", mostrarDatosComex);

function mostrarDatosComex() {

    const cuerpo = document.getElementById("comex-body");
    cuerpo.innerHTML = "";

    datosComex.forEach(dato => {

        const repuesto = window.repuestos?.find(
            r => Number(r.codigoSAP) === Number(dato.codigoSAP)
        );

        const descripcion =
            repuesto?.descripcion || dato.descripcion || "-";

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${dato.OrdenCompra}</td>
            <td>${dato.Posicion}</td>
            <td>${dato.codigoSAP}</td>
            <td>${descripcion}</td>
            <td>${dato.Almacen ?? "-"}</td>
            <td>${dato.Cantidad}</td>
            <td>${dato.ETA}</td>
            <td>${dato.FechaLlegada}</td>
            <td>${dato.Seguimiento ?? "-"}</td>
            <td>${dato.Solicitante}</td>
        `;

        cuerpo.appendChild(fila);
    });
}

function filtrarTabla(input) {
  const th = input.closest("th");
  const tabla = document.getElementById("grilla-comex");
  const filtros = tabla.querySelectorAll("thead input.filtro-columna");
  const filas = tabla.querySelectorAll("tbody tr");

  filas.forEach(fila => {
    let mostrar = true;
    filtros.forEach((input, index) => {
      const valor = input.value.toLowerCase().trim();
      const celda = fila.querySelectorAll("td")[index];
      if (celda) {
        const texto = celda.textContent.toLowerCase().trim();
        const valoresFiltro = valor.split(',').map(v => v.trim());
        const coincide = valoresFiltro.some(f => texto.includes(f));
        if (!coincide && valor !== "") {
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

function exportarComexExcel() {
  const tabla = document.getElementById("grilla-comex");
  const wb = XLSX.utils.table_to_book(tabla, { sheet: "Comex", raw: true });
  XLSX.writeFile(wb, "Comex.xlsx");
}