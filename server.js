const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

//app.use(bodyParser.json({ extended: true }));
//app.use(express.static(__dirname+'/public'));
app.use(express.static('.'));
app.use(express.json());
app.use(bodyParser.json());

//app.get('/catalogData', (req, res) => {
//  fs.readFile('catalog.json', 'utf8', (err, data) => {
//    res.send(data);
//  });
//});
//
//app.post('/addToCart', (req, res) => {
//  fs.readFile('cart.json', 'utf8', (err, data) => {
//    const cart = JSON.parse(data);
//  });
//});
//
//app.post('/addToCart', (req, res) => {
//  fs.readFile('cart.json', 'utf8', (err, data) => {
//    if (err) {
//      res.send('{"result": 0}');
//    } else {
//      const cart = JSON.parse(data);
//      const item = req.body;
//      
//      cart.push(item);
//
//      fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
//        if (err) {
//          res.send('{"result": 0}');
//        } else {
//          res.send('{"result": 1}');
//        }
//      });
//    }
//  });
//});
const sendForm = '<form action="/api/v1/goods" method="post"><div><label for="id_product">Введите ID нового товара. </label><input name="id_product" id="id_product" value="200"></div><div><label for="id_product">Введите название нового товара. </label><input name="product_name" id="product_name" value="Моноблок"></div><div><label for="to">Введите цену товара. </label><input name="price" id="price" value="199999"></div><div><button>Добавить товар</button></div></form>';

 app.get('/addToCatalog', (req, res) => res.send(sendForm));

const goodsRouter = express.Router();

goodsRouter.get('/:id', (req, res) => {
    fs.readFile('./public/catalogData.json', (err, data) => {
        if (!err) {
            let good;
            try {
                const goods = JSON.parse(data);
                console.log(req.params.id, goods);
                good = goods.find((good) => good.id_product == req.params.id)
                console.log(good);
            } catch (e) {
                res.status(500).json({ error: 'error parsing datafile'});
            }

            if (good) {
                res.json(good);
            } else {
                res.status(404).json('no such good with id '+req.params.id)
            }
        } else {
            res.status(500).json({ error: 'no data file!'});
        }
    })
});

goodsRouter.post('/', (req, res) => {
    console.log(req.body);
    const newGood = req.body;
    fs.readFile('./public/catalogData.json', (err, data) => {
        const goods = JSON.parse(data);

        if (goods.find((good) => good.id_product == newGood.id_product)) {
            res.status("400").json({ error: "already have good with id "+newGood.id_product });
        } else {
            goods.push(newGood);
            fs.writeFileSync('./public/catalogData.json', JSON.stringify(goods, null, '\t'));
            res.json({ result: "added good ok", id: newGood.id_product });
        }
    });
})

app.use('/api/v1/goods', goodsRouter);

app.listen(3000, () => console.log('Listening on port 3000'));
