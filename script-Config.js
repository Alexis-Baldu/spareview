
const passwords = ["Imega1126*", "xxvi2610"]; // Lista de contraseñas válidas

function checkPassword() {
  const input = document.getElementById("password-input").value;

  if (input === "Imega1126*") {
    window.location.href = "ConfigAB.html"; // Redirige a la primera página
  } else if (input === "xxvi2610") {
    window.location.href = "ConfigA.html"; // Redirige a la segunda página
  } else {
    alert("Contraseña incorrecta.");
  }
}

//Convertir Tabla_OrdenCompra.csv a OrdenCompra.js
async function OCCSVtoJS() {
  const fileInput = document.getElementById("csvFileOC");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo .CSV");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const text = e.target.result;
    const lines = text.trim().split('\n');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const [OrdenCompra, Posicion, codigoSAP, Almacen, Cantidad, Solicitante, ETA , FechaLlegada, Seguimiento ] = lines[i].split(';');
      result.push({
        OrdenCompra: parseInt(OrdenCompra),
        Posicion: parseFloat(Posicion.replace(',', '.')),
        codigoSAP: parseInt(codigoSAP),
        Almacen: parseInt(Almacen),
        Cantidad: parseFloat(Cantidad.replace(',', '.')),
        ETA,
        Solicitante,
        FechaLlegada,
        Seguimiento: Seguimiento.replace('\r', '')
});

    }

    const jsContent = `const datosComex = ${JSON.stringify(result, null, 2)};`;

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "OrdenCompra.js",
        types: [{
          description: "Archivo JavaScript",
          accept: { "application/javascript": [".js"] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(jsContent);
      await writable.close();
      alert("Archivo orden de compra guardado correctamente.");
      resetColor("csvFileOC");
    } catch (err) {
      console.error("Error al guardar el archivo:", err);
    }
  };

  reader.readAsText(file);
}

//Convertir Tabla_Ubicacion.csv a Ubicacion.js
async function UbicCSVtoJS() {
  const fileInput = document.getElementById("csvFileUbic");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo .CSV");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const text = e.target.result;
    const lines = text.trim().split('\n');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const [codigoSAP, ubicacion] = lines[i].split(';');
      result.push({
        codigoSAP: parseInt(codigoSAP),
        ubicacion: ubicacion.replace('\r', '')
      });
    }

    const jsContent = `const ubicacionData = ${JSON.stringify(result, null, 2)};`;

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "Ubicacion.js",
        types: [{
          description: "Archivo JavaScript",
          accept: { "application/javascript": [".js"] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(jsContent);
      await writable.close();
      alert("Archivo ubicación guardado correctamente.");
      resetColor("csvFileUbic");
    } catch (err) {
      console.error("Error al guardar el archivo:", err);
    }
  };

  reader.readAsText(file);
}

//Convertir Tabla_Precio.csv a Precio.js
async function PrecioCSVtoJS() {
  const fileInput = document.getElementById("csvFilePrecio");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo .CSV");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const text = e.target.result;
    const lines = text.trim().split('\n');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const [codigoSAP, precio24, precio28, precio29, precio30 ] = lines[i].split(';');
      result.push({
        codigoSAP: parseInt(codigoSAP),
        precio24,
        precio28,
        precio29,
        precio30: precio30.replace('\r', '')
      });
    }

    const jsContent = `const precioData = ${JSON.stringify(result, null, 2)};`;

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "Precio.js",
        types: [{
          description: "Archivo JavaScript",
          accept: { "application/javascript": [".js"] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(jsContent);
      await writable.close();
      alert("Archivo precio guardado correctamente.");
      resetColor("csvFilePrecio");
    } catch (err) {
      console.error("Error al guardar el archivo:", err);
    }
  };

  reader.readAsText(file);
}

//Convertir Tabla_Medida.csv a Medida.js
async function MedidaCSVtoJS() {
  const fileInput = document.getElementById("csvFileMedida");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo .CSV");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const text = e.target.result;
    const lines = text.trim().split('\n');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const [codigoSAP, largo, ancho, alto, m3, peso ] = lines[i].split(';');
      result.push({
        codigoSAP: parseInt(codigoSAP),
        largo,
        ancho,
        alto,
        m3,
        peso: peso.replace('\r', '')
      });
    }

    const jsContent = `const medidaData = ${JSON.stringify(result, null, 2)};`;

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "Medida.js",
        types: [{
          description: "Archivo JavaScript",
          accept: { "application/javascript": [".js"] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(jsContent);
      await writable.close();
      alert("Archivo medida guardado correctamente.");
      resetColor("csvFileMedida");
    } catch (err) {
      console.error("Error al guardar el archivo:", err);
    }
  };

  reader.readAsText(file);
}

//Convertir Tabla_modelos_por_marca.csv a modelos_por_marca.js
async function ModeloCSVtoJS() {
  const fileInput = document.getElementById("csvFileModelo");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo .CSV");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const text = e.target.result;
    const lines = text.trim().split('\n');
    const modelosPorMarca = {};

    for (let i = 1; i < lines.length; i++) {
      const [marcaRaw, modeloRaw] = lines[i].split(';');
      const marca = marcaRaw.trim();
      const modelo = modeloRaw ? modeloRaw.trim().replace(/\r$/, '') : "";

      if (!modelosPorMarca[marca]) {
        modelosPorMarca[marca] = [];
      }

      modelosPorMarca[marca].push(modelo);
    }

    const jsContent = `const modelosPorMarca = ${JSON.stringify(modelosPorMarca, null, 2)};`;

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "modelos_por_marca.js",
        types: [{
          description: "Archivo JavaScript",
          accept: { "application/javascript": [".js"] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(jsContent);
      await writable.close();
      alert("Archivo modelos guardado correctamente.");
      resetColor("csvFileModelo");
    } catch (err) {
      console.error("Error al guardar el archivo:", err);
    }
  };

  reader.readAsText(file);
}

//Convertir Tabla_datos_despiece.csv a datos_despiece.js
async function DespieceCSVtoJS() {
  const fileInput = document.getElementById("csvFileDespiece");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo .CSV");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    const text = e.target.result;
    const lines = text.trim().split('\n');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const [codigoFabrica, codigoSAP, cantidad, modelo ] = lines[i].split(';');
      result.push({
        codigoFabrica,
        codigoSAP: parseInt(codigoSAP),
        cantidad: parseFloat(cantidad),
        modelo: modelo.replace('\r', '')
      });
    }

    const jsContent = `const datosDespiece = ${JSON.stringify(result, null, 2)};`;

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "datos_despiece.js",
        types: [{
          description: "Archivo JavaScript",
          accept: { "application/javascript": [".js"] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(jsContent);
      await writable.close();
      alert("Archivo datos despiece guardado correctamente.");
      resetColor("csvFileDespiece");
    } catch (err) {
      console.error("Error al guardar el archivo:", err);
    }
  };

  reader.readAsText(file);
}

//Convertir Tabla_Reemplazos.csv a Reemplazos.js
async function ReemplazosCSVtoJS() {
  const fileInput = document.getElementById("csvFileReemplazos");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo CSV");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function (e) {
    const text = e.target.result;
    const lines = text.trim().split("\n");
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const [codigoSAP, reemplazo] = lines[i].split(";");

      result.push({
        codigoSAP: parseInt(codigoSAP),
        reemplazo: parseInt(reemplazo.replace("\r", ""))
      });
    }

    const jsContent =
      `const reemplazosData = ${JSON.stringify(result, null, 2)};`;

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "Reemplazos.js",
        types: [{
          description: "Archivo JavaScript",
          accept: {
            "application/javascript": [".js"]
          }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(jsContent);
      await writable.close();

      alert("Archivo Reemplazos.js generado.");
      resetColor("csvFileReemplazos");
    } catch (err) {
      console.error(err);
    }
  };

  reader.readAsText(file, "windows-1252");
}

// Cambiar a verde cuando se seleccione un archivo
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener("change", () => {
      const contenedor = input.closest(".convert");

      if (input.files.length > 0) {
        contenedor.classList.add("archivo-cargado");
      } else {
        contenedor.classList.remove("archivo-cargado");
      }
    });
  });
});

// Volver a blanco cuando termine la conversión
function resetColor(inputId) {
  const input = document.getElementById(inputId);

  if (input) {
    input.value = "";
    input.closest(".convert")
         .classList.remove("archivo-cargado");
  }
}