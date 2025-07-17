import { router } from "./router.js";

// Escucha cambios en el hash (cuando el usuario navega)
window.addEventListener("hashchange", () => {
  try {
    router();
  } catch (error) {
    console.error("❌ Error en el enrutador:", error);
    document.getElementById("app").innerHTML = `
      <section style="text-align:center; padding:3rem;">
        <h1>⚠️ Error al cargar la ruta</h1>
        <p>Ocurrió un problema. Intenta recargar la página.</p>
        <a href="#/" style="display:inline-block; margin-top:1rem; font-weight:bold; color:#6c63ff;">Volver al inicio</a>
      </section>
    `;
  }
});

// Llama al router cuando la página se carga inicialmente
window.addEventListener("DOMContentLoaded", () => {
  try {
    router();
  } catch (error) {
    console.error("❌ Error al cargar la página:", error);
    document.getElementById("app").innerHTML = `
      <section style="text-align:center; padding:3rem;">
        <h1>⚠️ Error al cargar la vista</h1>
        <p>Revisa la consola o contacta con soporte.</p>
        <a href="#/" style="display:inline-block; margin-top:1rem; font-weight:bold; color:#6c63ff;">Volver al inicio</a>
      </section>
    `;
  }
});
