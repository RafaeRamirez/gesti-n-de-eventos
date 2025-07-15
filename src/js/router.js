import { mostrarLogin } from "../views/login.js";
import { mostrarRegistro } from "../views/register.js";
import { mostrarLanding } from "../views/home.js"; 
import { mostrarDashboardAdmin } from "../views/dashboard-admin.js";
import { mostrarDashboardUsurio} from "../views/dashboard-usuario.js";


const routes = {
  "": mostrarLanding,
  "#/": mostrarLanding,
  "#/login": mostrarLogin,
  "#/register": mostrarRegistro,
  "#/dashboard-admin": mostrarDashboardAdmin,
  "#/dashboard-estudiante": mostrarDashboardUsurio
};



export function router() {
  const path = window.location.hash;
  const view = routes[path];
  const app = document.getElementById("app");

  if (view) {
    view();
  } else {
    app.innerHTML = "<h2>Página no encontrada</h2>";
  }
}
