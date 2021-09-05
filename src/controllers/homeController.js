import db from '../models/index'
import { CRUDService } from '../services/CRUDService'
import { isEmpty } from 'lodash'
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
//[get] get user by id
const getEditCRUD = async (req, res) => {
    try {
        const userId = req.query.id
        if (userId) {
            const userData = await CRUDService.getUserInfoById(userId)
            if (isEmpty(userData)) {
                return res.redirect('get-crud')
            }
            else {
                return res.render('editCrud.ejs', { userData })
            }
        }
        else {
            return res.send('Not Found')
        }
    }
    catch (err) {
        console.log(err)
    }
}
//[get] get user by id
const putCRUD = async (req, res) => {
    try {
        const data = req.body
        const userUpdated = await CRUDService.updateUserData(data)
        return res.redirect('get-crud')
    }
    catch (err) {
        console.log(err)
    }
}
//[post] delete user
const deleteCRUD = async (req, res) => {
    try {
        const userId = req.query.id
        if (userId) {
            const userDeleted = await CRUDService.deleteUserById(userId)
            console.log(userDeleted)
            return res.redirect('get-crud')
        }
        return res.redirect('get-crud')

    }
    catch (err) {
        console.log(err)
    }
    return res.send('hello delete form homecontrolle')
}
export const homeController = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
}
