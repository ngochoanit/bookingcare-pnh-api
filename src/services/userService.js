const db = require("../models/index")
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10);
//handle login
const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = {}
            const isExist = await checkUserEmail(email)
            if (isExist) {
                //user already exist
                //compare password
                const user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    raw: true
                })
                if (user) {
                    //compare password
                    const check = await bcrypt.compareSync(password, user.password)
                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = `OK`
                        delete user.password
                        userData.userInfo = user
                    }
                    else {
                        userData.errCode = 3
                        userData.errMessage = `wrong password`
                    }
                }
                else {
                    userData.errCode = 2
                    userData.errMessage = `User not found`
                    //return error

                }

            }
            else {
                userData.errCode = 1
                userData.errMessage = `Your email isn't is exist in system. Please try another email !!!`
                //return error

            }
            resolve(userData)
        } catch (err) {
            reject(err)
        }
    })
}
//check email has Exist
const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email: userEmail },
                raw: true
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        }
        catch (err) {
            reject(err)
        }
    })
}
//handle get user
const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'ALL') {
                console.log(userId)
                users = await db.User.findAll({
                    attributes: { exclude: ['password'] },
                    raw: true
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ['password'] },
                    raw: true
                })
            }
            resolve(users)
        }
        catch (err) {
            reject(err)
        }
    })
}
//handle Create New User
const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check emai isExist??
            const check = await checkUserEmail(data.email)
            if (check) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Your email is already used. Please try another email'
                })
            }
            else {
                const hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender === '1' ? 1 : 0,
                    roleId: data.roleId,
                    phoneNumber: data.phoneNumber,
                })
                resolve({
                    errCode: 0,
                    errMessage: "OK"
                })
            }
        }
        catch (err) {
            reject(err)
        }
    })
}
// hash password
const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        }
        catch (err) {
            reject(err)
        }
    })
}
//handle Edit User
const editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = data.id;
            delete data.userId;
            const user = await db.User.findOne({
                where: { id: userId }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't is exist`
                })
            }
            const userUpdated = await db.User.update({ ...data }, {
                where: {
                    id: userId,
                }
            });
            resolve({
                errCode: 0,
                errMessage: `OK`
            })
        } catch (err) {
            reject(err)
        }
    })
}
//handle Delete User
const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id: userId }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't is exist`
                })
            }
            await db.User.destroy({
                where: {
                    id: userId,
                }
            })
            resolve({
                errCode: 0,
                errMessage: `OK`
            })
        }
        catch (err) {
            reject(err)
        }
    })
}
//handle get all code
const getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = {}
            if (!typeInput) {
                res.errCode = 1
                res.errMessage = "Missing required parameter!"
            }
            else {

                const allCode = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                res.errCode = 0
                res.errMessage = "OK"
                res.allCode = allCode
            }
            resolve(res)
        }
        catch (err) {
            reject
        }
    })
}
export const userService = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    editUser,
    deleteUser,
    getAllCodeService
}