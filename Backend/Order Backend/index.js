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

// get all products
app.get('/getAllProducts', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Pujari_JCB_Spares')
        let allProducts = await db.collection('All_Products').find().toArray()
        res.status(200).send(allProducts)
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// getting all order information
app.get('/', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        let email = req.query.email
        let startDateTime = req.query.startDateTime
        let endDateTime = req.query.endDateTime
        
        const db = await client.db('Pujari_JCB_Spares')

        if (email !== '' && startDateTime === '' && endDateTime === '') {
            console.log('case 1');
            let orders = await db.collection('Orders').aggregate([{ $match: { email: email } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.send({ message: "No orders placed yet !" })
            }
        }
        else if (email === '' && startDateTime !== '' && endDateTime !== '') {
            let orders = await db.collection('Orders').aggregate([{ $match: { date: { $gte: startDateTime, $lte: endDateTime } } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.send({ message: "No orders placed yet !" })
            }
        }
        else if (email !== '' && startDateTime !== '' && endDateTime !== '') {
            let orders = await db.collection('Orders').aggregate([{ $match: { email: email, date: { $gte: startDateTime, $lte: req.query.endDateTime } } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.send({ message: "No orders placed yet !" })
            }
        }
        else {
            let orders = await db.collection('Orders').aggregate([{ $sort: { date: -1 } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.send({ message: "No orders placed yet !" })
            }
        }
        // if (orders.length) {
        //     res.status(200).send(orders)
        // }
        // else {
        //     res.send({ message: "No orders placed yet !" })
        // }
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
        req.body.price = parseInt(req.body.price)
        req.body.orderId = parseInt(req.body.orderId)
        req.body.quantity = parseInt(req.body.quantity)
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
        if (order.length) {
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
        res.status(200).send({ message: 'order cancelled' })

    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// setTimeout(async (req, res) => {
//     let serviceRunDate = new Date().getDate()
//     const client = await MongoClient.connect(dbUrl)
//     try {
//         const db = await client.db('Pujari_JCB_Spares')
//         let orders = await db.collection('Orders').find().toArray()
//         if (orders.length !== 0) {
//             orders.forEach((order) => {
//                 let orderDate = new Date(order.date).getDate()
//                 let dateDiff = serviceRunDate - orderDate;
//                 if (dateDiff >= 5) {
//                     // change delivered status to true
//                     // console.log(order._id);
//                     // db.collection('Orders').updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body })
//                     // aggregate([{ $match: { email: req.params.email } }]).toArray()

//                     // console.log('order delivered');
//                     // console.log(order);
//                 }
//                 else {
//                     // change delivered status to false

//                     // console.log('not delivered');
//                 }
//             })
//         }
//         else {
//             // res.send({ message: "No orders placed yet !" })
//             console.log('no orders');

//         }
//     }
//     catch (error) {
//         console.log(error);
//         // res.send({ message: 'Internal server error', error })
//     }
//     finally {
//         client.close()
//     }
// }, 2000)

app.listen(port, () => { console.log(`App listening on ${port}`) })
