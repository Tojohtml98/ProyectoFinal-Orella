// Clase para gestionar el presupuesto
class Presupuesto {
    constructor(ingresos) {
        this.ingresos = ingresos;
        this.gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    }

    agregarGasto(categoria, monto) {
        const nuevoGasto = { categoria, monto };
        this.gastos.push(nuevoGasto);
        localStorage.setItem("gastos", JSON.stringify(this.gastos));
    }

    calcularBalance() {
        const totalGastos = this.gastos.reduce((total, gasto) => total + gasto.monto, 0);
        return this.ingresos - totalGastos;
    }

    filtrarGastosPorCategoria(categoria) {
        return this.gastos.filter(gasto => gasto.categoria.toLowerCase() === categoria.toLowerCase());
    }
}

// Variables globales
let presupuesto;

// Función para inicializar el presupuesto
function inicializarPresupuesto(ingresos) {
    presupuesto = new Presupuesto(ingresos);
    localStorage.setItem("ingresos", ingresos);
}

// Función para manejar el formulario
document.getElementById("gastosForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const ingresos = parseFloat(document.getElementById("ingresos").value);
    const categoria = document.getElementById("categoria").value;
    const monto = parseFloat(document.getElementById("monto").value);

    if (!presupuesto) {
        inicializarPresupuesto(ingresos);
    }

    if (categoria && monto > 0) {
        presupuesto.agregarGasto(categoria, monto);
        mostrarMensaje("Gasto agregado correctamente.", "success");
        document.getElementById("gastosForm").reset();
    } else {
        mostrarMensaje("Por favor, completa todos los campos correctamente.", "error");
    }
});

// Función para calcular el balance mensual
function calcularBalance() {
    const ingresos = parseFloat(document.getElementById("ingresos").value);
    const gastosTotales = presupuesto.gastos.reduce((total, gasto) => total + gasto.monto, 0);
    return ingresos - gastosTotales;
}

// Función para filtrar gastos por categoría
document.getElementById('filtrar').addEventListener('click', async () => {
  const { value: categoria } = await Swal.fire({
    title: 'Filtrar gastos',
    input: 'text',
    inputLabel: 'Ingresa la categoría que deseas filtrar:',
    inputPlaceholder: 'Ejemplo: Comida',
    showCancelButton: true,
  })

  if (categoria) {
    const gastosFiltrados = presupuesto.filtrarGastosPorCategoria(categoria)
    const resultadoDiv = document.getElementById('resultado')
    resultadoDiv.innerHTML = `<h3>Gastos en la categoría "${categoria}":</h3>`
    gastosFiltrados.forEach(gasto => {
      resultadoDiv.innerHTML += `<p>Categoría: ${gasto.categoria}, Monto: $${gasto.monto}</p>`
    })
  }
})

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
  const resultadoDiv = document.getElementById('resultado')
  resultadoDiv.innerHTML = `<div class="alert ${tipo}">${mensaje}</div>`
}

async function cargarDatosIniciales() {
  try {
    const response = await fetch('data/gastos.json')
    const datos = await response.json()
    presupuesto.gastos = datos
  } catch (error) {
    console.error('Error al cargar los datos iniciales:', error)
  }
}
document.addEventListener('DOMContentLoaded', cargarDatosIniciales)

// Función para mostrar gastos
function mostrarGastos() {
  const listaGastos = document.createElement('ul')
  presupuesto.gastos.forEach(gasto => {
    const item = document.createElement('li')
    item.textContent = `Categoría: ${gasto.categoria}, Monto: $${gasto.monto}`
    listaGastos.appendChild(item)
  })
  document.getElementById('resultado').appendChild(listaGastos)
}

// Llama a esta función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const ingresosGuardados = localStorage.getItem('ingresos')
  if (ingresosGuardados) {
    inicializarPresupuesto(parseFloat(ingresosGuardados))
    cargarDatosIniciales()
  }
})
