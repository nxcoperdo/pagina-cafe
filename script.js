/* =========================================================
   Tierra Huilense — comportamiento
   1) Insignia "Abierto ahora / Cerrado" (hora de Bogotá)
   2) Acordeón de preguntas frecuentes
   ========================================================= */

/* ---------- 1. Insignia de horario ---------- */

// Horario ficticio. Clave = día de la semana (0 = domingo ... 6 = sábado).
// Valores = [apertura, cierre] en minutos desde la medianoche (7 * 60 = 7:00 a. m.).
// Debe coincidir con la tabla de horarios del HTML.
const HORARIO = {
  0: [8 * 60, 16 * 60],  // domingo
  1: [7 * 60, 19 * 60],  // lunes
  2: [7 * 60, 19 * 60],
  3: [7 * 60, 19 * 60],
  4: [7 * 60, 19 * 60],
  5: [7 * 60, 19 * 60],  // viernes
  6: [8 * 60, 20 * 60],  // sábado
};

const DIAS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// Obtiene día y hora actuales EN BOGOTÁ, sin importar dónde esté el visitante.
function ahoraEnBogota() {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const valor = (tipo) => partes.find((p) => p.type === tipo).value;
  return {
    dia: DIAS[valor("weekday")],
    minutos: Number(valor("hour")) * 60 + Number(valor("minute")),
  };
}

// 450 -> "7:30 a. m."
function formatearHora(minutos) {
  const h24 = Math.floor(minutos / 60);
  const min = String(minutos % 60).padStart(2, "0");
  const sufijo = h24 < 12 ? "a. m." : "p. m.";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${min} ${sufijo}`;
}

function actualizarEstado() {
  const insignia = document.getElementById("estado-local");
  const detalle = document.getElementById("estado-detalle");
  if (!insignia || !detalle) return;

  const { dia, minutos } = ahoraEnBogota();
  const [abre, cierra] = HORARIO[dia];
  const abierto = minutos >= abre && minutos < cierra;

  insignia.textContent = abierto ? "Abierto ahora" : "Cerrado";
  insignia.className = "insignia " + (abierto ? "insignia--abierto" : "insignia--cerrado");

  if (abierto) {
    detalle.textContent = `Hoy cerramos a las ${formatearHora(cierra)}.`;
  } else if (minutos < abre) {
    detalle.textContent = `Hoy abrimos a las ${formatearHora(abre)}.`;
  } else {
    const [abreManana] = HORARIO[(dia + 1) % 7];
    detalle.textContent = `Mañana abrimos a las ${formatearHora(abreManana)}.`;
  }
}

actualizarEstado();
setInterval(actualizarEstado, 60 * 1000); // se refresca cada minuto

/* ---------- 2. Acordeón ---------- */

// Cada botón controla el panel que indica su aria-controls.
// Un <button> ya responde a Enter y Espacio de forma nativa (dispara "click").
document.querySelectorAll(".faq__boton").forEach((boton) => {
  const panel = document.getElementById(boton.getAttribute("aria-controls"));

  boton.addEventListener("click", () => {
    const abrir = boton.getAttribute("aria-expanded") !== "true";
    boton.setAttribute("aria-expanded", String(abrir)); // avisa a los lectores de pantalla
    panel.classList.toggle("esta-abierto", abrir);      // el CSS anima la apertura
    // No se cierran los demás: se pueden abrir varios a la vez.
  });
});
