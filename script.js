const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const hostBus = new Vue();
const hostDell = new Vue();

Vue.component('goods-item', {
    props: ['good'],
    template: `
        <div>
            <img src="img/logo.png" height="50" width="50">
            <h3>{{ good.product_name }}</h3>
            <p>{{ good.price }}</p>
            <button class="add-button" type="add-button" @click="addProduct(good)">Добавить</button>
        </div>
    `,
    methods: {
        addProduct() {
            hostBus.$emit('addProduct', this.good);
        }
    }
});

Vue.component('goods-list', {
    props: ['filteredGoods'],
    template: `
        <div class="goods-list">
            <div v-if="filteredGoods.length > 0">
                <h2>Каталог товаров</h2>
                <div class="goods-item" v-for="good in filteredGoods">
                    <goods-item :good="good"></goods-item>
                </div>
            </div>
                <div v-else>
                    <span>Нет данных</span>
                </div>
        </div>
    `,
});


Vue.component('basket-item',{
    props: ['good'],
    template: `<div style="display: flex; justify-content: space-between; ">

                            <img src="img/logo.png" height="50" width="50">
                            <h3>{{ good.product_name }}</h3>
                            <p>Цена: {{ good.price }}</p>
                            <p>Количество: {{ good.amount }}</p>
                            <p>Сумма: {{ good.amount * good.price }}</p>
                            <button class="del-button" type="button" @click="delProduct(idx)">Удалить</button>
</div>`,
});

Vue.component('header-menu', {
    props: ['basket', 'isCartVisible', 'isCartEmpty', 'cartAmount', 'cartSumm'],
    //    basketVisy: {
    //        isCartVisible: false
    //    },
    template: ` <div>
                    <div class="header">
                        <div class="logo"><a href="#"><img src="img/logo_crete.png" alt="LOGO"></a></div>
                            <div class="menu">
                                <a href="#">Главная</a>
                                <a href="#">Каталог</a>
                                <a href="#">Контакты</a>
                                <button class="cart-button" type="button" @click="isCartVisible = !isCartVisible">Корзина</button>
                            </div>
                    </div> 
                
<div class="cart" v-if="isCartVisible">
                    <h2 v-if="isCartEmpty">Корзина пуста</h2>
                    <div v-else>
                        <h2>Корзина всего товаров {{cartAmount}} на сумму {{cartSumm}} рублей.</h2>
                        <div class="goods-list" v-for="(good, idx) in basket">

<basket-item :good='good'></basket-item>

                        </div>

                    </div>
                </div>

</div>`,
    methods: {
        delProduct() {
            hostDell.$emit('delProduct', this.good);
        }
    },
    //    mutations: {
    //        inc(basketVisy){
    //            basketVisy.isCartVisible = !basketVisy.isCartVisible;
    //        }
    //    },
});

Vue.component('search-menu',{
    props: ['searchLine'],
    tempalate: `<div>
                <form class="form-search">
                    <input type="text" class="goods-search" v-model="searchLine">
                    <input type="button" class="search-button" value="Поиск" id="filter" @click="filterGoods">
                    <input class="btn" type="button" value="Очистить поиск" id="clear-filter" @click="clearfilterGoods">

                </form>
            </div>`,
});

let app = new Vue({
    el: '#app',
    template: `<div class="container">

            <header-menu :basket="basket" :isCartVisible="isCartVisible" :isCartEmpty ="isCartEmpty" :cartAmount="cartAmount" :cartSumm="cartSumm" @delProduct="delProduct"></header-menu>


            <search-menu :searchLine="searchLine" @filterGoods="filterGoods" @clearfilterGoods="clearfilterGoods"></search-menu>

            <hr>
            <main class="catalog">
                
                <goods-list :filteredGoods="filteredGoods" @addProduct="addProduct"></goods-list>

            </main>

            <hr>
            <div id='footer' class="footer">
                {{ footer }}
            </div>
        </div>`,
    data: {
        goods: [],
        filteredGoods: [],
        isCartVisible: false,
        basket: [],
        searchLine: '',
        footer: '© Все права защищены.',
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

        addProduct(good) {
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
        },

        delProduct(idx) {
            this.basket[idx].amount--;
            if (this.basket[idx].amount === 0) {
                this.basket.splice(idx, 1);
            }
        },

        clearfilterGoods() {
            this.filteredGoods = this.goods;
            this.searchLine = '';
        },
        filterGoods() {
            const regex = new RegExp(this.searchLine, 'i');
            this.filteredGoods = this.goods.filter(good => good.product_name.match(regex));
        },

    },

    computed: {
        //        filterGoods() {
        //            const regex = new RegExp(this.searchLine, 'i');
        //            this.filteredGoods = this.goods.filter(good => good.product_name.match(regex));
        //        },
        cartSumm() {
            return this.basket.reduce((summ, good) => summ + good.amount * good.price, 0);
        },
        cartAmount() {
            return this.basket.reduce((summ, good) => summ + good.amount, 0);
        },
        isCartEmpty() {
            return this.basket.length === 0;
        },

    },
    created() {
        hostBus.$on('addProduct', this.addProduct);
        hostDell.$on('delProduct', this.delProduct);
    },
    beforeDestroy() {
        hostBus.$off('addProduct');
        hostDell.$off('delProduct');
    },

    mounted() {
        this.makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
            this.goods = JSON.parse(goods);
            this.filteredGoods = JSON.parse(goods);
        });
    },
});
