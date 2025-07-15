import { router } from "./router.js";

// Escucha cambios en el hash y carga la vista correcta
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
