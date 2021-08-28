import express from 'express'
import bodyParser from 'body-parser'
import viewEngine from './config/viewEngine'
import initWebRoutes from './route/web'
require('dotenv').config()

const app = express()
//config app
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
viewEngine(app)
initWebRoutes(app)
const PORT = process.env.PORT || 8080
app.listen(process.env.PORT, () => {
    console.log('Backend bookingcare-api is runing onthe port: ', PORT)
})