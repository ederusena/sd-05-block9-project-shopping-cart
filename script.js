// ANCHOR Cria a imagem no grid - Não devo mexer
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// ANCHOR Cria item por item qnd chamado - Não devo mexer
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// ANCHOR createProductItemElement

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));

  section.appendChild(createProductImageElement(image));

  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}
// ANCHOR getSkuFromProductItem
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
// ANCHOR cartItemClickListener - Apaga o item clicado
function cartItemClickListener(event) {
  const child = event.target;
  const idDoItemDoCart = child.children[0].className;
  localStorage.removeItem(idDoItemDoCart);

  child.parentNode.removeChild(child);
  console.log(idDoItemDoCart);
}
// ANCHOR createCartItemElement
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


// ANCHOR fetch specific item and Add to the cart
// prettier-ignore
const catchIDandCreateCartItemElement = (event) => {
  const productID = event.target.parentNode.querySelector('.item__sku')
    .innerHTML;
    fetchItemToCart(productID);
};

const loadCartItems = () => {
  for (var i = 0; i < localStorage.length; i+= 1) {
    fetchItemToCart(localStorage.key(i));
  }
};

const fetchItemToCart = (productSKU) => {
  fetch(`https://api.mercadolibre.com/items/${productSKU}`)
  .then(response => response.json())
  .then((data) => {
    const li = createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    });

    const span = document.createElement('span');
    span.className = productSKU;
    li.appendChild(span);

    const cartItems = document.getElementsByClassName('cart__items')[0];
    
    cartItems.appendChild(li);

    localStorage.setItem(productSKU, data.price)
  });
}

// ANCHOR fetchMercadoLivreComputadores

const apiComputadorUrl =
  'https://api.mercadolibre.com/sites/MLB/search?q=$computador';


// ANCHOR Adiciona os produtos à página
// prettier-ignore
const fetchMercadoLivre = () => {
  fetch(apiComputadorUrl)
    .then(response => response.json())
    .then((data) => {
      const allProducts = data.results;
      return allProducts;
    })
    .then((produtos) => {
      let index = 0;
      produtos.forEach((produto) => {
        const obj = {
          sku: produto.id,
          name: produto.title,
          image: produto.thumbnail,
        };
        const items = document.getElementsByClassName('items')[0];
        const section = createProductItemElement(obj);
        items.appendChild(section);

        const btnItemAdd = document.getElementsByClassName('item__add')[index];
        index += 1;

        btnItemAdd.addEventListener('click', catchIDandCreateCartItemElement);
      });
    });
};

window.onload = function onload() {
  fetchMercadoLivre();
  loadCartItems();
};
