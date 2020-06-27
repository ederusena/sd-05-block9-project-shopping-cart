window.onload = function onload() {};

function cartItemClickListener(event) {
  const target = event.target;
  target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function searchInfo(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
.then(response => response.json())
.then((data) => {
  const neededInfo = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const fatherCart = document.getElementsByClassName('cart__items')[0];
  fatherCart.appendChild(createCartItemElement(neededInfo));
});
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToChart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(addToChart);
  addToChart.addEventListener('click', function () {
    searchInfo(sku);
  });
  const fatherElement = document.getElementsByClassName('items')[0];
  fatherElement.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then(response => response.json())
.then((data) => {
  data.results.forEach((element) => {
    const product = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    createProductItemElement(product);
  });
});
