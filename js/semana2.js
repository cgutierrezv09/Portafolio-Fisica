   // ==================== SIMULACIÓN MOVIMIENTO 3D ====================
        const canvas3D = document.getElementById('canvas3D');
        const ctx3D = canvas3D.getContext('2d');
        const anguloSlider = document.getElementById('angulo3D');

        function resizeCanvas3D() {
            const container = canvas3D.parentElement;
            canvas3D.width = Math.min(container.clientWidth - 20, 400);
            canvas3D.height = canvas3D.width * 0.75;
        }
        resizeCanvas3D();
        window.addEventListener('resize', resizeCanvas3D);

        let tiempo3D = 0;

        function draw3D() {
            const angulo = parseFloat(anguloSlider.value) * Math.PI / 180;
            const v0 = 20;
            const g = 9.8;

            // Componentes iniciales
            const v0x = v0 * Math.cos(angulo);
            const v0z = v0 * Math.sin(angulo);
            const v0y = v0 * Math.cos(angulo) * 0.5; // Movimiento en Y

            // Limpiar
            ctx3D.fillStyle = '#f8f9fa';
            ctx3D.fillRect(0, 0, canvas3D.width, canvas3D.height);

            // Ejes
            const originX = canvas3D.width * 0.15;
            const originY = canvas3D.height * 0.75;

            // Eje X
            ctx3D.strokeStyle = '#e74c3c';
            ctx3D.lineWidth = 2;
            ctx3D.beginPath();
            ctx3D.moveTo(originX, originY);
            ctx3D.lineTo(originX + 80, originY);
            ctx3D.stroke();
            ctx3D.fillStyle = '#e74c3c';
            ctx3D.font = 'bold 12px Arial';
            ctx3D.fillText('X', originX + 90, originY);

            // Eje Z
            ctx3D.strokeStyle = '#3498db';
            ctx3D.beginPath();
            ctx3D.moveTo(originX, originY);
            ctx3D.lineTo(originX, originY - 80);
            ctx3D.stroke();
            ctx3D.fillStyle = '#3498db';
            ctx3D.fillText('Z', originX - 10, originY - 85);

            // Trayectoria
            ctx3D.strokeStyle = '#e74c3c';
            ctx3D.lineWidth = 2;
            ctx3D.beginPath();
            let primerPunto = true;

            const tTotal = (2 * v0z) / g;
            const steps = 50;
            for (let i = 0; i <= steps; i++) {
                const t = (i / steps) * tTotal;
                const x = v0x * t;
                const z = v0z * t - 0.5 * g * t * t;
                const y = v0y * t;

                // Proyección 2D (vista isométrica)
                const screenX = originX + x * 1.5 + y * 0.5;
                const screenY = originY - z * 1.5;

                if (primerPunto) {
                    ctx3D.moveTo(screenX, screenY);
                    primerPunto = false;
                } else {
                    ctx3D.lineTo(screenX, screenY);
                }
            }
            ctx3D.stroke();

            // Punto actual
            const tActual = (tiempo3D / 100) * tTotal;
            if (tActual <= tTotal) {
                const xActual = v0x * tActual;
                const zActual = v0z * tActual - 0.5 * g * tActual * tActual;
                const yActual = v0y * tActual;

                const screenXActual = originX + xActual * 1.5 + yActual * 0.5;
                const screenYActual = originY - zActual * 1.5;

                ctx3D.fillStyle = '#e74c3c';
                ctx3D.beginPath();
                ctx3D.arc(screenXActual, screenYActual, 6, 0, Math.PI * 2);
                ctx3D.fill();

                tiempo3D++;
                if (tActual >= tTotal) tiempo3D = 0;
            }

            // Información
            ctx3D.fillStyle = '#2c3e50';
            ctx3D.font = 'bold 11px Arial';
            ctx3D.fillText(`Ángulo: ${anguloSlider.value}°`, 10, 20);
            ctx3D.fillText(`v₀ = 20 m/s`, 10, 35);
        }

        function animate3D() {
            draw3D();
            requestAnimationFrame(animate3D);
        }

        anguloSlider.addEventListener('input', () => {
            document.querySelector('#mov3d-content .control-value').textContent = `θ = ${anguloSlider.value}°`;
            tiempo3D = 0;
        });

        animate3D();

        // ==================== SIMULACIÓN MCU ====================
        const canvasMCU = document.getElementById('canvasMCU');
        const ctxMCU = canvasMCU.getContext('2d');
        const rpmSlider = document.getElementById('rpmMCU');

        function resizeCanvasMCU() {
            const container = canvasMCU.parentElement;
            canvasMCU.width = Math.min(container.clientWidth - 20, 400);
            canvasMCU.height = canvasMCU.width;
        }
        resizeCanvasMCU();
        window.addEventListener('resize', resizeCanvasMCU);

        let angleMCU = 0;

        function drawMCU() {
            const rpm = parseFloat(rpmSlider.value);
            const f = rpm / 60; // Hz
            const T = 1 / f; // Período
            const omega = 2 * Math.PI * f; // rad/s

            ctxMCU.fillStyle = '#f8f9fa';
            ctxMCU.fillRect(0, 0, canvasMCU.width, canvasMCU.height);

            const centerX = canvasMCU.width / 2;
            const centerY = canvasMCU.height / 2;
            const radius = Math.min(canvasMCU.width, canvasMCU.height) / 3;

            // Círculo
            ctxMCU.strokeStyle = '#3498db';
            ctxMCU.lineWidth = 2;
            ctxMCU.setLineDash([5, 5]);
            ctxMCU.beginPath();
            ctxMCU.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctxMCU.stroke();
            ctxMCU.setLineDash([]);

            // Centro
            ctxMCU.fillStyle = '#3498db';
            ctxMCU.beginPath();
            ctxMCU.arc(centerX, centerY, 6, 0, Math.PI * 2);
            ctxMCU.fill();

            // Objeto
            const objX = centerX + radius * Math.cos(angleMCU);
            const objY = centerY + radius * Math.sin(angleMCU);

            ctxMCU.fillStyle = '#e74c3c';
            ctxMCU.beginPath();
            ctxMCU.arc(objX, objY, 8, 0, Math.PI * 2);
            ctxMCU.fill();

            // Radio
            ctxMCU.strokeStyle = '#2c3e50';
            ctxMCU.lineWidth = 1;
            ctxMCU.beginPath();
            ctxMCU.moveTo(centerX, centerY);
            ctxMCU.lineTo(objX, objY);
            ctxMCU.stroke();

            // Velocidad tangencial (flecha verde)
            const vScale = 30;
            const vX = -Math.sin(angleMCU) * vScale;
            const vY = Math.cos(angleMCU) * vScale;

            ctxMCU.strokeStyle = '#27ae60';
            ctxMCU.lineWidth = 2.5;
            ctxMCU.beginPath();
            ctxMCU.moveTo(objX, objY);
            ctxMCU.lineTo(objX + vX, objY + vY);
            ctxMCU.stroke();

            // Punta flecha
            const vAngle = Math.atan2(vY, vX);
            ctxMCU.fillStyle = '#27ae60';
            ctxMCU.beginPath();
            ctxMCU.moveTo(objX + vX, objY + vY);
            ctxMCU.lineTo(objX + vX - 6 * Math.cos(vAngle - Math.PI / 6), objY + vY - 6 * Math.sin(vAngle - Math.PI / 6));
            ctxMCU.lineTo(objX + vX - 6 * Math.cos(vAngle + Math.PI / 6), objY + vY - 6 * Math.sin(vAngle + Math.PI / 6));
            ctxMCU.fill();

            ctxMCU.fillStyle = '#27ae60';
            ctxMCU.font = 'bold 11px Arial';
            ctxMCU.fillText('v', objX + vX + 10, objY + vY);

            angleMCU += omega * 0.02;
            if (angleMCU > Math.PI * 2) angleMCU -= Math.PI * 2;

            // Actualizar displays
            document.querySelector('#mcu-content .control-value').textContent = `RPM = ${rpm}`;
            document.getElementById('mcuInfo').innerHTML = 
                `T = ${T.toFixed(2)} s | f = ${f.toFixed(2)} Hz | ω = ${omega.toFixed(2)} rad/s`;
        }

        function animateMCU() {
            drawMCU();
            requestAnimationFrame(animateMCU);
        }

        rpmSlider.addEventListener('input', () => {
            document.querySelector('#mcu-content .control-value').textContent = `RPM = ${rpmSlider.value}`;
        });

        animateMCU();