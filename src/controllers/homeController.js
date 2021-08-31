import db from '../models/index'
import { CRUDService } from '../services/CRUDService'
// [get] home
const getHomePage = async (req, res) => {
    try {
        const data = await db.User.findAll()
        console.log('-----------------------')
        console.log(data)
        console.log('-----------------------')
        return res.render('homePage.ejs', { data: JSON.stringify(data) })
    }
    catch (err) {
        console.error(err)
    }
}
//[get] CRUD
const getCRUD = (req, res) => {
    res.render('crud.ejs')
}
//[post] CRUD
const postCRUD = async (req, res) => {
    const message = await CRUDService.createNewUser(req.body)
    console.log(message)
    return res.send('post crud from server')
}
export const homeController = { getHomePage, getCRUD, postCRUD }
