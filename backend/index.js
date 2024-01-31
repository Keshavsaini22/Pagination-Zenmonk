const express = require('express')
const mongoose = require('mongoose')
const UsersModel = require('./models/UserData')
const cors = require('cors')

const app = express()
app.use(cors());
const url = "mongodb+srv://keshavsainikesu:Imhater369@cluster0.ityc4jw.mongodb.net/?retryWrites=true&w=majority"
// respond with "hello world" when a GET request is made to the homepage

try {
    mongoose.connect(url);
    console.log("connected to mongodb")
}
catch (error) {
    console.error(error);
}
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world !')
})

app.post('/productinfo', async (req, res) => {

    const { name, price, desc, category, tag, amount } = req.body;
    console.log(req.body)


    try {
        const entry = await UsersModel.create({ name, price, desc, category, tag, amount })
        console.log('entry', entry)
        res.status(200).json(entry)
    }
    catch (e) {
        res.status(500).json(err)
    }

})


app.get('/products', async (req, res) => {

    try {
        const allProducts = await UsersModel.find({});
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        // console.log(allProducts)
        const startindex = (page - 1) * limit
        const lastindex = page * limit

        const results = {}
        results.totalUser = allProducts.length;
        results.pageCount = Math.ceil(allProducts.length / limit)
// console.log(results.pageCount)
        if (lastindex < allProducts.length) {
            results.next = {
                page: page + 1
            }
        }
        if (startindex > 0) {
            results.prev = {
                page: page - 1
            }
        }



        results.result = allProducts.slice(startindex, lastindex)
        res.status(200).json({
            results
        })
    } catch (e) {
        res.status(500).json( err)
    }

})

app.listen(5000, () => console.log('Example app is listening on port 5000.'));
