"use strict";

//RENDER-COMUNICACION-node.js
const { app } = require('electron');
const { ipcRenderer } = window.require('electron');


/*----------------------------------------------*
*            CONFIGURACIONES  DB                *
*-----------------------------------------------*/

let activeTab = "prestados"; /*Por defecto tab principal*/
const DB_NAME = 'EQUIPOS';
const DB_VERSION = 1;
let db;

function abrirDB() {
  const request = window.indexedDB.open(DB_NAME, DB_VERSION);

  request.onerror = () => {
    console.log('Error opening database');
    mostrarNotificacion("Error en la base de datos")
  };

  request.onsuccess = () => {
    db = request.result;
    displayPrestados();
    displayHistorial();
    console.log('Database opened successfully');
    console.log('DB creada correctamente');
    mostrarNotificacion("base de datos cargada")
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Tabla de equipos prestados
    const prestadosStore = db.createObjectStore('prestados', { keyPath: 'placa' });
    prestadosStore.createIndex('cedula', 'cedula',{ unique: false });

    // Tabla de equipos entregados
    const entregadosStore = db.createObjectStore('entregados', { keyPath: 'id',autoIncrement: true });
    entregadosStore.createIndex('cedula', 'cedula', { unique: false });

    // Tabla de historial
    const historialStore = db.createObjectStore('historial', { keyPath: 'id', autoIncrement: true });
    historialStore.createIndex('placa', 'placa', { unique: false });
  };
  
  // Ajustar el límite de almacenamiento a 20 GB
  request.addEventListener('upgradeneeded', (event) => {
    const db = event.target.result;
    
    if (db.objectStoreNames.contains('prestados')) {
      const prestadosStore = event.currentTarget.transaction.objectStore('prestados');
      prestadosStore.requestSize = 20 * 1024 * 1024 * 1024; // 20 GB
    }
    
    if (db.objectStoreNames.contains('entregados')) {
      const entregadosStore = event.currentTarget.transaction.objectStore('entregados');
      entregadosStore.requestSize = 20 * 1024 * 1024 * 1024; // 20 GB
    }
    
    if (db.objectStoreNames.contains('historial')) {
      const historialStore = event.currentTarget.transaction.objectStore('historial');
      historialStore.requestSize = 20 * 1024 * 1024 * 1024; // 20 GB
    }
  });

  

  
  const filtroFechaInput = document.getElementById('filtroFecha');
  const filtroHoraInput = document.getElementById('filtroHora');
  // const filtroMesInput = document.getElementById('filtroMes');
  const filtroAnioInput = document.getElementById('filtroAnio');

  // Botón para filtrar por fecha
  document.getElementById('filtrarPorFecha').addEventListener('click', () => {
    const filtroFecha = filtroFechaInput.value;
    displayEntregados(filtroFecha, null, null, null);
  });

  // Botón para filtrar por hora
  document.getElementById('filtrarPorHora').addEventListener('click', () => {
    const filtroHora = filtroHoraInput.value;
    displayEntregados(null, filtroHora, null, null);
  });

  // // Botón para filtrar por mes
  // document.getElementById('filtrarPorMes').addEventListener('click', () => {
  //   const filtroMes = filtroMesInput.value;
  //   displayEntregados(null, null, filtroMes, null);
  // });

  // Botón para filtrar por año
  document.getElementById('filtrarPorAnio').addEventListener('click', () => {
    const filtroAnio = filtroAnioInput.value;
    displayEntregados(null, null, null, filtroAnio);
  });



  //Historial filtro
  // Obtén los elementos de filtro del DOM para el historial
  const filtroFechaHistorialInput = document.getElementById('filtroFechaHistorial');
  const filtroHoraHistorialInput = document.getElementById('filtroHoraHistorial');
  //  const filtroMesHistorialInput = document.getElementById('filtroMesHistorial');
  const filtroAnioHistorialInput = document.getElementById('filtroAnioHistorial');

  // Botón para filtrar por fecha en el historial
  document.getElementById('filtrarPorFechaHistorial').addEventListener('click', () => {
    const filtroFecha = filtroFechaHistorialInput.value;
    displayHistorial(filtroFecha, null, null, null);
  });

  // Botón para filtrar por hora en el historial
  document.getElementById('filtrarPorHoraHistorial').addEventListener('click', () => {
    const filtroHora = filtroHoraHistorialInput.value;
    displayHistorial(null, filtroHora, null, null);
  });

  //  // Botón para filtrar por mes en el historial
  //  document.getElementById('filtrarPorMesHistorial').addEventListener('click', () => {
  //    const filtroMes = filtroMesHistorialInput.value;
  //    displayHistorial(null, null, filtroMes, null);
  //  });

  // Botón para filtrar por año en el historial
  document.getElementById('filtrarPorAnioHistorial').addEventListener('click', () => {
    const filtroAnio = filtroAnioHistorialInput.value;
    displayHistorial(null, null, null, filtroAnio);
  });

}
/*----------------------------------------------*
*            CONFIGURACIONES  DB                *
*-----------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------*
*            MANIPULACION DE DATOS              *
*-----------------------------------------------*/

// Función para agregar un equipo prestado a la base de datos
   function añadirPrestamo(placa, nombre, cedula, equipo) {
    /*
       Función AÑADIR PRESTAMOS:
   
       La función añadirPrestamo agrega un equipo prestado a la base de datos. Esta función se encarga de verificar si el equipo ya ha sido prestado y, en caso contrario, lo agrega a la base de datos. Utiliza el almacenamiento de objetos IndexedDB para gestionar los equipos prestados.
   
       Parámetros
       placa (string): El identificador único del equipo prestado.
       nombre (string): El nombre de la persona que recibe el equipo.
       cedula (string): La cédula de la persona que recibe el equipo.
       equipo (string): El tipo de equipo prestado.
       Descripción
       Crear una transacción de lectura/escritura:
   
       const transaction = db.transaction(['prestados'], 'readwrite');
       Abre una transacción en la base de datos prestados con permisos de lectura y escritura.
       Obtener el almacén de objetos:
   
       const store = transaction.objectStore('prestados');
       Obtiene el almacén de objetos prestados desde la transacción.
       Buscar el equipo por la placa:
   
       const getRequest = store.get(placa);
       Inicia una solicitud para obtener un equipo específico utilizando la placa.
       Manejar la respuesta exitosa de la solicitud:
   
       getRequest.onsuccess = (event) => {...}
       Comprueba si el equipo ya existe en la base de datos:
       Si el equipo ya existe (existingItem), muestra una notificación indicando que el equipo ya ha sido prestado y termina la función.
       Si el equipo no existe, procede a agregarlo a la base de datos.
       Agregar el nuevo equipo:
   
       const request = store.add({ ... })
       Agrega un nuevo objeto al almacén con los datos proporcionados (placa, nombre, cédula, equipo, fecha y hora actuales).
       Manejar la respuesta exitosa de la solicitud de agregar:
   
       request.onsuccess = () => {...}
       Muestra una notificación de éxito y actualiza la visualización de los equipos prestados (displayPrestados).
       Manejar errores en la solicitud de agregar:
   
       request.onerror = () => {...}
       Muestra una notificación indicando que no se pudo añadir el equipo.
       Manejar errores en la solicitud de búsqueda:
   
       getRequest.onerror = () => {...}
       Muestra una notificación indicando que hubo un error al buscar el equipo.
       Funciones Auxiliares
       mostrarNotificacion(mensaje): Muestra una notificación al usuario con el mensaje especificado.
       optenerDate(): Devuelve la fecha actual.
       getCurrentTime(): Devuelve la hora actual.
       displayPrestados(): Actualiza la visualización de los equipos prestados.
    
    */
   
     const transaction = db.transaction(['prestados'], 'readwrite');
     const store = transaction.objectStore('prestados');
     
     const getRequest = store.get(placa);
   
     getRequest.onsuccess = (event) => {
       const existingItem = event.target.result;
       
       if (existingItem) {
         mostrarNotificacion("El equipo ya ha sido prestado");
         return;
       }
   
       const request = store.add({
         placa: placa,
         nombre: nombre,
         cedula: cedula,
         equipo: equipo,
         fecha: optenerDate(),
         hora: getCurrentTime()
       });
   
       request.onsuccess = () => {
         displayPrestados();
         mostrarNotificacion("Equipo añadido");
       };
   
       request.onerror = () => {
         mostrarNotificacion("No se puede añadir");
       };
     };
   
     getRequest.onerror = () => {
       mostrarNotificacion("Error al buscar el elemento");
     };
   }
   
   
   // Función para devolver un equipo prestado
   function devolverEquipo(placa) {
     /*
     
     Función DEVOLVER EQUIPO:
   
     La función devolverEquipo se encarga de procesar la devolución de un equipo prestado. Esta función mueve el equipo desde la lista de equipos prestados a la lista de equipos entregados y también registra el historial de devoluciones.
   
     Parámetros
     placa (string): El identificador único del equipo prestado que se va a devolver.
     Descripción
     Crear una transacción de lectura/escritura:
   
     const transaction = db.transaction(['prestados', 'entregados', 'historial'], 'readwrite');
     Abre una transacción en las bases de datos prestados, entregados y historial con permisos de lectura y escritura.
     Obtener los almacenes de objetos:
   
     const prestadosStore = transaction.objectStore('prestados');
     const entregadosStore = transaction.objectStore('entregados');
     const historialStore = transaction.objectStore('historial');
     Obtiene los almacenes de objetos prestados, entregados y historial desde la transacción.
     Buscar el equipo prestado por la placa:
   
     const getPrestadoRequest = prestadosStore.get(placa);
     Inicia una solicitud para obtener un equipo específico utilizando la placa.
     Manejar la respuesta exitosa de la solicitud:
   
     getPrestadoRequest.onsuccess = (event) => {...}
     Comprueba si el equipo prestado existe:
     Si el equipo existe (equipoPrestado), crea un objeto equipoEntregado con los detalles del equipo y añade la hora y fecha de entrega actuales.
     Agregar el equipo a la lista de entregados:
   
     const addEntregadoRequest = entregadosStore.add(equipoEntregado);
     Agrega el objeto equipoEntregado al almacén de objetos entregados.
     Manejar la respuesta exitosa de la solicitud de agregar a entregados:
   
     addEntregadoRequest.onsuccess = () => {...}
     Si el equipo se agrega exitosamente a entregados, elimina el equipo de prestados y lo añade a historial. Luego, actualiza la visualización de los equipos prestados y entregados.
     Mostrar notificación de equipo devuelto:
   
     mostrarNotificacion("¡Equipo Devuelto!");
     Muestra una notificación indicando que el equipo ha sido devuelto.
     Funciones Auxiliares
     mostrarNotificacion(mensaje): Muestra una notificación al usuario con el mensaje especificado.
     optenerDate(): Devuelve la fecha actual.
     getCurrentTime(): Devuelve la hora actual.
     displayPrestados(): Actualiza la visualización de los equipos prestados.
     displayEntregados(): Actualiza la visualización de los equipos entregados.
     
     */
   
     const transaction = db.transaction(['prestados', 'entregados', 'historial'], 'readwrite');
     const prestadosStore = transaction.objectStore('prestados');
     const entregadosStore = transaction.objectStore('entregados');
     const historialStore = transaction.objectStore('historial');
   
     const getPrestadoRequest = prestadosStore.get(placa);
   
     getPrestadoRequest.onsuccess = (event) => {
       const equipoPrestado = event.target.result;
   
       if (equipoPrestado) {
         const { placa,nombre,cedula ,equipo, fecha, hora } = equipoPrestado;
         const equipoEntregado = { placa, nombre,cedula,equipo,fecha, hora, horaEntrega: getCurrentTime(), fechaEntrega: optenerDate() };
   
         const addEntregadoRequest = entregadosStore.add(equipoEntregado);
   
         addEntregadoRequest.onsuccess = () => {
           prestadosStore.delete(placa);
           historialStore.add(equipoEntregado);
           displayPrestados();
           displayEntregados();
           console.log('Equipment returned');
         };
       }
     };
     mostrarNotificacion("!Equipo Devuelto!")
   }


  //Edita el prestamo actual TAB(ventana de PRESTADOS)
  let editedPlacas = [];
  function editarPrestamo(placa) {
    const transaction = db.transaction(['prestados'], 'readwrite');
    const store = transaction.objectStore('prestados');
    const request = store.get(placa);
  
    request.onsuccess = (event) => {
      const equipoPrestado = event.target.result;
  
      if (equipoPrestado) {
        const { nombre, cedula, equipo } = equipoPrestado;
  
        document.getElementById('editModal').style.display = 'block';
  
        document.getElementById('editedNombre').value = nombre;
        document.getElementById('editedCedula').value = cedula;
        document.getElementById('editedEquipo').value = equipo;
  
        document.getElementById('cancelEditBtn').addEventListener('click', () => {
          document.getElementById('editModal').style.display = 'none';
        });
  
        document.getElementById('editForm').addEventListener('submit', (e) => {
          e.preventDefault();
  
          const editedNombre = document.getElementById('editedNombre').value;
          const editedCedula = document.getElementById('editedCedula').value;
          const editedEquipo = document.getElementById('editedEquipo').value;
  
          if (editedNombre !== '' && editedCedula !== '') {
            // Verifica si esta placa ya se ha editado
            if (!editedPlacas.includes(placa)) {
              const newTransaction = db.transaction(['prestados'], 'readwrite');
              const newStore = newTransaction.objectStore('prestados');
  
              const editedEquipment = {
                placa,
                nombre: editedNombre,
                cedula: editedCedula,
                equipo: editedEquipo,
                fecha: optenerDate(),
                hora: getCurrentTime()
              };
  
              const updateRequest = newStore.put(editedEquipment);
  
              updateRequest.onsuccess = () => {
                newTransaction.commit();
                // Almacena la placa para evitar duplicados
                editedPlacas.push(placa);
                displayPrestados();
                mostrarNotificacion('Equipo actualizado');
                document.getElementById('editModal').style.display = 'none';
                setTimeout(() => {
                  location.reload();
                }, 1000); //Tiempo de espera para la actualizacion de los datos 2S por defecto.
                mostrarNotificacion('Espera un momento');
    
              };
  
              updateRequest.onerror = () => {
                newTransaction.abort();
                mostrarNotificacion('Error Actualizando Equipo');
              };
            } else {
              mostrarNotificacion('Espera un momento');
            
            }
          }
        });
      }
    };
  
  }
  
  //Borrar el prestamo actual TAB(ventana de PRESTADOS)
  function borrarPrestamo(placa) {
    const transaction = db.transaction(['prestados'], 'readwrite');
    const store = transaction.objectStore('prestados');
    const request = store.delete(placa);
  
    request.onsuccess = () => {
      displayPrestados();
      mostrarNotificacion('Equipo Borrado')
    };
  
    request.onerror = () => {
      mostrarNotificacion('Error al Borrar')
    };
  }
  
  //BORRA EL COTENIDO DE LA TABLA HISTORIAL
  function deleteHistorial(tabla) {
    // Función para borrar historial
      const transaction = db.transaction([tabla], 'readwrite');
      const objectStore = transaction.objectStore(tabla);
    
      const request = objectStore.clear();
    
      request.onsuccess = function () {
        console.log(`Historial ${tabla} borrado correctamente.`);
        mostrarNotificacion('Datos Borrados Correctamente');
      };
    
      request.onerror = function (error) {
        console.error('Error al borrar el historial:', error);
        mostrarNotificacion('error al borrar el Historial')
        
      };
  }

/*----------------------------------------------*
*            MANIPULACION DE DATOS              *
*-----------------------------------------------*/


/*---------------------------------------------------------------------------------------------------------------*/


/*----------------------------------------------*
*            XLS EXPORTAR | EXPORTAR JSON DB    *
*-----------------------------------------------*/
  
//--Funciones para exportar contenido en formato "xlsx", Requiere uso de la "libreria exceljs"
//--Exportar a ecxel



    function exportTableToExcel_Historial(mesSeleccionado) {
        mostrarNotificacion('Procesando...');
        try {
        const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    
        dbRequest.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['historial'], 'readonly');
            const objectStore = transaction.objectStore('historial');
            const request = objectStore.getAll();
    
            request.onsuccess = function(event) {
            const data = event.target.result;
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Historial');
    
            const headers = ['Placa', 'Nombre', 'Cedula', 'Equipo', 'Duracion de Prestamo', 'Fecha', 'Hora de Prestamo', 'Fecha de Entrega', 'Hora de Entrega'];
            worksheet.addRow(headers);
    
            const mes = new Date(mesSeleccionado).getMonth() + 1; // -1 mes mas mes actual
            const año = new Date(mesSeleccionado).getFullYear();
    
            data.forEach(item => {
                const fechaPrestamo = new Date(item.fecha); 
                
                if (fechaPrestamo.getMonth() === mes && fechaPrestamo.getFullYear() === año) {
                const tableRow = [
                    item.placa,
                    item.nombre,
                    item.cedula,
                    item.equipo,
                    item.duracionPrestamo,
                    item.fecha,
                    item.horaPrestamo,
                    item.fechaEntrega,
                    item.horaEntrega
                ];
                worksheet.addRow(tableRow);
                }
            });
    
            // Modificar el color de las celdas inferiores del encabezado
            worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
                cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '6AC753' } 
                };
                cell.font = {
                color: { argb: '000000' }, 
                bold: true 
                };
            });
    
            // Modificar el color de las celdas inferiores del encabezado
            const rowCount = worksheet.rowCount;
            for (let i = 2; i <= rowCount; i++) {
                worksheet.getRow(i).eachCell({ includeEmpty: true }, (cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: i % 2 === 0 ? 'FFFFFF' : 'F5F5F5' } 
                };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                });
            }
    
            // Generar el archivo XLSX
            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.target = '_blank';
                link.download =  mesSeleccionado + '_Historial_De_Prestamos.xlsx';
                link.click();
                mostrarNotificacion('Exportando tabla "Historial"');
            });
            };
    
            request.onerror = function(event) {
            console.error('Error al leer la base de datos:', event.target.errorCode);
            mostrarNotificacion('Error al leer la base de datos', 'error');
            };
        };
    
        dbRequest.onerror = function(event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode);
            mostrarNotificacion('Error al abrir la base de datos', 'error');
        };
        } catch (error) {
        console.error('Error al exportar a Excel:', error);
        mostrarNotificacion('Error en internet o API https://cdn.jsdelivr.net/npm/exceljs/dist/exceljs.min.js', 'error');
        }
    }
    



//-------------------------JSON EXPORTAR DATOS
    // /*Exportar datos de la DB*/
    // function exportDatabaseToJSON() {
    //     const transaction = db.transaction(['prestados', 'entregados', 'historial'], 'readonly');
    
    //     // Objeto para almacenar todos los datos de las tablas
    //     const data = {
    //     prestados: [],
    //     entregados: [],
    //     historial: []
    //     };
    
    //     // Obtener datos de la tabla de equipos prestados
    //     transaction.objectStore('prestados').openCursor().onsuccess = function (event) {
    //     const cursor = event.target.result;
    //     if (cursor) {
    //         data.prestados.push({
    //         placa: cursor.value.placa,
    //         nombre: cursor.value.nombre,
    //         cedula: cursor.value.cedula,
    //         equipo: cursor.value.equipo,
    //         fecha: cursor.value.fecha,
    //         hora: cursor.value.hora
    //         });
    //         cursor.continue();
    //     }
    //     };
    
    //     // Obtener datos de la tabla de equipos entregados
    //     transaction.objectStore('entregados').openCursor().onsuccess = function (event) {
    //     const cursor = event.target.result;
    //     if (cursor) {
    //         data.entregados.push({
    //         placa: cursor.value.placa,
    //         nombre: cursor.value.nombre,
    //         cedula: cursor.value.cedula,
    //         equipo: cursor.value.equipo,
    //         fecha: cursor.value.fecha,
    //         hora: cursor.value.hora,
    //         horaEntrega: cursor.value.horaEntrega,
    //         fechaEntrega: cursor.value.fechaEntrega
    //         });
    //         cursor.continue();
    //     }
    //     };
    
    //     // Obtener datos de la tabla de historial
    // transaction.objectStore('historial').openCursor().onsuccess = function (event) {
    //     const cursor = event.target.result;
    //     if (cursor) {
    //         data.historial.push({
    //         placa: cursor.value.placa,
    //         nombre: cursor.value.nombre,
    //         cedula: cursor.value.cedula,
    //         equipo: cursor.value.equipo,
    //         fecha: cursor.value.fecha,
    //         hora: cursor.value.hora,
    //         horaEntrega: cursor.value.horaEntrega,
    //         fechaEntrega: cursor.value.fechaEntrega
    //         });
    //         cursor.continue();
    //     }
    // };
    
    
    // function downloadJSON(data, filename) {
    //     const json = JSON.stringify(data, null, 2); // Agregar espaciado para formatear el JSON
    //     const blob = new Blob([json], { type: 'application/json' });
    //     const url = URL.createObjectURL(blob);
    
    //     const a = document.createElement('a');
    //     a.style.display = 'none';
    //     a.href = url;
    //     a.download = filename;
    //     document.body.appendChild(a);
    //     a.click();
    
    //     URL.revokeObjectURL(url);
    // }
    
    //     setTimeout(function () {
    //     downloadJSON(data, 'db.json');
    //     }, 1000);
    // }
    
    // const exportJsonBoton = document.getElementById("export-btn-JSON-DB");
    // exportJsonBoton.addEventListener('click',(()=>{
    //     exportDatabaseToJSON();
    //     mostrarNotificacion("Exportando 'base de datos' db.JSON..")
    // }))
    
    
    // /*IMPORTAR DATOS A LA DB, ARCHIVO JSON*/
    // function importDatabaseFromJSON(file) {
    //     const reader = new FileReader();
    
    //     reader.onload = function(event) {
    //     const json = event.target.result;
    //     const data = JSON.parse(json);
    
    //     const transaction = db.transaction(['prestados', 'entregados', 'historial'], 'readwrite');
    
    //     // Borrar todos los datos existentes en las tablas antes de importar los nuevos datos
    //     transaction.objectStore('prestados').clear();
    //     transaction.objectStore('entregados').clear();
    //     transaction.objectStore('historial').clear();
    
    //     // Importar datos a la tabla de equipos prestados
    //     data.prestados.forEach(item => {
    //         transaction.objectStore('prestados').add(item);
    //     });
    
    //     // Importar datos a la tabla de equipos entregados
    //     data.entregados.forEach(item => {
    //         transaction.objectStore('entregados').add(item);
    //     });
    
    //     // Importar datos a la tabla de historial
    //     data.historial.forEach(item => {
    //         transaction.objectStore('historial').add(item);
    //     });
    
    //     // Mostrar notificación de importación exitosa y limpiear tabla visualmente.
    //     const tabName="historial"
    //     mostrarNotificacion("Cargando datos, reinicia o cambia de TAB");
    //     const tableBody = document.querySelector(`#${tabName}-table tbody`);
    //     tableBody.innerHTML = ''; 

    //     // Cambiar de TAB para visualizar cambios.
    //     const tabButton = document.querySelector('.tab-button[data-tab="reporte"]');
    //     if (tabButton) {
    //         tabButton.click();
    //     }

    //     };
    
    //     reader.readAsText(file);
        
    
    // }
    
    // // Escuchar el evento change del input para importar .json
    // const importJsonInput = document.getElementById("import-file-input");
    // importJsonInput.addEventListener('change', (event) => {
    //     const file = event.target.files[0];
    //     importDatabaseFromJSON(file);
    // });
//-------------------------JSON EXPORTAR DATOS





  // Generar una clave secreta aleatoria
  function generateSecretKey() {
    return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
}

// Exportar base de datos a JSON y encriptar
function exportDatabaseToJSON() {
    const transaction = db.transaction(['prestados', 'entregados', 'historial'], 'readonly');
    const data = {
        prestados: [],
        entregados: [],
        historial: []
    };

    transaction.objectStore('prestados').openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            data.prestados.push(cursor.value);
            cursor.continue();
        } else {
            transaction.objectStore('entregados').openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    data.entregados.push(cursor.value);
                    cursor.continue();
                } else {
                    transaction.objectStore('historial').openCursor().onsuccess = function (event) {
                        const cursor = event.target.result;
                        if (cursor) {
                            data.historial.push(cursor.value);
                            cursor.continue();
                        } else {
                            const json = JSON.stringify(data, null, 2);
                            const secretKey = generateSecretKey();
                            const encrypted = CryptoJS.AES.encrypt(json, secretKey).toString();
                            downloadJSON(encrypted, 'db.json');
                            document.getElementById('clave-secreta-display').innerText = secretKey;
                            document.getElementById('modal-clave-secreta').style.display = 'block';
                        }
                    };
                }
            };
        }
    };
}

// Descargar el archivo "encriptado"
function downloadJSON(encryptedData, filename) {
    const blob = new Blob([encryptedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
}

// Importar base de datos desde JSON y desencriptar
function importDatabaseFromJSON(file, secretKey) {
  mostrarNotificacion("Calculando...")
    const reader = new FileReader();
    reader.onload = function (event) {
        const encrypted = event.target.result;
        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
            const json = bytes.toString(CryptoJS.enc.Utf8);
            const data = JSON.parse(json);

            const transaction = db.transaction(['prestados', 'entregados', 'historial'], 'readwrite');
            transaction.objectStore('prestados').clear();
            transaction.objectStore('entregados').clear();
            transaction.objectStore('historial').clear();

            data.prestados.forEach(item => {
                transaction.objectStore('prestados').add(item);
            });
            data.entregados.forEach(item => {
                transaction.objectStore('entregados').add(item);
            });
            data.historial.forEach(item => {
                transaction.objectStore('historial').add(item);
            });

            mostrarNotificacion("Datos importados exitosamente. Reinicie o cambie de TAB.");
            //// Cambiar de TAB para visualizar cambios.
            const tabButton = document.querySelector('.tab-button[data-tab="reporte"]');
            if (tabButton) {
                tabButton.click();
            }
        } catch (e) {
          mostrarNotificacion("Clave secreta incorrecta o archivo dañado | Reinicia el aplicativo");
          
          setTimeout(() => {
            location.reload();
          }, 1000); //Tiempo de espera para la actualizacion de los datos 1S por defecto.
        }
    };
    reader.readAsText(file);
}

/*----------------------------------------------*
*            XLS EXPORTAR | EXPORTAR JSON DB    *
*-----------------------------------------------*/
  
  
//--------------------------------------------------------------------------------------------------------------------------------
  


/*----------------------------------------------*
*          DB CUOTA DE ALMACENAMIENTO           *
*-----------------------------------------------*/

    //consulta la cuota de almacenamiento y obtener detalles del equipo
    async function consultarCuotaYDetalles() {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const { quota, usage } = await navigator.storage.estimate();
          const detallesEquipo = obtenerDetallesEquipo();
          mostrarResultados(quota, usage, detallesEquipo);
        } else {
          mostrarError('API storage no compatible con mostrar cuota');
        }
      } catch (error) {
        mostrarError(`Error: ${error.message}`);
      }
    }

    function obtenerDetallesEquipo() {
      return {
        idioma: navigator.language,
        navegador: navigator.userAgent,
        plataforma: navigator.platform,
        memoriaDisponible: `${(navigator.deviceMemory || 'N/A')} GB`,
      };
    }

    function mostrarResultados(quota, usage, detallesEquipo) {
      const quotaFormatted = formatSize(quota);
      const usageFormatted = formatSize(usage);

      const resultadoDiv = document.getElementById('resultado');
      resultadoDiv.innerHTML = `
        Cuota disponible: <span>${quotaFormatted}</span><br>
        Uso actual: <span class="usage">${usageFormatted}</span><br><br>
        <strong>Detalles del equipo:</strong><br>
        Idioma: ${detallesEquipo.idioma}<br>
        Motor: ${detallesEquipo.navegador}<br>
        Plataforma: ${detallesEquipo.plataforma}<br>
        Ram del sistema: ${detallesEquipo.memoriaDisponible}
      `;

      const modal = document.getElementById('modal_info');
      modal.style.display = 'block';
    }

    function mostrarError(error) {
      const resultadoDiv = document.getElementById('resultado');
      resultadoDiv.innerHTML = `<span class="error">${error}</span>`;

      const modal = document.getElementById('modal_info');
      modal.style.display = 'block';
    }

    function formatSize(size) {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let index = 0;

      while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
      }

      return `${size.toFixed(2)} ${units[index]}`;
    }

    document.getElementById('consultar-btn').addEventListener('click', consultarCuotaYDetalles);

/*----------------------------------------------*
*          DB CUOTA DE ALMACENAMIENTO           *
*-----------------------------------------------*/


/*----------------------------------------------*
*            ABRIR DB                           *
*-----------------------------------------------*/
window.addEventListener('DOMContentLoaded', () => {
  abrirDB();
});
/*----------------------------------------------*
*            ABRIR DB                           *
*-----------------------------------------------*/

/*----------------------------------------------*
*            CONTADOR DE REGISTROS              *
*-----------------------------------------------*/
function actualizarContador() {
  if (!db) {
    console.error('La base de datos no está abierta.');
    return;
  }

  const personCountElement = document.getElementById('person-count');
  const equipmentCountElement = document.getElementById('equipment-count');

  function mostrarAnimacionCarga() {
    let dots = 0;
    return setInterval(() => {
      dots = (dots + 1) % 4;
      const dotsText = '.'.repeat(dots);
      personCountElement.textContent = equipmentCountElement.textContent = dotsText;
    }, 400); // 1/2s mas o menos
  }

  function contarRegistros() {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['historial'], 'readonly');
      const store = transaction.objectStore('historial');
      const uniqueCedulas = new Set();
      const uniquePlacas = new Set();

      store.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          uniqueCedulas.add(cursor.value.cedula);
          uniquePlacas.add(cursor.value.placa);
          cursor.continue();
        } else {
          resolve({ personCount: uniqueCedulas.size, equipmentCount: uniquePlacas.size });
        }
      };

      transaction.onerror = reject;
    });
  }

  const animacionId = mostrarAnimacionCarga();

  setTimeout(() => {
    contarRegistros()
      .then(({ personCount, equipmentCount }) => {
        clearInterval(animacionId);
        personCountElement.textContent = personCount;
        equipmentCountElement.textContent = equipmentCount;
      })
      .catch(error => {
        console.error('Error al contar los registros:', error);
        clearInterval(animacionId);
        personCountElement.textContent = equipmentCountElement.textContent = 'Error';
      });
  }, 2100); //2.1s
}
/*----------------------------------------------*
*            CONTADOR DE REGISTROS              *
*-----------------------------------------------*/

