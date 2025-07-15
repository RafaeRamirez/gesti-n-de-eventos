import { login } from "../js/auth.js";




export function mostrarLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <section id="login">
      <h2>Iniciar sesión</h2>
      <form id="login-form">
        <input type="email" id="email" placeholder="Correo electrónico" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
      <p><a href="#/register">¿No tienes cuenta? Regístrate</a></p>
        <p><a href="/">home</a></p>
    </section>
  `;

  // Evento submit del formulario
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const usuario = await login(email, password);

      //  Redirigir según el rol
      if (usuario.rol === "1") {
        window.location.hash = "#/dashboard-admin";
      } else if (usuario.rol === "2") {
        window.location.hash = "#/dashboard-estudiante";
      } else {
        alert("Rol no reconocido.");
      }
    } catch (err) {
      alert("Credenciales incorrectas.");
    }
  });
}


export function mostrarLanding() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="landing">
      <h2>COURSE STUDEN</h2>
    <p>"Descubre, comparte y evoluciona con nuestra comunidad."</p>

   <div class="landing-imagenes">
        <img src="https://www.techsmith.es/wp-content/uploads/2022/10/blog_snagit_user-documentation_1500x1100-1.png" alt="organizador">
        <img src="https://document360.com/wp-content/uploads/2023/09/11-Best-Online-User-Manual-Tools-for-2023-2048x1165.png" alt="usurios">
        <img src="https://previews.123rf.com/images/mrcocoa/mrcocoa1605/mrcocoa160501792/55954260-host-events-glass-icon-suitable-for-info-graphics-websites-and-print-media-and-interfaces-line.jpg" alt="Eventos">
      </div>



      <div class="landing-botones">
        <a href="#/login" class="boton">Iniciar sesión</a>
        <a href="#/register" class="boton">Registrarse</a>
          <p><a href="/">home</a></p>
      </div>
    </section>
  `;
}
