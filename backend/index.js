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
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const flag = parseInt(req.query.flag)
        var n = (page - 1) * limit;
        const category = req.query.category
        const search = req.query.search
        if (page == '1') {
            n = 0;
        }
        const filter = {}
        if (category)
            filter.category = category
        if (search) {
            filter.name = { $regex: search, $options: 'i' }
        }


        var query = UsersModel.find(filter).skip(n).collation({ locale: 'en' }).limit(limit)
        if (flag !== 0) {
            query = UsersModel.find(filter).skip(n).collation({ locale: 'en' }).limit(limit).sort({ price: flag })
        }

        const allProducts = await query;
        // console.log(allProducts)
        const dataCount = await UsersModel.countDocuments();
        // const dataCount=allProducts.length

        res.status(200).json({
            Count: dataCount,
            Info: allProducts
        })



        // const allProducts = await UsersModel.find()
        // const page = parseInt(req.query.page)
        // const limit = parseInt(req.query.limit)
        // // console.log(allProducts)
        // const startindex = (page - 1) * limit
        // const lastindex = page * limit

        // const results = {}
        // results.totalUser = allProducts.length;
        // results.pageCount = Math.ceil(allProducts.length / limit)
        // // console.log(results.pageCount)
        // if (lastindex < allProducts.length) {
        //     results.next = {
        //         page: page + 1
        //     }
        // }
        // if (startindex > 0) {
        //     results.prev = {
        //         page: page - 1
        //     }
        // }
        // results.result = allProducts.slice(startindex, lastindex)
        // res.status(200).json({
        //     results
        // })
    } catch (e) {
        res.status(500).json(e)
    }
})


app.get('/product', async (req, res) => {
    const id = req.query.id;
    try {
        const productdata = await UsersModel.findById(id);
        // console.log(productdata);

        res.status(200).json(productdata)
    }
    catch (e) {
        res.status(400).json(e)
    }

})

app.delete('/deleteproduct', async (req, res) => {
    const id = req.query.id;
    console.log(id);
    try {
        const data = await UsersModel.findByIdAndDelete(id);
        console.log(data)
        res.status(200).json("Deleted")
    } catch (e) {
        res.status(400).json(e)
    }
})

app.put('/update/:id', async (req, res) => {
    console.log('reqst id', req)
    const { id } = req.params;
    console.log('idis ', id)
    const { name, price, desc, category, tag, amount } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json('invaluid id')
        }
        const updateUser = await UsersModel.findByIdAndUpdate(id, { name, price, desc, category, tag, amount }, { new: true })
        if (!updateUser) {
            return res.status(404).json('user not updated')
        }
        res.json(updateUser)
    } catch (error) {
        res.status(500).json('Internal server error');
    }
})

// app.put('/editproduct', async (req, res) => {
//     const { name, price, desc, category, tag, amount } = req.body;
//     const id = req.query.id;
//     try {
//         const data = await UsersModel.findByIdAndUpdate(id, { name, price, desc, category, tag, amount }, { new: true })
//         res.status(200).json(data);
//     } catch (e) {
//         res.status(400).json(e)

//     }

// })


app.listen(5000, () => console.log('Example app is listening on port 5000.'));
