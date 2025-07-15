export function show404() {
  document.getElementById('app').innerHTML = `
    <section style="text-align:center; padding:3rem;">
      <h1>404 - Página no encontrada 🐾</h1>
      <p>La ruta que intentaste acceder no existe.</p>
      <a href="/" style="display:inline-block; margin-top:1rem; font-weight:bold; color:#6c63ff;">Volver al inicio</a>
    </section>
  `;
}
