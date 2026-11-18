/* =====================================================================
   DATOS DEL SITIO — destinos, paquetes y guías
   ===================================================================== */


var DEST = {
  "Bariloche":      { precio: 210, icono: "❄",  pais: "Argentina",       slug: "bariloche" },
  "Cancún":         { precio: 520, icono: "🏝", pais: "México",          slug: "cancun" },
  "Río de Janeiro": { precio: 380, icono: "☀",  pais: "Brasil",          slug: "rio-de-janeiro" },
  "Madrid":         { precio: 890, icono: "🏛", pais: "España",          slug: "madrid" },
  "Cusco":          { precio: 460, icono: "⛰",  pais: "Perú",            slug: "cusco" },
  "Punta Cana":     { precio: 560, icono: "🌴", pais: "Rep. Dominicana", slug: "punta-cana" },
  "Miami":          { precio: 640, icono: "🌆", pais: "Estados Unidos",  slug: "miami" },
  "Ushuaia":        { precio: 260, icono: "🐧", pais: "Argentina",       slug: "ushuaia" }
};

/* ---------- Paquetes ----------
   cat: nac = nacionales · int = internacionales · car = Caribe */
var PK = [
  { destino: "Bariloche",      titulo: "Nieve y chocolate",     noches: 7, incluye: "Aéreo + hotel 4★ + pase de ski",            cat: "nac" },
  { destino: "Cancún",         titulo: "Caribe all inclusive",  noches: 8, incluye: "Aéreo + resort todo incluido + traslados",  cat: "car" },
  { destino: "Río de Janeiro", titulo: "Samba y playa",         noches: 6, incluye: "Aéreo + hotel + city tour",                 cat: "int" },
  { destino: "Madrid",         titulo: "Capital europea",       noches: 9, incluye: "Aéreo + hotel + traslados + seguro",        cat: "int" },
  { destino: "Cusco",          titulo: "Machu Picchu",          noches: 7, incluye: "Aéreo + hotel + tren a Machu Picchu",       cat: "int" },
  { destino: "Punta Cana",     titulo: "Descanso total",        noches: 7, incluye: "Aéreo + resort + traslados",                cat: "car" },
  { destino: "Ushuaia",        titulo: "Fin del mundo",         noches: 5, incluye: "Aéreo + hotel + navegación Beagle",         cat: "nac" }
];

/* Categorías del filtro de paquetes */
var CH = { all: "Todos", nac: "Nacionales", int: "Internacionales", car: "Caribe" };

/* ---------- Guías de viaje ---------- */
var BL = [
  {
    titulo: "Requisitos migratorios para viajar desde Argentina",
    texto: "Pasaporte vigente, visas y autorizaciones electrónicas: qué pedir según destino. Verificá siempre en el consulado oficial: Para Brasil, Chile, Uruguay y Paraguay alcanza el DNI; Estados Unidos requiere visa; la Unión Europea exigirá ETIAS desde su entrada en vigor. Revisá la validez mínima del pasaporte (suele ser 6 meses)."
  },
  {
    titulo: "Equipaje permitido: cómo no pagar de más",
    texto: "Cada aerolínea fija peso y medidas. Típico: mano 8–10 kg, despachado 23 kg en internacionales; low cost cobra aparte. Pesá la valija en casa, fotografiá tu equipaje y llevá lo valioso en cabina."
  },
  {
    titulo: "7 tips para volar más cómodo",
    texto: "Check-in online, asiento en pasillo para trayectos largos, hidratación, ropa en capas, cargador portátil, llegar 3 h antes en internacionales y descargar la tarjeta de embarque."
  },
  {
    titulo: "Guía rápida: Bariloche en 5 días",
    texto: "Cerro Catedral en invierno, Circuito Chico, Llao Llao, cervecerías y chocolaterías. Mejor época: julio–agosto para nieve; diciembre–marzo para lagos y trekking."
  }
];
