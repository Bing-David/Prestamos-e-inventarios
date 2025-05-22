// "use strict";

// // Variables
// const startBtn = document.getElementById('startBtn');
// const welcomeModal = document.getElementById('welcomeModal');
// const endModal = document.getElementById('endModal');
// const floatingCounter = document.getElementById('floatingCounter');
// const timeRemainingEl = document.getElementById('timeRemaining');
// const cancelBtn = document.getElementById('cancelBtn');

// let timeRemaining = 30 * 60;  //para pruebas
// let countdownInterval;

// function startCountdown() {
//     countdownInterval = setInterval(() => {
//         timeRemaining--;

//         let minutes = Math.floor(timeRemaining / 60);
//         let seconds = timeRemaining % 60;
//         timeRemainingEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

//         if (timeRemaining === 1) {
//             deleteHistorial('entregados');
//             deleteHistorial('historial');
//             const test_end = document.querySelector('.tab-button[data-tab="prestados"]');
//             test_end.click();
//         }



//         if (timeRemaining <= 0) {
//             clearInterval(countdownInterval);
//             mostrarNotificacion("!Periodo de prueba finalizado!")
//             floatingCounter.style.backgroundColor = 'red';

//             countdownInterval = setInterval(() => {
            
//             const salir_x= document.getElementById("closeBtn")
//             salir_x.click();
//             },5000);
//         }

//     }, 1000);
// }

// // Eventos
// startBtn.addEventListener('click', () => {
//     welcomeModal.style.display = 'none';
//     floatingCounter.style.display = 'block';
//     startCountdown();
// });

// document.addEventListener('DOMContentLoaded', function() {
//     welcomeModal.style.display = 'flex';
// });
