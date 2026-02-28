🏋️‍♂️ PUMP_PLANNER – Descubre y planifica tus ejercicios

Aplicación web desarrollada con React + Vite que permite explorar ejercicios, consultar sus detalles y crear un plan de entrenamiento personalizado que se guarda automáticamente en el navegador.

🎯 Objetivo

PumpPlanner - permite al usuario:

Explorar ejercicios por grupo muscular.

Ver detalles técnicos de cada ejercicio.

Añadir ejercicios a un plan personalizado.

Guardar el plan incluso al recargar la página.

🧠 Funcionamiento General

La aplicación sigue una estructura clara basada en:

Estado centralizado en App.jsx

Flujo de datos unidireccional

Componentes reutilizables

Persistencia mediante localStorage

El estado principal (el plan de ejercicios) vive en App.jsx y se pasa por props a las distintas páginas.
Las páginas pueden añadir o eliminar ejercicios, pero la gestión real del estado siempre ocurre en el componente raíz.

📂 Estructura Principal

App.jsx → Componente raíz. Gestiona el estado global del plan.

Home.jsx → Página principal con ejercicios destacados.

Explorer.jsx → Explorador de ejercicios por músculo.

MyPlan.jsx → Página que muestra el plan guardado.

Navbar.jsx → Navegación con contador dinámico del plan.

ExerciseCard.jsx → Tarjeta reutilizable para mostrar ejercicios.

ExerciseModal.jsx → Modal con detalles completos.

useLocalStorage.js → Hook personalizado para persistir el plan.




