// src/admin.js
import { supabase } from './supabase.js';

export async function mostrarAdmin() {
  const app = document.getElementById('app');

  // Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser();

  // Validar que sea el admin
  if (!user || user.email !== 'admin@mail.com') {
    app.innerHTML = `<p>⛔ No tienes permisos para acceder a este panel.</p>`;
    return;
  }

  app.innerHTML = `
    <h2>Panel Administrativo - Profesor</h2>
    <div id="mensaje"></div>

    <h3>Lista de Estudiantes</h3>
    <div id="lista-estudiantes">Cargando estudiantes...</div>

    <h3>Actividades Registradas</h3>
    <div id="lista-actividades">Cargando actividades...</div>

    <h3>Primera Actividad (más reciente)</h3>
    <div id="primera-actividad">Cargando...</div>

    <button id="guardar-notas">Guardar notas</button>
  `;

  const mensaje = document.getElementById('mensaje');
  const listaEstudiantes = document.getElementById('lista-estudiantes');
  const listaActividades = document.getElementById('lista-actividades');
  const primeraActividadDiv = document.getElementById('primera-actividad');

  // Cargar estudiantes
  const { data: estudiantes, error: errEstudiantes } = await supabase
    .from('estudiantes')
    .select('*')
    .order('nombre');

  if (errEstudiantes) {
    listaEstudiantes.innerHTML = `Error cargando estudiantes: ${errEstudiantes.message}`;
  } else if (!estudiantes.length) {
    listaEstudiantes.innerHTML = '<p>No hay estudiantes registrados.</p>';
  } else {
    listaEstudiantes.innerHTML = '';
    estudiantes.forEach(est => {
      listaEstudiantes.innerHTML += `
        <div>
          <b>${escapeHtml(est.nombre)}</b> - ${escapeHtml(est.correo)} - ${escapeHtml(est.telefono || '')}
          <button class="eliminar-estudiante" data-id="${est.id}">Eliminar</button>
        </div>
      `;
    });
  }

  // Cargar actividades
  const { data: actividades, error: errActividades } = await supabase
    .from('actividades')
    .select('*')
    .order('id', { ascending: false });

  if (errActividades) {
    listaActividades.innerHTML = `Error cargando actividades: ${errActividades.message}`;
    primeraActividadDiv.innerHTML = '';
  } else if (!actividades.length) {
    listaActividades.innerHTML = '<p>No hay actividades registradas.</p>';
    primeraActividadDiv.innerHTML = '';
  } else {
    listaActividades.innerHTML = '';
    actividades.forEach(act => {
      listaActividades.innerHTML += `
        <div>
          <b>${escapeHtml(act.titulo)}</b> - Tipo: ${escapeHtml(act.tipo)}<br />
          Nota: <input type="text" class="nota-input" data-id="${act.id}" value="${act.nota || ''}" />
        </div>
      `;
    });

    // Mostrar la primera actividad (más reciente)
    const primera = actividades[0];
    primeraActividadDiv.innerHTML = `
      <h4>${escapeHtml(primera.titulo)}</h4>
      <p><b>Descripción:</b> ${escapeHtml(primera.descripcion || '')}</p>
      <p><b>Tipo:</b> ${escapeHtml(primera.tipo)}</p>
      ${primera.imagen ? `<img src="${escapeHtml(primera.imagen)}" alt="${escapeHtml(primera.titulo)}" width="200" />` : ''}
    `;
  }

  // Evento para eliminar estudiantes
  document.querySelectorAll('.eliminar-estudiante').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const { error } = await supabase.from('estudiantes').delete().eq('id', id);
      if (error) {
        mensaje.textContent = '❌ Error eliminando estudiante: ' + error.message;
        mensaje.style.color = 'red';
      } else {
        mensaje.textContent = '✅ Estudiante eliminado correctamente.';
        mensaje.style.color = 'green';
        setTimeout(() => mostrarAdmin(), 700);
      }
    });
  });

  // Evento para guardar notas
  const guardarBtn = document.getElementById('guardar-notas');
  if (guardarBtn) {
    guardarBtn.addEventListener('click', async () => {
      const inputs = document.querySelectorAll('.nota-input');
      let errores = 0;
      for (const input of inputs) {
        const id = input.getAttribute('data-id');
        const valor = input.value.trim();
        if (valor === '') continue;
        const nota = parseFloat(valor);
        if (isNaN(nota)) {
          errores++;
          continue;
        }
        const { error } = await supabase.from('actividades').update({ nota }).eq('id', id);
        if (error) errores++;
      }
      if (errores > 0) {
        mensaje.textContent = '⚠️ Algunas notas no se actualizaron correctamente.';
        mensaje.style.color = 'orange';
      } else {
        mensaje.textContent = '✅ Notas actualizadas correctamente.';
        mensaje.style.color = 'green';
      }
      setTimeout(() => mostrarAdmin(), 800);
    });
  }
}

// Helper para evitar inyección de HTML
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
