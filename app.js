


/* ---------- utilidades -------- */
function $(id) {
  return document.getElementById(id);
}

function fmt(n) {
  return "USD " + n.toLocaleString("es-AR");
}


function enc(s) {
  var map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
  return String(s).replace(/[&<>"]/g, function (c) { return map[c]; });
}

/* nmero entero repetible a partir de un texto  */
function hash(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}


/* ---------- telefono ---------- */
function phoneOk(v) {
  var digits = String(v).replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function phoneNorm(v) {
  var p = String(v).trim();
  var digits = p.replace(/\D/g, "");
  return (p[0] === "+" ? "+" : "") + digits;
}


function wireTel(el) {
  el.addEventListener("input", function () {
    el.value = el.value.replace(/[^\d+\-()\s]/g, "");
    el.classList.toggle("bad", el.value && !phoneOk(el.value));
  });
}



var hoy = new Date();

/* Fecha local  */
function iso(d) {
  return d.getFullYear() + "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
    ("0" + d.getDate()).slice(-2);
}

function mostrarAviso(msg) {
  $("res").innerHTML = msg ? '<p class="msg err">' + msg + "</p>" : "";
}

/* Ajusta el mínimo del calendario de vuelta.
   Devuelve false si la vuelta es anterior a la ida (y la corrige si fix = true). */
function syncDates(fix) {
  var ida = $("d1").value;
  var vuelta = $("d2").value;

  $("d2").min = ida || iso(hoy);

  if (ida && vuelta && vuelta < ida) {
    if (fix) {
      $("d2").value = ida;
      mostrarAviso("La fecha de vuelta no puede ser anterior a la de ida. La ajustamos al día de ida.");
    }
    return false;
  }
  return true;
}

function initDates() {
  var DIA = 864e5;
  $("d1").min = iso(hoy);
  $("d1").value = iso(new Date(hoy.getTime() + 30 * DIA));
  $("d2").value = iso(new Date(hoy.getTime() + 37 * DIA));

  $("d1").onchange = function () {
    if ($("d1").value && $("d1").value < iso(hoy)) $("d1").value = iso(hoy);
    if (syncDates(true)) mostrarAviso("");
  };
  $("d2").onchange = function () {
    syncDates(true);
  };
  syncDates(false);
}
initDates();


/* ---------- 4. FOTOS ----------
   Busca img/<slug>.jpg; si no existe usa img/<slug>.svg; si tampoco, queda el color. */
function imgErr(el) {
  if (!el.dataset.t) {
    el.dataset.t = 1;
    el.src = el.src.replace(/\.jpg$/, ".svg");
  } else {
    el.classList.add("oculta");
  }
}


document.addEventListener("error", function (e) {
  if (e.target.tagName === "IMG" && e.target.closest(".ph")) imgErr(e.target);
}, true);

/* Tarjeta con foto, nombre y país. tag = "div" o "button" */
function photo(nombre, clase, tag, extra) {
  var d = DEST[nombre];
  return "<" + tag + ' class="' + clase + " ph " + d.slug + '"' + (extra || "") + ">" +
    '<img loading="lazy" src="img/' + d.slug + '.jpg" alt="' + nombre + ", " + d.pais + '">' +
    '<div class="cap"><b>' + nombre + "</b><span>📍 " + d.pais + "</span></div>" +
    "</" + tag + ">";
}


/* ---------- (vuelos / paquetes) ---------- */
var sel = $("de");
Object.keys(DEST).forEach(function (k) {
  sel.add(new Option(k, k));
});

var mode = "v"; // v = vuelos, p = paquetes

document.querySelectorAll(".tabs button").forEach(function (btn) {
  btn.onclick = function () {
    document.querySelectorAll(".tabs button").forEach(function (b) {
      b.classList.remove("on");
    });
    btn.classList.add("on");
    mode = btn.dataset.t;
    $("go").textContent = mode === "v" ? "Buscar" : "Ver paquetes";
    $("res").innerHTML = "";
  };
});

/* Una fila de resultado con precio y botón Reservar */
function rowHtml(titulo, subtitulo, precio, etiqueta) {
  var detalle = enc(etiqueta + " — " + titulo.replace(/<[^>]*>/g, ""));
  return '<div class="row">' +
    "<div><b>" + titulo + '</b><div class="mu">' + subtitulo + "</div></div>" +
    '<div class="side">' +
    '<div class="price">' + fmt(Math.round(precio)) + "</div>" +
    '<div class="mu">total ' + $("px").value + " pax</div>" +
    '<button class="btn" data-r="' + detalle + '" data-p="' + Math.round(precio) + '" data-book>Reservar</button>' +
    "</div></div>";
}

function buscarPaquetes(destino, base, pax) {
  var r = $("res");
  var lista = PK.filter(function (p) { return p.destino === destino; });

  if (!lista.length) {
    r.innerHTML = "<p>Sin paquete cerrado a ese destino: pedí un presupuesto a medida abajo.</p>" +
      '<a class="btn s" href="#cotizar">Cotizar a medida</a>';
    return;
  }
  r.innerHTML = lista.map(function (p) {
    return rowHtml(p.titulo + " · " + p.noches + " noches", p.incluye, base * 1.9 * pax, "Paquete " + destino);
  }).join("");
}

function buscarVuelos(destino, base, pax) {
  var aerolineas = ["Aerolíneas Argentinas", "LATAM", "Flybondi", "Iberia"];
  var seed = hash(destino + $("d1").value);
  var origen = $("or").value.split(" (")[0];
  var html = "";

  for (var i = 0; i < 4; i++) {
    var tarifa = base * (0.85 + ((seed >> i) % 30) / 100) * (1 + i * 0.07);
    var asientos = 1 + ((seed >> (i + 3)) % 9);
    var hora = ("0" + (6 + i * 4)).slice(-2) + ":" + (i % 2 ? "15" : "40");
    var duracion = (2 + (seed >> i) % 9) + "h " + ((seed >> i) % 5) * 10 + "m";
    var escala = i % 2 ? " · 1 escala" : " · directo";
    var equipaje = i === 2 ? "de mano" : "23 kg";
    var aviso = asientos < 5
      ? ' · <span class="pill w">Quedan ' + asientos + " asientos</span>"
      : ' · <span class="pill">' + asientos + " asientos</span>";

    html += rowHtml(
      aerolineas[i] + " · " + hora + " → " + duracion + escala,
      origen + " → " + destino + " · equipaje " + equipaje + aviso,
      Math.round(tarifa) * pax,
      "Vuelo " + aerolineas[i] + " a " + destino
    );
  }
  $("res").innerHTML = html;
}

$("go").onclick = function () {
  var destino = sel.value;
  var pax = +$("px").value;
  var base = DEST[destino].precio;

  if (!$("d1").value) {
    $("res").innerHTML = "<p>Elegí la fecha de ida.</p>";
    return;
  }
  if ($("d1").value < iso(hoy)) $("d1").value = iso(hoy);
  if (!syncDates(true)) return; // vuelta anterior a la ida: se corrige y se avisa

  if (mode === "p") buscarPaquetes(destino, base, pax);
  else buscarVuelos(destino, base, pax);
};


/* ---------- 6. PAQUETES Y DESTINOS ---------- */
var cat = "all";

Object.keys(CH).forEach(function (k) {
  var chip = document.createElement("button");
  chip.textContent = CH[k];
  if (k === "all") chip.className = "on";

  chip.onclick = function () {
    cat = k;
    [].forEach.call($("chips").children, function (x) { x.classList.remove("on"); });
    chip.classList.add("on");
    drawPk();
  };
  $("chips").appendChild(chip);
});

function drawPk() {
  $("pk").innerHTML = PK
    .filter(function (p) { return cat === "all" || p.cat === cat; })
    .map(function (p) {
      var precio = Math.round(DEST[p.destino].precio * 1.9);
      return '<div class="card pk">' +
        photo(p.destino, "im", "div") +
        '<div class="bd">' +
        "<b>" + p.titulo + "</b>" +
        '<span class="pill">' + p.noches + " noches</span>" +
        "<ul><li>" + p.incluye.split(" + ").join("</li><li>") + "</li></ul>" +
        '<div class="price">' + fmt(precio) + ' <span class="mu">p/p</span></div>' +
        '<button class="btn" data-r="Paquete ' + p.destino + " — " + p.titulo + '" data-p="' + precio + '" data-book>Reservar</button>' +
        "</div></div>";
    }).join("");
}
drawPk();


$("dg").innerHTML = Object.keys(DEST).map(function (n) {
  return photo(n, "", "button", ' type="button" data-d="' + n + '"');
}).join("");

[].forEach.call($("dg").children, function (b) {
  b.onclick = function () {
    sel.value = b.dataset.d;
    $("res").innerHTML = "";
    $("buscar").scrollIntoView();
  };
});


/* ---------- 7. GUÍAS DE VIAJE ---------- */
$("bl").innerHTML = BL.map(function (g, i) {
  return '<div class="card">' +
    "<h3>" + g.titulo + "</h3>" +
    '<p class="mu">' + g.texto.slice(0, 80) + "…</p>" +
    '<button class="btn o" data-art="' + i + '">Leer guía</button>' +
    "</div>";
}).join("");

function art(i) {
  $("mc").innerHTML = "<h2>" + BL[i].titulo + "</h2><p>" + BL[i].texto + "</p>" +
    '<button class="btn s" data-close>Cerrar</button>';
  $("m").classList.add("on");
}

function cl() {
  $("m").classList.remove("on");
}

$("m").onclick = function (e) {
  if (e.target === this) cl();
};

/* Botones creados dinámicamente: un solo "oyente" para todos */
document.addEventListener("click", function (e) {
  var reservar = e.target.closest("[data-book]");
  var guia = e.target.closest("[data-art]");

  if (reservar) book(reservar);
  else if (guia) art(+guia.dataset.art);
  else if (e.target.closest("[data-close]")) cl();
});

/* Los formularios no recargan la página */
["fs", "fq"].forEach(function (id) {
  $(id).addEventListener("submit", function (e) { e.preventDefault(); });
});


/* ---------- 8. RESERVAS (ventana modal) ---------- */
function book(el) {
  var producto = el.dataset.r;
  var total = +el.dataset.p;

  $("mc").innerHTML =
    "<h2>Reservar</h2>" +
    "<p><b>" + producto + '</b><br><span class="price">' + fmt(total) + "</span></p>" +
    '<p class="mu">Reserva sin pago: te contactamos para confirmar y coordinar la seña.</p>' +
    '<div class="g">' +
    '<div><label>Nombre</label><input id="bn"></div>' +
    '<div><label>Teléfono / WhatsApp *</label><input id="bt" type="tel" inputmode="tel" autocomplete="tel" placeholder="+54 9 11 1234-5678"></div>' +
    "</div>" +
    '<div class="actions"><button class="btn" id="bc">Confirmar reserva</button>' +
    '<button class="btn o" data-close>Cancelar</button></div>' +
    '<div id="bm"></div>';
  $("m").classList.add("on");

  wireTel($("bt"));

  $("bc").onclick = async function () {
    var nombre = $("bn").value.trim();
    var tel = $("bt").value.trim();

    if (!nombre) {
      $("bm").innerHTML = '<div class="msg err">Ingresá tu nombre.</div>';
      return;
    }
    if (!phoneOk(tel)) {
      $("bm").innerHTML = '<div class="msg err">Ingresá un teléfono válido (8 a 15 dígitos, con código de país). Sin teléfono no podemos confirmar la reserva.</div>';
      $("bt").focus();
      return;
    }

    var ok = await save("reservas", {
      producto: producto,
      total: total,
      pasajeros: +$("px").value,
      ida: $("d1").value,
      vuelta: $("d2").value,
      nombre: nombre,
      telefono: phoneNorm(tel)
    });

    var texto = ok === true
      ? "✓ Reserva registrada. Un asesor te escribe pronto."
      : "Reserva guardada en este dispositivo. Confirmala por WhatsApp para que la veamos.";
    var wa = "https://wa.me/" + WA + "?text=" +
      encodeURIComponent("Hola, quiero reservar: " + producto + " a nombre de " + nombre);

    $("bm").innerHTML = '<div class="msg">' + texto + "</div>" +
      '<p><a class="btn" target="_blank" rel="noopener" href="' + wa + '">Confirmar por WhatsApp</a></p>';
  };
}



async function save(tabla, datos) {
  delete datos.id;
  delete datos.creado;

  /* Los campos vacíos viajan como null (si no, las fechas vacías dan error) */
  ["ida", "vuelta", "fecha", "email", "comentarios"].forEach(function (k) {
    if (k in datos && datos[k] === "") datos[k] = null;
  });

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      var resp = await fetch(SUPABASE_URL + "/rest/v1/" + tabla, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(datos)
      });
      if (resp.ok) return true;
      console.warn("Supabase respondió " + resp.status + ":", await resp.text());
    } catch (e) {
      console.warn("No se pudo conectar con Supabase:", e);
    }
  }

  try {
    var clave = "rumbosur_" + tabla;
    var lista = JSON.parse(localStorage.getItem(clave) || "[]");
    datos.creado = new Date().toISOString();
    lista.push(datos);
    localStorage.setItem(clave, JSON.stringify(lista));
    return "local";
  } catch (e) {
    return false;
  }
}



wireTel($("qt"));

$("sq").onclick = async function () {
  var nombre = $("qn").value.trim();
  var tel = $("qt").value.trim();
  var destino = $("qd").value.trim();

  if (!nombre || !destino) {
    $("qm").innerHTML = '<div class="msg err">Completá nombre y destino.</div>';
    return;
  }
  if (!phoneOk(tel)) {
    $("qm").innerHTML = '<div class="msg err">El teléfono es obligatorio y debe ser válido (con código de país).</div>';
    $("qt").focus();
    return;
  }

  var ok = await save("solicitudes", {
    nombre: nombre,
    telefono: phoneNorm(tel),
    email: $("qe").value,
    destino: destino,
    fecha: $("qf").value,
    viajeros: +$("qp").value,
    comentarios: $("qc").value
  });

  $("qm").innerHTML = '<div class="msg">' + (ok === true
    ? "✓ Solicitud enviada. ¡Gracias, " + enc(nombre) + "!"
    : "Recibimos tu solicitud en este dispositivo. Para que llegue ya a un asesor, enviala por WhatsApp.") + "</div>";
};


/* ---------- 11. WHATSAPP ---------- */
$("wq").onclick = function () {
  if (!$("qn").value.trim() || !phoneOk($("qt").value)) {
    $("qm").innerHTML = '<div class="msg err">Ingresá tu nombre y un teléfono válido antes de continuar.</div>';
    $("qt").focus();
    return;
  }
  var msg = "Hola, soy " + $("qn").value + ". Quiero cotizar " + $("qd").value +
    " para " + $("qp").value + " personas (" + $("qf").value + "). " + $("qc").value;
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank");
};

/* Botón flotante */
$("wa").href = "https://wa.me/" + WA + "?text=" +
  encodeURIComponent("Hola, quisiera información sobre viajes");
