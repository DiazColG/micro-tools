document.addEventListener('DOMContentLoaded', async function() {
    
    // --- OBTENER ELEMENTOS DEL DOM ---
    const valorUVAInput = document.getElementById('valorUVA');
    const tipoCambioInput = document.getElementById('tipoCambio');
    const btnCalcular = document.getElementById('btnCalcular');
    const resultadoDiv = document.getElementById('resultado');

    // --- FUNCIÓN PARA CARGAR COTIZACIONES DESDE NUESTRO SERVIDOR ---
    async function cargarCotizaciones() {
        try {
            // Llama al endpoint /api/cotizaciones de nuestro propio servidor
            const response = await fetch('/api/cotizaciones');
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.statusText}`);
            }
            const data = await response.json();
            
            // Rellena los campos con los datos obtenidos en tiempo real
            if (data.valorUVASugerido && data.tipoCambioSugerido) {
                tipoCambioInput.value = data.tipoCambioSugerido.toFixed(2);
                valorUVAInput.value = data.valorUVASugerido.toFixed(2);
            }
        } catch (error) {
            console.error('No se pudieron cargar las cotizaciones:', error);
            // Si el servidor falla, se usan valores fijos como respaldo para que la app no se rompa
            tipoCambioInput.value = '1305.50';
            valorUVAInput.value = '1528.41';
            alert('No se pudieron obtener las cotizaciones actualizadas. Se usarán valores de respaldo.');
        }
    }

    // --- EJECUCIÓN INICIAL ---
    await cargarCotizaciones();
    
    btnCalcular.addEventListener('click', calcularCredito);

    // La función de cálculo no cambia, ya que lee los valores de los inputs.
    function calcularCredito() {
        const tipoCambio = parseFloat(tipoCambioInput.value);
        const valorUVA = parseFloat(valorUVAInput.value);
        const montoPropiedadUSD = parseFloat(document.getElementById('montoPropiedad').value);
        const sueldoNetoARS = parseFloat(document.getElementById('sueldoNeto').value);
        const tasaInteresAnual = parseFloat(document.getElementById('tasaInteres').value) / 100;
        const porcentajeFinanciacion = parseFloat(document.getElementById('porcentajeFinanciacion').value);
        const limiteSueldo = parseFloat(document.getElementById('limiteSueldo').value);
        const plazoEnMeses = parseInt(document.getElementById('plazo').value);
        const gastoInmobiliaria = parseFloat(document.getElementById('gastoInmobiliaria').value) / 100;
        const gastoEscribania = parseFloat(document.getElementById('gastoEscribania').value) / 100;
        
        if (isNaN(tipoCambio) || isNaN(montoPropiedadUSD) || isNaN(sueldoNetoARS)) {
            resultadoDiv.innerHTML = `<div class="veredicto rechazado">Por favor, completá todos los campos principales.</div>`;
            return;
        }

        const montoPropiedadARS = montoPropiedadUSD * tipoCambio;
        const montoCreditoARS = montoPropiedadARS * porcentajeFinanciacion;
        const tasaInteresMensual = tasaInteresAnual / 12;
        let cuotaCalculadaARS;
        if (tasaInteresMensual > 0) {
            const numerador = tasaInteresMensual * Math.pow(1 + tasaInteresMensual, plazoEnMeses);
            const denominador = Math.pow(1 + tasaInteresMensual, plazoEnMeses) - 1;
            cuotaCalculadaARS = montoCreditoARS * (numerador / denominador);
        } else {
            cuotaCalculadaARS = montoCreditoARS / plazoEnMeses;
        }
        
        const cuotaMaximaSueldoARS = sueldoNetoARS * limiteSueldo;
        const anticipoUSD = montoPropiedadUSD * (1 - porcentajeFinanciacion);
        const costoInmobiliariaUSD = montoPropiedadUSD * gastoInmobiliaria;
        const costoEscribaniaUSD = montoPropiedadUSD * gastoEscribania;
        const ahorroTotalUSD = anticipoUSD + costoInmobiliariaUSD + costoEscribaniaUSD;
        
        const formatoARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
        const formatoUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        let htmlResultado = '';

        if (cuotaCalculadaARS <= cuotaMaximaSueldoARS) {
            htmlResultado += `<div class="veredicto aprobado">✅ ¡EXCELENTE! Con estos datos, tu ingreso es suficiente para calificar.</div>`;
        } else {
            htmlResultado += `<div class="veredicto rechazado">❌ Con estos datos, tu ingreso NO es suficiente para calificar.</div>`;
        }
        
        htmlResultado += `
            <h3 class="resultado-titulo">Resultado de tu Simulación</h3>
            <div class="resultado-linea"><span>Cuota mensual FIJA en Pesos:</span><span class="cuota-principal">${formatoARS.format(cuotaCalculadaARS)}</span></div>
            <div class="resultado-linea"><span>Equivalente en USD (según tu TC):</span><span>${formatoUSD.format(cuotaCalculadaARS / tipoCambio)}</span></div>
            <div class="resultado-linea"><span>Equivalente en UVAs (de referencia):</span><span>${(cuotaCalculadaARS / valorUVA).toFixed(2)} UVAs</span></div>
            <div class="resultado-linea"><span>Tu sueldo te permite una cuota de hasta:</span><span>${formatoARS.format(cuotaMaximaSueldoARS)}</span></div>
        `;

        htmlResultado += `
            <h3 class="resultado-titulo" style="margin-top: 25px;">Ahorros Iniciales que Necesitás</h3>
            <div class="resultado-linea"><span>Anticipo:</span><span>${formatoUSD.format(anticipoUSD)}</span></div>
            <div class="resultado-linea"><span>Comisión Inmobiliaria:</span><span>${formatoUSD.format(costoInmobiliariaUSD)}</span></div>
            <div class="resultado-linea"><span>Gastos de Escribanía:</span><span>${formatoUSD.format(costoEscribaniaUSD)}</span></div>
            <div class="resultado-linea" style="background-color: #f0f8ff; font-size: 1.1rem;"><span><strong>TOTAL AHORROS (en efectivo):</strong></span><span><strong>${formatoUSD.format(ahorroTotalUSD)}</strong></span></div>
        `;
        
        resultadoDiv.innerHTML = htmlResultado;
    }
});