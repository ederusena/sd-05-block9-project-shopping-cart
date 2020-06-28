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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const productClicked = event.target;
  if (productClicked.classList.contains('cart__item')) {
    const info = productClicked.innerText.split(' ');
    const productsListStorage = localStorage.productsList.split(',');
    const index = productsListStorage.indexOf(info[1]);
    productsListStorage.splice(index, 1);
    localStorage.productsList = productsListStorage;
    let price = info[info.length - 1];
    price = price.split('$');
    finalPrice(false, price[1]);
    productClicked.remove();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveLocalStorage(productInformation) {
  let productsListStorage = [];
  if (localStorage.productsList) {
    productsListStorage = [localStorage.productsList];
  } else {
    productsListStorage = [];
  }
  productsListStorage.push(productInformation.sku);
  localStorage.productsList = productsListStorage;
}

function createElementCart(ID) {
  return (fetch(`https://api.mercadolibre.com/items/${ID}`)
  .then(response => response.json())
  .then(function (data) {
    const productInformation = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const productElement = createCartItemElement(productInformation);
    document.getElementsByClassName('cart__items')[0].appendChild(productElement);
    return productInformation;
  }))
}

async function finalPrice(somar, price) {
  let totalPrice = parseInt(document.querySelector('.total-price').innerText);
  if(somar) {
    totalPrice += price;
    document.querySelector('.total-price').innerText = totalPrice;
  } else {
    totalPrice -= price;
    document.querySelector('.total-price').innerText = totalPrice;
  }
}

const addToCart = async function(ID) {
  try {
    const productInformation = await createElementCart(ID);
    saveLocalStorage(productInformation);
    finalPrice(true, productInformation.salePrice);
  } catch(e) {
    console.log(e);
  }
}

function loadCart() {
  if (localStorage.productsList) {
    const productsListStorage = localStorage.productsList.split(',');
    productsListStorage.forEach(async (ID) => {
      const productInformation = await createElementCart(ID);
      finalPrice(true, productInformation.salePrice);
    });
  }
}

function loadProducts() {
  const productList = document.getElementsByClassName('items')[0];
  function getProduct(e) {
    const productSelected = e.target;
    if (productSelected.classList.contains('item__add')) {
      const productSelectedID = productSelected.parentNode.firstChild.innerText;
      addToCart(productSelectedID);
    }
  }
  productList.addEventListener('click', getProduct);
}

function erase() {
  const buttonClearCart = document.getElementsByClassName('empty-cart')[0];
  function cleanCart() {
    const cartList = document.getElementsByClassName('cart__items')[0];
    if (cartList) {
      cartList.innerHTML = '';
      localStorage.removeItem('productsList');
    }
  }
  buttonClearCart.addEventListener('click', cleanCart);
}

function loading() {
  const loadObject = document.querySelector('.loading-container');
  loadObject.appendChild(createCustomElement('span', 'loading', 'loading'));
}

window.onload = function onload() {
  loading();
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 1000);
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
    .then(response => response.json())
    .then(function (data) {
      data.results.forEach((element) => {
        const productInformation = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        const productElement = createProductItemElement(productInformation);
        document.getElementsByClassName('items')[0].appendChild(productElement);
      });
    })
    .then(function () { loadProducts(); })
    .then(function () { loadCart(); })
    .then(function () { erase(); })
    .catch((error) => {
      document.getElementsByClassName('items')[0].innerHTML = error;
    });
    // Apaga a frase de loading no término da requisação
    /* .then(function () {
      document.getElementsByClassName('loading')[0].remove();
    });*/
};
