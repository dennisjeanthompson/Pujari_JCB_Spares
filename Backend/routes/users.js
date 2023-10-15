var express = require('express');
var router = express.Router();
const { dbName, dbUrl, MongoClient } = require('./../config/dbConfig')
const { hashPassword, hashCompare, createToken, validate } = require('../common/auth')

// get all users
router.get('/', async (req, res) => {
  const client = new MongoClient(dbUrl)
  await client.connect()
  try {
    const db = client.db(dbName)
    const collection = db.collection('All_Users')
    if (req.query.email === '') {
      let allUsers = await collection.find().toArray()
      if (allUsers.length) {
        res.status(200).send(allUsers)
      }
      else {
        res.status(400).send({ message: "No Users Found" })
      }
    }
    else {
      let user = await collection.aggregate([{ $match: { email: req.query.email } }]).toArray()
      if (user.length) {
        res.status(200).send(user)
      }
      else {
        res.status(400).send({ message: "No Users Found" })
      }
    }
  }
  catch (error) {
    // console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
  finally {
    client.close()
  }
});

// user login
router.get('/login', async (req, res) => {
  const client = new MongoClient(dbUrl)
  await client.connect()
  try {
    const db = client.db(dbName)
    const collection = db.collection('All_Users')
    let user = await collection.aggregate([{ $match: { email: req.query.email } }]).toArray()
    if (user.length) {
      if (req.query.password === undefined || req.query.password === null) {
        let token = createToken({ name: user[0].name, email: user[0].email })
        res.status(200).send({ message: 'Login successful', userData: user, tokenData: token })
      }
      else {
        // let passwordCheck = await hashCompare(req.query.password, user[0].password)
        if (await hashCompare(req.query.password, user[0].password)) {
          let token = createToken({ name: user[0].name, email: user[0].email })
          res.status(200).send({ message: 'Login successful', userData: user, tokenData: token })
        }
        else {
          res.status(400).send({ message: 'Invalid login credentials' })
        }
      }
    }
    else {
      res.status(400).send({ message: 'Invalid login credentials' })
    }
  }
  catch (error) {
    // console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
  finally {
    client.close()
  }
});

// user signup
router.post('/signup', async (req, res) => {
  const client = new MongoClient(dbUrl)
  await client.connect()
  try {
    const db = client.db(dbName)
    const collection = db.collection('All_Users')
    let user = await collection.aggregate([{ $match: { email: req.body.email } }]).toArray()
    if (user.length) {
      res.status(400).send({ message: "Email address already exist" })
    }
    else {
      const userInfo = await collection.aggregate([{ $sort: { userId: -1 } }]).toArray()
      if (userInfo.length) {
        if (userInfo[0].userId === undefined || userInfo[0].userId === null) {
          req.body.userId = 1
        }
        else {
          req.body.userId = userInfo[0].userId + 1
        }
      }
      else {
        req.body.userId = 1
      }
      if (req.body.password === undefined || req.body.password === null) {
        await collection.insertOne(req.body)
        res.status(201).send({ message: 'Signup successful', data: req.body })
      }
      else {
        let hashedPassword = await hashPassword(req.body.password)
        req.body.password = hashedPassword
        await collection.insertOne(req.body)
        res.status(201).send({ message: 'Signup successful', data: req.body })
      }
    }
  }
  catch (error) {
    // console.log(error);
    res.status(500).send({ message: 'Internal server error', error })
  }
  finally {
    client.close()
  }
})

// user password change
router.put('/changePassword/:email/:securityCode', async (req, res) => {
  const client = new MongoClient(dbUrl)
  await client.connect()
  try {
    const db = client.db(dbName)
    const collection = db.collection('All_Users')
    let user = await collection.aggregate([{ $match: { email: req.params.email, securityCode: req.params.securityCode } }]).toArray()
    if (user.length) {
      let hashedPassword = await hashPassword(req.body.password)
      req.body.password = hashedPassword
      let changedPassword = await collection.updateOne({ email: req.params.email, securityCode: req.params.securityCode }, { $set: req.body })
      if (changedPassword.modifiedCount === 1) {
        res.status(200).send({ message: 'Password updated successfully' })
      }
      else {
        res.status(400).send({ message: 'Failed to change password' })
      }
    }
    else {
      res.status(400).send({ message: 'Invalid credentials' })
    }
  }
  catch (error) {
    res.status(500).send({ message: 'Internal server error', error })
  }
  finally {
    client.close()
  }
})

// update user info
router.put('/updateUser/:email', validate, async (req, res) => {
  const client = new MongoClient(dbUrl)
  await client.connect()
  try {
    const db = client.db(dbName)
    const collection = db.collection('All_Users')
    let hashedPassword = await hashPassword(req.body.password)
    req.body.password = hashedPassword
    let updatedUser = await collection.updateOne({ email: req.params.email }, { $set: req.body })
    if (updatedUser.modifiedCount === 1) {
      res.status(200).send({ message: 'Information successfully updated' })
    }
    else {
      res.status(400).send({ message: 'Failed to update user information' })
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

// delete user
router.delete('/deleteUser', async (req, res) => {
  const client = new MongoClient(dbUrl)
  await client.connect()
  try {
    const db = client.db(dbName)
    const collection = db.collection('All_Users')
    let deletedUser = await collection.deleteOne({ userId: parseInt(req.query.userId) })
    // console.log(deletedUser);
    if (deletedUser.deletedCount === 1) {
      res.status(200).send({ message: 'user successfully deleted' })
    }
    else {
      res.status(400).send({ message: 'Failed to delete user' })
    }
  }
  catch (error) {
    res.status(500).send({ message: 'Internal server error', error })
  }
  finally {
    client.close()
  }
})

module.exports = router;