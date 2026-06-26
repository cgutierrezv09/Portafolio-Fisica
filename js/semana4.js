  // ==================== SIMULACIÓN TRABAJO ====================
        const canvasTrabajo = document.getElementById('canvasTrabajo');
        const ctxT = canvasTrabajo.getContext('2d');
        const anguloTrabajoSlider = document.getElementById('anguloTrabajo');

        function resizeCanvasTrabajo() {
            const container = canvasTrabajo.parentElement;
            canvasTrabajo.width = Math.min(container.clientWidth - 20, 400);
            canvasTrabajo.height = canvasTrabajo.width * 0.6;
        }
        resizeCanvasTrabajo();
        window.addEventListener('resize', resizeCanvasTrabajo);

        function drawTrabajo() {
            const angulo = parseFloat(anguloTrabajoSlider.value) * Math.PI / 180;
            const F = 50;
            const d = 8;
            const W = F * d * Math.cos(angulo);

            // Limpiar
            ctxT.fillStyle = '#f8f9fa';
            ctxT.fillRect(0, 0, canvasTrabajo.width, canvasTrabajo.height);

            // Piso
            const groundY = canvasTrabajo.height * 0.65;
            ctxT.fillStyle = '#34495e';
            ctxT.fillRect(0, groundY, canvasTrabajo.width, 15);

            // Patrón piso
            ctxT.strokeStyle = '#7f8c8d';
            ctxT.lineWidth = 1;
            for (let i = 0; i < canvasTrabajo.width; i += 12) {
                ctxT.beginPath();
                ctxT.moveTo(i, groundY);
                ctxT.lineTo(i + 4, groundY + 15);
                ctxT.stroke();
            }

            // Bloque
            const blockX = 50;
            const blockY = groundY - 35;
            const blockW = 50;
            const blockH = 35;

            ctxT.fillStyle = '#e74c3c';
            ctxT.fillRect(blockX, blockY, blockW, blockH);
            ctxT.strokeStyle = '#c0392b';
            ctxT.lineWidth = 2;
            ctxT.strokeRect(blockX, blockY, blockW, blockH);

            const blockCenterX = blockX + blockW / 2;
            const blockCenterY = blockY + blockH / 2;

            // Fuerza aplicada (azul)
            const forceLen = 80;
            const forceX = blockCenterX + forceLen * Math.cos(angulo);
            const forceY = blockCenterY - forceLen * Math.sin(angulo);

            ctxT.strokeStyle = '#3498db';
            ctxT.lineWidth = 3;
            ctxT.beginPath();
            ctxT.moveTo(blockCenterX, blockCenterY);
            ctxT.lineTo(forceX, forceY);
            ctxT.stroke();

            // Punta flecha F
            const angle = Math.atan2(forceY - blockCenterY, forceX - blockCenterX);
            ctxT.fillStyle = '#3498db';
            ctxT.beginPath();
            ctxT.moveTo(forceX, forceY);
            ctxT.lineTo(forceX - 6 * Math.cos(angle - Math.PI / 6), forceY - 6 * Math.sin(angle - Math.PI / 6));
            ctxT.lineTo(forceX - 6 * Math.cos(angle + Math.PI / 6), forceY - 6 * Math.sin(angle + Math.PI / 6));
            ctxT.fill();

            // Desplazamiento (verde punteado)
            ctxT.strokeStyle = '#27ae60';
            ctxT.lineWidth = 2;
            ctxT.setLineDash([5, 5]);
            ctxT.beginPath();
            ctxT.moveTo(blockX - 30, groundY + 25);
            ctxT.lineTo(blockX + blockW + 50, groundY + 25);
            ctxT.stroke();
            ctxT.setLineDash([]);

            // Punta flecha d
            ctxT.fillStyle = '#27ae60';
            ctxT.beginPath();
            ctxT.moveTo(blockX + blockW + 50, groundY + 25);
            ctxT.lineTo(blockX + blockW + 50 - 6, groundY + 25 - 4);
            ctxT.lineTo(blockX + blockW + 50 - 6, groundY + 25 + 4);
            ctxT.fill();

            // Ángulo arc
            if (anguloTrabajoSlider.value != 0) {
                ctxT.strokeStyle = '#9b59b6';
                ctxT.lineWidth = 1.5;
                ctxT.beginPath();
                const arcRadius = 30;
                ctxT.arc(blockCenterX, blockCenterY, arcRadius, -Math.PI / 2, -Math.PI / 2 + angulo, false);
                ctxT.stroke();

                ctxT.fillStyle = '#9b59b6';
                ctxT.font = 'bold 12px Arial';
                ctxT.fillText('θ', blockCenterX + 35, blockCenterY - 15);
            }

            // Etiquetas
            ctxT.fillStyle = '#2c3e50';
            ctxT.font = 'bold 11px Arial';
            ctxT.textAlign = 'center';
            ctxT.fillText('F', forceX + 15, forceY - 10);
            ctxT.fillText('d', blockX + blockW + 50, groundY + 45);

            // Información
            document.querySelector('#trabajo-content .control-value').textContent = `θ = ${anguloTrabajoSlider.value}°`;
            document.getElementById('trabajoInfo').innerHTML = 
                `F = 50 N | d = 8 m | W = ${W.toFixed(1)} J`;
        }

        function animateTrabajo() {
            drawTrabajo();
            requestAnimationFrame(animateTrabajo);
        }

        anguloTrabajoSlider.addEventListener('input', () => {
            document.querySelector('#trabajo-content .control-value').textContent = `θ = ${anguloTrabajoSlider.value}°`;
        });

        animateTrabajo();

        // ==================== SIMULACIÓN ENERGÍA ====================
        const canvasEnergia = document.getElementById('canvasEnergia');
        const ctxE = canvasEnergia.getContext('2d');
        const alturaSlider = document.getElementById('alturaInicial');

        function resizeCanvasEnergia() {
            const container = canvasEnergia.parentElement;
            canvasEnergia.width = Math.min(container.clientWidth - 20, 400);
            canvasEnergia.height = canvasEnergia.width * 0.75;
        }
        resizeCanvasEnergia();
        window.addEventListener('resize', resizeCanvasEnergia);

        let tiempoEnergia = 0;
        let posYBola = 0;

        function drawEnergia() {
            const hInicial = parseFloat(alturaSlider.value);
            const m = 2;
            const g = 9.8;
            const ETotal = m * g * hInicial;

            const groundY = canvasEnergia.height - 40;
            const topY = 40;
            const maxHeight = groundY - topY;

            // Limpiar
            ctxE.fillStyle = '#f8f9fa';
            ctxE.fillRect(0, 0, canvasEnergia.width, canvasEnergia.height);

            // Suelo
            ctxE.fillStyle = '#34495e';
            ctxE.fillRect(0, groundY, canvasEnergia.width, 40);

            // Línea de altura inicial
            ctxE.strokeStyle = '#7f8c8d';
            ctxE.lineWidth = 1;
            ctxE.setLineDash([3, 3]);
            ctxE.beginPath();
            ctxE.moveTo(0, topY);
            ctxE.lineTo(canvasEnergia.width, topY);
            ctxE.stroke();
            ctxE.setLineDash([]);

            // Caída libre
            const tCaida = Math.sqrt(2 * hInicial / g);
            tiempoEnergia += 0.02;
            let t = (tiempoEnergia / 30) * tCaida;

            if (t > tCaida) {
                tiempoEnergia = 0;
                t = 0;
            }

            const h = hInicial - 0.5 * g * t * t;
            const v = g * t;
            const U = m * g * h;
            const K = 0.5 * m * v * v;

            // Posición de la bola
            const bolaY = topY + (hInicial - h) / hInicial * maxHeight;
            const bolaX = canvasEnergia.width / 2;

            // Bola
            ctxE.fillStyle = '#e74c3c';
            ctxE.beginPath();
            ctxE.arc(bolaX, bolaY, 10, 0, Math.PI * 2);
            ctxE.fill();

            // Línea de altura actual
            ctxE.strokeStyle = '#2ecc71';
            ctxE.lineWidth = 1;
            ctxE.setLineDash([3, 3]);
            ctxE.beginPath();
            ctxE.moveTo(0, bolaY);
            ctxE.lineTo(canvasEnergia.width, bolaY);
            ctxE.stroke();
            ctxE.setLineDash([]);

            // Etiqueta altura
            ctxE.fillStyle = '#2c3e50';
            ctxE.font = 'bold 11px Arial';
            ctxE.fillText(`h = ${h.toFixed(2)} m`, 10, bolaY - 15);

            // Actualizar displays
            document.querySelector('#energia-content .control-value').textContent = `h = ${hInicial} m`;
            document.getElementById('energiaTotal').textContent = `${ETotal.toFixed(1)} J`;
            document.getElementById('energiaInfo').innerHTML = 
                `U = ${U.toFixed(1)} J | K = ${K.toFixed(1)} J | v = ${v.toFixed(2)} m/s`;

            // Barras de energía
            const porcentajeU = Math.max(0, U / ETotal);
            const porcentajeK = Math.max(0, K / ETotal);

            document.getElementById('barU').style.width = (porcentajeU * 100) + '%';
            document.getElementById('barK').style.width = (porcentajeK * 100) + '%';
            document.getElementById('barU').textContent = `U = ${U.toFixed(0)} J`;
            document.getElementById('barK').textContent = `K = ${K.toFixed(0)} J`;
        }

        function animateEnergia() {
            drawEnergia();
            requestAnimationFrame(animateEnergia);
        }

        alturaSlider.addEventListener('input', () => {
            document.querySelector('#energia-content .control-value').textContent = `h = ${alturaSlider.value} m`;
            tiempoEnergia = 0;
        });

        animateEnergia();