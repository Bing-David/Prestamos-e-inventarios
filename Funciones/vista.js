"use strict";
/*----------------------------------------------*
*            NOTIFIACIONES-CONFIRMACIONES       *
*-----------------------------------------------*/
  

    /*NOTIFICACIONES |ERRORES |ALERTAS | AVISOS*/
    document.addEventListener("DOMContentLoaded", () => {
        window.mostrarNotificacion = function(texto) {
        const notificacion = document.getElementById("notificacion");
        if (notificacion) {
            notificacion.textContent = texto;
            notificacion.classList.add("visible");
            setTimeout(() => {
            notificacion.classList.remove("visible");
            }, 3005);
        } else {
            console.error("El elemento #notificacion no se encontró.");
        }
        }
    });
    /*NOTIFICACIONES |ERRORES |ALERTAS | AVISOS*/

    //--------|CONFIRMACION-MODAL-|
    function mostrarModalConfirmacion(message, onConfirm) {
        const modalConfirmacion = document.getElementById('modal-confirmacion');
        const modalMessage = document.getElementById('modal-message');
        const modalYes = document.getElementById('modal-yes');
        const modalNo = document.getElementById('modal-no');

        modalMessage.textContent = message;

        modalYes.onclick = function () {
        onConfirm();
        modalConfirmacion.style.display = 'none';
        };

        modalNo.onclick = function () {
        modalConfirmacion.style.display = 'none';
        };

        modalConfirmacion.style.display = 'flex';
    }
    //--------|CONFIRMACION-MODAL-|


  /*----------------------------------------------*
*            NOTIFIACIONES-CONFIRMACIONES       *
*-----------------------------------------------*/



//------------------------------------------------------------------------------



/*----------------------------------------------*
*            CREAR TABLAS                       *
*-----------------------------------------------*/

/*Añadir el cotenido al cuerpo de las tablas[EQUIPOS]*/
function crearEventosFila(placa, numeroPrestadas, personas, tipo) {
  const row = document.createElement('tr');

  // Placa
  const tdPlaca = document.createElement('td');
  tdPlaca.textContent = placa;
  row.appendChild(tdPlaca);

  // Número de préstamos
  const tdCount = document.createElement('td');
  tdCount.textContent = numeroPrestadas;
  row.appendChild(tdCount);

  // Tipo de equipo
  const tdTipo = document.createElement('td');
  tdTipo.textContent = tipo;
  row.appendChild(tdTipo);

  // Boton “Mostrar personas
  const tdBtn = document.createElement('td');
  const btn = document.createElement('button');
  btn.textContent = 'Mostrar personas';
  btn.addEventListener('click', () => modalPersonas(personas));
  tdBtn.appendChild(btn);
  row.appendChild(tdBtn);

  return row;
}
    //RENDER-PERSONAS-TABLA
    function crearPersonasFilas(cedula, nombre, numeroEquiposPrestados, equiposPrestados) {
    
      const row = document.createElement('tr');
    
      const cedulaCell = document.createElement('td');
      cedulaCell.textContent = cedula;
      row.appendChild(cedulaCell);
    
      const nombreCell = document.createElement('td');
      nombreCell.textContent = nombre;
      row.appendChild(nombreCell);
    
      const numeroEquiposPrestadosCell = document.createElement('td');
      numeroEquiposPrestadosCell.textContent = numeroEquiposPrestados;
      row.appendChild(numeroEquiposPrestadosCell);
    
      const equiposPrestadosCell = document.createElement('td');
    
      const mostrarEquiposButton = document.createElement('button');
      mostrarEquiposButton.textContent = 'Mostrar equipos';
      mostrarEquiposButton.addEventListener('click', () => {
        MostarEquiposPrestados(equiposPrestados);
      });
      equiposPrestadosCell.appendChild(mostrarEquiposButton);
    
      row.appendChild(equiposPrestadosCell);
    
      return row;
    }
    
    //RENDER-PRESTADOS-TABLA
    function crearFilas(placa,nombre,cedula,equipo,fecha, hora, fechaEntrega, horaEntrega) {
      const row = document.createElement('tr');
    
      const placaCell = document.createElement('td');
      placaCell.textContent = placa;
      row.appendChild(placaCell);
    
      const nombreCell = document.createElement('td');
      nombreCell.textContent = nombre;
      row.appendChild(nombreCell);
    
    
      const cedulaCell = document.createElement('td');
      cedulaCell.textContent = cedula;
      row.appendChild(cedulaCell)
    
    
      const equipoCell = document.createElement('td');
      equipoCell.textContent = equipo;
      row.appendChild(equipoCell);
    
      const duracionCell = document.createElement('td');
      duracionCell.textContent = calcularDuracion(fecha, hora, fechaEntrega, horaEntrega);
      row.appendChild(duracionCell);
      
    
    ;
    
      const fechaCell = document.createElement('td');
      fechaCell.textContent = fecha;
      row.appendChild(fechaCell);
    
      const horaCell = document.createElement('td');
      horaCell.textContent = hora;
      row.appendChild(horaCell);
    
      if (fechaEntrega && horaEntrega) {
        const fechaEntregaCell = document.createElement('td');
        fechaEntregaCell.textContent = fechaEntrega;
        row.appendChild(fechaEntregaCell);
    
        const horaEntregaCell = document.createElement('td');
        horaEntregaCell.textContent = horaEntrega;
        row.appendChild(horaEntregaCell);
      }
    
      return row;
    }
    
    function accionCeldas(placa) {
      const actionsCell = document.createElement('td');
    
      const editarBtn = document.createElement('button');  
      editarBtn.textContent = 'Editar ';
      editarBtn.classList.add('edit-btn');
      editarBtn.addEventListener('click', () => {
        editarPrestamo(placa);
      });
      actionsCell.appendChild(editarBtn);
    
      const borrarBtn = document.createElement('button');
      borrarBtn.textContent = 'Borrar';
      borrarBtn.classList.add('delete-btn');
      borrarBtn.addEventListener('click', () => {
        mostrarModalConfirmacion('¿Estás seguro que deseas borrar este elemento?', () => {
          borrarPrestamo(placa);
          setTimeout(() => {
            location.reload();
          }, 1000);
        });
      });
      actionsCell.appendChild(borrarBtn);
    
      //--Boton de DEVOLVER-Tabla de prestamos
      const devolverBtn = document.createElement('button');
      //Al parecionar el boton llama al modal de confirmacion
      //Luego pasa como parametro la placa del equipo ID unico, a la funcion deolver equipo.
      //El cual borrar lo quita de la tabla actual y lo pasa a la de historial y entregados.
      devolverBtn.textContent = 'Devolver';
      devolverBtn.classList.add('return-btn');
      devolverBtn.addEventListener('click', () => {
          mostrarModalConfirmacion('¿Devolver el equipo?', () => {
            setTimeout(() => {
            devolverEquipo(placa);
            }, 100);});
      });
    
      actionsCell.appendChild(devolverBtn);
      return actionsCell;
    }
    
/*----------------------------------------------*
*            CREAR TABLAS                       *
*-----------------------------------------------*/
    


/*----------------------------------------------*
*            DISPLAYS TABLAS                    *
*-----------------------------------------------*/



    //Mostrar cotenido en el TAB(ventana de prestamos actuales)
    function displayPrestados() {

        /*
        Función displayPrestados:
        La función displayPrestados se encarga de mostrar el contenido de los equipos prestados en una tabla dentro del aplicativo. Utiliza IndexedDB para acceder y recuperar los datos almacenados.
    
        Parámetros
        La función no recibe parámetros explícitos.
    
        Descripción
        Selección de Elementos HTML:
    
        Selecciona el cuerpo de la tabla (<tbody>) donde se mostrarán los equipos prestados.
        Transacción de Lectura:
    
        Inicia una transacción de solo lectura en la base de datos IndexedDB (db) con el almacén de objetos llamado 'prestados'.
        Obtención de Cursor:
    
        Abre un cursor sobre el almacén de objetos 'prestados' para iterar sobre todos los registros almacenados.
        Iteración a través de los Registros:
    
        Por cada registro encontrado por el cursor:
        Extrae los campos (placa, nombre, cedula, equipo, fecha, hora) del registro.
        Crea una fila de tabla (<tr>) con los datos obtenidos utilizando las funciones auxiliares crearFilas y accionCeldas.
        Agrega la fila creada a la tabla en el documento HTML.
        
        */
    
        const tableBody = document.querySelector('#prestados-table tbody');
        tableBody.innerHTML = '';
    
        const transaction = db.transaction(['prestados'], 'readonly');
        const store = transaction.objectStore('prestados');
        const request = store.openCursor();
    
        request.onsuccess = (event) => {
        const cursor = event.target.result;
    
        if (cursor) {
            const { placa, nombre,cedula,equipo,fecha, hora } = cursor.value;
            const row = crearFilas(placa,nombre,cedula,equipo,fecha, hora);
            const actionsCell = accionCeldas(placa);
            row.appendChild(actionsCell);
            tableBody.appendChild(row);
            cursor.continue();
        }
        };
    
        
    }

    //Mostrar cotenido en el TAB(ventana de prestamos entregados)
    function displayEntregados(filtroFecha, filtroHora, filtroMes, filtroAnio, startIndex = 0) {
    /*
    
        Función displayEntregado y display historial
        La función displayEntregados muestra los datos de equipos entregados en una tabla paginada, permitiendo filtrar por fecha, hora, mes y año.
    
        Parámetros
        filtroFecha (string): Filtro opcional por fecha de entrega en formato ISO.
        filtroHora (string): Filtro opcional por hora de entrega.
        filtroMes (string): Filtro opcional por nombre del mes en español.
        filtroAnio (string): Filtro opcional por año de entrega.
        startIndex (number, opcional): Índice de inicio para paginación, por defecto es 0.
        Descripción
        Selección de Elementos HTML:
    
        Selecciona el cuerpo de la tabla (<tbody>) donde se mostrarán los equipos entregados.
        Transacción de Lectura:
    
        Inicia una transacción de solo lectura en la base de datos IndexedDB (db) con el almacén de objetos 'entregados'.
        Obtención y Filtrado de Datos:
    
        Utiliza store.getAll() para obtener todos los registros de 'entregados'.
        Filtra los datos basados en los parámetros de filtro proporcionados (filtroFecha, filtroHora, filtroMes, filtroAnio). Si un filtro no se aplica, todos los elementos se consideran válidos.
        Paginación de Resultados:
    
        Limita los resultados mostrados utilizando startIndex y elementsPerPage(20 elementos), (número de elementos por página).
        Crea una nueva tabla en el documento HTML y muestra los datos filtrados y paginados.
        Botones de Navegación:
    
        Añade botones dinámicos para navegar entre páginas de resultados:
        Volver: Permite retroceder a la página anterior si hay más resultados anteriores disponibles.
        Seguir: Permite avanzar a la siguiente página si hay más resultados disponibles.
        Fin: Muestra un botón deshabilitado cuando no hay más resultados para cargar.
        se hace scroll automático al inicio de la página después de cargar nuevos resultados.
    
    */
    
        const tableBody = document.querySelector('#entregados-table tbody');
        const transaction = db.transaction(['entregados'], 'readonly');
        const store = transaction.objectStore('entregados');
        const elementsPerPage = 20; // Número de elementos por página
        let filteredData = []; 
    
        store.getAll().onsuccess = (event) => {
        filteredData = event.target.result.filter((item) => {
            const fechaEntrega = new Date(item.fechaEntrega);
            return (
            (!filtroFecha || fechaEntrega.toISOString().includes(filtroFecha)) &&
            (!filtroHora || item.horaEntrega === filtroHora) &&
            (!filtroMes || fechaEntrega.toLocaleString('es', { month: 'long' }).toLowerCase().startsWith(filtroMes.toLowerCase())) &&
            (!filtroAnio || fechaEntrega.getFullYear() === Number(filtroAnio))
            );
        });
        
        filteredData.reverse();
        const paginatedData = filteredData.slice(startIndex, startIndex + elementsPerPage);
        tableBody.innerHTML = '';
    
        paginatedData.forEach((item) => {
            const row = crearFilas(item.placa, item.nombre, item.cedula, item.equipo, item.fecha, item.hora, item.fechaEntrega, item.horaEntrega);
            tableBody.appendChild(row);
        });
    
        // Mostrar los botones de "Volver" y "Seguir"
        const backButton = document.createElement('button');
        backButton.classList.add('volver');
        backButton.textContent = 'Volver';
        backButton.addEventListener('click', () => {
            const prevStartIndex = Math.max(startIndex - elementsPerPage, 0);
            displayEntregados(filtroFecha, filtroHora, filtroMes, filtroAnio, prevStartIndex);
        });
        tableBody.appendChild(backButton);
    
        if (filteredData.length > startIndex + elementsPerPage) {
            const nextButton = document.createElement('button');
            nextButton.classList.add('cargar');
            nextButton.textContent = 'Seguir';
            nextButton.addEventListener('click', () => {
            displayEntregados(filtroFecha, filtroHora, filtroMes, filtroAnio, startIndex + elementsPerPage);
            });
            tableBody.appendChild(nextButton);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Si no hay más contenido disponible, mostrar el botón deshabilitado
            // Es decir "FIN".
            const disabledButton = document.createElement('button');
            disabledButton.classList.add('cargar');
            disabledButton.textContent = 'Fin';
            disabledButton.disabled = true;
            tableBody.appendChild(disabledButton);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        };
    }
    
    
    function displayHistorial(filtroFecha, filtroHora, filtroMes, filtroAnio, startIndex = 0) {
        const tableBody = document.querySelector('#historial-table tbody');
        const transaction = db.transaction(['historial'], 'readonly');
        const store = transaction.objectStore('historial');
        const elementsPerPage = 20; // Número de elementos por página
        let filteredData = [];
    
        // Obtener todos los datos y almacenarlos en filteredData
        store.getAll().onsuccess = (event) => {
        filteredData = event.target.result.filter((item) => {
            const fechaEntrega = new Date(item.fechaEntrega);
            return (
            (!filtroFecha || fechaEntrega.toISOString().includes(filtroFecha)) &&
            (!filtroHora || item.horaEntrega === filtroHora) &&
            (!filtroMes || fechaEntrega.toLocaleString('es', { month: 'long' }).toLowerCase().startsWith(filtroMes.toLowerCase())) &&
            (!filtroAnio || fechaEntrega.getFullYear() === Number(filtroAnio))
            );
        });
    
        filteredData.reverse();


        const paginatedData = filteredData.slice(startIndex, startIndex + elementsPerPage);
    
        tableBody.innerHTML = '';
    
        paginatedData.forEach((item) => {
            const row = crearFilas(item.placa, item.nombre, item.cedula, item.equipo, item.fecha, item.hora, item.fechaEntrega, item.horaEntrega);
            tableBody.appendChild(row);
        });
    
        // Mostrar los botones de "Volver" y "Seguir"
        const backButton = document.createElement('button');
        backButton.classList.add('volver-h');
        backButton.textContent = 'Volver';
        backButton.addEventListener('click', () => {
            const prevStartIndex = Math.max(startIndex - elementsPerPage, 0);
            displayHistorial(filtroFecha, filtroHora, filtroMes, filtroAnio, prevStartIndex);
        });
        tableBody.appendChild(backButton);
    
        // Verificar si hay más contenido disponible para cargar
        if (filteredData.length > startIndex + elementsPerPage) {
            const nextButton = document.createElement('button');
            nextButton.classList.add('cargar-h');
            nextButton.textContent = 'Seguir';
            nextButton.addEventListener('click', () => {
            displayHistorial(filtroFecha, filtroHora, filtroMes, filtroAnio, startIndex + elementsPerPage);
            });
            tableBody.appendChild(nextButton);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const disabledButton = document.createElement('button');
            disabledButton.classList.add('cargar-h');
            disabledButton.textContent = 'Fin';
            disabledButton.disabled = true;
            tableBody.appendChild(disabledButton);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        };
    }
    
    //---Mostrar cotenido en el TAB(ventana de prestamos EQUIPOS)
    function displayEventos(startIndex = 0) {
    
    /*
    
        Función displayEventos y display personas:
        La función displayEventos se encarga de mostrar una lista de eventos en una tabla HTML, utilizando datos almacenados en la db.
        La función también proporciona paginación para navegar a través de un gran número de eventos osea equipos.
    
        Parámetros
        startIndex (number, opcional): Índice de inicio para la paginación. El valor predeterminado es 0.
        Descripción
        Selección de Elementos HTML:
    
        Se selecciona el cuerpo de la tabla (<tbody>) donde se mostrarán los eventos.
        Transacción de Lectura:
    
        Se inicia una transacción de solo lectura en la base de datos IndexedDB (db) con el almacén de objetos 'historial'.
        Inicialización del Cursor:
    
        Se abre un cursor en el almacén de objetos 'historial' para iterar sobre todos los registros.
        Recopilación de Datos:
    
        Se crea un objeto eventos para almacenar los eventos agrupados por placa (identificador único).
        Se procesa cada registro encontrado por el cursor, incrementando el contador numeroPrestadas y almacenando la información de cada persona que ha prestado el equipo, incluyendo la duración del préstamo calculada por la función calcularDuracion.
        Paginación:
    
        Se filtran los eventos según el startIndex y elementsPerPage para mostrar solo una porción de los datos en cada página.
        Actualización de la Tabla HTML:
    
        Se limpia el contenido actual de la tabla.
        Se crean filas de tabla (<tr>) para cada evento paginado utilizando la función crearEventosFila y se agregan al cuerpo de la tabla.
        Botones de Navegación:
    
        Botón "Volver": Permite retroceder a la página anterior de eventos.
        Botón "Seguir": Permite avanzar a la siguiente página de eventos si hay más eventos disponibles.
        Botón "Final": Se muestra deshabilitado cuando no hay más eventos disponibles para cargar.
        Scroll al Principio de la Página
    
    */
        
        const tableBody = document.querySelector('#eventos-table tbody');
        const transaction = db.transaction(['historial'], 'readonly');
        const store = transaction.objectStore('historial');
        const elementsPerPage = 210;
      
        const request = store.openCursor();
        const eventos = {};
      
        request.onsuccess = event => {
          const cursor = event.target.result;
          if (cursor) {
            const { placa, equipo /* este es el texto que quieres mostrar */, fecha, hora, fechaEntrega, horaEntrega } = cursor.value;
      
            if (!eventos[placa]) {
              eventos[placa] = {
                numeroPrestadas: 0,
                personas: [],
                tipo: equipo   // guardamos el texto en lugar de referenciar el <select>
              };
            }
            eventos[placa].numeroPrestadas++;
            eventos[placa].personas.push({ ...cursor.value, duracion: calcularDuracion(fecha, hora, fechaEntrega, horaEntrega) });
            cursor.continue();
          } else {
            // paginación
            const keys = Object.keys(eventos);
            const paged = keys.slice(startIndex, startIndex + elementsPerPage);
            tableBody.innerHTML = '';
      
            for (const key of paged) {
              const { numeroPrestadas, personas, tipo } = eventos[key];
              // aquí ya pasamos el string correcto
              const row = crearEventosFila(key, numeroPrestadas, personas, tipo);
              tableBody.appendChild(row);
            }
            }
    
            const backButton = document.createElement('button');
            backButton.classList.add('volver-eventos');
            backButton.textContent = 'Volver';
            backButton.addEventListener('click', () => {
            const prevStartIndex = Math.max(startIndex - elementsPerPage, 0);
            displayEventos(prevStartIndex);
            window.scrollTo({ top: 0, behavior: 'smooth' });
    
            });
            tableBody.appendChild(backButton);
    
            if (Object.keys(eventos).length > startIndex + elementsPerPage) {
            const nextButton = document.createElement('button');
            nextButton.classList.add('segir-eventos');
            nextButton.textContent = 'Seguir';
            nextButton.addEventListener('click', () => {
                displayEventos(startIndex + elementsPerPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            tableBody.appendChild(nextButton);
    
            } else {
            const disabledButton = document.createElement('button');
            disabledButton.classList.add('segir-eventos');
            disabledButton.textContent = 'F i n';
            disabledButton.disabled = true;
            tableBody.appendChild(disabledButton);
            }
        }
        };
    //Modal, vetana flotante
    function modalPersonas(personas) {
        const modal = document.getElementById('modal2');
        const personasContainer = document.getElementById('personas-container');
    
        // Limpiar el contenido anterior del modal
        personasContainer.innerHTML = '';
    
        const elementsPerPage = 20; // Número de elementos por página
        let startIndex = 0; // Índice inicial para cargar elementos
    
        function displayNextElements() {
        for (let i = startIndex; i < Math.min(startIndex + elementsPerPage, personas.length); i++) {
            const persona = personas[i];
            const personaInfo = document.createElement('ul');
            personaInfo.innerHTML = `
            <li><strong>Cédula:</strong> ${persona.cedula}</li>
            <li><strong>Nombre:</strong> ${persona.nombre}</li>
            <li><strong>Duración:</strong> ${persona.duracion}</li> 
            <li><strong>Fecha:</strong> ${persona.fecha}</li>
            <li><strong>Hora:</strong> ${persona.hora}</li>
            <li><strong>Fecha de Entrega:</strong> ${persona.fechaEntrega}</li>
            <li><strong>Hora de Entrega:</strong> ${persona.horaEntrega}</li>
            `;
            personasContainer.appendChild(personaInfo);
        }
    
        startIndex += elementsPerPage;
    
        // Mostrar el botón de cargar más si hay más elementos disponibles
        if (startIndex < personas.length) {
            if (!document.querySelector('.cargar-modal-P')) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.classList.add('cargar-modal-P');
            loadMoreButton.textContent = 'Cargar más';
            loadMoreButton.addEventListener('click', displayNextElements);
    
            // Agregar el botón al final del contenedor del modal
            modal.appendChild(loadMoreButton);
            }
        } else {
            // Eliminar el botón si no hay más elementos para cargar
            const loadMoreButton = document.querySelector('.cargar-modal-P');
            if (loadMoreButton) {
            loadMoreButton.remove();
            }
        }
        }
    
        displayNextElements();
    
        modal.style.display = 'block';
    }
    //---Mostrar cotenido en el TAB(ventana de prestamos EQUIPOS)
    
    
    //--Mostrar cotenido en el TAB(ventana de prestamos Personas)
    function displayPersonas(startIndex = 0) {
        const tableBody = document.querySelector('#personas-table tbody');
        const transaction = db.transaction(['historial'], 'readonly');
        const store = transaction.objectStore('historial');
        const elementsPerPage = 200; // Número de elementos por página
    
        const request = store.openCursor();
        let personas = {};
    
        request.onsuccess = (event) => {
        const cursor = event.target.result;
    
        if (cursor) {
            const { cedula, nombre } = cursor.value;
    
            if (!personas.hasOwnProperty(cedula)) {
            personas[cedula] = {
                nombre: nombre,
                numeroEquiposPrestados: 0,
                equiposPrestados: []
            };
            }
    
            personas[cedula].numeroEquiposPrestados++;
    
            personas[cedula].equiposPrestados.push(cursor.value);
    
            cursor.continue();
        } else {
            const paginatedPersonas = Object.keys(personas).slice(startIndex, startIndex + elementsPerPage).reduce((obj, key) => {
            obj[key] = personas[key];
            return obj;
            }, {});
    
            tableBody.innerHTML = '';
    
            for (const cedula in paginatedPersonas) {
            if (paginatedPersonas.hasOwnProperty(cedula)) {
                const { nombre, numeroEquiposPrestados, equiposPrestados } = paginatedPersonas[cedula];
                const row = crearPersonasFilas(cedula, nombre, numeroEquiposPrestados, equiposPrestados);
                tableBody.appendChild(row);
            }
            }
    
            const backButton = document.createElement('button');
            backButton.classList.add('volver-personas');
            backButton.textContent = 'Volver';
            backButton.addEventListener('click', () => {
            const prevStartIndex = Math.max(startIndex - elementsPerPage, 0);
            displayPersonas(prevStartIndex);
            });
            tableBody.appendChild(backButton);
    
            if (Object.keys(personas).length > startIndex + elementsPerPage) {
            const nextButton = document.createElement('button');
            nextButton.classList.add('segir-personas');
            nextButton.textContent = 'Seguir';
            nextButton.addEventListener('click', () => {
                displayPersonas(startIndex + elementsPerPage);
            });
            tableBody.appendChild(nextButton);
            } else {
            const disabledButton = document.createElement('button');
            disabledButton.classList.add('segir-personas');
            disabledButton.textContent = 'F i  n';
            disabledButton.disabled = true;
            tableBody.appendChild(disabledButton);
            }
        }
        };
    }
    //Modal,  ventana flotante
    function MostarEquiposPrestados(equiposPrestados) {
    
        /*
        
        Función MostarEquiposPrestados y modal de personas:
        La función MostarEquiposPrestados se encarga de mostrar una lista de equipos prestados en un modal HTML con funcionalidad de paginación para cargar más elementos a medida que el usuario lo solicite.
    
        Parámetros
        equiposPrestados (array): Array de objetos que contienen la información de los equipos prestados.
        Descripción
        Selección de Elementos HTML:
    
        Se selecciona el modal (#modal1) y el contenedor de equipos (#equipos-container) donde se mostrarán los detalles de los equipos prestados.
        Limpieza del Contenido Anterior:
    
        Se limpia el contenido del contenedor de equipos para asegurar que no haya datos duplicados o desactualizados.
        Paginación Inicial:
    
        Se define el número de elementos por página (elementsPerPage) como 5.
        Se inicializa el índice de inicio (startIndex) en 0 para comenzar desde el primer elemento.
        Función displayNextElements:
    
        Ciclo de Carga de Elementos: Itera sobre el array de equiposPrestados desde startIndex hasta startIndex + elementsPerPage o hasta el final del array, lo que ocurra primero.
        Para cada equipo, se crea una lista (<ul>) con la información del equipo y se agrega al contenedor de equipos.
        Actualización del Índice de Inicio: Se incrementa startIndex para la siguiente carga de elementos.
        Mostrar Botón de Cargar Más: Si hay más elementos para cargar, se muestra un botón de "Cargar más" que permite al usuario cargar la siguiente página de elementos.
        Si el botón ya existe, no se crea uno nuevo.
        Eliminar Botón de Cargar Más: Si no hay más elementos para cargar, se elimina el botón de "Cargar más".
        Mostrar los Primeros Elementos:
    
        Se llama a displayNextElements para cargar y mostrar la primera página de elementos.
        Mostrar el Modal:
    
        Se establece el estilo del modal para hacerlo visible (display: block).
    
        */
    
        const modal = document.getElementById('modal1');
        const equiposContainer = document.getElementById('equipos-container');
    
        // Limpiar el contenido anterior del modal
        equiposContainer.innerHTML = '';
    
        const elementsPerPage = 30; // Número de elementos por página
        let startIndex = 0; // Índice inicial para cargar elementos
    
        function displayNextElements() {
        for (let i = startIndex; i < Math.min(startIndex + elementsPerPage, equiposPrestados.length); i++) {
            const equipo = equiposPrestados[i];
            const equipoInfo = document.createElement('ul');
            equipoInfo.innerHTML = `
            <li><strong>Placa:</strong> ${equipo.placa}</li>
            <li><strong>Equipo:</strong> ${equipo.equipo}</li>
            <li><strong>Fecha:</strong> ${equipo.fecha}</li>
            <li><strong>Hora Prestado:</strong> ${equipo.hora}</li>
            <li><strong>Hora de Entrega:</strong> ${equipo.horaEntrega}</li>
            `;
            equiposContainer.appendChild(equipoInfo);
        }
    
        startIndex += elementsPerPage;
    
        // Mostrar el botón de cargar más si hay más elementos disponibles
        if (startIndex < equiposPrestados.length) {
            if (!document.querySelector('.cargar-modal')) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.classList.add('cargar-modal');
            loadMoreButton.textContent = 'Cargar más';
            loadMoreButton.addEventListener('click', displayNextElements);
    
            // Agregar el botón al final del contenedor del modal
            modal.appendChild(loadMoreButton);
            }
        } else {
            // Eliminar el botón si no hay más elementos para cargar
            const loadMoreButton = document.querySelector('.cargar-modal');
            if (loadMoreButton) {
            loadMoreButton.remove();
            }
        }
        }
    
        // Mostrar los primeros elementos
        displayNextElements();
    
        modal.style.display = 'block';
    }
    //---Mostrar cotenido en el TAB(ventana de prestamos Personas)
    
    
  
/*----------------------------------------------*
 *            DISPLAYS TABLAS                    *
/*-----------------------------------------------*/


//--------------------------------------------------------------------------------------

/*----------------------------------------------*
 *            DISPLAYS CONTEO                    *
/*-----------------------------------------------*/


  function actualizarNumeroEquiposPrestados() {
    var tablaPrestados = document.getElementById('prestados-table');
    var numeroEquiposPrestados = tablaPrestados.rows.length - 1;
    document.getElementById('numEquiposPrestados').textContent = numeroEquiposPrestados.toString();
    document.getElementById('numEquiposPrestados2').textContent = numeroEquiposPrestados.toString();
  }

  document.addEventListener('DOMContentLoaded', function () {
    actualizarNumeroEquiposPrestados();

    var observer = new MutationObserver(actualizarNumeroEquiposPrestados);
    observer.observe(document.getElementById('prestados-table').getElementsByTagName('tbody')[0], { childList: true });
  });

/*----------------------------------------------*
 *            DISPLAYS CONTEO                    *
/*-----------------------------------------------*/


//--------------------------------------------------------------------------------------


/*----------------------------------------------*
*                 SUGERENCIAS-"INTELIGENTES"      *
*-----------------------------------------------*/
const cedulaInput = document.getElementById('cedula');
const nombreInput = document.getElementById('nombre');
const equipoInput = document.getElementById('equipo');

cedulaInput.addEventListener('input', () => {
  const fieldName = 'cedula';
  const suggestionsContainerId = 'suggestions-cedula';
  autoCompletado(fieldName, suggestionsContainerId);
});

function autoCompletado(fieldName, suggestionsContainerId) {
  const inputValue = cedulaInput.value.toLowerCase();
  if (!inputValue.trim()) {
    limpiarSugerencias(suggestionsContainerId);
    return;
  }

  const transaction = db.transaction(["historial"], "readonly");
  const historialStore = transaction.objectStore("historial");

  const request = historialStore.openCursor();
  const matchingResults = [];

  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const fieldValue = cursor.value[fieldName].toLowerCase();
      if (fieldValue.includes(inputValue)) {
        matchingResults.push(cursor.value);
      }
      cursor.continue();
    } else {
      mostrarSugerencias(matchingResults.slice(0, 4), suggestionsContainerId, fieldName);
    }
  };
}

function mostrarSugerencias(results, containerId, fieldName) {
  limpiarSugerencias(containerId);

  const suggestionsContainer = document.getElementById(containerId);

  results.forEach(result => {
    const suggestion = document.createElement('button');
    suggestion.textContent = result[fieldName];
    suggestion.classList.add('suggestion');

    suggestion.addEventListener('click', () => {
      cedulaInput.value = result['cedula'];
      nombreInput.value = result['nombre'];
      equipoInput.value = result['equipo'];
      limpiarSugerencias(containerId);
      suggestionsContainer.style.display = 'none';
    });

    suggestionsContainer.appendChild(suggestion);
  });

  // Mostrar el contenedor de sugerencias solo si hay sugerencias, que concuerden con el historial.
  suggestionsContainer.style.display = results.length > 0 ? 'block' : 'none';
}

function limpiarSugerencias(containerId) {
  const suggestionsContainer = document.getElementById(containerId);
  suggestionsContainer.innerHTML = "";
  suggestionsContainer.style.display = 'none';
}
/*----------------------------------------------*
*                 SUGERENCIAS-INTELIGENTES      *
*-----------------------------------------------*/

//--------------------------------------------------------------------------------------



/*----------------------------------------------*
*          BUSQUEDA(search fuctions)            *
*-----------------------------------------------*/

document.getElementById('search-input5').addEventListener('keyup', buscarModalInfo);
document.getElementById('search-input7').addEventListener('keyup', buscarModalInfo);


    function busquedaBasica(inputId, tableId) {
        const input = document.getElementById(inputId).value.toUpperCase();
        const table = document.getElementById(tableId);
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
        for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;
    
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            const cellValue = cell.textContent || cell.innerText;
    
            if (cellValue.toUpperCase().indexOf(input) > -1) {
            found = true;
            break;
            }
        }
    
        rows[i].style.display = found ? '' : 'none';
        }
    }



  //---------------------------------------------------------

    
    let isSearching = false;
    function buscarTabla(tableName, query) {
      isSearching = true;
      document.getElementById(`search-input${tableName === 'entregados' ? '2' : '3'}`).disabled = true;
      mostrarNotificacion("Buscando...");
  
      const transaction = db.transaction([tableName], 'readonly');
      const store = transaction.objectStore(tableName);
      store.getAll().onsuccess = (event) => {
          const data = event.target.result;
          const filteredData = data.filter(item => {
              return Object.values(item).some(value => {
                  return value.toString().toUpperCase().indexOf(query) > -1;
              });
          });
  
          // Reset pagination
          displayPaginatedResults(tableName, filteredData, 0, query);
          isSearching = false;
          document.getElementById(`search-input${tableName === 'entregados' ? '2' : '3'}`).disabled = false;
      };
  }
  
  function displayPaginatedResults(tableName, data, startIndex, query) {
      const elementsPerPage = 20; // PAGINACION
      const tableBody = document.querySelector(`#${tableName}-table tbody`);
      const paginatedData = data.slice(startIndex, startIndex + elementsPerPage);
  
      tableBody.innerHTML = '';
      paginatedData.forEach(item => {
          const row = crearFilas(item.placa, item.nombre, item.cedula, item.equipo, item.fecha, item.hora, item.fechaEntrega, item.horaEntrega);
          resltarCoinsidencias(row, query);
          tableBody.appendChild(row);
      });
  
  }
  
  function resltarCoinsidencias(row, query) {
      const cells = row.getElementsByTagName('td');
      for (let cell of cells) {
          const regex = new RegExp(`(${query})`, 'gi');
          cell.innerHTML = cell.textContent.replace(regex, '<span class="highlight">$1</span>');
      }
  }
  
  // Estilos para resaltar coincidencias
  const style = document.createElement('style');
  style.innerHTML = `
      .highlight {
          background-color: #5fad33;
          font-weight: bold;
      }
  `;
  document.head.appendChild(style);

  //---------------------------------------------------------
    


    //--Busca dentro de los modales.
    function buscarModalInfo() {
      const input5 = document.getElementById('search-input5').value.toUpperCase();
      const input7 = document.getElementById('search-input7').value.toUpperCase();
      const personasContainer = document.getElementById('personas-container');
      const equiposContainer = document.getElementById('equipos-container');
  
      // Buscar en contenedor de personas
      buscarContenedorModal(personasContainer, input5);
      // Buscar en contenedor de equipos
      buscarContenedorModal(equiposContainer, input7);
  }
  
  function buscarContenedorModal(container, input) {
      const rows = container.getElementsByTagName('ul');
      
      Array.from(rows).forEach(row => {
          const cells = row.getElementsByTagName('li');
          
          const found = Array.from(cells).some(cell => {
              const cellValue = cell.textContent || '';
              return cellValue.toUpperCase().includes(input);
          });
  
          row.style.display = found ? '' : 'none';
      });
  }
  
/*----------------------------------------------*
*          BUSQUEDA(search)            *
*-----------------------------------------------*/

//--------------------------------------------------------------------------------------

/*----------------------------------------------*
*          REPORTE    Chart.js                   *
*-----------------------------------------------*/

let dbRequest;

function reporte() {
  const tipoGrafico = document.getElementById('tipo-grafico').value;
  const selectedYear = parseInt(document.getElementById('year-selector').value, 10) || new Date().getFullYear();
  document.getElementById('año-tabla').textContent = selectedYear;

  dbRequest = indexedDB.open('EQUIPOS', 1);

  dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['historial'], 'readonly');
    const objectStore = transaction.objectStore('historial');
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      const allPrestamos = event.target.result;

      const prestamos = allPrestamos.filter(p => {
        const fecha = new Date(p.fecha);
        return fecha.getFullYear() === selectedYear;
      });

      document.getElementById('total-value').textContent = prestamos.length;

      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth() + 1;
      const nombreMes = fechaActual.toLocaleDateString('es', { month: 'long' });
      document.getElementById('MES').textContent = nombreMes;

      const prestamosMes = prestamos.filter(p => {
        const fechaPrestamo = new Date(p.fecha);
        return fechaPrestamo.getMonth() + 1 === mesActual;
      }).length;
      document.getElementById('prestamos-mes-value').textContent = prestamosMes;

      // ---------------------- GRÁFICO HISTÓRICO ----------------------
      const meses = [];
      for (let i = 1; i <= 12; i++) {
        meses.push(prestamos.filter(p => new Date(p.fecha).getMonth() + 1 === i).length);
      }

      const canvas = document.getElementById('grafico-historico');
      if (canvas.chart) canvas.chart.destroy();

      canvas.chart = new Chart(canvas, {
        type: tipoGrafico,
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [{
            label: 'Prestamos',
            data: meses,
            backgroundColor: 'rgba(78, 163, 36, 0.2)',
            borderColor: 'rgb(95, 173, 51)',
            borderWidth: 2
          }]
        }
      });

      // ---------------------- GRÁFICO POR TIPO DE EQUIPO ----------------------
      const conteoEquipos = {};
      prestamos.forEach(p => {
        const tipo = p.equipo?.trim().toUpperCase() || 'DESCONOCIDO';
        conteoEquipos[tipo] = (conteoEquipos[tipo] || 0) + 1;
      });

      const equiposOrdenados = Object.entries(conteoEquipos).sort((a, b) => b[1] - a[1]);
      const equipoMasUsado = equiposOrdenados.length > 0 ? equiposOrdenados[0][0] : 'Ninguno';
      document.getElementById('equipo-mas-usado').textContent = equipoMasUsado;

      const canvasEquipos = document.getElementById('grafico-equipos');
      if (canvasEquipos.chart) canvasEquipos.chart.destroy();

      canvasEquipos.chart = new Chart(canvasEquipos, {
        type: 'bar',
        data: {
          labels: equiposOrdenados.map(e => e[0]),
          datasets: [{
            label: 'Veces Prestado',
            data: equiposOrdenados.map(e => e[1]),
            backgroundColor: 'rgba(78, 163, 36, 0.2)',
            borderColor: 'rgb(95, 173, 51)',
            borderWidth: 2
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });

      // ---------------------- DURACIÓN PROMEDIO POR EQUIPO ----------------------
      const duracionesPorEquipo = {};
      const cantidadesPorEquipo = {};

      prestamos.forEach(p => {
        if (p.fecha && p.hora && p.fechaEntrega && p.horaEntrega) {
          const tipo = p.equipo?.trim().toUpperCase() || 'DESCONOCIDO';
          const inicio = new Date(`${p.fecha} ${p.hora}`);
          const fin = new Date(`${p.fechaEntrega} ${p.horaEntrega}`);
          const duracionHoras = (fin - inicio) / (1000 * 60 * 60);
          duracionesPorEquipo[tipo] = (duracionesPorEquipo[tipo] || 0) + duracionHoras;
          cantidadesPorEquipo[tipo] = (cantidadesPorEquipo[tipo] || 0) + 1;
        }
      });

      const equiposDuracion = Object.keys(duracionesPorEquipo);
      const duracionPromedio = equiposDuracion.map(e => +(duracionesPorEquipo[e] / cantidadesPorEquipo[e]).toFixed(2));

      const canvasDuracion = document.getElementById('grafico-duracion');
      if (canvasDuracion.chart) canvasDuracion.chart.destroy();

      canvasDuracion.chart = new Chart(canvasDuracion, {
        type: 'bar',
        data: {
          labels: equiposDuracion,
          datasets: [{
            label: 'Horas Promedio',
            data: duracionPromedio,
            backgroundColor: 'rgba(255, 193, 7, 0.3)',
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 2
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });

      // ---------------------- TOP USUARIOS CON MÁS PRÉSTAMOS ----------------------
      const prestamosPorCedula = {};
      prestamos.forEach(p => {
        const cedula = p.cedula?.trim() || 'DESCONOCIDO';
        prestamosPorCedula[cedula] = (prestamosPorCedula[cedula] || 0) + 1;
      });

      const topUsuarios = Object.entries(prestamosPorCedula)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const canvasUsuarios = document.getElementById('grafico-usuarios');
      if (canvasUsuarios.chart) canvasUsuarios.chart.destroy();

      canvasUsuarios.chart = new Chart(canvasUsuarios, {
        type: 'bar',
        data: {
          labels: topUsuarios.map(u => u[0]),
          datasets: [{
            label: 'Préstamos',
            data: topUsuarios.map(u => u[1]),
            backgroundColor: 'rgba(153, 102, 255, 0.3)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    };

    request.onerror = (event) => {
      console.error('Error al leer la base de datos:', event.target.errorCode);
      mostrarNotificacion("Error al leer la DB.");
    };
  };

  dbRequest.onerror = (event) => {
    console.error('Error al abrir la base de datos:', event.target.errorCode);
    mostrarNotificacion("Error al abrir la DB.");
  };
}

// Función para llenar el selector de años
function selecionarAñoGrafico() {
  const yearSelector = document.getElementById('year-selector');
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 20; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelector.appendChild(option);
  }
}

// Inicializar al cargar....................................
selecionarAñoGrafico();
document.getElementById("reporte-tab").addEventListener('click', () => {
  mostrarNotificacion("Calculando...");
  reporte();
});
document.getElementById("tipo-grafico").addEventListener('change', () => {
  mostrarNotificacion("Cambiando gráfico...");
  reporte();
});
document.getElementById('year-selector').addEventListener('change', () => {
  mostrarNotificacion("Consultando...");
  reporte();
});

/*----------------------------------------------*
*          REPORTE                              *
*-----------------------------------------------*/

//--------------------------------------------------------------------------------------
document.getElementById('exportar-reporte-pdf').addEventListener('click', async () => {
  mostrarNotificacion("Generando PDF...");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const secciones = [
    { id: 'grafico-historico', titulo: 'Histórico de Préstamos por Mes' },
    { id: 'grafico-equipos', titulo: 'Préstamos por Tipo de Equipo' },
    { id: 'grafico-duracion', titulo: 'Duración Promedio por Equipo' },
    { id: 'grafico-usuarios', titulo: 'Top 5 Usuarios con Más Préstamos' }
  ];

  for (let i = 0; i < secciones.length; i++) {
    const { id, titulo } = secciones[i];
    const canvas = document.getElementById(id);

    if (!canvas) continue;

    const imgData = canvas.toDataURL("image/png", 1.0);

    if (i > 0) pdf.addPage();

    pdf.setFontSize(14);
    pdf.text(titulo, 10, 20);
    pdf.addImage(imgData, 'PNG', 10, 30, 180, 90);
  }

  const fechaActual = new Date().toISOString().split("T")[0];
  pdf.save(`REPORTE-${fechaActual}.pdf`);
});
//--------------------------------------------------------------------------------------



/*----------------------------------------------*
*               DARK-MODE                       *
*-----------------------------------------------*/
const toggleButton = document.getElementById('toggle-mode-btn');
toggleButton.addEventListener('click', toggleDarkMode);
function addDarkModeClasses() {


  //Esta funcion añade una nueva CLASE la con el mismo nombre pero con la clave "dark-" al inicio cual
  //Luego en el archivo dark-style.css se maipula para adecuar los estilos a "modo oscuro"
  const elements = document.getElementsByTagName('*');
  for (let i = 0; i < elements.length; i++) {
    const classNames = elements[i].classList;
    const newClassNames = Array.from(classNames, className => 'dark-' + className);
    elements[i].classList.add(...newClassNames);
  }
}
function removeDarkModeClasses() {
  const elements = document.getElementsByTagName('*');
  for (let i = 0; i < elements.length; i++) {
    const classNames = elements[i].classList;
    const removeClassNames = Array.from(classNames, className => className.startsWith('dark-') ? className : null).filter(Boolean);
    elements[i].classList.remove(...removeClassNames);
  }
}
function toggleDarkMode() {
  const darkModeStyle = document.getElementById('dark-mode-style');
  if (darkModeStyle) {
    removeDarkModeClasses();
    darkModeStyle.remove();
  } else {
    addDarkModeClasses();
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = './styles/dark-style.css';
    linkElement.id = 'dark-mode-style';
    document.head.appendChild(linkElement);
  }
}

// Verificar si el sistema está en modo oscuro
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const isDarkMode = prefersDarkScheme.matches;

// Activar el modo oscuro automáticamente si el sistema lo tiene configurado
if (isDarkMode) {
  toggleDarkMode();
}
/*----------------------------------------------*
*               DARK-MODE                       *
*-----------------------------------------------*/
