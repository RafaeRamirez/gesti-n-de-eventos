import { getUsuarioActual, logout } from "../js/auth.js";

const API = "http://localhost:3000";

export function mostrarDashboardAdmin() {
  const app = document.getElementById("app");
  const usuario = getUsuarioActual();

  app.innerHTML = `
    <section id="admin-panel" class="dashboard-fondo">
      <h2>Dashboard Administrador</h2>
      <div class="admin-botones">
        <button id="btn-crear">📘 Crear eventos</button>
        <button id="btn-ver-eventos">📋 Ver eventos disponibles</button>
        <button id="btn-ver-inscripciones">👥 Ver inscritos</button>
        <button id="btn-inicio">🏠 Volver al inicio</button>
        <button id="cerrar-sesion">❌ Cerrar sesión</button>
      </div>
      <div id="admin-vista"></div>
    </section>
  `;

  document.getElementById("btn-crear").addEventListener("click", () => mostrarFormularioEventos());
  document.getElementById("btn-ver-eventos").addEventListener("click", mostrarEventos);
  document.getElementById("btn-ver-inscripciones").addEventListener("click", mostrarInscripciones);
  document.getElementById("btn-inicio").addEventListener("click", () => {
    window.location.hash = "#/";
  });
  document.getElementById("cerrar-sesion").addEventListener("click", () => {
    logout();
    window.location.hash = "#/";
  });
}

function mostrarFormularioEventos(evento = null) {
  const vista = document.getElementById("admin-vista");
  const usuario = getUsuarioActual();

  vista.innerHTML = `
    <h3>${evento ? 'Editar evento' : 'Crear nuevo evento'}</h3>
    <form id="form-eventos">
      <input type="text" id="titulo" placeholder="Título" value="${evento ? evento.titulo : ''}" required />
      <input type="text" id="descripcion" placeholder="Descripción" value="${evento ? evento.descripcion : ''}" required />
      <input type="text" id="categoria" placeholder="Categoría" value="${evento ? evento.categoria : ''}" required />
      <input type="number" id="capacidad" placeholder="Capacidad máxima" value="${evento ? evento.capacidad : ''}" required min="1" />
      <input type="text" id="organizador" value="${evento ? evento.organizador : usuario.nombre}" readonly />
      <button type="submit">${evento ? 'Actualizar' : 'Crear'}</button>
    </form>
  `;

  const form = document.getElementById("form-eventos");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datosEventos = {
      titulo: form.titulo.value.trim(),
      descripcion: form.descripcion.value.trim(),
      categoria: form.categoria.value.trim(),
      capacidad: parseInt(form.capacidad.value),
      organizador: form.organizador.value.trim()
    };

    // Validación adicional
    if (
      !datosEventos.titulo ||
      !datosEventos.descripcion ||
      !datosEventos.categoria ||
      !datosEventos.organizador ||
      isNaN(datosEventos.capacidad) ||
      datosEventos.capacidad <= 0
    ) {
      alert("❌ Todos los campos deben estar completos y válidos.");
      return;
    }

    try {
      let res;
      if (evento) {
        res = await fetch(`${API}/eventos/${evento.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosEventos)
        });
      } else {
        res = await fetch(`${API}/eventos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosEventos)
        });
      }

      if (!res.ok) throw new Error("Error al guardar el evento");

      alert(`✅ Evento ${evento ? 'actualizado' : 'creado'} exitosamente.`);
      mostrarEventos();
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar el evento.");
    }
  });
}

async function mostrarEventos() {
  const vista = document.getElementById("admin-vista");
  vista.innerHTML = "<h3>Listado de Eventos</h3>";

  try {
    const eventos = await (await fetch(`${API}/eventos`)).json();

    for (const evento of eventos) {
      const inscripciones = await (await fetch(`${API}/inscripciones?eventoId=${evento.id}`)).json();
      const inscritos = inscripciones.length;
      const cuposDisponibles = evento.capacidad - inscritos;

      const div = document.createElement("div");
      div.classList.add("evento-item");
      div.innerHTML = `
        <strong>${evento.titulo}</strong> - ${evento.descripcion}<br>
        Categoría: ${evento.categoria} | Organizador: ${evento.organizador}<br>
        Capacidad: ${evento.capacidad} | Inscritos: ${inscritos} | Cupos disponibles: ${cuposDisponibles}<br>
        <button class="editar" data-id="${evento.id}">✏️ Editar</button>
        <button class="eliminar" data-id="${evento.id}">🗑️ Eliminar</button>
        <hr>
      `;
      vista.appendChild(div);
    }

    document.querySelectorAll(".editar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const evento = await (await fetch(`${API}/eventos/${id}`)).json();
        mostrarFormularioEventos(evento);
      });
    });

    document.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const confirmar = confirm("¿Seguro que deseas eliminar este evento?");
        if (!confirmar) return;

        const res = await fetch(`${API}/eventos/${id}`, { method: "DELETE" });
        if (res.ok) {
          alert("✅ Evento eliminado");
          mostrarEventos();
        } else {
          alert("❌ No se pudo eliminar");
        }
      });
    });

  } catch (error) {
    console.error(error);
    vista.innerHTML += "<p>Error cargando los eventos.</p>";
  }
}

async function mostrarInscripciones() {
  const vista = document.getElementById("admin-vista");
  vista.innerHTML = "<h3>Inscripciones por evento</h3>";

  try {
    const eventos = await (await fetch(`${API}/eventos`)).json();
    const usuarios = await (await fetch(`${API}/usuarios`)).json();
    const inscripciones = await (await fetch(`${API}/inscripciones`)).json();

    for (const evento of eventos) {
      const inscritos = inscripciones.filter(i => String(i.eventoId) === String(evento.id));
      const div = document.createElement("div");
      div.classList.add("inscripcion-item");
      div.innerHTML = `<strong>${evento.titulo}</strong><br>`;

      if (inscritos.length === 0) {
        div.innerHTML += "<em>No hay inscritos para este evento.</em>";
      } else {
        div.innerHTML += "<ul>";
        for (const ins of inscritos) {
          const cliente = usuarios.find(u => String(u.id) === String(ins.usuarioId));
          if (cliente) {
            div.innerHTML += `<li>${cliente.nombre} <button class='eliminar-insc' data-id='${ins.id}'>❌</button></li>`;
          }
        }
        div.innerHTML += "</ul>";
      }

      div.innerHTML += "<hr>";
      vista.appendChild(div);
    }

    document.querySelectorAll(".eliminar-insc").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const confirmar = confirm("¿Eliminar esta inscripción?");
        if (!confirmar) return;

        const res = await fetch(`${API}/inscripciones/${id}`, { method: "DELETE" });
        if (res.ok) {
          alert("✅ Inscripción eliminada");
          mostrarInscripciones();
        } else {
          alert("❌ No se pudo eliminar");
        }
      });
    });

  } catch (error) {
    console.error(error);
    vista.innerHTML += "<p>Error cargando las inscripciones.</p>";
  }
}
