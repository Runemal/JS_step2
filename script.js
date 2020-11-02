
Vue.component('goods-list', {
    props: ['goods'],
    template: `
        <div v-if="goods.length !== 0" class="goods-list">
            <goods-item class="goods-item" v-for="good in goods" :key="good.id_product" :good="good"></goods-item>
        </div>
        <div v-else class="goods-list">
            <span>Нет данных</span>
        </div>
    `
})

Vue.component('goods-item', {
    props: ['good'],
    template: `
        <div class="goods-item">
            <img src="img/logo.png" height="50" width="50">
            <h3>{{ good.product_name }}</h3>
            <span>Цена: {{ good.price }}</span>
            <button class="buy-btn" @click="$parent.$emit('add-product', good)" >Добавить</button>
        </div>
    `
});

Vue.component('basket', {
    props: ['basket', 'sumGoods'],
    data(){
      return {
          isCartVisible: false,
      }
    },
    template: `<div>
                    <div class="header">
                        <div class="logo"><a href="#"><img src="img/logo_crete.png" alt="LOGO"></a></div>
                            <div class="menu">
                                <a href="#">Главная</a>
                                <a href="#">Каталог</a>
                                <a href="addToCatalog">Добавить товар</a>
                                <button class="cart-button" type="button" @click="toogleVisibleCart">Корзина</button>
                            </div>
                    </div>

<div class="cart" v-if="isCartVisible">
                    <h2 v-if="isCartEmpty">Корзина пуста</h2>
                    <div v-else>
        <table class="basket-list" v-if="basket.length !== 0" :basket="basket" :sumGoods="sumGoods">
            <tr class="titel-tbl">
<td></td>
                <td>Товар</td>
                <td>Цена</td>
<td>Количество</td>
<td>Стоимость</td>
                <td></td>
            </tr>
            <tr v-for="el_basket in basket" :key="el_basket.id_product" :basket="el_basket">
<td><img src="img/logo.png" height="50" width="50"></td>
<td>{{ el_basket.product_name }}</td>
                <td>{{ el_basket.price }}</td>
<td>{{ el_basket.amount }}</td>
<td>{{ el_basket.amount * el_basket.price }}</td>
                <td><a class="del-btn" @click="$emit('delete-product', el_basket)">&times;</a></td>
            </tr>
        </table>
</div>
                </div>


    </div>`,
    methods: {
        toogleVisibleCart(){
            this.isCartVisible = !this.isCartVisible;
        },
    },
});



Vue.component('search-form', {
    props: ['value'],
    template: `
        <input type="text" id="search"  placeholder="Поиск" v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)">
    `
})

let app = new Vue ({
    el: '#app',

    data: {
        goods: [],
        filteredGoods: [],
        basket: [],
        searchLine: '',
        searchText: '',
        isCartVisible: false,
    },

    methods: {

        makeGETRequest(url, callback) {
            return new Promise((resolve, reject) => {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        callback(xhr.responseText);
                    }
                }
                xhr.open('GET', url, true);
                xhr.send();
            });
        },

        makePOSTRequest(url, data, callback) {
            let xhr;

            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    callback(xhr.responseText);
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

            xhr.send(data);
        },

        addProducts(good){

            if (!this.basket.some((gd) => {
                    if (gd.id_product === good.id_product) {
                        gd.amount++;
                        return true;
                    }
                })) {
                this.basket.push({
                    ...good,
                    amount: 1
                });
            }

            this.makePOSTRequest('/addToCart', JSON.stringify(basket), (respons) => {console.log(respons)});
        },

        deleteProducts (good){
            this.basket = this.basket.filter(item => item !== good);
            let arrToString = '';
            for (const item of this.basket) {
                if (item == this.basket[this.basket.length - 1]){
                    arrToString += JSON.stringify(item);
                }else {
                    arrToString += JSON.stringify(item) + ',';
                }
            }
            this.makePOSTRequest('/updateToCart', '[' + arrToString + ']', (respons) => {console.log(respons)});
        },

        filterGoods () {
            let text = this.searchLine.toLowerCase().trim();
            if (text === '') {
                this.filteredGoods = this.goods;
            } else {
                this.filteredGoods = this.goods.filter((el) => {
                    return el.title.toLowerCase().includes(text);
                });
            }
        },

        clearfilterGoods(){
            this.filteredGoods = this.goods;
            this.searchLine = '';
        },

    },

    computed: {
        sumGoods: function () {

            return this.basket.reduce((summ, good) => summ + good.amount * good.price, 0);
        },
        isCartEmpty() {
            return this.basket.length === 0;
        },
        sumItem() {
            return this.basket.reduce((summ, good) => summ + good.amount, 0);
        },

    },

    mounted () {
        this.makeGETRequest('/catalogData.json', (goods) => {
            this.goods = JSON.parse(goods);
            this.filteredGoods = JSON.parse(goods);
        });

    }
});

