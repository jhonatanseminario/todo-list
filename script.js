document.addEventListener('DOMContentLoaded', function () {

    const inputTarea = document.querySelector('input');
    const botonAgregar = document.querySelector('button');
    const listaTareas = document.querySelector('ol');
    const botonLimpiar = document.getElementById('botonLimpiar');
    const botonCompletar = document.getElementById('botonCompletar');
    const botonEliminar = document.getElementById('botonEliminar');

    botonAgregar.addEventListener('click', function () {
        const nuevaTarea = inputTarea.value;

        if (nuevaTarea !== '') {
            const nuevaTareaElemento = document.createElement('li');

            nuevaTareaElemento.classList.add('creacion');

            const botonMarcar = document.createElement('button');
            const botonEditar = document.createElement('button');
            const botonEliminar = document.createElement('button');

            const iconoMarcar = document.createElement('span');
            const iconoEditar = document.createElement('span');
            const iconoEliminar = document.createElement('span');

            iconoMarcar.title = 'Marcar tarea como completada';
            iconoEditar.title = 'Editar tarea';
            iconoEliminar.title = 'Eliminar tarea';
    
            iconoMarcar.classList.add('material-symbols-outlined');
            iconoEditar.classList.add('material-symbols-outlined');
            iconoEliminar.classList.add('material-symbols-outlined');

            iconoMarcar.textContent = 'done';
            iconoEditar.textContent = 'edit';
            iconoEliminar.textContent = 'minimize';

            nuevaTareaElemento.textContent = nuevaTarea;
            nuevaTareaElemento.title = nuevaTarea

            botonMarcar.textContent = '';
            botonEditar.textContent = '';
            botonEliminar.textContent = '';

            botonMarcar.appendChild(iconoMarcar);
            botonEditar.appendChild(iconoEditar);
            botonEliminar.appendChild(iconoEliminar);

            botonMarcar.classList.add('marcar');
            botonEditar.classList.add('editar');
            botonEliminar.classList.add('eliminar');

            listaTareas.appendChild(nuevaTareaElemento);
            nuevaTareaElemento.appendChild(botonMarcar);
            nuevaTareaElemento.appendChild(botonEditar);
            nuevaTareaElemento.appendChild(botonEliminar);

            inputTarea.classList.add('input-fade');

            setTimeout(function () {
                inputTarea.value = '';
            }, 300);

            setTimeout(function () {
                inputTarea.classList.remove('input-fade');
            }, 300);

            botonMarcar.addEventListener('click', function () {
                const esCompletado = nuevaTareaElemento.classList.contains('completado');

                iconoMarcar.title = esCompletado ? 'Marcar tarea como completada' : 'Desmarcar tarea';
                botonMarcar.title = esCompletado ? 'Marcar tarea como completada' : 'Desmarcar tarea';
                nuevaTareaElemento.classList.toggle('tachado');
                nuevaTareaElemento.classList.toggle('completado');
                botonEditar.disabled = !esCompletado;
                
                actualizarEstadoBotonCompletar();
                actualizarEstadoBotonEliminar()
                actualizarContadorTareas();
            });

            botonEditar.addEventListener('click', function () {
                nuevaTareaElemento.contentEditable = true;
                botonEditar.disabled = true;
                nuevaTareaElemento.focus();

                const range = document.createRange();
                range.selectNodeContents(nuevaTareaElemento);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                nuevaTareaElemento.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        nuevaTareaElemento.contentEditable = false;
                    } else if (event.key === 'Backspace') {
                        const nuevoTitle = nuevaTareaElemento.textContent.replace('doneeditminimize', '');

                        if (nuevoTitle.length === 1) {
                            nuevaTareaElemento.firstChild.nodeValue = '‎';
                            nuevaTareaElemento.classList.add('sin-contenido');
                        } 
                    }

                    const nuevoTitle = nuevaTareaElemento.textContent.replace('doneeditminimize', '');
                    nuevaTareaElemento.title = nuevoTitle;
                });

                nuevaTareaElemento.addEventListener('input', function () {
                    const nuevoTitle = nuevaTareaElemento.textContent.replace('doneeditminimize', '');
                    
                    if (nuevoTitle.length === 2) {
                        nuevaTareaElemento.classList.remove('sin-contenido');
                    } 
                });

                nuevaTareaElemento.addEventListener('keydown', function (event) {
                    const selectedText = window.getSelection().toString();
                
                    if (event.key === 'Backspace' && selectedText === nuevaTareaElemento.firstChild.nodeValue) {
                        nuevaTareaElemento.firstChild.nodeValue = '‎'
                    }
                });
                
                nuevaTareaElemento.addEventListener('blur', function () {
                    nuevaTareaElemento.contentEditable = false;
                    const nuevoTitle = nuevaTareaElemento.textContent.replace('doneeditminimize', '');
                    nuevaTareaElemento.title = nuevoTitle;
                    botonEditar.disabled = false;
                });

                const botonesDentroLi = nuevaTareaElemento.querySelectorAll('button');
                botonesDentroLi.forEach(function (boton) {
                    boton.contentEditable = false;
                });
            });

            botonEliminar.addEventListener('click', function () {
                nuevaTareaElemento.classList.remove('completado');
                nuevaTareaElemento.classList.add('eliminacion');

                setTimeout(function () {
                    listaTareas.removeChild(nuevaTareaElemento);
                    actualizarVisibilidadListaVacia();
                    actualizarEstadoBotonCompletar();
                    actualizarContadorTareas();
                }, 290);
                actualizarEstadoBotonEliminar()
            });
        }
        actualizarVisibilidadListaVacia();
        actualizarEstadoBotonCompletar();
        actualizarEstadoBotonEliminar()
        actualizarContadorTareas();
        inputTarea.focus();
    });

    function actualizarContadorTareas() {
        const cantidadTotalTareas = document.querySelectorAll('ol li').length;
        const cantidadTareasCompletadas = document.querySelectorAll('ol li.tachado').length;
        const subtitle = document.querySelector('.subtitle');
        const botonCompletar = document.getElementById('botonCompletar');
        const botonLimpiar = document.getElementById('botonLimpiar');

        if (cantidadTotalTareas === 0) {
            subtitle.textContent = '';
            subtitle.style.display = 'none';
            botonCompletar.style.display = 'none';
            botonEliminar.style.display = 'none';
            botonLimpiar.style.display = 'none';
        } else if (cantidadTareasCompletadas === cantidadTotalTareas) {
            subtitle.textContent = '¡Completaste todas tus tareas!';
            subtitle.style.display = 'block';
            botonCompletar.style.display = 'block';
            botonEliminar.style.display = 'block';
            botonLimpiar.style.display = 'block';
        } else {
            const tareasPendientes = cantidadTotalTareas - cantidadTareasCompletadas;
            subtitle.textContent = `Tienes ${tareasPendientes} tarea${tareasPendientes !== 1 ? 's' : ''} por completar`;
            subtitle.style.display = 'block';
            botonCompletar.style.display = 'block';
            botonEliminar.style.display = 'block';
            botonLimpiar.style.display = 'block';
        }
    }

    botonCompletar.addEventListener('click', function () {
        const tareas = document.querySelectorAll('ol li');
        const todasMarcadas = Array.from(tareas).every(tarea => tarea.classList.contains('completado'));

        tareas.forEach((tarea) => {
            tarea.classList.toggle('tachado', !todasMarcadas);
            tarea.classList.toggle('completado', !todasMarcadas);

            const botonEditar = tarea.querySelector('.editar');
            botonEditar.disabled = !todasMarcadas;
        });

        actualizarEstadoBotonCompletar();
        actualizarEstadoBotonEliminar()
        actualizarContadorTareas();
    });

    botonLimpiar.addEventListener('click', function () {
        const tareas = document.querySelectorAll('ol li');

        tareas.forEach((tarea) => {
            tarea.classList.remove('completado');
            tarea.classList.add('eliminacion');
            setTimeout(function () {
                tarea.remove();
                actualizarVisibilidadListaVacia();
                actualizarEstadoBotonCompletar();
                actualizarContadorTareas();
            }, 290);
        });
    });

    function actualizarEstadoBotonCompletar() {
        const tareas = document.querySelectorAll('ol li');
        const todasMarcadas = Array.from(tareas).every(tarea => tarea.classList.contains('completado'));
        const iconoCompletar = botonCompletar.querySelector('.material-symbols-outlined');

        botonCompletar.title = todasMarcadas ? 'Desmarcar todas las tareas' : 'Marcar todas las tareas como completadas';
        iconoCompletar.textContent = todasMarcadas ? 'radio_button_unchecked' : 'check_circle';

        tareas.forEach((tarea) => {
            const botonMarcar = tarea.querySelector('.marcar');
            const iconoMarcar = tarea.querySelector('.marcar .material-symbols-outlined');
            botonMarcar.title = todasMarcadas ? 'Desmarcar tarea' : 'Marcar tarea como completada';
            iconoMarcar.title = todasMarcadas ? 'Desmarcar tarea' : 'Marcar tarea como completada';
        });
    }

    botonEliminar.addEventListener('click', function () {
        const tareasCompletadas = document.querySelectorAll('ol li.completado');

        tareasCompletadas.forEach((tarea) => {
            tarea.classList.remove('completado');
            tarea.classList.add('eliminacion');
            setTimeout(function () {
                tarea.remove();
                
                actualizarVisibilidadListaVacia();
                actualizarEstadoBotonCompletar();
                actualizarContadorTareas();
            }, 290);
            actualizarEstadoBotonEliminar();
        });
    });

    function actualizarVisibilidadListaVacia() {
        const listaVacia = document.querySelector('.lista-vacia');
        const tareas = document.querySelectorAll('ol li');
        const consejoAleatorio = consejos[Math.floor(Math.random() * consejos.length)];
        const parrafoConsejo = document.querySelector('.consejo');

        tareas.length > 0 ? listaVacia.style.display = 'none' : listaVacia.style.display = 'block';
        parrafoConsejo.textContent = consejoAleatorio;
    }

    function actualizarEstadoBotonEliminar() {
        const tareasCompletadas = document.querySelectorAll('ol li.completado');
        const botonEliminar = document.getElementById('botonEliminar');
    
        botonEliminar.disabled = tareasCompletadas.length === 0;
    }

    inputTarea.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            botonAgregar.click();
        } else if (event.key === 'Escape') {
            inputTarea.value = '';
            inputTarea.blur(); 
        }
    });

    const consejos = [
        "Divide tus tareas en metas diarias para mantener el enfoque y lograr un progreso constante",
        "Identifica y prioriza las tareas más importantes para abordar primero",
        "Crea listas de verificación para cada tarea y marca cada ítem a medida que avanzas",
        "Programa pequeños descansos entre tareas para mantener la productividad y la concentración",
        "Si es posible, delega tareas a otras personas para aliviar tu carga de trabajo",
        "Enfócate en una tarea a la vez para mejorar la calidad y eficiencia del trabajo",
        "Asigna fechas límite realistas a tus tareas para evitar el estrés innecesario",
        "Celebra tus logros, incluso los pequeños, para mantenerte motivado/a",
        "Minimiza distracciones como notificaciones para maximizar tu tiempo de trabajo",
        "Revisa y actualiza tu lista de tareas regularmente para reflejar cambios en prioridades",
        "No tengas miedo de decir no a nuevas tareas si tu carga de trabajo actual es alta",
        "Un espacio de trabajo organizado contribuye a una mente organizada",
        "Divide tu tiempo en bloques de trabajo de 25 minutos seguidos de un breve descanso",
        "Reflexiona sobre tus tareas completadas para mejorar tu eficiencia en el futuro",
        "Utiliza herramientas y tecnologías para automatizar tareas repetitivas siempre que sea posible",
        "No olvides cuidar tu bienestar mental y toma descansos cuando lo necesites"
    ];
    
    const consejoAleatorio = consejos[Math.floor(Math.random() * consejos.length)];
    const parrafoConsejo = document.querySelector('.consejo');

    parrafoConsejo.textContent = consejoAleatorio;

    inputTarea.focus();

});
