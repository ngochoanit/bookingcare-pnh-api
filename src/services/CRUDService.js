import bcrypt from 'bcryptjs'
import db from '../models/index'

var salt = bcrypt.genSaltSync(10);
//Create new user
const createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            resolve('create new user successed')
        }
        catch (err) {
            reject(err);
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
//get all user
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = db.User.findAll({
                raw: true,
            })
            resolve(users)
        }
        catch (err) {
            reject(err)
        }
    })
}
export const CRUDService = { createNewUser, getAllUser }