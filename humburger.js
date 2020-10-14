class Hamburger {
    constructor(size, stuffing) {
        this.size = size;
        this.stuffing = [stuffing];
    }

    addTopping(topping) {
        this.stuffing.push(topping);
    }
    removeTopping(topping) {
        this.stuffing.splice(topping, 1);
    }
    getToppings(topping) {
        switch (topping) {
            case 'cheese':
                return {
                    price: 10,
                        callory: 20
                };
                break;
            case 'salad':
                return {
                    price: 20,
                        callory: 5
                };
                break;
            case 'potatos':
                return {
                    price: 15,
                        callory: 10
                };
                break;
        }

    }
    getSize() {
        return this.size
    }
    getStuffing() {
        return this.stuffing
    }
    calculatePrice() {
        let priceHumburger = 0;
        if (this.size == 'small') {
            priceHumburger += 50;
        } else if (this.size == 'big') {
            priceHumburger += 100;
        }
        this.stuffing.forEach(stuff => {
            if (stuff == 'cheese') {
                priceHumburger += 10;
            } else if (stuff == 'salad') {
                priceHumburger += 20;
            } else if (stuff == 'potatos') {
                priceHumburger += 15;
            }
        });
        return priceHumburger;

    }
    calculateCalories() {
        let calloryHumburger = 0;
        if (this.size == 'small') {
            calloryHumburger += 20;
        } else if (this.size == 'big') {
            calloryHumburger += 40;
        }
        this.stuffing.forEach(stuff => {
            if (stuff == 'cheese') {
                calloryHumburger += 20;
            } else if (stuff == 'salad') {
                calloryHumburger += 5;
            } else if (stuff == 'potatos') {
                calloryHumburger += 10;
            }
        });
        return calloryHumburger;
    }
}
