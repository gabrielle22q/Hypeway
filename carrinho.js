const KEY = 'cart'; // chave no localStorage

function getCart(){
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}
function saveCart(cart){
  localStorage.setItem(KEY, JSON.stringify(cart));
  updateBadge();
}

function formatCurrency(v){
  return v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
}

function updateBadge(){
  const cart = getCart();
  const count = cart.reduce((s,i)=> s + (i.qty||0), 0);
  const badge = document.querySelector('.cart-badge');
  if(badge) badge.textContent = count;
}

function renderCart(){
  const container = document.getElementById('cart-items');
  const empty = document.getElementById('empty-message');
  const subtotalEl = document.getElementById('subtotal');
  const freteEl = document.getElementById('frete');
  const totalEl = document.getElementById('total');

  const cart = getCart();
  container.innerHTML = '';

  if(!cart.length){
    empty.hidden = false;
    document.querySelector('.cart-content').style.display = 'none';
    subtotalEl.textContent = formatCurrency(0);
    freteEl.textContent = formatCurrency(0);
    totalEl.textContent = formatCurrency(0);
    return;
  }

  empty.hidden = true;
  document.querySelector('.cart-content').style.display = 'flex';

  let subtotal = 0;
  cart.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="thumb"><img src="${item.image || 'imagens/placeholder.png'}" alt="${item.name}"></div>
      <div class="info">
        <div class="title">${item.name}</div>
        <div class="price">${formatCurrency(item.price)}</div>
        <div class="controls">
          <div class="qty" data-id="${item.id}">
            <button class="dec" aria-label="Diminuir">-</button>
            <div class="value">${item.qty}</div>
            <button class="inc" aria-label="Aumentar">+</button>
          </div>
          <button class="remove-btn" data-id="${item.id}">Remover</button>
        </div>
      </div>
    `;
    container.appendChild(row);
    subtotal += item.price * (item.qty||1);
  });

  const frete = subtotal > 0 ? 0 : 0; // ajuste se quiser calcular frete
  subtotalEl.textContent = formatCurrency(subtotal);
  freteEl.textContent = formatCurrency(frete);
  totalEl.textContent = formatCurrency(subtotal + frete);

  // delegação de eventos
  container.onclick = (e) => {
    const target = e.target;
    if(target.classList.contains('inc') || target.classList.contains('dec')){
      const id = target.closest('.qty').dataset.id;
      const cart = getCart();
      const item = cart.find(x=> x.id == id);
      if(!item) return;
      if(target.classList.contains('inc')) item.qty = (item.qty||1) + 1;
      else item.qty = Math.max(1, (item.qty||1) - 1);
      saveCart(cart);
      renderCart();
    } else if(target.classList.contains('remove-btn')){
      const id = target.dataset.id;
      let cart = getCart();
      cart = cart.filter(x=> x.id != id);
      saveCart(cart);
      renderCart();
    }
  };
}

// inicialização
updateBadge();
renderCart();