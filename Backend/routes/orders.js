var express = require('express');
var router = express.Router();
const { dbName, dbUrl, MongoClient } = require('../config/dbConfig')
const { nodemailer } = require('../config/nodemailerConfig')
const { validate } = require('../common/auth')

// booking new order
router.post('/newOrder', validate, async (req, res) => {
    const client = new MongoClient(dbUrl)
    await client.connect()
    try {
        const db = client.db(dbName)
        const collection = db.collection('Orders')
        const orderInfo = await collection.aggregate([{ $sort: { orderId: -1 } }]).toArray()
        if (orderInfo.length) {
            req.body.orderId = orderInfo[0].orderId + 1
        }
        else {
            req.body.orderId = 1
        }
        req.body.price = parseInt(req.body.price)
        req.body.quantity = parseInt(req.body.quantity)
        req.body.deliveryCharges = parseInt(req.body.deliveryCharges)
        req.body.totalAmount = parseInt(req.body.totalAmount)
        let placedOrder = await collection.insertOne(req.body)
        if (placedOrder.acknowledged === true) {
            res.status(201).send({ message: 'Order successfully placed', data: req.body })
        }
        else {
            res.status(400).send({ message: "Order not placed" })
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// getting orders data of user
router.get('/getOrders/:email', async (req, res) => {
    const client = new MongoClient(dbUrl)
    await client.connect()
    try {
        const db = client.db(dbName)
        const collection = db.collection('Orders')
        let allOrders = await collection.aggregate([{ $match: { email: req.params.email, delivered: false } }]).toArray()
        if (allOrders.length) {
            res.status(200).send(allOrders)
        }
        else {
            res.status(400).send({ message: "No order data found" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
});

// getting all order information
router.get('/', async (req, res) => {
    console.log(validate);
    const client = new MongoClient(dbUrl)
    await client.connect()
    try {
        const db = client.db(dbName)
        const collection = db.collection('Orders')
        let email = req.query.email
        let startDateTime = req.query.startDateTime
        let endDateTime = req.query.endDateTime
        // for user name
        if (email !== '' && startDateTime === '' && endDateTime === '') {
            let orders = await collection.aggregate([{ $match: { email: email } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.status(400).send({ message: "No orders placed yet !" })
            }
        }
        // for date
        else if (email === '' && startDateTime !== '' && endDateTime !== '') {
            let orders = await collection.aggregate([{ $match: { date: { $gte: startDateTime, $lte: endDateTime } } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.status(400).send({ message: "No orders placed yet !" })
            }
        }
        // for user name & date
        else if (email !== '' && startDateTime !== '' && endDateTime !== '') {
            let orders = await collection.aggregate([{ $match: { email: email, date: { $gte: startDateTime, $lte: endDateTime } } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.status(400).send({ message: "No orders placed yet !" })
            }
        }
        // all orders
        else if (email === '' && startDateTime === '' && endDateTime === '') {
            let orders = await collection.aggregate([{ $sort: { date: -1 } }]).toArray()
            if (orders.length) {
                res.status(200).send(orders)
            }
            else {
                res.status(400).send({ message: "No orders placed yet !" })
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
});

// cancel order
router.delete('/cancleOrder/:orderId', validate, async (req, res) => {
    const client = new MongoClient(dbUrl)
    await client.connect()
    try {
        const db = client.db(dbName)
        const collection = db.collection('Orders')
        let deletedOrder = await collection.deleteOne({ orderId: parseInt(req.params.orderId) })
        // console.log(deletedOrder);
        if (deletedOrder.deletedCount === 1) {
            res.status(200).send({ message: 'order cancelled' })
        }
        else {
            res.status(400).send({ message: 'Order failed to delete' })
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// sending email after order booking
router.post('/sendEmail', async (req, res) => {
    const client = new MongoClient(dbUrl)
    await client.connect()
    try {
        let orderId
        randomStringGenerator()
        function randomStringGenerator() {
            const characters = 'abcdABCD123456789';
            function generateString(length) {
                let result = '';
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            orderId = generateString(5);
        }
        let orderDate = new Date(req.body.date).toLocaleDateString()
        let expectedDeliveryDate = new Date(new Date(req.body.date).setDate(new Date(req.body.date).getDate() + 5)).toLocaleDateString()
        const emailData = {
            text: `Congratulations, Your order has been placed. You'll get your product within four days. Thank You !`,
            orderId: 'order_' + orderId,
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
        const transporter = nodemailer.createTransport({
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
            html: `<b>Congratulations, Your order has been placed with order Id ${emailData.orderId}. You'll get your product within 5 days.<br/><br/>Thank You !<br/><br/>Regards,<br/>Pujari JCB Spares<br/><br/>Following are the details of order:</b><br/><br/>
                <table style="border: 3px solid white">
                    <thead>
                        <th>
                            <tr>
                                <td>Sr. No</td>
                                <td>Order Id</td>
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
                            <td>${emailData.orderId}</td>
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
        // res.json(info)
        console.log(info);
        console.log(info.accepted.length);
        if (info.accepted.length) {
            res.status(201).send({ message: 'Email sent', data: info })
        }
        else {
            res.status(502).send({ message: "Email not sent" })
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Internal server error', error })
    }
})

// not delivered products
router.get('/get-delivered-orders', async (req, res) => {
    const client = new MongoClient(dbUrl)
    await client.connect()
    try {
        const db = client.db(dbName)
        const collection = db.collection('Orders')
        let usersOrders = await collection.aggregate([{ $match: { email: req.query.email, delivered: false } }]).toArray()
        if (usersOrders.length) {
            usersOrders.forEach((e) => {
                let dateDiff = (new Date(e.date).getDate()) - (new Date().getDate())
                if (dateDiff > 4) {
                    updateStatus(e.orderId, e.date)
                }
            })
            async function updateStatus(orderId, date) {
                let nxtDate = new Date(date).getDate() + 4
                console.log(nxtDate);
                let newDate = new Date(new Date().setDate(nxtDate))
                let update = {
                    delivered: true,
                    orderDeliveredDate: new Date(newDate).toISOString()
                }
                await collection.updateOne({ orderId: orderId }, { $set: update })
            }
            let data = await collection.aggregate([{ $match: { email: req.query.email, delivered: true } }]).toArray()
            res.status(200).send({ message: 'Users delivered orders data', data: data })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error: error })
    }
})

module.exports = router;
