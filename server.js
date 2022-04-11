const express = require('express');
const sequelize = require('./db');
const router = require('./routes/index')
const models = require ('./models/models')
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json())
app.use('/api', router)

app.get('/',(req,res)=>{
    res.status(200).json({message:'working'})
})

const PORT = process.env.PORT || 5001

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`server has started on Port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}

start(); 