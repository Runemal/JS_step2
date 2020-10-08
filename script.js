const goods = [
    {
        title: 'Shirt',
        price: 150,
        img: 'img/logo.png'
    },
    {
        title: 'Socks',
        price: 50,
        img: 'img/logo.png'
    },
    {
        title: 'Jacket',
        price: 350,
        img: 'img/logo.png'
    },
    {
        title: 'Shoes',
        price: 250,
        img: 'img/logo.png'
    },
    {
        title: 'Shirt',
        price: 150,
        img: 'img/logo.png'
    },
    {
        title: 'Socks',
        price: 50,
        img: 'img/logo.png'
    },
    {
        title: 'Jacket',
        price: 350,
        img: 'img/logo.png'
    },
    {
        title: 'Shoes',
        price: 250,
        img: 'img/logo.png'
    },
    {
        title: 'Shirt',
        price: 150,
        img: 'img/logo.png'
    },
    {
        title: 'Socks',
        price: 50,
        img: 'img/logo.png'
    },
    {
        title: 'Jacket',
        price: 350,
        img: 'img/logo.png'
    },
    {
        title: 'Shoes',
        price: 250,
        img: 'img/logo.png'
    },
  ];

const renderGoodsItem = (title, price, img) => {
    return `<div class="goods-item"><img src="${img}" alt="${title}" height="50" width="50"><h3>${title}</h3><p>${price}</p><button class="add-button" type="add-button">Добавить</button></div>`;
};

const renderGoodsList = (list) => {
    const goodsList = list.map(item => renderGoodsItem(item.title, item.price, item.img));
    document.querySelector('.goods-list').innerHTML = goodsList.join('');
}

renderGoodsList(goods);

const renderFooter = () => {
    document.getElementById('footer');
    footer.innerHTML = '&copy; Все права защищены.';
}

renderFooter();
