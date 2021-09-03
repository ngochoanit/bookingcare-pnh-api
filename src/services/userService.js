const db = require("../models/index")
import bcrypt from 'bcryptjs'
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
                    attributes: ['email', 'roleId', 'password'],
                    raw: true
                })
                if (user) {
                    //compare password
                    const check = await bcrypt.compareSync(password, user.password)
                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = `OK`
                        delete user.password
                        userData.user = user
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

export const userService = { handleUserLogin }