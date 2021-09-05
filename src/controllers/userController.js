import { userService } from "../services/userService"

//handle login 
const handleLogin = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        })
    }
    const userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}

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
export const userController = { handleLogin, handleGetAllUsers }