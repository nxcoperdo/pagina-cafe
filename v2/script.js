/* =========================================================
   Tierra Huilense — comportamiento (JavaScript vanilla)
   1) Modo oscuro      2) Menú hamburguesa   3) Insignia Abierto/Cerrado
   4) Acordeón de FAQ  5) Formulario de contacto + aviso (toast)
   Los estilos los pone Tailwind; aquí solo se cambian atributos (aria-*, data-*, hidden).
   ========================================================= */

/* ---------- 1. Modo oscuro ---------- */
// El script del <head> ya puso (o no) la clase "dark" antes de pintar. Aquí solo sincronizamos el botón.
const raiz = document.documentElement;
const botonTema = document.getElementById("boton-tema");

function aplicarTema(oscuro) {
  raiz.classList.toggle("dark", oscuro);
  botonTema.setAttribute("aria-pressed", String(oscuro));
  botonTema.setAttribute("aria-label", oscuro ? "Activar modo claro" : "Activar modo oscuro");
}

aplicarTema(raiz.classList.contains("dark"));

botonTema.addEventListener("click", () => {
  const oscuro = !raiz.classList.contains("dark");
  aplicarTema(oscuro);
  try {
    localStorage.setItem("tema", oscuro ? "oscuro" : "claro"); // recuerda la elección
  } catch (e) {
    /* sin localStorage: el cambio vale solo para esta visita */
  }
});

/* ---------- 2. Menú hamburguesa ---------- */
const botonMenu = document.getElementById("boton-menu");
const panelNav = document.getElementById("panel-nav");
const desdeMd = window.matchMedia("(min-width: 48rem)"); // 48rem = 768 px = breakpoint md de Tailwind

function abrirMenu(abrir) {
  botonMenu.setAttribute("aria-expanded", String(abrir));
  panelNav.toggleAttribute("data-abierto", abrir); // Tailwind: data-[abierto]:block
}

botonMenu.addEventListener("click", () => {
  abrirMenu(botonMenu.getAttribute("aria-expanded") !== "true");
});

// Se cierra al elegir un enlace
panelNav.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => abrirMenu(false));
});

// Se cierra con Escape (y devuelve el foco al botón)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && botonMenu.getAttribute("aria-expanded") === "true") {
    abrirMenu(false);
    botonMenu.focus();
  }
});

// Se cierra al pasar a md o más (ahí la navegación ya se muestra en línea)
desdeMd.addEventListener("change", (e) => {
  if (e.matches) abrirMenu(false);
});

/* ---------- 3. Insignia "Abierto ahora / Cerrado" (hora de Bogotá) ---------- */

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

// Día y hora actuales EN BOGOTÁ, sin importar dónde esté el visitante.
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

const contenedorEstado = document.getElementById("estado-local");
const detalleEstado = document.getElementById("estado-detalle");
let estadoActual = "";

function actualizarEstado() {
  const { dia, minutos } = ahoraEnBogota();
  const [abre, cierra] = HORARIO[dia];
  const abierto = minutos >= abre && minutos < cierra;
  const estado = abierto ? "abierto" : "cerrado";

  // Solo se toca la insignia si cambió (así el lector de pantalla no la repite cada minuto)
  if (estado !== estadoActual) {
    estadoActual = estado;
    contenedorEstado.querySelectorAll("[data-vista]").forEach((vista) => {
      vista.hidden = vista.dataset.vista !== estado;
    });
  }

  if (abierto) {
    detalleEstado.textContent = `Hoy cerramos a las ${formatearHora(cierra)}.`;
  } else if (minutos < abre) {
    detalleEstado.textContent = `Hoy abrimos a las ${formatearHora(abre)}.`;
  } else {
    const [abreManana] = HORARIO[(dia + 1) % 7];
    detalleEstado.textContent = `Mañana abrimos a las ${formatearHora(abreManana)}.`;
  }
}

actualizarEstado();
setInterval(actualizarEstado, 60 * 1000); // se refresca cada minuto

/* ---------- 4. Acordeón de preguntas frecuentes ---------- */

// Cada botón controla el panel que indica su aria-controls.
// Un <button> ya responde a Enter y Espacio de forma nativa (dispara "click").
document.querySelectorAll(".faq-boton").forEach((boton) => {
  const panel = document.getElementById(boton.getAttribute("aria-controls"));

  boton.addEventListener("click", () => {
    const abrir = boton.getAttribute("aria-expanded") !== "true";
    boton.setAttribute("aria-expanded", String(abrir)); // avisa a los lectores de pantalla
    panel.toggleAttribute("data-abierto", abrir);       // Tailwind anima la apertura
    // No se cierran los demás: se pueden abrir varios a la vez.
  });
});

/* ---------- 5. Formulario de contacto ---------- */
const formulario = document.getElementById("form-contacto");
const campos = [...formulario.querySelectorAll("input, textarea")];
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // algo@dominio.ext

// Devuelve el mensaje de error del campo, o "" si está bien.
function mensajeDeError(campo) {
  const valor = campo.value.trim();
  if (valor === "") return "Este campo es obligatorio.";
  if (campo.type === "email" && !EMAIL_VALIDO.test(valor)) {
    return "Escribe un correo válido, por ejemplo nombre@correo.com.";
  }
if (campo.id === "mensaje" && valor.length < 10) {           
    return "Cuéntanos un poco más, mínimo 10 caracteres.";    
  }                                                            
  return "";
}

// Muestra u oculta el error debajo del campo y marca aria-invalid.
function mostrarError(campo, texto) {
  const contenedor = document.getElementById(campo.id + "-error"); // el mismo de aria-describedby
  const parrafo = contenedor.querySelector("p");
  contenedor.querySelector("[data-error-texto]").textContent = texto;
  parrafo.hidden = texto === "";
  if (texto) {
    campo.setAttribute("aria-invalid", "true");
  } else {
    campo.removeAttribute("aria-invalid");
  }
}

campos.forEach((campo) => {
  // Al salir del campo
  campo.addEventListener("blur", () => mostrarError(campo, mensajeDeError(campo)));
  // Mientras se corrige un campo con error, se revisa en vivo
  campo.addEventListener("input", () => {
    if (campo.getAttribute("aria-invalid") === "true") mostrarError(campo, mensajeDeError(campo));
  });
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault(); // no se envía nada a ningún servidor

  let primerConError = null;
  campos.forEach((campo) => {
    const texto = mensajeDeError(campo);
    mostrarError(campo, texto);
    if (texto && !primerConError) primerConError = campo;
  });

  // Con errores: el foco va al primer campo con error
  if (primerConError) {
    primerConError.focus();
    return;
  }

  formulario.reset();
  mostrarAviso();
});

/* ---------- Aviso de confirmación (toast) ---------- */
const aviso = document.getElementById("aviso");
const botonCerrarAviso = document.getElementById("aviso-cerrar");
let temporizadorAviso;

function mostrarAviso() {
  aviso.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(cerrarAviso, 4000); // se cierra solo a los 4 segundos
}

function cerrarAviso() {
  clearTimeout(temporizadorAviso);
  aviso.hidden = true;
}

botonCerrarAviso.addEventListener("click", () => {
  cerrarAviso();
  formulario.querySelector("button[type='submit']").focus(); // el foco no se pierde al desaparecer el aviso
});
