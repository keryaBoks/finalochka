const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 5001

app.listen(PORT, ()=> console.log(`server has started on Port ${PORT}`))