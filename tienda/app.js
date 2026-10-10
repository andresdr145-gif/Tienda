let categoriaActual = "Todos";
let textoBusqueda = "";
let carrito = []; // [{ id, cantidad }]

const $ = (id) => document.getElementById(id);

// ---------- Categorías ----------
function pintarCategorias() {
  $("categorias").innerHTML = ["Todos", ...CATEGORIAS].map(c => `
    <button type="button" class="btn btn-outline-secondary btn-sm ${c === categoriaActual ? "activa" : ""}"
            aria-pressed="${c === categoriaActual}" onclick="elegirCategoria('${c}')">${c}</button>`).join("");
}

function elegirCategoria(c) {
  categoriaActual = c;
  pintarCategorias();
  pintarProductos();
}

// ---------- Productos ----------
function pintarProductos() {
  const lista = PRODUCTOS.filter(p =>
    (categoriaActual === "Todos" || p.categoria === categoriaActual) &&
    p.nombre.toLowerCase().includes(textoBusqueda)
  );

  $("productos").innerHTML = lista.map(p => `
    <div class="col">
      <div class="card producto h-100 shadow-sm text-center">
        <div class="card-body d-flex flex-column">
          <div class="emoji" aria-hidden="true">${p.emoji}</div>
          <h3 class="h6 mt-2">${p.nombre}</h3>
          <p class="text-secondary small mb-1">${p.categoria}</p>
          <p class="precio">$${p.precio.toFixed(2)}</p>
          <button type="button" class="btn btn-primary mt-auto" onclick="agregar(${p.id})">Agregar al carrito</button>
        </div>
      </div>
    </div>`).join("");

  $("vacio").classList.toggle("d-none", lista.length > 0);
  $("conteo").textContent = `${lista.length} producto(s)`;
}

// ---------- Carrito ----------
function agregar(id) {
  const item = carrito.find(i => i.id === id);
  if (item) item.cantidad++;
  else carrito.push({ id, cantidad: 1 });
  pintarCarrito();
}

function quitar(id) {
  const item = carrito.find(i => i.id === id);
  item.cantidad--;
  if (item.cantidad === 0) carrito = carrito.filter(i => i.id !== id);
  pintarCarrito();
}

function pintarCarrito() {
  let total = 0, unidades = 0;

  $("itemsCarrito").innerHTML = carrito.map(i => {
    const p = PRODUCTOS.find(p => p.id === i.id);
    total += p.precio * i.cantidad;
    unidades += i.cantidad;
    return `<div class="d-flex justify-content-between align-items-center mb-2">
      <span>${p.emoji} ${p.nombre} <span class="text-secondary">x${i.cantidad}</span></span>
      <button type="button" class="btn btn-sm btn-outline-secondary" aria-label="Quitar uno de ${p.nombre}" onclick="quitar(${p.id})">−</button>
    </div>`;
  }).join("") || '<p class="text-secondary">Tu carrito está vacío.</p>';

  $("total").textContent = total.toFixed(2);
  $("contador").textContent = unidades;
}

// ---------- Eventos ----------
$("busqueda").addEventListener("input", e => {
  textoBusqueda = e.target.value.toLowerCase();
  pintarProductos();
});
$("btnVaciar").onclick = () => { carrito = []; pintarCarrito(); };

// ---------- Inicio ----------
pintarCategorias();
pintarProductos();
pintarCarrito();
