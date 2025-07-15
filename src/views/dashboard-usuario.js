import { getUsuarioActual, logout } from "../js/auth.js";

const API = "http://localhost:3000";

export function mostrarDashboardUsurio() {
  const app = document.getElementById("app");
  const usuario = getUsuarioActual();

  app.innerHTML = `
    <section id="usurio-panel">
      <h2>📚 Dashboard Usurios</h2>
      <div class="usurio-botones">
        <button id="btn-disponibles">📚 Ver eventos disponibles</button>
        <button id="btn-mis-eventos">📋 Ver mis eventos</button>
        <button id="btn-inicio">🏠 Volver al inicio</button>
        <button id="cerrar-sesion">❌ Cerrar sesión</button>
      </div>
      <div id="usurio-vista"></div>
    </section>
  `;

  document.getElementById("btn-disponibles").addEventListener("click", () => verEventosDisponibles(usuario));
  document.getElementById("btn-mis-eventos").addEventListener("click", () => verMisEventos(usuario));
  document.getElementById("btn-inicio").addEventListener("click", () => {
    window.location.hash = "#/";
  });
  document.getElementById("cerrar-sesion").addEventListener("click", () => {
    logout();
    window.location.hash = "#/";
  });
}

async function verEventosDisponibles(usuario) {
  const eventos = await (await fetch(`${API}/eventos`)).json();
  const inscripcionesUsuario = await (await fetch(`${API}/inscripciones?usuarioId=${usuario.id}`)).json();
  const eventosInscritos = inscripcionesUsuario.map(i => i.eventoId);

  const vista = document.getElementById("usurio-vista");
  vista.innerHTML = "<h3>Eventos disponibles</h3>";

  for (const evento of eventos) {
    const inscripcionesCupo = await (await fetch(`${API}/inscripciones?eventoId=${evento.id}`)).json();
    const cupoDisponible = inscripcionesCupo.length < evento.capacidad;
    const yaInscrito = eventosInscritos.includes(evento.id);

    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${evento.titulo}</strong> - ${evento.descripcion}<br>
      Categoría: ${evento.categoria} | organizador: ${evento.organizador} | Capacidad: ${evento.capacidad}<br>
    `;

    if (yaInscrito) {
      div.innerHTML += `<em>✅ Ya estás inscrito en este evento.</em>`;
    } else if (!cupoDisponible) {
      div.innerHTML += `<em>❌ El evento esta  lleno. No hay cupos disponibles.</em>`;
    } else {
      const boton = document.createElement("button");
      boton.textContent = "✅ Inscribirme";
      boton.classList.add("btn-inscribir");
      boton.dataset.eventoId = evento.id;
      boton.dataset.usuarioId = usuario.id;
      div.appendChild(boton);
    }

    div.innerHTML += "<hr>";
    vista.appendChild(div);
  }

  // Enlazar eventos a los botones una sola vez después del render
  setTimeout(() => {
    const botones = document.querySelectorAll(".btn-inscribir");
    botones.forEach(boton => {
      boton.addEventListener("click", async () => {
        const eventoId = Number(boton.dataset.eventoId);
        const usuarioId = Number(boton.dataset.usuarioId);

        const confirmar = confirm("¿Deseas inscribirte en este evento?");
        if (!confirmar) return;

        const nuevaInscripcion = { eventoId, usuarioId };

        try {
          const res = await fetch(`${API}/inscripciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaInscripcion)
          });

          if (!res.ok) throw new Error("Error al guardar inscripción");

          const data = await res.json();
          console.log("✅ Inscripción guardada:", data);
          alert("✅ Te has inscrito correctamente.");
          mostrarDashboardUsurio();
        } catch (err) {
          console.error("❌ Error en inscripción:", err);
          alert("❌ No se pudo guardar la inscripción.");
        }
      });
    });
  }, 100);
}

async function verMisEventos(usuario) {
  const inscripciones = await (await fetch(`${API}/inscripciones?usuarioId=${usuario.id}`)).json();
  const eventos = await (await fetch(`${API}/eventos`)).json();

  const vista = document.getElementById("usurio-vista");
  vista.innerHTML = "<h3>Mis eventos inscritos</h3>";

  if (inscripciones.length === 0) {
    vista.innerHTML += "<p>No estás inscrito en ningún evento.</p>";
    return;
  }

  inscripciones.forEach(ins => {
    const evento = eventos.find(c => Number(c.id) === Number(ins.eventoId));
    if (evento) {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${evento.titulo}</strong> - ${evento.descripcion}<br>
        Categoría: ${evento.categoria} | organizador: ${evento.organizador}
        <hr>
      `;
      vista.appendChild(div);
    }
  });
}