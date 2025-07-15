export function mostrarLanding() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="landing">
      <h2>Gestion de eventos </h2>
      <p>"Descubre, comparte y evoluciona con nuestra comunidad."</p>

      <div class="landing-imagenes">
        <img src="https://www.techsmith.es/wp-content/uploads/2022/10/blog_snagit_user-documentation_1500x1100-1.png" alt="organizador">
        <img src="https://document360.com/wp-content/uploads/2023/09/11-Best-Online-User-Manual-Tools-for-2023-2048x1165.png" alt="usurios">
        <img src="https://previews.123rf.com/images/mrcocoa/mrcocoa1605/mrcocoa160501792/55954260-host-events-glass-icon-suitable-for-info-graphics-websites-and-print-media-and-interfaces-line.jpg" alt="Eventos">
      </div>

      <div class="landing-botones">
        <a href="#/login" class="boton">Iniciar sesión</a>
        <a href="#/register" class="boton">Registrarse</a>
      </div>
    </section>
  `;
}
