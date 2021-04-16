const express = require('express')
const bcrypt = require("bcrypt");
const dbModel = require('./models/User')
const usermodel = new dbModel()
require('dotenv').config()
const app = express()

// for parsing application/json
app.use(express.json());

app.get('/', (req, res) => {

    res.status(200).json({ "code": 200, "success": true, "resp": "Helo world." })
});


app.post('/createUser', async (req, res) => {

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    let params = []
    params.push(req.body.email)
    params.push(hashPassword)
    params.push(req.body.first_name)
    params.push(req.body.las_name)

    let msg = await usermodel.createUser(params)
    res.status(200).json(msg)
});

app.get('/getUsers', async (req, res) => {

    let msg = await usermodel.getUsers(req.query.limit, req.query.userid)

    res.status(200).json(msg)
});

app.put('/updateUser', async (req, res) => {

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    let params = []
    params.push(req.body.email)
    params.push(hashPassword)
    params.push(req.body.first_name)
    params.push(req.body.las_name)
    params.push(req.body.user_id)

    let msg = await usermodel.updateUser(params)
    res.status(200).json(msg)
});

app.delete('/deleteUsers', async (req, res) => {

    let msg = await usermodel.deleteUsers(req.body.user_id)

    res.status(200).json(msg)
});

app.post('/transactionExample', async (req, res) => {

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    let params = []
    params.push(req.body.email)
    params.push(hashPassword)
    params.push(req.body.first_name)
    params.push(req.body.las_name)

    let msg = await usermodel.transactionExample(req.body.user_id, params)

    res.status(200).json(msg)
});

app.listen(5000, () => console.log('Server Started'))