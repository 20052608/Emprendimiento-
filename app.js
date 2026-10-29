/* ==========================================================
   VIOLA JOYERÍA · app.js
   Secciones:
   1. Datos de ejemplo (12 productos)
   2. Estado (memoria + localStorage)
   3. Utilidades
   4. Analítica simulada (KPIs)
   5. Avisos (toast) y contador del carrito
   6. Carrito (lógica)
   7. Imágenes SVG de ejemplo
   8. Componentes (tarjeta de producto)
   9. Vistas: INICIO  ✅ | CATÁLOGO, DETALLE (parte 2) | CARRITO, REGISTRO, CONFIRMACIÓN (parte 3)
   10. Router por hash
   11. Arranque
   ========================================================== */

/* 1. DATOS ------------------------------------------------- */
const PRODUCTOS = [
  { id: 1,  nombre: "Anillo Solitario Aurora",   categoria: "Anillos",  material: "Oro 18k",            ley: "750 (18 quilates)", peso: 3.2, precio: 320.00, talla: true,  calificacion: 4.9, vendidos: 58,
    descripcion: "Solitario clásico en oro amarillo de 18k con engaste de seis garras. Brilla en cada ocasión especial." },
  { id: 2,  nombre: "Collar Gota de Orquídea",   categoria: "Collares", material: "Plata 925",          ley: "Ley 925",           peso: 4.1, precio: 68.00,  talla: false, calificacion: 4.8, vendidos: 91,
    descripcion: "Colgante en forma de gota con acabado pulido y cadena veneciana de 45 cm." },
  { id: 3,  nombre: "Aretes Luna Violeta",       categoria: "Aretes",   material: "Plata 925",          ley: "Ley 925",           peso: 2.4, precio: 34.00,  talla: false, calificacion: 4.7, vendidos: 120,
    descripcion: "Media luna con cristal violeta. Livianos, ideales para uso diario." },
  { id: 4,  nombre: "Pulsera Eslabones Dorados", categoria: "Pulseras", material: "Oro 18k",            ley: "750 (18 quilates)", peso: 6.8, precio: 185.00, talla: false, calificacion: 4.9, vendidos: 44,
    descripcion: "Eslabones entrelazados en oro 18k con cierre de mosquetón. Largo ajustable de 17 a 19 cm." },
  { id: 5,  nombre: "Anillo Amatista Real",      categoria: "Anillos",  material: "Plata 925",          ley: "Ley 925 · amatista", peso: 3.9, precio: 89.00,  talla: true,  calificacion: 4.8, vendidos: 76,
    descripcion: "Amatista natural ovalada engastada en plata 925. El violeta que define a Viola." },
  { id: 6,  nombre: "Collar Perla Nocturna",     categoria: "Collares", material: "Acero quirúrgico",   ley: "Acero 316L",        peso: 5.0, precio: 24.00,  talla: false, calificacion: 4.5, vendidos: 133,
    descripcion: "Perla cultivada sobre cadena de acero 316L hipoalergénico, resistente al agua." },
  { id: 7,  nombre: "Aretes Argolla Brillante",  categoria: "Aretes",   material: "Oro 18k",            ley: "750 (18 quilates)", peso: 2.9, precio: 140.00, talla: false, calificacion: 4.9, vendidos: 62,
    descripcion: "Argollas de 18 mm en oro 18k con brillo espejo y cierre de seguridad." },
  { id: 8,  nombre: "Pulsera Hilo de Plata",     categoria: "Pulseras", material: "Plata 925",          ley: "Ley 925",           peso: 3.3, precio: 42.00,  talla: false, calificacion: 4.6, vendidos: 85,
    descripcion: "Pulsera fina y delicada en plata 925, perfecta para combinar en capas." },
  { id: 9,  nombre: "Anillo Banda Minimal",      categoria: "Anillos",  material: "Acero quirúrgico",   ley: "Acero 316L",        peso: 2.8, precio: 18.00,  talla: true,  calificacion: 4.4, vendidos: 150,
    descripcion: "Banda lisa de acero quirúrgico. No se oscurece ni causa alergias." },
  { id: 10, nombre: "Collar Corazón Viola",      categoria: "Collares", material: "Oro 18k",            ley: "750 (18 quilates)", peso: 4.6, precio: 210.00, talla: false, calificacion: 5.0, vendidos: 39,
    descripcion: "Corazón calado en oro 18k con cadena de 42 cm. Un regalo que se recuerda." },
  { id: 11, nombre: "Aretes Gota Cristal",       categoria: "Aretes",   material: "Acero quirúrgico",   ley: "Acero 316L",        peso: 2.1, precio: 19.50,  talla: false, calificacion: 4.3, vendidos: 98,
    descripcion: "Gotas de cristal facetado con base de acero quirúrgico hipoalergénico." },
  { id: 12, nombre: "Pulsera Charm Estrella",    categoria: "Pulseras", material: "Plata 925",          ley: "Ley 925",           peso: 4.4, precio: 55.00,  talla: false, calificacion: 4.7, vendidos: 71,
    descripcion: "Pulsera con dije de estrella y cierre ajustable. Se puede sumar más charms." }
];

const CATEGORIAS = ["Anillos", "Collares", "Aretes", "Pulseras"];
const MATERIALES = ["Oro 18k", "Plata 925", "Acero quirúrgico"];

const ENVIO = 3.50, ENVIO_GRATIS_DESDE = 60, EMPAQUE_REGALO = 2.00;

/* 2. ESTADO ------------------------------------------------ */
// Se guarda en memoria y se respalda en localStorage (con try/catch por si está bloqueado).
const estado = {
  carrito: [],        // { id, talla, cantidad }
  favoritos: [],      // ids de productos
  regalo: false,
  busqueda: "",
  usuario: null,      // { nombre, correo, celular }
  ultimoPedido: null
};

function guardarEstado() {
  try {
    localStorage.setItem("viola_estado", JSON.stringify({
      carrito: estado.carrito, favoritos: estado.favoritos, regalo: estado.regalo,
      usuario: estado.usuario, ultimoPedido: estado.ultimoPedido
    }));
  } catch (e) { /* sin localStorage: seguimos solo en memoria */ }
}

function cargarEstado() {
  try {
    const g = JSON.parse(localStorage.getItem("viola_estado") || "null");
    if (g) Object.assign(estado, {
      carrito: g.carrito || [], favoritos: g.favoritos || [], regalo: !!g.regalo, usuario: g.usuario || null, ultimoPedido: g.ultimoPedido || null
    });
  } catch (e) { /* datos corruptos: se ignoran */ }
}

/* 3. UTILIDADES -------------------------------------------- */
const $ = (sel, raiz = document) => raiz.querySelector(sel);
const dinero = n => "$" + n.toFixed(2).replace(".", ",");   // $18,00 (formato ecuatoriano en pantalla)
const productoPorId = id => PRODUCTOS.find(p => p.id === Number(id));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function estrellas(valor) {
  const llenas = Math.round(valor);
  return "★".repeat(llenas) + "☆".repeat(5 - llenas);
}

/* 4. ANALÍTICA SIMULADA (KPIs del laboratorio) ------------- */
// Eventos: inicio_registro, registro_completado, busqueda_exitosa, clic_agregar_carrito
function registrarEvento(nombre, datos = {}) {
  console.log(`[analitica] ${nombre}`, { ...datos, hora: new Date().toISOString() });
}

/* 5. AVISOS Y CONTADOR ------------------------------------- */
function mostrarAviso(html, ms = 4500) {
  const caja = $("#avisos");
  const el = document.createElement("div");
  el.className = "aviso";
  el.innerHTML = html;
  caja.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

function actualizarContador() {
  const total = estado.carrito.reduce((s, l) => s + l.cantidad, 0);
  const c = $("#contador-carrito");
  c.textContent = total;
  c.parentElement.setAttribute("aria-label", `Carrito de compras, ${total} ${total === 1 ? "producto" : "productos"}`);
  c.classList.remove("pulso"); void c.offsetWidth; c.classList.add("pulso");
}

/* 6. CARRITO (lógica) -------------------------------------- */
function agregarAlCarrito(id, talla = null, cantidad = 1) {
  const p = productoPorId(id);
  if (!p) return;
  const linea = estado.carrito.find(l => l.id === p.id && l.talla === talla);
  if (linea) linea.cantidad += cantidad;
  else estado.carrito.push({ id: p.id, talla, cantidad });
  guardarEstado();
  actualizarContador();
  registrarEvento("clic_agregar_carrito", { producto: p.nombre, cantidad });
  mostrarAviso(`<span>Agregaste <strong>${esc(p.nombre)}</strong></span><a href="#carrito">Ver carrito</a>`);
}

function alternarFavorito(id) {
  const i = estado.favoritos.indexOf(id);
  if (i >= 0) estado.favoritos.splice(i, 1); else estado.favoritos.push(id);
  guardarEstado();
}

/* 7. IMÁGENES ---------------------------------------------- */
// Para usar fotos reales: guarda images/p1.jpg … images/p12.jpg (una por id de producto)
// y cambia USAR_FOTOS a true. Si una foto falta, se muestra la ilustración.
const USAR_FOTOS = true;

// Gema de cada producto: define el color de la piedra en la ilustración
const GEMAS = { 1: "cristal", 2: "orquidea", 3: "violeta", 5: "amatista", 6: "perla", 10: "orquidea", 11: "cristal", 9: "ninguna" };

const PALETA_GEMA = {
  cristal:  ["#FFFFFF", "#CFE6FF", "#8FB4E8"],
  orquidea: ["#F6B3EC", "#CD4FBB", "#7B1E6E"],
  violeta:  ["#D9A0F0", "#9B3FC4", "#5A0E78"],
  amatista: ["#E3B4FF", "#A24BD6", "#5E1585"],
  perla:    ["#FFFFFF", "#F4EBDD", "#CBBFA9"]
};
const PALETA_METAL = {
  "Oro 18k":          ["#FFF1CC", "#FFC57C", "#B9822E"],
  "Plata 925":        ["#FFFFFF", "#DAD4E2", "#8B8497"],
  "Acero quirúrgico": ["#F4F4F8", "#B9B7C4", "#6F6D7B"]
};

// Ilustración vectorial con metal brillante, gema facetada y destellos.
function imagenProducto(p) {
  const [m1, m2, m3] = PALETA_METAL[p.material];
  const gema = GEMAS[p.id] || "ninguna";
  const [g1, g2, g3] = PALETA_GEMA[gema] || [];
  const k = "p" + p.id;
  const metal = `url(#${k}m)`, piedra = `url(#${k}g)`;

  const piedraDef = gema === "ninguna" ? "" :
    `<linearGradient id="${k}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g1}"/><stop offset=".55" stop-color="${g2}"/><stop offset="1" stop-color="${g3}"/></linearGradient>`;

  const formas = {
    Anillos: `
      <ellipse cx="100" cy="132" rx="44" ry="42" fill="none" stroke="${metal}" stroke-width="11"/>
      <path d="M62 118a44 42 0 0 1 20-28" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
      <path d="M84 96h32l8 10H76z" fill="${metal}"/>
      ${gema === "ninguna" ? "" : `<polygon points="100,44 126,66 100,98 74,66" fill="${piedra}"/>
      <polygon points="100,44 112,66 100,98 88,66" fill="#fff" fill-opacity=".28"/>
      <path d="M74 66h52M100 44v54" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>`}`,
    Collares: `
      <path d="M34 34Q100 190 166 34" fill="none" stroke="${metal}" stroke-width="3.5" stroke-dasharray="1 5.5" stroke-linecap="round"/>
      <path d="M34 34Q100 190 166 34" fill="none" stroke="${metal}" stroke-width="1.6" opacity=".6"/>
      ${gema === "perla" ? `<circle cx="100" cy="132" r="17" fill="${piedra}"/><circle cx="94" cy="126" r="5" fill="#fff" fill-opacity=".8"/>`
        : `<path d="M100 112c-4 12-20 20-20 36a20 20 0 0 0 40 0c0-16-16-24-20-36z" fill="${piedra}" stroke="${metal}" stroke-width="4"/>
           <path d="M90 132q-6 8-2 16" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>`}`,
    Aretes: `
      ${[62, 138].map(x => `
        <path d="M${x} 34v26" stroke="${metal}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="${x}" cy="64" r="7" fill="${metal}"/>
        ${p.id === 3
          ? `<path d="M${x + 4} 82a24 24 0 1 0 12 40 20 20 0 0 1-12-40z" fill="${piedra}" stroke="${metal}" stroke-width="3"/>`
          : p.material === "Oro 18k"
            ? `<circle cx="${x}" cy="108" r="26" fill="none" stroke="${metal}" stroke-width="7"/>`
            : `<path d="M${x} 80c-4 10-16 16-16 30a16 16 0 0 0 32 0c0-14-12-20-16-30z" fill="${piedra}" stroke="${metal}" stroke-width="3"/>`}`).join("")}`,
    Pulseras: `
      <ellipse cx="100" cy="104" rx="64" ry="40" fill="none" stroke="${metal}" stroke-width="12" ${p.id === 4 ? 'stroke-dasharray="20 4" stroke-linecap="round"' : p.id === 8 ? 'stroke-width="5"' : 'stroke-dasharray="3 0"'}/>
      <path d="M50 88a64 40 0 0 1 40-24" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>
      ${p.id === 12 ? `<polygon points="100,128 106,142 121,143 109,153 113,168 100,160 87,168 91,153 79,143 94,142" fill="${metal}"/>` : ""}`
  };

  const destellos = [[32, 40, 1], [168, 70, .8], [150, 168, .6], [40, 150, .7]].map(([x, y, s]) =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0-9Q1-1 9 0 1 1 0 9-1 1-9 0-1-1 0-9z" fill="#FFE3B3" opacity=".85"/>`).join("");

  const foto = USAR_FOTOS
    ? `<img class="foto" src="images/p${p.id}.jpg" alt="${esc(p.nombre)}, ${esc(p.material)}" loading="lazy" onerror="this.remove()">` : "";

  return `<div class="img-joya">
    <svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.nombre)}, ${esc(p.material)}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="${k}f" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#9A2BB8"/><stop offset=".6" stop-color="#4B0A5E"/><stop offset="1" stop-color="#1B0F21"/></radialGradient>
        <linearGradient id="${k}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m1}"/><stop offset=".5" stop-color="${m2}"/><stop offset="1" stop-color="${m3}"/></linearGradient>
        ${piedraDef}
      </defs>
      <rect width="200" height="200" fill="url(#${k}f)"/>
      <circle cx="100" cy="100" r="78" fill="none" stroke="#FFE3B3" stroke-opacity=".12"/>
      ${formas[p.categoria]}${destellos}
    </svg>${foto}</div>`;
}

/* 8. COMPONENTES ------------------------------------------- */
const ICONOS = {
  Anillos:  '<circle cx="12" cy="15" r="6"/><path d="m9 6 3-3 3 3-3 4z"/>',
  Collares: '<path d="M4 4c0 9 4 13 8 13s8-4 8-13"/><circle cx="12" cy="19" r="2.5"/>',
  Aretes:   '<path d="M8 3v5M16 3v5"/><circle cx="8" cy="13" r="4"/><circle cx="16" cy="13" r="4"/>',
  Pulseras: '<ellipse cx="12" cy="12" rx="9" ry="6"/><path d="M5 9.5 9 7M19 9.5 15 7" />',
  Plata:    '<path d="m12 3 8 6-8 12L4 9z"/><path d="M4 9h16M9 9l3 12 3-12"/>',
  escudo:   '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  camion:   '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  efectivo: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
  cambio:   '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>'
};
const icono = (n, cls = "icono") =>
  `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONOS[n]}</svg>`;

function tarjetaProducto(p) {
  const fav = estado.favoritos.includes(p.id);
  return `
    <article class="tarjeta">
      <button class="fav-btn" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? "Quitar de favoritos" : "Agregar a favoritos"}: ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>
      </button>
      <div class="tarjeta__imagen">
        ${imagenProducto(p)}
        <span class="tarjeta__material">${esc(p.material)}</span>
        <button type="button" class="rapido" data-rapido="${p.id}" aria-label="${p.talla ? "Elegir talla de" : "Agregar al carrito:"} ${esc(p.nombre)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="tarjeta__cuerpo">
        <div class="tarjeta__fila">
          <h3 class="tarjeta__nombre"><a href="#detalle-${p.id}">${esc(p.nombre)}</a></h3>
          <span class="tarjeta__precio">${dinero(p.precio)}</span>
        </div>
        <span class="tarjeta__meta" aria-label="${esc(p.categoria)}, calificación ${p.calificacion} de 5">${esc(p.categoria)} · <span aria-hidden="true">★</span> ${p.calificacion.toFixed(1)}</span>
      </div>
    </article>`;
}

/* 9. VISTAS ------------------------------------------------ */

/* --- INICIO --- */
function vistaInicio() {
  const masVendidos = [...PRODUCTOS].sort((a, b) => b.vendidos - a.vendidos).slice(0, 8);
  const estrella = productoPorId(1);
  const flecha = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const categoriasInicio = [
    ...CATEGORIAS.map(c => ({ nombre: c, icono: c, enlace: `#catalogo?cat=${encodeURIComponent(c)}` })),
    { nombre: "Plata 925", icono: "Plata", enlace: `#catalogo?mat=${encodeURIComponent("Plata 925")}` }
  ];
  const tiles = categoriasInicio.map(c => `<a class="tile" href="${c.enlace}"><span class="tile__nombre">${c.nombre}</span></a>`).join("");

  return `
    <section class="hero" aria-labelledby="titulo-banner">
      <div class="hero__texto">
        <span class="eyebrow">Guayaquil · Ecuador</span>
        <h1 id="titulo-banner">Joyas que cuentan <em>tu historia</em></h1>
        <p>Oro 18k, plata 925 y acero quirúrgico. Piezas pensadas para acompañarte en cada momento importante.</p>
        <div class="hero__acciones">
          <a class="btn btn--primario" href="#catalogo">Ver colección</a>
          <a class="btn btn--secundario" href="#masvendidos" data-ancla="titulo-vendidos">Más vendidos</a>
        </div>
        <ul class="hero__datos"><li>Oro 18k</li><li>Plata 925</li><li>Acero 316L</li></ul>
      </div>
      <a class="hero__visual" href="#detalle-${estrella.id}" aria-label="Ver ${esc(estrella.nombre)}">
        <div class="hero__marco">${imagenProducto(estrella)}</div>
        <span class="hero__ficha glass"><span><small>Pieza destacada</small><strong>${esc(estrella.nombre)}</strong></span><span class="hero__precio">${dinero(estrella.precio)}<small>Ver pieza →</small></span></span>
      </a>
    </section>

    <section class="seccion" aria-labelledby="titulo-categorias">
      <div class="seccion__cabecera"><div><span class="eyebrow">Explora</span><h2 id="titulo-categorias">Categorías</h2></div></div>
      <div class="tiles">${tiles}</div>
    </section>

    <section class="seccion seccion--degradado" aria-labelledby="titulo-vendidos">
      <div class="seccion__cabecera">
        <div><span class="eyebrow">Favoritas de nuestras clientas</span><h2 id="titulo-vendidos">Más vendidos</h2></div>
        <a href="#catalogo">Ver todo →</a>
      </div>
      <div class="linea-marca" aria-hidden="true" style="margin-bottom:20px"></div>
      <div class="grilla">${masVendidos.map(tarjetaProducto).join("")}</div>
    </section>

    <section class="regalo" aria-labelledby="titulo-regalo">
      <div>
        <span class="eyebrow eyebrow--claro">Para sorprender</span>
        <h2 id="titulo-regalo">Empaque de regalo por solo ${dinero(EMPAQUE_REGALO)}</h2>
        <p>Caja con lazo y tarjeta. Actívalo en tu carrito en un clic.</p>
      </div>
      <a class="btn btn--primario" href="#catalogo">Elegir un regalo</a>
    </section>

    <section class="seccion" aria-labelledby="titulo-confianza">
      <div class="seccion__cabecera"><div><span class="eyebrow">Viola te cuida</span><h2 id="titulo-confianza">Compra con tranquilidad</h2></div></div>
      <div class="confianza">
        <div class="confianza__item glass">${icono("escudo", "confianza__icono")}<div><strong>Garantía de autenticidad</strong><span>Certificado en cada pieza</span></div></div>
        <div class="confianza__item glass">${icono("camion", "confianza__icono")}<div><strong>Envío asegurado en Guayaquil</strong><span>Gratis desde $60</span></div></div>
        <div class="confianza__item glass">${icono("efectivo", "confianza__icono")}<div><strong>Pago contra entrega</strong><span>Pagas al recibir</span></div></div>
        <div class="confianza__item glass">${icono("cambio", "confianza__icono")}<div><strong>Cambios en 15 días</strong><span>Sin complicaciones</span></div></div>
      </div>
    </section>`;
}

/* --- CATÁLOGO --- */
let filtros = { cat: "", mat: "", precio: "", orden: "vendidos" };

const normalizar = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function filtrarProductos() {
  const q = normalizar(estado.busqueda);
  let lista = PRODUCTOS.filter(p => {
    if (q && !normalizar([p.nombre, p.categoria, p.material, p.descripcion].join(" ")).includes(q)) return false;
    if (filtros.cat && p.categoria !== filtros.cat) return false;
    if (filtros.mat && p.material !== filtros.mat) return false;
    if (filtros.precio) {
      const [min, max] = filtros.precio.split("-").map(Number);
      if (p.precio < min || p.precio >= max) return false;
    }
    return true;
  });
  if (filtros.orden === "menor") lista.sort((a, b) => a.precio - b.precio);
  else if (filtros.orden === "mayor") lista.sort((a, b) => b.precio - a.precio);
  else lista.sort((a, b) => b.vendidos - a.vendidos);
  return lista;
}

function vistaCatalogo(_, consulta) {
  // Los filtros se reinician al entrar y se leen de la URL (chips del inicio)
  filtros = { cat: consulta.get("cat") || "", mat: consulta.get("mat") || "", precio: "", orden: "vendidos" };
  const chips = CATEGORIAS.map(c =>
    `<button type="button" class="chip" data-filtro="cat" data-valor="${c}" aria-pressed="${filtros.cat === c}">${c}</button>`).join("");
  const opcionesMat = ['<option value="">Todos</option>', ...MATERIALES.map(m =>
    `<option ${filtros.mat === m ? "selected" : ""}>${m}</option>`)].join("");

  return `
    <h1>Catálogo</h1>
    <section class="filtros glass" aria-label="Filtros y orden">
      <div class="chips" role="group" aria-label="Categoría">${chips}</div>
      <div class="filtros__campos">
        <div class="campo"><label for="f-mat">Material</label>
          <select id="f-mat" data-filtro="mat">${opcionesMat}</select></div>
        <div class="campo"><label for="f-precio">Precio</label>
          <select id="f-precio" data-filtro="precio">
            <option value="">Todos</option><option value="0-30">Hasta $30</option>
            <option value="30-100">$30 a $100</option><option value="100-1000">Más de $100</option></select></div>
        <div class="campo"><label for="f-orden">Ordenar por</label>
          <select id="f-orden" data-filtro="orden">
            <option value="vendidos">Más vendidos</option><option value="menor">Precio: menor a mayor</option>
            <option value="mayor">Precio: mayor a menor</option></select></div>
      </div>
    </section>
    <p id="resumen" class="resumen" aria-live="polite"></p>
    <div id="resultados" class="grilla"></div>`;
}

function pintarResultados() {
  const lista = filtrarProductos();
  const q = estado.busqueda;
  $("#resumen").innerHTML = `${lista.length} ${lista.length === 1 ? "resultado" : "resultados"}` +
    (q ? ` para «${esc(q)}» <button type="button" class="enlace" data-limpiar-busqueda>Quitar búsqueda</button>` : "");
  $("#resultados").innerHTML = lista.length ? lista.map(tarjetaProducto).join("") : `
    <div class="vacio" style="grid-column:1/-1">
      <h2>No encontramos joyas con esos filtros</h2>
      <p>Prueba quitando algún filtro o buscando con otra palabra, por ejemplo «anillo» o «plata».</p>
      <button type="button" class="btn btn--primario" data-limpiar-todo>Ver todo el catálogo</button>
    </div>`;
  document.querySelectorAll("[data-filtro='cat']").forEach(b => b.setAttribute("aria-pressed", filtros.cat === b.dataset.valor));
}

/* --- DETALLE --- */
let det = { talla: null, cantidad: 1 };

const RESENAS = [
  { autor: "Camila R.", estrellas: 5, texto: "Llegó rápido a Urdesa y la pieza es hermosa, igual que en las fotos." },
  { autor: "Andrés M.", estrellas: 5, texto: "Lo compré de regalo con el empaque especial y quedó perfecto." },
  { autor: "Daniela P.", estrellas: 4, texto: "Muy buena calidad por el precio. El brillo se mantiene después de semanas." },
  { autor: "Josué T.", estrellas: 5, texto: "Pagué contra entrega sin ningún problema. Muy recomendado." }
];

function vistaDetalle(id) {
  const p = productoPorId(id);
  if (!p) return `<section class="vacio"><h1>Producto no encontrado</h1><a class="btn btn--primario" href="#catalogo">Ir al catálogo</a></section>`;
  det = { talla: null, cantidad: 1 };
  const resenas = [RESENAS[p.id % 4], RESENAS[(p.id + 1) % 4]].map(r => `
    <article class="resena"><strong>${r.autor}</strong>
      <span class="estrellas" aria-label="${r.estrellas} de 5">${estrellas(r.estrellas)}</span><p>${r.texto}</p></article>`).join("");
  const tallas = p.talla ? `
    <fieldset class="tallas"><legend>Talla</legend>
      <div class="tallas__lista">${[5, 6, 7, 8, 9, 10].map(t =>
        `<button type="button" class="talla" data-talla="${t}" aria-pressed="false">${t}</button>`).join("")}</div>
      <p id="err-talla" class="error" role="alert" hidden>Elige tu talla para continuar.</p>
    </fieldset>` : "";

  return `
    <nav class="migas" aria-label="Ruta"><a href="#catalogo">← Volver al catálogo</a></nav>
    <div class="detalle">
      <div class="detalle__imagen">${imagenProducto(p, true)}</div>
      <div class="detalle__info">
        <span class="tarjeta__etiqueta etiqueta--orq">${esc(p.categoria)}</span>
        <h1>${esc(p.nombre)}</h1>
        <p class="precio-grande">${dinero(p.precio)}</p>
        <p class="estrellas" aria-label="Calificación ${p.calificacion} de 5">${estrellas(p.calificacion)} ${p.calificacion.toFixed(1)}</p>
        <dl class="ficha">
          <div><dt>Material</dt><dd>${esc(p.material)}</dd></div>
          <div><dt>Ley / quilataje</dt><dd>${esc(p.ley)}</dd></div>
          <div><dt>Peso</dt><dd>${p.peso.toFixed(1).replace(".", ",")} g</dd></div>
        </dl>
        <p>${esc(p.descripcion)}</p>
        ${tallas}
        <div class="campo"><label for="cantidad">Cantidad</label>
          <div class="stepper">
            <button type="button" data-cant="-1" aria-label="Disminuir cantidad">−</button>
            <input id="cantidad" type="number" min="1" max="10" value="1" inputmode="numeric">
            <button type="button" data-cant="1" aria-label="Aumentar cantidad">+</button>
          </div></div>
        <button type="button" id="btn-agregar" class="btn btn--primario btn--bloque btn--grande" data-agregar="${p.id}">
          Agregar al carrito · ${dinero(p.precio)}</button>
      </div>
    </div>
    <section class="seccion" aria-labelledby="t-resenas">
      <h2 id="t-resenas">Reseñas</h2><div class="resenas">${resenas}</div>
    </section>`;
}

function actualizarBotonAgregar() {
  const btn = $("#btn-agregar");
  if (!btn) return;
  const p = productoPorId(btn.dataset.agregar);
  btn.textContent = `Agregar al carrito · ${dinero(p.precio * det.cantidad)}`;
}

/* --- CARRITO --- */
function calcularTotales() {
  const subtotal = estado.carrito.reduce((s, l) => s + productoPorId(l.id).precio * l.cantidad, 0);
  const envio = subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : ENVIO;
  const regalo = estado.regalo && subtotal > 0 ? EMPAQUE_REGALO : 0;
  return { subtotal, envio, regalo, total: subtotal + envio + regalo, faltan: Math.max(0, ENVIO_GRATIS_DESDE - subtotal) };
}

function filasResumen(t) {
  return `
    <div class="fila"><span>Subtotal</span><span>${dinero(t.subtotal)}</span></div>
    <div class="fila"><span>Envío</span><span>${t.envio ? dinero(t.envio) : "Gratis"}</span></div>
    ${t.regalo ? `<div class="fila"><span>Empaque de regalo</span><span>${dinero(t.regalo)}</span></div>` : ""}
    <div class="fila fila--total"><span>Total</span><span>${dinero(t.total)}</span></div>`;
}

function vistaCarrito() {
  if (!estado.carrito.length) return `
    <section class="vacio"><h1>Tu carrito está vacío</h1>
      <p>Aún no has agregado joyas. ¡Descubre nuestra colección!</p>
      <a class="btn btn--primario" href="#catalogo">Explorar joyas</a></section>`;
  const t = calcularTotales();
  const lineas = estado.carrito.map((l, i) => {
    const p = productoPorId(l.id);
    return `
    <li class="linea">
      <div class="linea__mini">${imagenProducto(p)}</div>
      <div class="linea__info">
        <h3><a href="#detalle-${p.id}">${esc(p.nombre)}</a></h3>
        <p>${esc(p.material)}${l.talla ? ` · Talla ${l.talla}` : ""}</p>
        <p class="linea__precio">${dinero(p.precio * l.cantidad)}</p>
        <div class="linea__acciones">
          <div class="stepper">
            <button type="button" data-cart="menos" data-i="${i}" aria-label="Disminuir cantidad de ${esc(p.nombre)}">−</button>
            <span aria-live="polite" aria-label="Cantidad">${l.cantidad}</span>
            <button type="button" data-cart="mas" data-i="${i}" aria-label="Aumentar cantidad de ${esc(p.nombre)}">+</button>
          </div>
          <button type="button" class="btn btn--secundario" data-cart="quitar" data-i="${i}" aria-label="Eliminar ${esc(p.nombre)}">Eliminar</button>
        </div>
      </div>
    </li>`;
  }).join("");

  return `
    ${pasos(1)}
    <h1>Tu carrito</h1>
    <div class="carrito">
      <ul class="lineas" aria-label="Productos en el carrito">${lineas}</ul>
      <aside class="resumen-compra glass" aria-label="Resumen del pedido">
        <h2>Resumen</h2>
        <p class="meta-envio" role="status">${t.faltan > 0
          ? `Te faltan <strong>${dinero(t.faltan)}</strong> para envío gratis`
          : "¡Tienes envío gratis! 🎉"}</p>
        <label class="check"><input type="checkbox" data-cart="regalo" ${estado.regalo ? "checked" : ""}>
          Empaque de regalo (+${dinero(EMPAQUE_REGALO)})</label>
        ${filasResumen(t)}
        <a class="btn btn--primario btn--bloque" href="#registro">Continuar al pago</a>
      </aside>
    </div>`;
}

function repintarCarrito(enfocar) {
  $("#contenido").innerHTML = vistaCarrito();
  actualizarContador();
  if (enfocar) { const el = $(enfocar); if (el) el.focus(); }
}

/* --- REGISTRO, CUENTA Y PAGO --- */
let registroIniciado = false;

const VALIDACIONES = {
  nombre: v => /^\S{2,}(\s+\S{2,})+$/.test(v.trim()) ? "" : "Escribe tu nombre y apellido, por ejemplo: María Pérez.",
  correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Revisa tu correo: debe tener el formato nombre@correo.com.",
  celular: v => /^09\d{8}$/.test(v) ? "" : "Escribe 10 dígitos que empiecen con 09, sin espacios ni guiones. Ej: 0991234567."
};

// Íconos extra para estas pantallas
Object.assign(ICONOS, {
  tarjeta: '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M6 15h4"/>',
  candado: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  check:   '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  caja:    '<path d="M3 8 12 3l9 5v8l-9 5-9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>'
});

/* Indicador de pasos: 1 Carrito · 2 Datos y pago · 3 Confirmación */
function pasos(actual) {
  const nombres = ["Carrito", "Datos y pago", "Confirmación"];
  return `<ol class="pasos" aria-label="Progreso de la compra">${nombres.map((n, i) => {
    const num = i + 1;
    const clase = num < actual ? "hecho" : num === actual ? "actual" : "";
    return `<li class="${clase}" ${num === actual ? 'aria-current="step"' : ""}>
      <span class="pasos__num" aria-hidden="true">${num < actual ? "✓" : num}</span><span class="pasos__txt">${n}</span></li>`;
  }).join("")}</ol>`;
}

/* Campo de texto con etiqueta visible, ayuda y mensaje de error en línea */
function campoRegistro(u, id, etiqueta, tipo, ayuda, extra = "") {
  return `
    <div class="campo">
      <label for="r-${id}">${etiqueta}</label>
      <input id="r-${id}" name="${id}" type="${tipo}" value="${esc(u[id] || "")}" ${extra}
             aria-describedby="ayuda-${id} err-${id}" required>
      <p id="ayuda-${id}" class="ayuda">${ayuda}</p>
      <p id="err-${id}" class="error" role="alert"></p>
    </div>`;
}

function camposContacto(u) {
  return `
    ${campoRegistro(u, "nombre", "Nombre completo", "text", "Nombre y apellido.", 'autocomplete="name"')}
    ${campoRegistro(u, "correo", "Correo electrónico", "email", "Te enviaremos la confirmación aquí.", 'autocomplete="email"')}
    ${campoRegistro(u, "celular", "Celular", "tel", "10 dígitos, empieza con 09. Ej: 0991234567.", 'autocomplete="tel" inputmode="numeric" maxlength="10"')}`;
}

function casillaTerminos(texto) {
  return `
    <div class="campo">
      <label class="check"><input type="checkbox" id="r-terminos" aria-describedby="err-terminos"> ${texto}</label>
      <p id="err-terminos" class="error" role="alert"></p>
    </div>`;
}

function vistaRegistro() {
  return estado.carrito.length ? vistaPago() : vistaCuenta();
}

/* --- Pago (hay productos en el carrito) --- */
function vistaPago() {
  registroIniciado = false;
  const u = estado.usuario || {};
  const t = calcularTotales();
  const miniaturas = estado.carrito.map(l => {
    const p = productoPorId(l.id);
    return `<li class="mini-linea">
      <div class="mini-linea__img">${imagenProducto(p)}</div>
      <div class="mini-linea__info"><strong>${esc(p.nombre)}</strong>
        <small>${l.cantidad} ${l.cantidad === 1 ? "unidad" : "unidades"}${l.talla ? ` · talla ${l.talla}` : ""}</small></div>
      <span class="mini-linea__precio">${dinero(p.precio * l.cantidad)}</span></li>`;
  }).join("");

  return `
    ${pasos(2)}
    <h1>Casi listo</h1>
    <p class="subtitulo">Solo necesitamos 3 datos para coordinar tu entrega en Guayaquil.</p>
    <div class="carrito">
      <form id="form-registro" class="panel" data-modo="pago" novalidate>
        <section class="bloque" aria-labelledby="b-datos">
          <h2 id="b-datos"><span class="bloque__num" aria-hidden="true">1</span> Tus datos</h2>
          ${camposContacto(u)}
        </section>

        <div class="bloque"><fieldset class="pago">
          <legend><span class="bloque__num" aria-hidden="true">2</span> Método de pago</legend>
          <div class="pago__opciones">
            <label class="pago-opcion"><input type="radio" name="pago" value="Contra entrega" checked>
              <span class="pago-opcion__cuerpo"><span class="pago-opcion__icono">${icono("efectivo")}</span>
                <span><strong>Contra entrega</strong><small>Pagas en efectivo al recibir</small></span></span></label>
            <label class="pago-opcion"><input type="radio" name="pago" value="Tarjeta">
              <span class="pago-opcion__cuerpo"><span class="pago-opcion__icono">${icono("tarjeta")}</span>
                <span><strong>Tarjeta</strong><small>Crédito o débito</small></span></span></label>
          </div>
          <div id="datos-tarjeta" class="tarjeta-form" hidden>
            <p class="ayuda">Demostración visual: no se procesa ningún pago real.</p>
            <div class="campo"><label for="t-num">Número de tarjeta</label><input id="t-num" inputmode="numeric" autocomplete="off" placeholder="0000 0000 0000 0000"></div>
            <div class="dos-col">
              <div class="campo"><label for="t-ven">Vence</label><input id="t-ven" autocomplete="off" inputmode="numeric" placeholder="MM/AA"></div>
              <div class="campo"><label for="t-cvv">CVV</label><input id="t-cvv" autocomplete="off" inputmode="numeric" placeholder="123"></div>
            </div>
          </div>
        </fieldset></div>

        <section class="bloque" aria-labelledby="b-confirma">
          <h2 id="b-confirma"><span class="bloque__num" aria-hidden="true">3</span> Confirma tu pedido</h2>
          ${casillaTerminos("Acepto los términos y condiciones")}
          <button type="submit" id="btn-confirmar" class="btn btn--primario btn--bloque btn--grande">Confirmar pedido · ${dinero(t.total)}</button>
          <p class="nota-segura">${icono("candado", "icono")} Tus datos solo se usan para coordinar la entrega.</p>
        </section>
      </form>

      <aside class="resumen-compra glass" aria-label="Resumen del pedido">
        <h2>Tu pedido</h2>
        <ul class="mini-lineas">${miniaturas}</ul>
        ${filasResumen(t)}
        <p class="meta-envio" role="status">${t.faltan > 0 ? `Te faltan <strong>${dinero(t.faltan)}</strong> para envío gratis` : "¡Tienes envío gratis! 🎉"}</p>
        <ul class="mini-garantias">
          <li>${icono("escudo", "icono")} Garantía de autenticidad</li>
          <li>${icono("camion", "icono")} Envío asegurado en Guayaquil</li>
          <li>${icono("cambio", "icono")} Cambios en 15 días</li>
        </ul>
        <a href="#carrito">← Editar carrito</a>
      </aside>
    </div>`;
}

/* --- Cuenta (carrito vacío): crear cuenta o ver perfil --- */
function vistaCuenta() {
  const u = estado.usuario;
  if (u) {
    return `
      <section class="perfil panel" aria-labelledby="t-perfil">
        <div class="perfil__avatar" aria-hidden="true">${esc(u.nombre.charAt(0).toUpperCase())}</div>
        <h1 id="t-perfil">Hola, ${esc(u.nombre.split(" ")[0])}</h1>
        <p class="subtitulo">Esta es tu cuenta en Viola.</p>
        <dl class="perfil__datos">
          <div><dt>Nombre</dt><dd>${esc(u.nombre)}</dd></div>
          <div><dt>Correo</dt><dd>${esc(u.correo)}</dd></div>
          <div><dt>Celular</dt><dd>${esc(u.celular)}</dd></div>
        </dl>
        <div class="perfil__acciones">
          <a class="btn btn--primario" href="#catalogo">Seguir comprando</a>
          ${estado.ultimoPedido ? '<a class="btn btn--secundario" href="#confirmacion">Ver último pedido</a>' : ""}
          <button type="button" class="btn btn--secundario" data-cerrar-sesion>Cerrar sesión</button>
        </div>
      </section>`;
  }
  registroIniciado = false;
  return `
    <div class="cuenta">
      <section class="cuenta__info" aria-labelledby="t-cuenta">
        <span class="eyebrow">Registro rápido · 3 datos</span>
        <h1 id="t-cuenta">Crea tu cuenta <em>Viola</em></h1>
        <p>Guarda tus datos y compra en segundos la próxima vez.</p>
        <ul class="perks">
          <li>${icono("check", "icono")} Pedidos más rápidos</li>
          <li>${icono("check", "icono")} Tus favoritos siempre guardados</li>
          <li>${icono("check", "icono")} Envío asegurado en Guayaquil</li>
        </ul>
      </section>
      <form id="form-registro" class="panel" data-modo="cuenta" novalidate>
        <h2>Tus datos</h2>
        ${camposContacto({})}
        ${casillaTerminos("Acepto los términos y condiciones")}
        <button type="submit" id="btn-confirmar" class="btn btn--primario btn--bloque btn--grande">Crear cuenta</button>
        <p class="nota-segura">${icono("candado", "icono")} Sin contraseñas ni tarjetas en este paso.</p>
      </form>
    </div>`;
}

function mostrarError(id, msg) {
  const campo = $(`#r-${id}`), err = $(`#err-${id}`);
  err.textContent = msg;
  if (campo.type !== "checkbox") campo.setAttribute("aria-invalid", msg ? "true" : "false");
  campo.classList.toggle("invalido", !!msg);
  campo.classList.toggle("valido", !msg && campo.value.trim() !== "");
}

function validarCampo(id) {
  const campo = $(`#r-${id}`);
  const msg = VALIDACIONES[id](campo.value);
  mostrarError(id, msg);
  return !msg;
}

function enviarRegistro(e) {
  e.preventDefault();
  const modo = e.currentTarget.dataset.modo;
  const ok = ["nombre", "correo", "celular"].map(validarCampo);
  const terminos = $("#r-terminos").checked;
  $("#err-terminos").textContent = terminos ? "" : "Debes aceptar los términos para continuar.";
  if (ok.includes(false) || !terminos) {
    const primero = document.querySelector(".invalido") || $("#r-terminos");
    primero.focus();
    return;
  }

  // Estado de carga al confirmar
  const btn = $("#btn-confirmar");
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${modo === "cuenta" ? "Creando cuenta…" : "Confirmando…"}`;

  setTimeout(() => {
    estado.usuario = { nombre: $("#r-nombre").value.trim(), correo: $("#r-correo").value.trim(), celular: $("#r-celular").value };

    if (modo === "cuenta") {
      guardarEstado();
      registrarEvento("registro_completado", { tipo: "cuenta" });
      mostrarAviso(`<span>Cuenta creada. ¡Hola, <strong>${esc(estado.usuario.nombre.split(" ")[0])}</strong>!</span>`);
      navegar();
      return;
    }

    const t = calcularTotales();
    const entrega = new Date(); entrega.setDate(entrega.getDate() + 2);
    estado.ultimoPedido = {
      numero: "VJ-" + String(Math.floor(1000 + Math.random() * 9000)),
      items: estado.carrito.map(l => ({ nombre: productoPorId(l.id).nombre, talla: l.talla, cantidad: l.cantidad })),
      totales: t,
      pago: document.querySelector("input[name='pago']:checked").value,
      entrega: entrega.toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" }),
      cliente: estado.usuario
    };
    estado.carrito = []; estado.regalo = false;
    guardarEstado();
    registrarEvento("registro_completado", { pedido: estado.ultimoPedido.numero });
    actualizarContador();
    location.hash = "#confirmacion";
  }, 1200);
}

/* --- CONFIRMACIÓN --- */
function vistaConfirmacion() {
  const o = estado.ultimoPedido;
  if (!o) return `<section class="vacio"><h1>No hay pedidos recientes</h1><a class="btn btn--primario" href="#catalogo">Explorar joyas</a></section>`;
  const items = o.items.map(i => `<li>${i.cantidad} × ${esc(i.nombre)}${i.talla ? ` <small>(talla ${i.talla})</small>` : ""}</li>`).join("");
  return `
    ${pasos(4)}
    <section class="exito panel" aria-labelledby="t-exito">
      <div class="exito__icono" aria-hidden="true">${icono("check", "icono")}</div>
      <h1 id="t-exito">¡Gracias, ${esc(o.cliente.nombre.split(" ")[0])}!</h1>
      <p class="subtitulo">Tu pedido fue confirmado.</p>
      <p class="numero-pedido">Pedido <strong>${o.numero}</strong></p>
      <div class="exito__grid">
        <div class="dato"><small>Entrega estimada</small><strong>${o.entrega}</strong></div>
        <div class="dato"><small>Método de pago</small><strong>${esc(o.pago)}</strong></div>
        <div class="dato"><small>Te contactaremos al</small><strong>${esc(o.cliente.celular)}</strong></div>
        <div class="dato"><small>Confirmación a</small><strong>${esc(o.cliente.correo)}</strong></div>
      </div>
      <ul class="exito__items" aria-label="Productos del pedido">${items}</ul>
      <div class="resumen-compra">${filasResumen(o.totales)}</div>
      <div class="perfil__acciones">
        <a class="btn btn--primario" href="#catalogo">Seguir comprando</a>
        <a class="btn btn--secundario" href="#inicio">Ir al inicio</a>
      </div>
    </section>`;
}

/* 10. ROUTER POR HASH -------------------------------------- */
// Rutas: #inicio, #catalogo[?cat=..&mat=..], #detalle-ID, #carrito, #registro, #confirmacion
function parsearHash() {
  const crudo = location.hash.replace(/^#/, "") || "inicio";
  const [camino, consulta = ""] = crudo.split("?");
  const [ruta, param] = camino.split("-");
  return { ruta, param, consulta: new URLSearchParams(consulta) };
}

const VISTAS = {
  inicio:       () => vistaInicio(),
  catalogo:     (p, q) => vistaCatalogo(p, q),
  detalle:      id => vistaDetalle(id),
  carrito:      () => vistaCarrito(),
  registro:     () => vistaRegistro(),
  confirmacion: () => vistaConfirmacion()
};

// Acciones que se enlazan después de pintar cada vista
const ALENTRAR = {
  catalogo: pintarResultados,
  registro: () => { const f = $("#form-registro"); if (f) enlazarRegistro(f); }
};

function navegar() {
  const { ruta, param, consulta } = parsearHash();
  const vista = VISTAS[ruta] || VISTAS.inicio;
  const main = $("#contenido");
  main.innerHTML = vista(param, consulta);
  if (ALENTRAR[ruta]) ALENTRAR[ruta]();
  document.title = "Viola Joyería · " + (ruta.charAt(0).toUpperCase() + ruta.slice(1));
  window.scrollTo(0, 0);

  // Marca la opción activa de la barra inferior
  document.querySelectorAll(".nav-inferior a").forEach(a => {
    const activa = a.dataset.ruta === ruta || (ruta === "detalle" && a.dataset.ruta === "catalogo");
    activa ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  });
}

/* Eventos del formulario de registro / pago */
function enlazarRegistro(form) {
  form.addEventListener("submit", enviarRegistro);
  form.addEventListener("focusin", () => {
    if (!registroIniciado) { registroIniciado = true; registrarEvento("inicio_registro"); }
  });
  ["nombre", "correo", "celular"].forEach(id => $(`#r-${id}`).addEventListener("blur", () => validarCampo(id)));
  $("#r-celular").addEventListener("input", e => { e.target.value = e.target.value.replace(/\D/g, ""); });

  // Método de pago: muestra los campos de tarjeta (solo visual) y les da formato
  const radios = form.querySelectorAll("input[name='pago']");
  radios.forEach(r => r.addEventListener("change", () => {
    $("#datos-tarjeta").hidden = document.querySelector("input[name='pago']:checked").value !== "Tarjeta";
  }));
  const soloDigitos = (id, max, formato) => {
    const el = $(id);
    if (el) el.addEventListener("input", () => { el.value = formato(el.value.replace(/\D/g, "").slice(0, max)); });
  };
  soloDigitos("#t-num", 16, d => d.replace(/(\d{4})(?=\d)/g, "$1 "));
  soloDigitos("#t-ven", 4, d => d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d);
  soloDigitos("#t-cvv", 4, d => d);
}

/* 11. ARRANQUE --------------------------------------------- */
function iniciar() {
  cargarEstado();
  actualizarContador();

  // Buscador del encabezado: guarda el término y lleva al catálogo
  $("#form-busqueda").addEventListener("submit", e => {
    e.preventDefault();
    estado.busqueda = $("#campo-busqueda").value.trim();
    filtros = { cat: "", mat: "", precio: "", orden: "vendidos" };
    const aciertos = filtrarProductos().length;
    registrarEvento(aciertos ? "busqueda_exitosa" : "busqueda_sin_resultados", { termino: estado.busqueda, resultados: aciertos });
    const yaEstaba = location.hash.startsWith("#catalogo");
    location.hash = "#catalogo";
    if (yaEstaba) navegar();
  });

  // Filtros del catálogo
  document.addEventListener("change", e => {
    const f = e.target.dataset.filtro;
    if (f && e.target.tagName === "SELECT") { filtros[f] = e.target.value; pintarResultados(); }
    if (e.target.id === "cantidad") {
      det.cantidad = Math.min(10, Math.max(1, parseInt(e.target.value) || 1));
      e.target.value = det.cantidad; actualizarBotonAgregar();
    }
    if (e.target.dataset.cart === "regalo") { estado.regalo = e.target.checked; guardarEstado(); repintarCarrito("[data-cart='regalo']"); }
  });

  document.addEventListener("click", e => {
    const t = e.target;
    // Cuenta: cerrar sesión
    if (t.closest("[data-cerrar-sesion]")) {
      estado.usuario = null; guardarEstado(); navegar();
      mostrarAviso("<span>Cerraste sesión</span>", 2500); return;
    }
    // Ancla suave dentro del inicio
    const ancla = t.closest("[data-ancla]");
    if (ancla) { e.preventDefault(); const d = document.getElementById(ancla.dataset.ancla); if (d) d.scrollIntoView({ behavior: "smooth" }); return; }
    // Botón "+" de la tarjeta: agrega directo, o lleva al detalle si pide talla
    const rapido = t.closest("[data-rapido]");
    if (rapido) {
      const p = productoPorId(rapido.dataset.rapido);
      if (p.talla) location.hash = "#detalle-" + p.id; else agregarAlCarrito(p.id, null, 1);
      return;
    }
    // Chips de categoría (activar / desactivar)
    const chip = t.closest("button[data-filtro='cat']");
    if (chip) { filtros.cat = filtros.cat === chip.dataset.valor ? "" : chip.dataset.valor; pintarResultados(); return; }
    if (t.closest("[data-limpiar-busqueda]")) { estado.busqueda = ""; $("#campo-busqueda").value = ""; pintarResultados(); return; }
    if (t.closest("[data-limpiar-todo]")) {
      estado.busqueda = ""; $("#campo-busqueda").value = ""; navegar(); return;
    }

    // Detalle: talla, cantidad y agregar
    const talla = t.closest("[data-talla]");
    if (talla) {
      det.talla = Number(talla.dataset.talla);
      document.querySelectorAll("[data-talla]").forEach(b => b.setAttribute("aria-pressed", b === talla));
      $("#err-talla").hidden = true; return;
    }
    const cant = t.closest("[data-cant]");
    if (cant) {
      det.cantidad = Math.min(10, Math.max(1, det.cantidad + Number(cant.dataset.cant)));
      $("#cantidad").value = det.cantidad; actualizarBotonAgregar(); return;
    }
    const agregar = t.closest("[data-agregar]");
    if (agregar) {
      const p = productoPorId(agregar.dataset.agregar);
      if (p.talla && !det.talla) { const err = $("#err-talla"); err.hidden = false; $(".talla").focus(); return; }
      agregarAlCarrito(p.id, p.talla ? det.talla : null, det.cantidad); return;
    }

    // Carrito: cantidad y eliminar
    const c = t.closest("button[data-cart]");
    if (c) {
      const i = Number(c.dataset.i), linea = estado.carrito[i], accion = c.dataset.cart;
      if (accion === "mas") linea.cantidad = Math.min(10, linea.cantidad + 1);
      if (accion === "menos") linea.cantidad = Math.max(1, linea.cantidad - 1);
      if (accion === "quitar") {
        const p = productoPorId(linea.id);
        estado.carrito.splice(i, 1);
        mostrarAviso(`<span>Eliminaste <strong>${esc(p.nombre)}</strong></span>`, 2500);
      }
      guardarEstado();
      repintarCarrito(accion === "quitar" ? null : `[data-cart='${accion}'][data-i='${i}']`);
      return;
    }
  });

  // Favoritos: un solo listener delegado para todas las tarjetas
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-fav]");
    if (!btn) return;
    const id = Number(btn.dataset.fav);
    alternarFavorito(id);
    const activo = estado.favoritos.includes(id);
    const p = productoPorId(id);
    btn.setAttribute("aria-pressed", activo);
    btn.setAttribute("aria-label", `${activo ? "Quitar de favoritos" : "Agregar a favoritos"}: ${p.nombre}`);
    mostrarAviso(activo ? `<span>♥ Guardaste <strong>${esc(p.nombre)}</strong></span>` : `<span>Quitaste <strong>${esc(p.nombre)}</strong> de favoritos</span>`, 2500);
  });

  window.addEventListener("hashchange", navegar);
  navegar();
}

document.addEventListener("DOMContentLoaded", iniciar);
