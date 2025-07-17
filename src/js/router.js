import { mostrarLogin } from "../views/login.js";
import { mostrarRegistro } from "../views/register.js";
import { mostrarLanding } from "../views/home.js";
import { mostrarDashboardAdmin } from "../views/dashboard-admin.js";
import { mostrarDashboardUsuario } from "../views/dashboard-usuario.js";
import { getUsuarioActual } from "../js/auth.js";

const routes = {
  "": mostrarLanding,
  "#/": mostrarLanding,
  "#/login": mostrarLogin,
  "#/register": mostrarRegistro,
  "#/dashboard-admin": mostrarDashboardAdmin,
  "#/dashboard-estudiante": mostrarDashboardUsuario
};

export function router() {
  const path = window.location.hash;
  const usuario = getUsuarioActual();
  const app = document.getElementById("app");

  // 🔐 Rutas que requieren sesión activa
  const rutasProtegidas = ["#/dashboard-admin", "#/dashboard-estudiante"];

  // ⚠️ Si no hay usuario y entra a ruta protegida, redirigir a login
  if (rutasProtegidas.includes(path) && !usuario) {
    alert("⚠️ Debes iniciar sesión para acceder.");
    window.location.hash = "#/login";
    return;
  }

  // 🔒 Validación por rol
  if (path === "#/dashboard-admin" && usuario?.rol !== "1") {
    alert("⛔ No tienes permiso para acceder al panel de administrador.");
    window.location.hash = "#/";
    return;
  }

  if (path === "#/dashboard-estudiante" && usuario?.rol !== "2") {
    alert("⛔ No tienes permiso para acceder al panel de estudiante.");
    window.location.hash = "#/";
    return;
  }

  // ✅ Si ya está logueado y entra a login o registro, redirigir al dashboard
  if ((path === "#/login" || path === "#/register") && usuario) {
    const destino = usuario.rol === "1" ? "#/dashboard-admin" : "#/dashboard-estudiante";
    window.location.hash = destino;
    return;
  }

  // 🚀 Mostrar la vista correspondiente
  const view = routes[path];
  if (view) {
    view();
  } else {
    app.innerHTML = "<h2>404 - Página no encontrada 🚫</h2>";
  }
}
