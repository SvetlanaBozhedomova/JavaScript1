'use strict';

const basketEl = document.querySelector('.basket');
const featItemsElems = document.querySelector('.featuredItems');
const basketCounterEl = document.querySelector('.cartIconWrap span');
const basketTotalEl = document.querySelector('.basketTotal');
const basketTotalValueEl = document.querySelector('.basketTotalValue');

// показать-убрать корзину по клику на корзине
document.querySelector('.cartIconWrap').addEventListener('click',
  () => { basketEl.classList.toggle('hidden'); }
);

// корзина для выбранного товара:
// {
//   id1: {id: id1, name: название товара1, price: цена, count: кол-во},
//   id2: {id: id2, name: название товара2, price: цена, count: кол-во},
// }
const basket = {};

// добавить товар в basket по клику на "Add to cart"
featItemsElems.addEventListener('click', event => {
  if (!event.target.closest('.addToCart')) {
    return;
  }
  // ищем родителя с данными, берём данные у родителя и добавляем в basket
  const featuredItemEl = event.target.closest('.featuredItem');
  const id = +featuredItemEl.dataset.id;
  const name = featuredItemEl.dataset.name;
  const price = +featuredItemEl.dataset.price;
  addToCart(id, name, price);
});

/**
 * Добавить товар в корзину.
 * @param {number} id - id товара
 * @param {string} name - название товара
 * @param {number} price - цена товара
 */
function addToCart(id, name, price) {
  // создаём объект - элемент объекта basket, если его там ещё нет
  if (!(id in basket)) {
    basket[id] = { id: id, name: name, price: price, count: 0 };
  }
  basket[id].count++;
  // считаем кол-во товаров и записываем около значка корзины
  basketCounterEl.textContent = String(countProducts());
  // считаем стоимость товаров
  basketTotalValueEl.textContent = String(countTotalPrice());
  // строка о добавленном товаре в окне корзины
  renderProductInBasket(id);
}

/**
 * Посчитать количество товаров в корзине.
 * @return {number} - количество товаров
 */
function countProducts() {
  let count = 0;
  for (const obj in basket) {
    count += basket[obj].count;
  }
  return count;
}

/**
 * Посчитать общую стоимость товаров в корзине.
 * @return {number} - общая стоимость товаров
 */
function countTotalPrice() {
  let price = 0;
  for (const obj in basket) {
    price += basket[obj].price * basket[obj].count;
  }
  return price.toFixed(2);
}

/**
 * Отрисовать информацию о товаре в окне корзины.
 * @param {number} productId - id товара
 */
function renderProductInBasket(productId) {
  // пытаемся найти строку товара в корзине
  const basketRowEl = basketEl
    .querySelector(`.basketRow[data-productId="${productId}"]`);
  if (!basketRowEl) {
    renderNewProductInBasket(productId);
    return;
  }
  // строка товара уже есть в корзине
  // меняем кол-во штук
  basketRowEl.querySelector('.productCount').textContent =
    basket[productId].count;
  // меняем стоимость
  basketRowEl.querySelector('.productTotalRow').textContent =
    (basket[productId].price * basket[productId].count).toFixed(2);
}

/**
 * Добавить новую строку товара в окно корзины.
 * @param {number} productId - id товара.
 */
function renderNewProductInBasket(productId) {
  const newRow = `
    <div class="basketRow" data-productId="${productId}">
      <div>${basket[productId].name}</div>
      <div>
        <span class="productCount">${basket[productId].count}</span> шт.
      </div>
      <div>$${(basket[productId].price).toFixed(2)}</div>
      <div>
        $<span class="productTotalRow">
          ${(basket[productId].price * basket[productId].count).toFixed(2)}
        </span>
      </div>
    </div>
    `;
  basketTotalEl.insertAdjacentHTML("beforebegin", newRow);
}
