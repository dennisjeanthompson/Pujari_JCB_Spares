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
const nodemailer = require('nodemailer')

// get all products
app.get('/getAllProducts', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = client.db('Pujari_JCB_Spares')
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

// update product info
app.put('/updateProduct/:productId', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = client.db('Pujari_JCB_Spares')
        req.params.productId = parseInt(req.params.productId)
        req.body.productPrice = parseInt(req.body.productPrice)
        req.body.productDeliveryCharges = parseInt(req.body.productDeliveryCharges)
        await db.collection('All_Products').updateOne({ productId: req.params.productId }, { $set: req.body })
        res.status(200).send({ message: 'Product updated successfully' })
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
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

        const db = client.db('Pujari_JCB_Spares')

        // for user name
        if (email !== '' && startDateTime === '' && endDateTime === '') {
            let orders = await db.collection('Orders').aggregate([{ $match: { email: email } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.send({ message: "No orders placed yet !" })
            }
        }

        // for date
        else if (email === '' && startDateTime !== '' && endDateTime !== '') {
            let orders = await db.collection('Orders').aggregate([{ $match: { date: { $gte: startDateTime, $lte: endDateTime } } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.send({ message: "No orders placed yet !" })
            }
        }

        // for user name & date
        else if (email !== '' && startDateTime !== '' && endDateTime !== '') {
            let orders = await db.collection('Orders').aggregate([{ $match: { email: email, date: { $gte: startDateTime, $lte: endDateTime } } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.send({ message: "No orders placed yet !" })
            }
        }

        // all orders
        else if (email === '' && startDateTime === '' && endDateTime === '') {
            let orders = await db.collection('Orders').aggregate([{ $sort: { date: -1 } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.send({ message: "No orders placed yet !" })
            }
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
        const db = client.db('Pujari_JCB_Spares')
        req.body.price = parseInt(req.body.price)
        req.body.orderId = parseInt(req.body.orderId)
        req.body.quantity = parseInt(req.body.quantity)
        req.body.deliveryCharges = parseInt(req.body.deliveryCharges)
        req.body.totalAmount = parseInt(req.body.totalAmount)
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

// send email after order placed
app.post('/sendEmail', async (req, res) => {
    let orderId
    randomStringGenerator()
    async function randomStringGenerator() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        function generateString(length) {
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        orderId = await generateString(10);
    }
    let orderDate = new Date(req.body.date).toLocaleString()
    let expectedDeliveryDate = new Date(new Date(req.body.date).setDate(new Date(req.body.date).getDate() + 4)).toLocaleDateString()
    console.log(req.body);
    const emailData = {
        text: `Congratulations, Your order has been placed. You'll get your product within four days. Thank You !`,
        userName: req.body.userName,
        productName: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        deliveryCharges: req.body.deliveryCharges,
        totalAmount: req.body.totalAmount,
        address: req.body.address,
        orderDate: orderDate,
        expectedDeliveryDate: expectedDeliveryDate
    }
    // console.log(emailData);
    const transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'rpujari1144@gmail.com',
            pass: 'roaklhqwpybvxjzi'
        }
    });

    let info = await transporter.sendMail({
        from: '"Pujari JCB Spares" <pujarijcbspares@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Order Placed !!", // Subject line
        html: `<b>Congratulations, Your order has been placed with order Id order_${orderId}. You'll get your product within 5 days.<br/><br/>Thank You !<br/><br/>Regards,<br/>Pujari JCB Spares<br/><br/>Following are the details of order:</b><br/><br/>
            <table style="border: 3px solid white">
                <thead>
                    <th>
                        <tr>
                            <td>Sr. No</td>
                            <td>User name</td>
                            <td>Product Name</td>
                            <td>Quantity</td>
                            <td>Price</td>
                            <td>Delivery charges</td>
                            <td>Total amount</td>
                            <td>Address</td>
                            <td>Order date</td>
                            <td>Expected delivery date</td>
                        </tr>
                    </th>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>${emailData.userName}</td>
                        <td>${emailData.productName}</td>
                        <td>${emailData.quantity}</td>
                        <td>${emailData.price}</td>
                        <td>${emailData.deliveryCharges}</td>
                        <td>${emailData.totalAmount}</td>
                        <td>${emailData.address}</td>
                        <td>${emailData.orderDate}</td>
                        <td>${emailData.expectedDeliveryDate}</td>
                    </tr>
                </tbody>
            </table>`
    })

    console.log("Message sent: ", info.messageId);
    res.json(info)
})

// getting orders data of user
app.get('/getOrders/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = client.db('Pujari_JCB_Spares')
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
        const db = client.db('Pujari_JCB_Spares')
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

setTimeout(async function (req, res) {
    var orderId
    let serviceRunDate = new Date().getDate()
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = client.db('Pujari_JCB_Spares') // it will connect without any promise
        let orders = await db.collection('Orders').find({}).toArray()
        if (orders.length) {
            orders.forEach((order) => {
                orderId = order.orderId
                let orderDate = new Date(order.date).getDate()
                let dateDiff = serviceRunDate - orderDate;
                if (dateDiff > 4) {
                    changeStatus()
                }
            })
        }
        else {
            res.send({ message: "No orders placed yet !" })
        }
        async function changeStatus() {
            let changedStatus = await db.collection('Orders').updateOne({ orderId: orderId }, { $set: { delivered: true, deliveryDate: new Date().toISOString() } })
            console.log(changedStatus);
        }
    }
    catch (error) {
        // console.log(error);
        res.send({ message: 'Internal server error', error })
    }
}, 86400000)

app.listen(port, () => { console.log(`App listening on ${port}`) })
