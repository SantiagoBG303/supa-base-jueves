// src/login.js
import { supabase } from './supabase.js';
import { cargarMenu } from './main.js';
import { mostrarMVP } from './mvp.js';

export function mostrarLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section>
      <h2>Iniciar Sesión</h2>
      <form id="login-form">
        <input type="email" name="correo" placeholder="Correo" required />
        <input type="password" name="password" placeholder="Contraseña" required />
        <button type="submit">Ingresar</button>
      </form>
      <p id="mensaje" style="text-align:center;color:red;"></p>
    </section>
  `;

  const form = document.getElementById('login-form');
  const mensaje = document.getElementById('mensaje');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    mensaje.textContent = 'Verificando...';

    const correo = form.correo.value.trim();
    const password = form.password.value.trim();

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });

    if (error) {
      mensaje.textContent = '❌ Credenciales inválidas.';
      return;
    }

    mensaje.style.color = 'green';
    mensaje.textContent = '✅ Sesión iniciada correctamente.';

    await cargarMenu();
    mostrarMVP();
  });
}
