// main.js

// 1️⃣ Importa la función desde registro.js
import { mostrarRegistro } from './registro.js';

// Si tienes otras funciones de vistas, impórtalas también:
// import { mostrarInicioSesion } from './login.js';

// 2️⃣ Llama a la función para que se muestre el formulario al cargar la app
mostrarRegistro(); 

// Nota: Dependiendo de tu lógica de enrutamiento, puede que necesites 
// llamar a esta función dentro de un listener o función de inicio.