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
    return res.send('post crud from server')
}
//[get] get user
const displayCRUD = async (req, res) => {
    try {
        const data = await CRUDService.getAllUser()
        return res.render('displayCrud.ejs', { data: data })
    }
    catch (err) {
        console.error(err)
    }

}

export const homeController = { getHomePage, getCRUD, postCRUD, displayCRUD }
