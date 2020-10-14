class GoodsItem {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
    }
    render() {
        return `<div class="goods-item"><img src="${this.img}" alt="${this.title}" height="50" width="50"><h3>${this.title}</h3><p>${this.price}</p><button class="add-button" type="add-button">Добавить</button></div>`;
    }
}

//Класс корзины не доработан!!!
class BusketList {
    constructor() {
        this.myBusket = [];
    }
    allInBusket() {
        for (i = 0; i < localStorage.length; i++) {
            this.myBusket.push({
                title: localStorage.key(i),
                count: Number(localStorage.getItem(localStorage.key(i)))
            });
        }
    }
    renderBasket() {
        if (this.myBusket.size != 0) {
            for (i of this.myBusket.keys()) {
                basketcatalog.insertAdjacentHTML('beforeend', '<a href="catalog/' + list.get(i)[2] + '"><img src="" alt="" height="200" width="150"><br>' + i + '</a>' + '<div style="display: inline; float: right; width: 1em; height: 1em; color: red;" type="button" onclick="deleteProduct(\'' + i + '\')" >&#215</div><div style=" display: inline; float: right; width: 1em; height: 1em;  color: blue;" type="button" onclick="editProduct(\'' + i + '\')">&#177</div>' + '<div style="float: right;">' + this.myBusket.get(i)[0] + ' шт. &#8195<br></div>');
            }
            basketprise.insertAdjacentHTML('beforeend', '<hr>Итого в корзине ' + this.myBusket.size + ' позиция/и/й и ' + countBasketProduct(this.myBusket) + ' товар/а/ов на сумму ' + Math.floor(countBasketPrice(this.myBusket)) + ' рублей.');
        } else {
            basketcatalog.insertAdjacentHTML('beforeend', 'Ваша корзина пуста!');
        }
    }
    countBasketPrice(){
     var sum = 0;
     for (i of this.myBusket.keys()){
         sum += this.myBusket.get(i)[1] * this.myBusket.get(i)[0];
     };
     return(sum);}

    countBasketProduct(){
    var count = 0;
    for (i of this.myBusket.keys()){
        count += this.myBusket.get(i)[0];
     };
     return(count);
    }

    editProduct(i) {
        var count = Number(prompt('Введите количество товара: ', 0));
        if (count > 0) {
            localStorage.setItem(i, count);
        }
        location.reload()
    }
    addToMyBusket(item){
    var count = Number(prompt('Введите количество товара: ', 1));
    if (count > 0){
        localStorage.setItem(item.title, count);
    }

 }
    deleteProduct(productName) {
        localStorage.removeItem(productName);
        location.reload()
    }

}

//Класс и рендер списка товаров
class GoodsList {
    constructor() {
        this.goods = [];
    }
    fetchGoods() {
        this.goods = [
            {
                title: 'Shirt',
                price: 1500,
                img: 'img/logo.png'
            },
            {
                title: 'Socks',
                price: 500,
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
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.title, good.price, good.img);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
    allprice() {
        let sumAllPrise = 0;
        this.goods.forEach(good => {
            sumAllPrise += good.price;
        });
        return sumAllPrise;
    }
}

//Генерация и отображение списка товаров
const list = new GoodsList();
list.fetchGoods();
list.render();

//Класс и рендер футера
const renderFooter = () => {
    document.getElementById('footer');
    footer.innerHTML = '&copy; Все права защищены.';
}

renderFooter();

//Удалить перед новым ДЗ
alert('Общая стоимость товаров в каталоге ' + list.allprice());
