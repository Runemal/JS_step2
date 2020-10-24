const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

let app = new Vue ({
    el: '#app',

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

        addProducts(good){
            this.basket.push(good);

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
            let sum = 0;
            this.basket.forEach(({price}) => {
                sum += price;
            });
            return this.sumGood = sum;
        },

        sumItem: function () {
            return this.basket.length==0 ? '   ' :this.basket.length;
        }
    },

    mounted () {
        this.makeGETRequest(`${API_URL}/catalogData.json`, (goods) => {
            this.goods = JSON.parse(goods);
            this.filteredGoods = JSON.parse(goods);
        });
    }
});

