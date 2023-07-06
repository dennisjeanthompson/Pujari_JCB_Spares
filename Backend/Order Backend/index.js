const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const mongodb = require('mongodb')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const dbUrl = 'mongodb+srv://rohit10231:rohitkaranpujari@cluster0.kjynvxt.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl)
const port = 7500

// getting all users order information
app.get('/', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        let orders = await db.collection('Orders').find().toArray()
        if (orders.length !== 0) {
            res.status(200).send(orders)
        }
        else {
            res.send({ message: "No orders placed yet !" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// booking new order
app.post('/newOrder', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        await db.collection('Orders').insertOne(req.body)
        res.status(201).send({ message: 'Order placed', data: req.body })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// getting orders data of user
app.get('/getOrders/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        let order = await db.collection('Orders').aggregate([{ $match: { email: req.params.email } }]).toArray()
        if (order.length !== 0) {
            res.status(200).send(order)
        }
        else {
            res.send({ message: 'No order placed' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// cancle order
app.delete('/cancleOrder/:orderId', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        let order = await db.collection('Orders').deleteOne({ _id: mongodb.ObjectId(req.params.orderId) })
        res.status(200).send({message:'order cancelled'})
        
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

app.listen(port, () => { console.log(`App listening on ${port}`) })
