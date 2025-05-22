"use strict";

/*----------------------------------------------*
*            CONTROL ENVIO FORM                 *
*-----------------------------------------------*/

   /*CONTROLA EL ENVÍO DE LOS DATOS DEL FORMULARIO DE PRÉSTAMOS*/
    document.getElementById('prestamo-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const placa = document.getElementById('placa').value.trim();
      const cedula = document.getElementById('cedula').value.trim();
      const nombre = document.getElementById('nombre').value.trim();
      const equipo = document.getElementById('equipo').value.trim();

      // Validar que PLACA y CEDULA no estén vacíos
      if (placa === '' || cedula === '') {
      mostrarNotificacion('PLACA Y CEDULA SON OBLIGATORIOS');
      return;
      }

      //Sanitizacion de datos, INPUTS
      if (!/^\d+$/.test(placa)) {
      mostrarNotificacion('PLACA debe contener solo números');
      return; 
      }

      if (!/^\d+$/.test(cedula)) {
      mostrarNotificacion('CEDULA debe contener solo números');
      return; 
      }

      
      if (!/^[a-zA-Z\s]+$/.test(nombre)) {
      mostrarNotificacion('NOMBRE solo debe contener letras y espacios');
      return; 
      }

      añadirPrestamo(placa, nombre, cedula, equipo);
      document.getElementById('prestamo-form').reset();

      formContainer.style.display = 'none';
      fondo.style.display = 'none';
  });

/*----------------------------------------------*
*            CONTROL ENVIO FORM                 *
*-----------------------------------------------*/




/*----------------------------------------------*
*            CONTROL DE TIME AND DATE           *
*-----------------------------------------------*/

    // Función para obtener la fecha actual de los prestamos
    function optenerDate() {
        //Modulo date formato de fecha DD/MM/Y
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let day = currentDate.getDate();
        day = day < 10 ? '0' + day : day;
    
        return `${year}-${month}-${day}`;
    }
    
    // Función para obtener la hora actual en formato de 24h
    function getCurrentTime() {
        const currentDate = new Date();
        let hours = currentDate.getHours();
        hours = hours < 10 ? '0' + hours : hours;
        let minutes = currentDate.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
    
        return `${hours}:${minutes}`;
    }
    
    //funcion  para calcular duracion del prestamo
    function calcularDuracion(fechaInicio, horaInicio, fechaFin, horaFin) {
        if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) {
        return 'En Curso';
        }
    
        const fechaInicioObj = new Date(fechaInicio + ' ' + horaInicio);
        const fechaFinObj = new Date(fechaFin + ' ' + horaFin);
        const duracionMs = fechaFinObj - fechaInicioObj;
    
        // Convertir milisegundos a horas, minutos y segundos
        const segundos = Math.floor((duracionMs / 1000) % 60);
        const minutos = Math.floor((duracionMs / (1000 * 60)) % 60);
        const horas = Math.floor(duracionMs / (1000 * 60 * 60));
    
        return `${horas}h ${minutos}m ${segundos}s`;
    }

/*----------------------------------------------*
*            CONTROL DE TIME AND DATE           *
*-----------------------------------------------*/



//----------------------------------------------------------------------------------------------------



/*----------------------------------------------*
*      CONTROLES | TAB ENTRE TABLAS  | CONTROLES *
*-----------------------------------------------*/

    document.addEventListener('DOMContentLoaded', function () {
        const tabs = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
    
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                const target = this.getAttribute('data-tab');
    
                // Ocultar todos los contenidos de las pestañas y desactivar los botones de pestañas
                tabContents.forEach(function (content) {
                    content.style.display = 'none';
                });
                tabs.forEach(function (tab) {
                    tab.classList.remove('active');
                });
    
            // Mostrar el contenido de la pestaña seleccionada y activar su botón correspondiente
            const tabContent = document.getElementById(target);
            if (tabContent) {
            tabContent.style.display = 'block';
            this.classList.add('active');
    
            // Restablecer el contenido de la tabla al cambiar de pestaña
            if (target === 'historial' || target === 'entregados') {
                resetTable(target);
            }
    
            // Llamar a la función correspondiente para mostrar los datos de la pestaña, TAB
            switch (target) {
                case 'prestados':
                displayPrestados();
                break;
                case 'entregados':
                displayEntregados();
                break;
                case 'historial':
                displayHistorial();
                break;
                case 'eventos':
                displayEventos();
                actualizarContador();
                break;
                case 'personas':
                displayPersonas();
                actualizarContador();
                break;
                default:
                break;
            }
            }
        });
        });
    });
    function resetTable(tabName) {
        const tableBody = document.querySelector(`#${tabName}-table tbody`);
        tableBody.innerHTML = ''; 
    }
    
    //Manejo de
    window.addEventListener('scroll', function() {
        let scrollToTopBtn = document.getElementById('scrollToTopBtn');
        
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollToTopBtn.style.display = 'block';
        } else {
        scrollToTopBtn.style.display = 'none';
        }
    });
    
    document.getElementById('scrollToTopBtn').addEventListener('click', function() {
        window.scrollTo({
        top: 0,
        behavior: 'smooth'
        });
    });
    
    
    //minimize maximize window
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('minimizeBtn').addEventListener('click', () => {
        ipcRenderer.send('minimize');
        });
    
        document.getElementById('closeBtn').addEventListener('click', () => {
        ipcRenderer.send('close');
        });
    });
    
    
    function closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
        modal.style.display = 'none';
        });
    }
    
    const closeSpans = document.querySelectorAll('.close');
    closeSpans.forEach(closeSpan => {
        closeSpan.addEventListener('click', closeModal);
    });
    
  
  /*----------------------------------------------*
  *          TAB ENTRE TABLAS  | CONTROLES        *
  *-----------------------------------------------*/


//-----------------------------------------------------------------------------------------------


/*----------------------------------------------*
*          CAPTURA DE PANTALLA | CONTROL        *
*-----------------------------------------------*/

    //Reporte-captura de TAB
    document.addEventListener('DOMContentLoaded', () => {
        /*
        
        CAPTURA-DE-PANTALLA-REPORTE
    
        Tomar captura, TAB(ventana de reportes), Esta funcionalidad hace uso del script "html2canvas".
    
        La cual recibe como parAmetro importante, la sección, en específico un ID de un elemento contenedor del DOM
        Al cual va a tomar captura de su contenido.
    
        Este tiene cierto parámetro aplicado, para manejar un fondo (color blanco),
        además agrega una marca de agua en la esquina inferior izquierda, y genera un LINK de
        autodescarga del contenido capturado con "fileServer.js"
    
        */
        document.getElementById('capturar-imagen').addEventListener('click', () => {
            const reportesElement = document.getElementById('reportes');
    
            html2canvas(reportesElement, {
            backgroundColor: '#ffffff', 
            scale: 15, 
            logging: true, 
            onrendered: function(canvas) {
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                tempCtx.fillStyle = '#ffffff';
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempCtx.drawImage(canvas, 0, 0);
    
                // Agrega la marca de agua de la fecha y hora actual
                const timestamp = new Date().toLocaleString();
                tempCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                tempCtx.font = '17px Arial'; // Tamaño y fuente del texto de la marca de agua
                tempCtx.fillText("REPORTE "+ timestamp, 10, tempCanvas.height - 10); // Posición del texto de la marca de agua
    
                const link = document.createElement('a');
                let fecha_actual=optenerDate()
                link.download =fecha_actual+'-REPORTE.png';
                link.href = tempCanvas.toDataURL('image/png');
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            });
        });
        });
    
    
    //TABLA DE PRESTAMOS ACTUALES TAB(PRESTADOS)
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('exportarPDFBtn').addEventListener('click', () => {
            mostrarNotificacion("...")
            removeDarkModeClasses();
            setTimeout(() => {
            mostrarNotificacion("Tomando captura..")
            const reportesElement = document.getElementById('prestados-table');
            html2canvas(reportesElement, {
                backgroundColor: '#ffffff', 
                scale: 15, 
                logging: true,
                onrendered: function(canvas) {
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                tempCtx.fillStyle = '#ffffff';
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
                tempCtx.drawImage(canvas, 0, 0);
    
                const timestamp = new Date().toLocaleString();
                tempCtx.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
                tempCtx.font = '15px Arial'; 
                tempCtx.fillText('EQUIPOS PRESTADOS '+timestamp, 15, tempCanvas.height - 10);
    
                const link = document.createElement('a');
                let fecha_actual=optenerDate()
                link.download = fecha_actual+'-EQUIPOS-PRESTADOS-ACTUALMENTE.png';
                link.href = tempCanvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
    
                }
            });
            }, 2000); 
        });
     });
    
/*----------------------------------------------*
*          CAPTURA DE PANTALLA | CONTROL        *
*-----------------------------------------------*/


//--------------------------------------------------------------------------------------------------------------




/*----------------------------------------------*
*               EVENTOS-ACCIONES                *
*-----------------------------------------------*/

document.getElementById('search-input').addEventListener('keyup', () => {
  busquedaBasica('search-input', 'prestados-table');
  });
  

document.getElementById('search-input2').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !isSearching) {
        const query = document.getElementById('search-input2').value.toUpperCase();
        buscarTabla('entregados', query);
    }
});


document.getElementById('search-input3').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !isSearching) {
        const query = document.getElementById('search-input3').value.toUpperCase();
        buscarTabla('historial', query);
    }
});


  
  document.getElementById('search-input4').addEventListener('keyup', () => {
    busquedaBasica('search-input4', 'eventos-table');
  });
  
  document.getElementById('search-input6').addEventListener('keyup', () => {
    busquedaBasica('search-input6', 'personas-table');
  });
  
  
  
  document.getElementById('export-btn-historial').addEventListener('click', () => {
    document.getElementById('modal-confirmacion-xls').style.display = 'block';
  });
  
  document.getElementById('export-btn-historial-reporte').addEventListener('click', () => {
    document.getElementById('modal-confirmacion-xls').style.display = 'block';
  });
  
  
  document.getElementById('confirmar-exportacion').addEventListener('click', () => {
    const mesSeleccionado = document.getElementById('mes-seleccionado').value;
    const password = document.getElementById('password-exportacion').value;
    const correctPassword = 'Formacion';

    if (mesSeleccionado) {
        if (password === correctPassword) {
            exportTableToExcel_Historial(mesSeleccionado);
            document.getElementById('modal-confirmacion-xls').style.display = 'none';
        } else {
            mostrarNotificacion('Contraseña incorrecta. La exportación no se puede realizar.');
        }
    } else {
        mostrarNotificacion('Necesitas seleccionar una fecha "Mes"');
    }
});

function showModal() {
    document.getElementById('modal-confirmacion-xls').style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal-confirmacion-xls').style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == document.getElementById('modal-confirmacion-xls')) {
        document.getElementById('modal-confirmacion-xls').style.display = 'none';
    }
});
  
  
    
function mostrarModalBorrar(callback) {
  const modal = document.getElementById('modal-confirmacion-borrar');
  const confirmarBorrar = document.getElementById('confirmar-borrar');
  const cancelarBorrar = document.getElementById('cancelar-borrar');
  const passwordBorrar = document.getElementById('password-borrar');
  const correctPassword = 'Formacion';
  let failedAttempts = 0;
  const maxAttempts = 5;

  modal.style.display = 'flex';

  confirmarBorrar.addEventListener('click', () => {
      if (passwordBorrar.value === correctPassword) {
          modal.style.display = 'none';
          callback();
      } else {
          failedAttempts++;
          if (failedAttempts >= maxAttempts) {
              mostrarNotificacion('Demasiados intentos fallidos. Cerrando modal.');
              modal.style.display = 'none';
          } else {
              mostrarNotificacion('Contraseña incorrecta. La acción no se puede realizar.');
          }
      }
  });


}

document.getElementById('borrarEntregados').addEventListener('click', function () {
  mostrarModalBorrar(() => {
      deleteHistorial('entregados');
      setTimeout(() => {
          location.reload();
      }, 3000);
  });
});

document.getElementById('borrarHistorial').addEventListener('click', function () {
  mostrarModalBorrar(() => {
      deleteHistorial('historial');
      setTimeout(() => {
          location.reload();
      }, 3000);
  });
});

  
  
  const AbrirPrestamo= document.querySelector('.prestar')
  const fondo =document.getElementById('fondo');
  const formContainer = document.getElementById('prestamoFormContainer');
  const cancelFormBtn = document.getElementById('cancelFormBtn');
  
  AbrirPrestamo.addEventListener('click', function () {
    formContainer.style.display = 'block';
    fondo.style.display = 'block';
  });
  
  cancelFormBtn.addEventListener('click', function () {
    fondo.style.display = 'none';
    formContainer.style.display = 'none';
  });
  
  
  
  ///-----adicionales------RED--------------------------
  window.addEventListener('online', function () {
    mostrarNotificacion("¡Ya tienes conexión a internet!")
   });
   
   window.addEventListener('offline', function () {
    mostrarNotificacion("No tienes conexión a internet...")
   });
  ///-----adicionales------RED--------------------------
  

   function mostrarHora() {
    let hora = new Date();
    let minutos = hora.getMinutes();
    let segundos = hora.getSeconds();
    let horaActual = hora.getHours() + ":" + minutos + ":" + segundos;
    document.getElementById("hora").innerHTML = horaActual;
  }
  setInterval(mostrarHora, 1000);
  
document.getElementById('export-btn-JSON-DB').addEventListener('click', () => {
  exportDatabaseToJSON();
});

document.getElementById('copy-clave-secreta').addEventListener('click', () => {
  const claveSecreta = document.getElementById('clave-secreta-display').innerText;
  navigator.clipboard.writeText(claveSecreta).then(() => {
    mostrarNotificacion('Clave secreta copiada al portapapeles.');
  });
});

document.getElementById('import-file-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  document.getElementById('modal-seguridad').style.display = 'block';
  document.getElementById('btn-importar').addEventListener('click', () => {
      const secretKey = document.getElementById('clave-secreta').value;
      importDatabaseFromJSON(file, secretKey);
  });
});

  /*----------------------------------------------*
  *               EVENTOS-ACCIONES                *
  *-----------------------------------------------*/
