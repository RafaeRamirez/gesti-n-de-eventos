const API = "http://localhost:3000/usuarios";

/**
 * Inicia sesión validando email y password.
 * Guarda al usuario en localStorage si es correcto.
 */
export async function login(email, password) {
  const res = await fetch(`${API}?email=${email}&password=${password}`);
  const data = await res.json();

  if (data.length > 0) {
    localStorage.setItem("usuario", JSON.stringify(data[0]));
    return data[0];
  } else {
    throw new Error("Credenciales incorrectas");
  }
}

/**
 * Cierra sesión eliminando al usuario del localStorage.
 */
export function logout() {
  localStorage.removeItem("usuario");
}

/**
 * Devuelve el usuario actual guardado en localStorage.
 */
export function getUsuarioActual() {
  return JSON.parse(localStorage.getItem("usuario"));
}
