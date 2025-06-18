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

// Función para calcular el balance
document.getElementById("calcularBalance").addEventListener("click", () => {
    if (!presupuesto) {
        mostrarMensaje("Por favor, ingresa tus ingresos primero.", "error");
        return;
    }
    const balance = presupuesto.calcularBalance();
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `<p>Tu balance actual es: <strong>$${balance.toFixed(2)}</strong></p>`;
});

// Función para filtrar gastos por categoría
document.getElementById("filtrar").addEventListener("click", () => {
    const categoria = prompt("Ingresa la categoría que deseas filtrar:");
    if (!categoria) return;

    const gastosFiltrados = presupuesto.filtrarGastosPorCategoria(categoria);
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `<h3>Gastos en la categoría "${categoria}":</h3>`;
    if (gastosFiltrados.length > 0) {
        gastosFiltrados.forEach(gasto => {
            resultadoDiv.innerHTML += `<p>Categoría: ${gasto.categoria}, Monto: $${gasto.monto.toFixed(2)}</p>`;
        });
    } else {
        resultadoDiv.innerHTML += `<p>No se encontraron gastos en esta categoría.</p>`;
    }
});

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `<div class="alert ${tipo}">${mensaje}</div>`;
}
