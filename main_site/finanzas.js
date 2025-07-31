// Lógica para las 10 mini-herramientas de finanzas personales

document.addEventListener('DOMContentLoaded', () => {
  // Lector de Gastos
  document.getElementById('tool-lector-gastos').addEventListener('click', e => {
    e.preventDefault();
    showModal('Lector de Gastos', lectorGastosHTML(), null, true);
  });
// --- Lector de Gastos ---
function lectorGastosHTML() {
  return `<iframe src="Lector de gastos/index.html" style="width:100vw;height:100vh;min-height:400px;min-width:320px;border:none;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.1);background:#fff;" allowfullscreen></iframe>`;
}
  // Crédito Hipotecario
  document.getElementById('tool-hipotecario').addEventListener('click', e => {
    e.preventDefault();
    showModal('Simulador de Crédito Hipotecario', hipotecarioHTML(), hipotecarioLogic);
  });
  // Descuento
  document.getElementById('tool-descuento').addEventListener('click', e => {
    e.preventDefault();
    showModal('Calculadora de descuento', descuentoHTML(), descuentoLogic);
  });
  // Cuotas
  document.getElementById('tool-cuotas').addEventListener('click', e => {
    e.preventDefault();
    showModal('Calculadora de cuotas', cuotasHTML(), cuotasLogic);
  });
  // Impuestos
  document.getElementById('tool-impuestos').addEventListener('click', e => {
    e.preventDefault();
    showModal('Calculadora de impuestos', impuestosHTML(), impuestosLogic);
  });
  // Porcentaje
  document.getElementById('tool-porcentaje').addEventListener('click', e => {
    e.preventDefault();
    showModal('Calculadora de porcentaje', porcentajeHTML(), porcentajeLogic);
  });
  // Gastos mensuales
  document.getElementById('tool-gastos').addEventListener('click', e => {
    e.preventDefault();
    showModal('Calculadora de gastos mensuales', gastosMensualesHTML(), calcularGastosMensuales);
  });
  // Ahorro objetivo
  document.getElementById('tool-ahorro').addEventListener('click', e => {
    e.preventDefault();
    showModal('Calculadora de ahorro objetivo', ahorroObjetivoHTML(), calcularAhorroObjetivo);
  });
  // Divisor de cuentas
  document.getElementById('tool-split').addEventListener('click', e => {
    e.preventDefault();
    showModal('Divisor de cuentas', splitBillHTML(), calcularSplitBill);
  });
  // Conversor de monedas
  document.getElementById('tool-monedas').addEventListener('click', e => {
    e.preventDefault();
    showModal('Conversor de monedas', conversorMonedasHTML(), conversorMonedasLogic);
  });
  // Pequeños gastos
  document.getElementById('tool-pequenos').addEventListener('click', e => {
    e.preventDefault();
    showModal('Calculadora de pequeños gastos', pequenosGastosHTML(), pequenosGastosLogic);
  });
  // Propina
  document.getElementById('tool-propina').addEventListener('click', e => {
    e.preventDefault();
    showModal('Calculadora de propinas', propinaHTML(), propinaLogic);
  });
// --- Conversor de monedas ---
function conversorMonedasHTML() {
  return `<form id="monedas-form">
    <label>Monto: <input type="number" min="0.01" step="any" name="monto" required></label><br>
    <label>De: <select name="de">
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="ARS">ARS</option>
      <option value="BRL">BRL</option>
    </select></label>
    <label>A: <select name="a">
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="ARS">ARS</option>
      <option value="BRL">BRL</option>
    </select></label><br>
    <button type="submit">Convertir</button>
  </form>
  <div id="monedas-resultado"></div>
  <div style="font-size:0.9em;color:#888;margin-top:0.5em;">* Tasas simuladas, no reales.</div>`;
}
function conversorMonedasLogic() {
  const tasas = {
    USD: { USD: 1, EUR: 0.9, ARS: 900, BRL: 5 },
    EUR: { USD: 1.1, EUR: 1, ARS: 1000, BRL: 5.5 },
    ARS: { USD: 0.0011, EUR: 0.001, ARS: 1, BRL: 0.0055 },
    BRL: { USD: 0.2, EUR: 0.18, ARS: 180, BRL: 1 }
  };
  document.getElementById('monedas-form').onsubmit = function(e) {
    e.preventDefault();
    const monto = parseFloat(this.monto.value);
    const de = this.de.value;
    const a = this.a.value;
    const tasa = tasas[de][a];
    const resultado = monto * tasa;
    document.getElementById('monedas-resultado').innerHTML = `${monto} ${de} = <strong>${resultado.toFixed(2)} ${a}</strong>`;
  };
}

// --- Pequeños gastos ---
function pequenosGastosHTML() {
  return `<form id="pequenos-form">
    <label>Descripción: <input type="text" name="desc" placeholder="Ej: café" required></label><br>
    <label>Monto: <input type="number" min="0.01" step="any" name="monto" required></label><br>
    <button type="button" id="agregar-gasto">Agregar gasto</button>
  </form>
  <ul id="pequenos-lista"></ul>
  <div id="pequenos-resultado"></div>`;
}
let pequenosGastosArr = [];
function pequenosGastosLogic() {
  let gastos = [];
  const lista = document.getElementById('pequenos-lista');
  const resultado = document.getElementById('pequenos-resultado');
  document.getElementById('agregar-gasto').onclick = function() {
    const form = document.getElementById('pequenos-form');
    const desc = form.desc.value.trim();
    const monto = parseFloat(form.monto.value);
    if (!desc || isNaN(monto)) return;
    gastos.push({ desc, monto });
    form.desc.value = '';
    form.monto.value = '';
    renderLista();
  };
  function renderLista() {
    lista.innerHTML = '';
    let total = 0;
    gastos.forEach((g, i) => {
      total += g.monto;
      const li = document.createElement('li');
      li.innerText = `${g.desc}: $${g.monto.toFixed(2)}`;
      const btn = document.createElement('button');
      btn.innerText = '✖';
      btn.style.marginLeft = '0.5em';
      btn.onclick = () => { gastos.splice(i,1); renderLista(); };
      li.appendChild(btn);
      lista.appendChild(li);
    });
    if (gastos.length > 0) {
      resultado.innerHTML = `Total mensual estimado: <strong>$${(total*30).toFixed(2)}</strong> | Total anual: <strong>$${(total*365).toFixed(2)}</strong>`;
    } else {
      resultado.innerHTML = '';
    }
  }
}

// --- Propina ---
function propinaHTML() {
  return `<form id="propina-form">
    <label>Monto de la cuenta: <input type="number" min="0.01" step="any" name="cuenta" required></label><br>
    <label>Porcentaje de propina: <input type="number" min="0" max="100" name="porcentaje" value="10" required></label><br>
    <button type="submit">Calcular</button>
  </form>
  <div id="propina-resultado"></div>`;
}
function propinaLogic() {
  document.getElementById('propina-form').onsubmit = function(e) {
    e.preventDefault();
    const cuenta = parseFloat(this.cuenta.value);
    const porcentaje = parseFloat(this.porcentaje.value);
    const propina = cuenta * porcentaje / 100;
    const total = cuenta + propina;
    document.getElementById('propina-resultado').innerHTML = `Propina: <strong>$${propina.toFixed(2)}</strong><br>Total a pagar: <strong>$${total.toFixed(2)}</strong>`;
  };
}
// --- Descuento ---
function descuentoHTML() {
  return `<form id="descuento-form">
    <label>Precio original: <input type="number" min="0.01" step="any" name="original" required></label><br>
    <label>Descuento (%): <input type="number" min="0" max="100" name="descuento" required></label><br>
    <button type="submit">Calcular</button>
  </form>
  <div id="descuento-resultado"></div>`;
}
function descuentoLogic() {
  document.getElementById('descuento-form').onsubmit = function(e) {
    e.preventDefault();
    const original = parseFloat(this.original.value);
    const descuento = parseFloat(this.descuento.value);
    const rebaja = original * descuento / 100;
    const final = original - rebaja;
    document.getElementById('descuento-resultado').innerHTML = `Descuento: <strong>$${rebaja.toFixed(2)}</strong><br>Precio final: <strong>$${final.toFixed(2)}</strong>`;
  };
}

// --- Cuotas ---
function cuotasHTML() {
  return `<form id="cuotas-form">
    <label>Monto total: <input type="number" min="0.01" step="any" name="total" required></label><br>
    <label>Cantidad de cuotas: <input type="number" min="1" max="60" name="cuotas" required></label><br>
    <label>Interés total (%): <input type="number" min="0" max="200" name="interes" value="0" required></label><br>
    <button type="submit">Calcular</button>
  </form>
  <div id="cuotas-resultado"></div>`;
}
function cuotasLogic() {
  document.getElementById('cuotas-form').onsubmit = function(e) {
    e.preventDefault();
    const total = parseFloat(this.total.value);
    const cuotas = parseInt(this.cuotas.value);
    const interes = parseFloat(this.interes.value);
    const totalConInteres = total * (1 + interes/100);
    const valorCuota = totalConInteres / cuotas;
    document.getElementById('cuotas-resultado').innerHTML = `Total a pagar: <strong>$${totalConInteres.toFixed(2)}</strong><br>Cuotas: <strong>${cuotas}</strong> de <strong>$${valorCuota.toFixed(2)}</strong> cada una`;
  };
}

// --- Impuestos ---
function impuestosHTML() {
  return `<form id="impuestos-form">
    <label>Monto base: <input type="number" min="0.01" step="any" name="base" required></label><br>
    <label>Impuesto (%): <input type="number" min="0" max="100" name="impuesto" required></label><br>
    <button type="submit">Calcular</button>
  </form>
  <div id="impuestos-resultado"></div>`;
}
function impuestosLogic() {
  document.getElementById('impuestos-form').onsubmit = function(e) {
    e.preventDefault();
    const base = parseFloat(this.base.value);
    const impuesto = parseFloat(this.impuesto.value);
    const montoImp = base * impuesto / 100;
    const total = base + montoImp;
    document.getElementById('impuestos-resultado').innerHTML = `Impuesto: <strong>$${montoImp.toFixed(2)}</strong><br>Total con impuesto: <strong>$${total.toFixed(2)}</strong>`;
  };
}

// --- Porcentaje ---
function porcentajeHTML() {
  return `<form id="porcentaje-form">
    <label>Monto: <input type="number" min="0.01" step="any" name="monto" required></label><br>
    <label>Porcentaje (%): <input type="number" min="0" max="100" name="porcentaje" required></label><br>
    <button type="submit">Calcular</button>
  </form>
  <div id="porcentaje-resultado"></div>`;
}
function porcentajeLogic() {
  document.getElementById('porcentaje-form').onsubmit = function(e) {
    e.preventDefault();
    const monto = parseFloat(this.monto.value);
    const porcentaje = parseFloat(this.porcentaje.value);
    const resultado = monto * porcentaje / 100;
    document.getElementById('porcentaje-resultado').innerHTML = `${porcentaje}% de $${monto.toFixed(2)} es <strong>$${resultado.toFixed(2)}</strong>`;
  };
}

// --- Crédito Hipotecario ---
function hipotecarioHTML() {
  return `
  <div class="calculadora-container" style="max-width:600px;">
    <h2>Simulador de Crédito Hipotecario 🇦🇷</h2>
    <div class="datos-mercado">
      <div>
        <label for="hipo-tipoCambio">Tipo de Cambio (ARS por USD)</label>
        <input type="number" id="hipo-tipoCambio" step="0.01" value="1305.50">
      </div>
      <div>
        <label for="hipo-valorUVA">Valor UVA (ARS) (Referencia)</label>
        <input type="number" id="hipo-valorUVA" step="0.01" value="1528.41">
      </div>
    </div>
    <div class="form-grid">
      <div class="form-columna">
        <label for="hipo-montoPropiedad">Monto de la Propiedad (USD)</label>
        <input type="number" id="hipo-montoPropiedad" placeholder="Ej: 100000" value="100000">
        <label for="hipo-porcentajeFinanciacion">Porcentaje de Financiación</label>
        <select id="hipo-porcentajeFinanciacion">
          <option value="0.75">75%</option>
          <option value="0.70">70%</option>
        </select>
        <label for="hipo-tasaInteres">Tasa de Interés Anual Fija (%)</label>
        <input type="number" id="hipo-tasaInteres" placeholder="Ej: 7" value="7" step="0.5">
      </div>
      <div class="form-columna">
        <label for="hipo-sueldoNeto">Tu Sueldo Neto Mensual (ARS)</label>
        <input type="number" id="hipo-sueldoNeto" placeholder="Ej: 1500000" value="1800000">
        <label for="hipo-limiteSueldo">Relación Cuota/Ingreso</label>
        <select id="hipo-limiteSueldo">
          <option value="0.25">25% (Recomendado)</option>
          <option value="0.30">30%</option>
        </select>
        <label for="hipo-plazo">Plazo del Crédito</label>
        <select id="hipo-plazo">
          <option value="240">240 meses (20 años)</option>
          <option value="120">120 meses (10 años)</option>
          <option value="360">360 meses (30 años)</option>
        </select>
      </div>
    </div>
    <div class="gastos-cierre">
      <label for="hipo-gastoInmobiliaria">Comisión Inmobiliaria (%)</label>
      <input type="number" id="hipo-gastoInmobiliaria" value="3">
      <label for="hipo-gastoEscribania">Gastos de Escribanía (%)</label>
      <input type="number" id="hipo-gastoEscribania" value="1.5">
    </div>
    <button id="hipo-btnCalcular">Simular mi Escenario</button>
    <div id="hipo-resultado" class="resultado-container"></div>
    <div class="disclaimer">
      <p><strong>Calculadora de Crédito Tradicional (Tasa Fija en Pesos).</strong> Los valores de UVA y Dólar son editables para que puedas proyectar a futuro. La cuota calculada es fija en pesos y no varía con la UVA.</p>
    </div>
  </div>`;
}

function hipotecarioLogic() {
  document.getElementById('hipo-btnCalcular').onclick = function() {
    const tipoCambio = parseFloat(document.getElementById('hipo-tipoCambio').value);
    const valorUVA = parseFloat(document.getElementById('hipo-valorUVA').value);
    const montoPropiedadUSD = parseFloat(document.getElementById('hipo-montoPropiedad').value);
    const sueldoNetoARS = parseFloat(document.getElementById('hipo-sueldoNeto').value);
    const tasaInteresAnual = parseFloat(document.getElementById('hipo-tasaInteres').value) / 100;
    const porcentajeFinanciacion = parseFloat(document.getElementById('hipo-porcentajeFinanciacion').value);
    const limiteSueldo = parseFloat(document.getElementById('hipo-limiteSueldo').value);
    const plazoEnMeses = parseInt(document.getElementById('hipo-plazo').value);
    const gastoInmobiliaria = parseFloat(document.getElementById('hipo-gastoInmobiliaria').value) / 100;
    const gastoEscribania = parseFloat(document.getElementById('hipo-gastoEscribania').value) / 100;
    const resultadoDiv = document.getElementById('hipo-resultado');
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
  };
}
});

// --- Gastos mensuales ---
function gastosMensualesHTML() {
  return `<form id="gastos-form">
    <label>Alquiler: <input type="number" min="0" step="any" name="alquiler" required></label><br>
    <label>Comida: <input type="number" min="0" step="any" name="comida" required></label><br>
    <label>Transporte: <input type="number" min="0" step="any" name="transporte" required></label><br>
    <label>Servicios: <input type="number" min="0" step="any" name="servicios" required></label><br>
    <label>Otros: <input type="number" min="0" step="any" name="otros" required></label><br>
    <button type="submit">Calcular</button>
  </form>
  <div id="gastos-resultado"></div>`;
}
function calcularGastosMensuales() {
  document.getElementById('gastos-form').onsubmit = function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    let total = 0;
    for (let k in data) total += parseFloat(data[k] || 0);
    let resumen = `<strong>Total mensual:</strong> $${total.toFixed(2)}<br><ul>`;
    for (let k in data) resumen += `<li>${k.charAt(0).toUpperCase()+k.slice(1)}: $${parseFloat(data[k]||0).toFixed(2)}</li>`;
    resumen += '</ul>';
    document.getElementById('gastos-resultado').innerHTML = resumen;
  };
}

// --- Ahorro objetivo ---
function ahorroObjetivoHTML() {
  return `<form id="ahorro-form">
    <label>Monto objetivo: <input type="number" min="1" step="any" name="objetivo" required></label><br>
    <label>Meses para ahorrar: <input type="number" min="1" step="1" name="meses" required></label><br>
    <button type="submit">Calcular</button>
  </form>
  <div id="ahorro-resultado"></div>`;
}
function calcularAhorroObjetivo() {
  document.getElementById('ahorro-form').onsubmit = function(e) {
    e.preventDefault();
    const objetivo = parseFloat(this.objetivo.value);
    const meses = parseInt(this.meses.value);
    const porMes = objetivo / meses;
    document.getElementById('ahorro-resultado').innerHTML = `Debes ahorrar <strong>$${porMes.toFixed(2)}</strong> por mes para alcanzar tu objetivo.`;
  };
}

// --- Divisor de cuentas ---
function splitBillHTML() {
  return `<form id="split-form">
    <label>Total a dividir: <input type="number" min="0.01" step="any" name="total" required></label><br>
    <label>Cantidad de personas: <input type="number" min="2" step="1" name="personas" required></label><br>
    <button type="submit">Calcular</button>
  </form>
  <div id="split-resultado"></div>`;
}
function calcularSplitBill() {
  document.getElementById('split-form').onsubmit = function(e) {
    e.preventDefault();
    const total = parseFloat(this.total.value);
    const personas = parseInt(this.personas.value);
    const porPersona = total / personas;
    document.getElementById('split-resultado').innerHTML = `Cada persona debe pagar <strong>$${porPersona.toFixed(2)}</strong>.`;
  };
}

// --- Modal ---
function showModal(titulo, contenido, onReady) {
  let modal = document.getElementById('fin-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'fin-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.25)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `<div style="background:#fff;padding:2.2rem 1.5rem 1.5rem 1.5rem;border-radius:16px;min-width:320px;max-width:95vw;box-shadow:0 2px 16px rgba(0,0,0,0.13);position:relative;">
    <button id="fin-modal-close" style="position:absolute;top:10px;right:10px;font-size:1.3rem;background:none;border:none;cursor:pointer;">✖</button>
    <h2 style="margin-top:0;">${titulo}</h2>
    ${contenido}
  </div>`;
  document.getElementById('fin-modal-close').onclick = () => { modal.remove(); };
  if (onReady) setTimeout(onReady, 50);
}
