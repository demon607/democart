let iconCart = document.querySelector('.icon-cart'); // Corrected class name to match CSS
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProduct = [];
let carts = JSON.parse(localStorage.getItem('cart')) || [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    listProduct.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');
        newProduct.dataset.id = product.id;
        newProduct.innerHTML = `<img src="${product.image}" width="50%" alt="${product.name}">
        <h2>${product.name}</h2>
        <div class="price">$${product.price}</div>
        <button class="addCart" data-id="${product.id}">
        ADD TO CART
        </button>
        `;
        listProductHTML.appendChild(newProduct);
    });
}

listProductHTML.addEventListener('click', (event) => {
    if(event.target.classList.contains('addCart')){
        let product_id = event.target.dataset.id;
        addToCart(product_id);
    }
})

const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((cart) => cart.product_id == product_id);
    if(positionThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    carts.forEach(cart => {
        totalQuantity += cart.quantity;
        let positionProduct = listProduct.findIndex((product) => product.id == cart.product_id);
        let info = listProduct[positionProduct];
        let newCart = document.createElement('div');
        newCart.classList.add('item');
        newCart.dataset.id = cart.product_id;
        newCart.innerHTML = `
        <div class="image">
                <img src="${info.image}" alt="${info.name}"> 
            </div>
            <div class="name">
            ${info.name}
            </div>
            <div class="totalprice">
                $${info.price * cart.quantity}
            </div>
            <div class="quantity">
                <span class="minus" data-id="${cart.product_id}">-</span>
                <span>${cart.quantity}</span>
                <span class="plus" data-id="${cart.product_id}">+</span>
            </div>
        `;
        listCartHTML.appendChild(newCart);
    });
    iconCartSpan.innerText = totalQuantity;   
}
listCartHTML.addEventListener('click', (event) => {
    if(event.target.classList.contains('minus') || event.target.classList.contains('plus')){
        let product_id = event.target.dataset.id;
        let type = event.target.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantity(product_id, type);
    }
})
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((cart) => cart.product_id == product_id);
    if(positionItemInCart >= 0){
        if(type === 'plus'){
            carts[positionItemInCart].quantity += 1;
        } else {
            carts[positionItemInCart].quantity -= 1;
            if(carts[positionItemInCart].quantity <= 0){
                carts.splice(positionItemInCart, 1);
            }
        }
    }
    addCartToMemory();
    addCartToHTML();
}
const initApp = () => {
    // get data from json 
    fetch('Product.json')
        .then(response => response.json())
        .then(data => {
            listProduct = data;
            addDataToHTML();
            addCartToHTML();
        })

}
initApp();