 
        // ==================== SIMULACIÓN FUERZA CENTRÍPETA ====================
        const canvasCentripeta = document.getElementById('canvasCentripeta');
        const ctxC = canvasCentripeta.getContext('2d');
        const velocidadSlider = document.getElementById('velocidadCentripeta');

        function resizeCanvasCentripeta() {
            const container = canvasCentripeta.parentElement;
            canvasCentripeta.width = Math.min(container.clientWidth - 20, 400);
            canvasCentripeta.height = canvasCentripeta.width;
        }
        resizeCanvasCentripeta();
        window.addEventListener('resize', resizeCanvasCentripeta);

        let angleCentripeta = 0;

        function drawCentripeta() {
            const omega = parseFloat(velocidadSlider.value);
            
            ctxC.fillStyle = '#f8f9fa';
            ctxC.fillRect(0, 0, canvasCentripeta.width, canvasCentripeta.height);

            const centerX = canvasCentripeta.width / 2;
            const centerY = canvasCentripeta.height / 2;
            const radius = Math.min(canvasCentripeta.width, canvasCentripeta.height) / 3;

            // Círculo de trayectoria
            ctxC.strokeStyle = '#3498db';
            ctxC.lineWidth = 2;
            ctxC.setLineDash([5, 5]);
            ctxC.beginPath();
            ctxC.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctxC.stroke();
            ctxC.setLineDash([]);

            // Centro
            ctxC.fillStyle = '#3498db';
            ctxC.beginPath();
            ctxC.arc(centerX, centerY, 6, 0, Math.PI * 2);
            ctxC.fill();

            // Posición del objeto
            const objX = centerX + radius * Math.cos(angleCentripeta);
            const objY = centerY + radius * Math.sin(angleCentripeta);

            // Objeto
            ctxC.fillStyle = '#e74c3c';
            ctxC.beginPath();
            ctxC.arc(objX, objY, 8, 0, Math.PI * 2);
            ctxC.fill();

            // Radio
            ctxC.strokeStyle = '#2c3e50';
            ctxC.lineWidth = 1;
            ctxC.beginPath();
            ctxC.moveTo(centerX, centerY);
            ctxC.lineTo(objX, objY);
            ctxC.stroke();

            // Fuerza centrípeta
            const forceMagnitude = Math.min(20 + omega * 5, radius * 0.4);
            const dirX = -Math.cos(angleCentripeta);
            const dirY = -Math.sin(angleCentripeta);
            const arrowX = objX + dirX * forceMagnitude;
            const arrowY = objY + dirY * forceMagnitude;

            ctxC.strokeStyle = '#f39c12';
            ctxC.lineWidth = 3;
            ctxC.beginPath();
            ctxC.moveTo(objX, objY);
            ctxC.lineTo(arrowX, arrowY);
            ctxC.stroke();

            // Punta de flecha
            const arrowSize = 6;
            const arrowAngle = Math.atan2(arrowY - objY, arrowX - objX);
            ctxC.fillStyle = '#f39c12';
            ctxC.beginPath();
            ctxC.moveTo(arrowX, arrowY);
            ctxC.lineTo(arrowX - arrowSize * Math.cos(arrowAngle - Math.PI / 6), arrowY - arrowSize * Math.sin(arrowAngle - Math.PI / 6));
            ctxC.lineTo(arrowX - arrowSize * Math.cos(arrowAngle + Math.PI / 6), arrowY - arrowSize * Math.sin(arrowAngle + Math.PI / 6));
            ctxC.fill();

            angleCentripeta += omega * 0.02;
            if (angleCentripeta > Math.PI * 2) angleCentripeta -= Math.PI * 2;

            // Actualizar display
            document.querySelector('#fc-content .control-value').textContent = `ω = ${omega} rad/s`;
        }

        function animateCentripeta() {
            drawCentripeta();
            requestAnimationFrame(animateCentripeta);
        }

        velocidadSlider.addEventListener('input', () => {
            document.querySelector('#fc-content .control-value').textContent = `ω = ${velocidadSlider.value} rad/s`;
        });

        animateCentripeta();

        // ==================== SIMULACIÓN FRICCIÓN ====================
        const canvasFriccion = document.getElementById('canvasFriccion');
        const ctxF = canvasFriccion.getContext('2d');
        const fuerzaSlider = document.getElementById('fuerzaAplicada');
        const statusMessage = document.getElementById('statusMessage');

        function resizeCanvasFriccion() {
            const container = canvasFriccion.parentElement;
            canvasFriccion.width = Math.min(container.clientWidth - 20, 400);
            canvasFriccion.height = canvasFriccion.width * 0.6;
        }
        resizeCanvasFriccion();
        window.addEventListener('resize', resizeCanvasFriccion);

        let posFriccion = 0;
        let velFriccion = 0;
        let enMovimiento = false;

        function drawFriccion() {
            const fuerzaAplicada = parseFloat(fuerzaSlider.value);
            const masa = 5;
            const g = 9.8;
            const muE = 0.5;
            const muC = 0.3;
            const N = masa * g;
            const friccionEMax = muE * N;
            const friccionC = muC * N;

            if (fuerzaAplicada > friccionEMax) {
                enMovimiento = true;
            } else if (fuerzaAplicada < friccionC) {
                enMovimiento = false;
                velFriccion = 0;
            }

            const friccionActual = enMovimiento ? friccionC : Math.min(fuerzaAplicada, friccionEMax);

            if (enMovimiento) {
                const aceleracion = (fuerzaAplicada - friccionC) / masa;
                velFriccion += aceleracion * 0.01;
                posFriccion += velFriccion * 0.01;
                if (posFriccion > canvasFriccion.width - 150) {
                    posFriccion = canvasFriccion.width - 150;
                    velFriccion = 0;
                }
            } else {
                velFriccion = 0;
            }

            // Limpiar
            ctxF.fillStyle = '#f8f9fa';
            ctxF.fillRect(0, 0, canvasFriccion.width, canvasFriccion.height);

            // Superficie
            const groundY = canvasFriccion.height * 0.65;
            ctxF.fillStyle = '#34495e';
            ctxF.fillRect(0, groundY, canvasFriccion.width, 15);

            // Patrón superficie
            ctxF.strokeStyle = '#7f8c8d';
            ctxF.lineWidth = 1;
            for (let i = 0; i < canvasFriccion.width; i += 12) {
                ctxF.beginPath();
                ctxF.moveTo(i, groundY);
                ctxF.lineTo(i + 4, groundY + 15);
                ctxF.stroke();
            }

            // Bloque
            const blockX = 60 + posFriccion;
            const blockY = groundY - 35;
            const blockW = 50;
            const blockH = 35;

            ctxF.fillStyle = enMovimiento ? '#f1c40f' : '#e74c3c';
            ctxF.fillRect(blockX, blockY, blockW, blockH);
            ctxF.strokeStyle = '#c0392b';
            ctxF.lineWidth = 2;
            ctxF.strokeRect(blockX, blockY, blockW, blockH);

            const blockCenterX = blockX + blockW / 2;
            const blockCenterY = blockY + blockH / 2;

            // Fuerza aplicada (azul)
            const arrowLenF = Math.min(fuerzaAplicada * 0.4, 60);
            ctxF.strokeStyle = '#3498db';
            ctxF.lineWidth = 2.5;
            ctxF.beginPath();
            ctxF.moveTo(blockCenterX + blockW / 2, blockCenterY);
            ctxF.lineTo(blockCenterX + blockW / 2 + arrowLenF, blockCenterY);
            ctxF.stroke();

            // Punta flecha F
            ctxF.fillStyle = '#3498db';
            ctxF.beginPath();
            ctxF.moveTo(blockCenterX + blockW / 2 + arrowLenF, blockCenterY);
            ctxF.lineTo(blockCenterX + blockW / 2 + arrowLenF - 6, blockCenterY - 4);
            ctxF.lineTo(blockCenterX + blockW / 2 + arrowLenF - 6, blockCenterY + 4);
            ctxF.fill();

            // Fricción (naranja)
            const arrowLenFric = Math.min(friccionActual * 0.4, 60);
            ctxF.strokeStyle = '#e67e22';
            ctxF.lineWidth = 2.5;
            ctxF.beginPath();
            ctxF.moveTo(blockCenterX - blockW / 2, blockCenterY);
            ctxF.lineTo(blockCenterX - blockW / 2 - arrowLenFric, blockCenterY);
            ctxF.stroke();

            // Punta flecha f
            ctxF.fillStyle = '#e67e22';
            ctxF.beginPath();
            ctxF.moveTo(blockCenterX - blockW / 2 - arrowLenFric, blockCenterY);
            ctxF.lineTo(blockCenterX - blockW / 2 - arrowLenFric + 6, blockCenterY - 4);
            ctxF.lineTo(blockCenterX - blockW / 2 - arrowLenFric + 6, blockCenterY + 4);
            ctxF.fill();

            // Actualizar status
            if (enMovimiento) {
                statusMessage.className = 'status-message';
                statusMessage.style.backgroundColor = '#fff3cd';
                statusMessage.style.color = '#856404';
                statusMessage.textContent = 'Bloque en movimiento (fricción cinética)';
            } else {
                statusMessage.className = 'status-message';
                statusMessage.style.backgroundColor = '#d4edda';
                statusMessage.style.color = '#155724';
                statusMessage.textContent = 'Bloque en reposo (fricción estática)';
            }

            // Actualizar valor
            document.querySelector('#ff-content .control-value').textContent = `F = ${fuerzaAplicada} N`;
        }

        function animateFriccion() {
            drawFriccion();
            requestAnimationFrame(animateFriccion);
        }

        fuerzaSlider.addEventListener('input', () => {
            document.querySelector('#ff-content .control-value').textContent = `F = ${fuerzaSlider.value} N`;
        });

        animateFriccion();
  