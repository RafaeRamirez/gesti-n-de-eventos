export function mostrarRegistro() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section id="register">
      <h2>Registro</h2>
      <form id="register-form">
        <input type="text" id="nombre" placeholder="Nombre completo" required />
        <input type="email" id="email" placeholder="Correo electrónico" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Registrarse</button>
      </form>
      <p><a href="#/login">¿Ya tienes cuenta? Inicia sesión</a></p>
       <p><a href="/">home</a></p>
    </section>
  `;

  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoUsuario = {
      nombre: document.getElementById("nombre").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
      rol: "2" // 🔐 Rol forzado a estudiante
    };

    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario)
      });

      if (res.ok) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        window.location.hash = "#/login";
      } else {
        alert("Error al registrar.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red.");
    }
  });
}