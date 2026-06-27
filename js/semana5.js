   // ==================== SIMULACIÓN IMPULSO ====================
        const canvasImpulso = document.getElementById('canvasImpulso');
        const ctxI = canvasImpulso.getContext('2d');
        const fuerzaSlider = document.getElementById('fuerzaImpulso');

        function resizeCanvasImpulso() {
            const container = canvasImpulso.parentElement;
            canvasImpulso.width = Math.min(container.clientWidth - 20, 400);
            canvasImpulso.height = canvasImpulso.width * 0.6;
        }
        resizeCanvasImpulso();
        window.addEventListener('resize', resizeCanvasImpulso);

        let tiempoImpulso = 0;

        function drawImpulso() {
            const F = parseFloat(fuerzaSlider.value);
            const m = 0.5;

            tiempoImpulso += 0.02;
            const t = tiempoImpulso;
            const J = F * t;
            const v = J / m;
            const p = m * v;

            // Limpiar
            ctxI.fillStyle = '#f8f9fa';
            ctxI.fillRect(0, 0, canvasImpulso.width, canvasImpulso.height);

            // Suelo
            const groundY = canvasImpulso.height * 0.65;
            ctxI.fillStyle = '#34495e';
            ctxI.fillRect(0, groundY, canvasImpulso.width, 15);

            // Patrón suelo
            ctxI.strokeStyle = '#7f8c8d';
            ctxI.lineWidth = 1;
            for (let i = 0; i < canvasImpulso.width; i += 12) {
                ctxI.beginPath();
                ctxI.moveTo(i, groundY);
                ctxI.lineTo(i + 4, groundY + 15);
                ctxI.stroke();
            }

            // Objeto
            const objX = 50 + Math.min(v * 2, canvasImpulso.width - 120);
            const objY = groundY - 35;
            const objW = 40;
            const objH = 35;

            ctxI.fillStyle = '#e74c3c';
            ctxI.fillRect(objX, objY, objW, objH);
            ctxI.strokeStyle = '#c0392b';
            ctxI.lineWidth = 2;
            ctxI.strokeRect(objX, objY, objW, objH);

            const objCenterX = objX + objW / 2;
            const objCenterY = objY + objH / 2;

            // Fuerza (azul)
            const forceLen = Math.min(F / 2, 80);
            ctxI.strokeStyle = '#3498db';
            ctxI.lineWidth = 3;
            ctxI.beginPath();
            ctxI.moveTo(objX - 5, objCenterY);
            ctxI.lineTo(objX - 5 - forceLen, objCenterY);
            ctxI.stroke();

            // Punta flecha F
            ctxI.fillStyle = '#3498db';
            ctxI.beginPath();
            ctxI.moveTo(objX - 5 - forceLen, objCenterY);
            ctxI.lineTo(objX - 5 - forceLen + 6, objCenterY - 4);
            ctxI.lineTo(objX - 5 - forceLen + 6, objCenterY + 4);
            ctxI.fill();

            // Velocidad (verde)
            const velLen = Math.min(v * 1.5, 100);
            ctxI.strokeStyle = '#27ae60';
            ctxI.lineWidth = 2.5;
            ctxI.beginPath();
            ctxI.moveTo(objX + objW + 5, objCenterY);
            ctxI.lineTo(objX + objW + 5 + velLen, objCenterY);
            ctxI.stroke();

            // Punta flecha v
            ctxI.fillStyle = '#27ae60';
            ctxI.beginPath();
            ctxI.moveTo(objX + objW + 5 + velLen, objCenterY);
            ctxI.lineTo(objX + objW + 5 + velLen - 6, objCenterY - 4);
            ctxI.lineTo(objX + objW + 5 + velLen - 6, objCenterY + 4);
            ctxI.fill();

            // Información
            document.getElementById('fuerzaValue').textContent = `F = ${F} N`;
            document.getElementById('impulsoInfo').innerHTML = 
                `J = ${J.toFixed(1)} N·s | p = ${p.toFixed(2)} kg·m/s | v = ${v.toFixed(2)} m/s`;

            // Reset
            if (tiempoImpulso > 3) tiempoImpulso = 0;
        }

        function animateImpulso() {
            drawImpulso();
            requestAnimationFrame(animateImpulso);
        }

        fuerzaSlider.addEventListener('input', () => {
            document.getElementById('fuerzaValue').textContent = `F = ${fuerzaSlider.value} N`;
            tiempoImpulso = 0;
        });

        animateImpulso();

        // ==================== SIMULACIÓN COLISIONES ====================
        const canvasColisiones = document.getElementById('canvasColisiones');
        const ctxC = canvasColisiones.getContext('2d');
        const v1Slider = document.getElementById('v1Colision');
        const v2Slider = document.getElementById('v2Colision');

        function resizeCanvasColisiones() {
            const container = canvasColisiones.parentElement;
            canvasColisiones.width = Math.min(container.clientWidth - 20, 400);
            canvasColisiones.height = canvasColisiones.width * 0.6;
        }
        resizeCanvasColisiones();
        window.addEventListener('resize', resizeCanvasColisiones);

        let tiempoColision = 0;

        function drawColisiones() {
            const v1 = parseFloat(v1Slider.value);
            const v2 = parseFloat(v2Slider.value);
            const m1 = 1000;
            const m2 = 1500;

            tiempoColision += 0.01;

            // Limpiar
            ctxC.fillStyle = '#f8f9fa';
            ctxC.fillRect(0, 0, canvasColisiones.width, canvasColisiones.height);

            // Suelo
            const groundY = canvasColisiones.height * 0.65;
            ctxC.fillStyle = '#34495e';
            ctxC.fillRect(0, groundY, canvasColisiones.width, 15);

            // Fase de colisión
            const collisionTime = 1;
            const phase = (tiempoColision % 4);

            let obj1X, obj2X, obj1V, obj2V, combined = false;

            if (phase < collisionTime) {
                // Antes de colisión
                obj1X = 40;
                obj2X = canvasColisiones.width - 90;
                obj1V = v1;
                obj2V = v2;
            } else if (phase < collisionTime + 0.5) {
                // Colisionando
                obj1X = 40 + v1 * (phase - collisionTime) * 30;
                obj2X = canvasColisiones.width - 90 + v2 * (phase - collisionTime) * 30;
                obj1V = 0;
                obj2V = 0;
                combined = true;
            } else {
                // Después de colisión
                const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
                const postCollisionTime = phase - collisionTime - 0.5;
                const combinedX = (40 + canvasColisiones.width - 90) / 2 + vf * postCollisionTime * 30;
                obj1X = combinedX;
                obj2X = combinedX;
                obj1V = vf;
                obj2V = 0;
                combined = true;
            }

            const objH = 30;

            if (!combined) {
                // Objeto 1 (rojo)
                const obj1Y = groundY - objH;
                ctxC.fillStyle = '#e74c3c';
                ctxC.fillRect(obj1X, obj1Y, 40, objH);
                ctxC.strokeStyle = '#c0392b';
                ctxC.lineWidth = 2;
                ctxC.strokeRect(obj1X, obj1Y, 40, objH);

                ctxC.fillStyle = 'white';
                ctxC.font = 'bold 10px Arial';
                ctxC.textAlign = 'center';
                ctxC.fillText('m1', obj1X + 20, obj1Y + 18);

                // Objeto 2 (azul)
                const obj2Y = groundY - objH;
                ctxC.fillStyle = '#3498db';
                ctxC.fillRect(obj2X, obj2Y, 40, objH);
                ctxC.strokeStyle = '#2980b9';
                ctxC.lineWidth = 2;
                ctxC.strokeRect(obj2X, obj2Y, 40, objH);

                ctxC.fillStyle = 'white';
                ctxC.fillText('m2', obj2X + 20, obj2Y + 18);

                // Velocidades
                ctxC.fillStyle = '#2c3e50';
                ctxC.font = 'bold 9px Arial';
                ctxC.fillText(`v1=${v1}`, obj1X + 20, obj1Y - 5);
                ctxC.fillText(`v2=${v2}`, obj2X + 20, obj2Y - 5);
            } else {
                // Objeto combinado (verde)
                const objY = groundY - objH;
                ctxC.fillStyle = '#27ae60';
                ctxC.fillRect(obj1X, objY, 80, objH);
                ctxC.strokeStyle = '#229954';
                ctxC.lineWidth = 2;
                ctxC.strokeRect(obj1X, objY, 80, objH);

                ctxC.fillStyle = 'white';
                ctxC.font = 'bold 10px Arial';
                ctxC.textAlign = 'center';
                ctxC.fillText('m1+m2', obj1X + 40, objY + 18);

                const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
                ctxC.fillStyle = '#2c3e50';
                ctxC.font = 'bold 9px Arial';
                ctxC.fillText(`vf=${vf.toFixed(1)}`, obj1X + 40, objY - 5);
            }

            // Información
            document.getElementById('v1Value').textContent = `v1 = ${v1} m/s`;
            document.getElementById('v2Value').textContent = `v2 = ${v2} m/s`;

            const pAntes = m1 * v1 + m2 * v2;
            const vf = pAntes / (m1 + m2);
            const KAntes = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
            const KDespues = 0.5 * (m1 + m2) * vf * vf;
            const deltaK = Math.abs(KAntes - KDespues);

            document.getElementById('colisionInfo').innerHTML = 
                `p_antes = ${pAntes.toFixed(0)} kg·m/s | vf = ${vf.toFixed(2)} m/s | ΔK = ${deltaK.toFixed(0)} J`;
        }

        function animateColisiones() {
            drawColisiones();
            requestAnimationFrame(animateColisiones);
        }

        v1Slider.addEventListener('input', () => {
            document.getElementById('v1Value').textContent = `v1 = ${v1Slider.value} m/s`;
            tiempoColision = 0;
        });

        v2Slider.addEventListener('input', () => {
            document.getElementById('v2Value').textContent = `v2 = ${v2Slider.value} m/s`;
            tiempoColision = 0;
        });

        animateColisiones();