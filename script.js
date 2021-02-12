const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

let app = new Vue({
    el: '#app',

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
                this.basket.push({ ...good, amount: 1 });
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
            return this.basket.reduce((summ, good) => summ+good.amount*good.price, 0);
        },
        cartAmount() {
            return this.basket.reduce((summ, good) => summ+good.amount, 0);
        },
        isCartEmpty() {
            return this.basket.length === 0;
        },

    },

    mounted() {
        this.makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
            console.log(goods);
            this.goods = JSON.parse(goods);
            this.filteredGoods = JSON.parse(goods);
        });
    }, 
});
