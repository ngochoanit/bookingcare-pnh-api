import { userService } from "../services/userService"

//handle login 
const handleLogin = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameter'
        })
    }
    const userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        userInfo: userData.userInfo ? userData.userInfo : {}

    })
}
//handle get all users
const handleGetAllUsers = async (req, res) => {
    const id = req.query.id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter ',
            users: []
        })
    }
    const users = await userService.getAllUsers(id)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}
//handle create new user
const handleCreateNewUser = async (req, res) => {
    const message = await userService.createNewUser(req.body)
    console.log(message)
    return res.status(200).json(message)
}
//handle edit user
const handleEditUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessagege: 'Missing required parameter'
        })
    }
    const data = req.body
    const message = await userService.editUser(data)
    return res.status(200).json(message)
}
//handle delete user
const handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter'
        })
    }
    const message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message)
}
//handle get all code
const handleGetAllCode = async (req, res) => {
    try {
        const data = await userService.getAllCodeService(req.query.type)
        return res.status(200).json(data)
    } catch (err) {
        console.log("Get all code error", err)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
export const userController = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    handleGetAllCode
}