const express = require('express');
const sequelize = require('./db');
require('dotenv').config();

const app = express();

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