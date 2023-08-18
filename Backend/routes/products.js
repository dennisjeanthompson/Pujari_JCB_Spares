var express = require('express');
var router = express.Router();
const { dbName, dbUrl, MongoClient } = require('../config/dbConfig')

// get all products
router.get('/allProducts', async (req, res) => {
    const client = new MongoClient(dbUrl)
    await client.connect()
    try {
        const db = client.db(dbName)
        const collection = db.collection('All_Products')
        let allProducts = await collection.find().toArray()
        res.status(200).send(allProducts)
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
});

// update product info
router.put('/updateProduct/:productId', async (req, res) => {
    const client = new MongoClient(dbUrl)
    await client.connect()
    try {
        const db = client.db(dbName)
        const collection = db.collection('All_Products')
        req.body.productPrice = parseInt(req.body.productPrice)
        req.body.productDeliveryCharges = parseInt(req.body.productDeliveryCharges)
        await collection.updateOne({ productId: parseInt(req.params.productId) }, { $set: req.body })
        res.status(200).send({ message: 'Product information successfully updated' })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// delete product
router.delete('/deleteProduct/:productId', async (req, res) => {
    const client = new MongoClient(dbUrl)
    await client.connect()
    try {
        const db = client.db(dbName)
        const collection = db.collection('All_Products')
        await collection.deleteOne({ productId: parseInt(req.params.productId) })
        res.status(200).send({ message: 'product successfully deleted' })
    }
    catch (error) {
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

module.exports = router;