// server setup
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

// middlewares
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());


// mongodb setup
const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4apda.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('wareHouseProducts').collection('products');

        // get all the products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })
        // delete
        app.delete('/delete', async (req, res) => {
            const product = req.body;
            const result = await productCollection.deleteOne(product);
            res.send(result);
        })

        // upload
        app.post('/upload', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        // put update a singleproduct from productDetails page
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const filter = { productId: id };
            const result = await productCollection.updateOne(
                filter,
                {
                    $set: updateProduct,
                },
                { upsert: true }
            );
            res.send({ result })
        })
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello warehouse server!')
})

app.listen(port, () => {
    console.log(`wareHouse app listening on port ${port}`)
})