const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const hostBus = new Vue();
const hostDell = new Vue();

Vue.component('goods-item', {
    props: ['good'],
//    data: {
//      basket: [],
//    },
    template: `
        <div>
            <img src="img/logo.png" height="50" width="50">
            <h3>{{ good.product_name }}</h3>
            <p>{{ good.price }}</p>
            <button class="add-button" type="add-button" @click="addProduct(good)">Добавить</button>
        </div>
    `,
    methods: {
//        addProduct(good) {
//            if (!this.basket.some((gd) => {
//                    if (gd.id_product === good.id_product) {
//                        gd.amount++;
//                        return true;
//                    }
//                })) {
//                this.basket.push({
//                    ...good,
//                    amount: 1
//                });
//            }
//        },
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
    template: `<div style="display: flex; justify-content: space-between; width: 100%;">

                            <img src="img/logo.png" height="50" width="50">
                            <h3>{{ good.product_name }}</h3>
                            <p>Цена: {{ good.price }}</p>
                            <p>Количество: {{ good.amount }}</p>
                            <p>Сумма: {{ good.amount * good.price }}</p>
                            <button class="del-button" type="button" @click="delProduct(good.id_product)">Удалить</button>
</div>`,
    methods:{
        delProduct(id){
            this.$emit('delProduct', id);
        }
    },
});

Vue.component('header-menu', {
    props: ['basket', 'isCartVisible', 'isCartEmpty', 'cartAmount', 'cartSumm'],
    data(){
      return {
          isCartVisible: false,
      }
    },

    template: ` <div>
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
                        <h2>Корзина всего товаров {{cartAmount}} на сумму {{cartSumm}} рублей.</h2>
                        <div class="goods-list" v-for="(good, idx) in basket">

<basket-item :good='good' @delProduct="delProduct"></basket-item>

                        </div>

                    </div>
                </div>

</div>`,
    methods: {
        delProduct(id) {
            const currentProduct = this.basket.find(item => {
                return item.id_product === id; });
            if(currentProduct.amount > 1){
                currentProduct.amount--;
            }else {
                this.basket = this.basket.filter(item => {
                    return item.id_product !== id;
                });
            }
        },
//        delProduct(id) {
////            this.basket[good.id_product].amount--;
////            if (this.basket[good.id_product].amount === 0) {
////                return this.basket.splice(good.id_product, 1);
////            };
//        },

        toogleVisibleCart(){
            this.isCartVisible = !this.isCartVisible;
        },
    },
    computed: {
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
});

Vue.component('search-menu',{
    props: ['searchLine'],
    template: `<div>
                <form class="form-search">
                    <input type="text" class="goods-search" v-bind="searchLine">
                    <input type="button" class="search-button" value="Поиск" id="filter" @click="filterGoods">
                    <input class="btn" type="button" value="Очистить поиск" id="clear-filter" @click="clearfilterGoods">

                </form>
            </div>`,
    methods: {
        clearfilterGoods() {
            this.filteredGoods = this.goods;
            this.searchLine = '';
        },
        filterGoods() {
            const regex = new RegExp(this.searchLine, 'i');
            this.$emit('filteredGoods', this.goods.filter(good => good.product_name.match(regex)));
        },
    },
});

let app = new Vue({
    el: '#app',
    template: `<div class="container">

            <header-menu :basket="basket"></header-menu>


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

    },

    computed: {

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
        this.makeGETRequest(`public/catalogData.json`, (goods) => {
            this.goods = JSON.parse(goods);
            this.filteredGoods = JSON.parse(goods);
        });
    },
});
