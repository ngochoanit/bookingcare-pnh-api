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
const getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id: userId },
                raw: true
            })
            if (user) {
                resolve(user)
            }
            else {
                resolve({})
            }
        }
        catch (err) {
            reject(err)
        }
    })
}
const updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = data.id;
            delete data.userId;
            const user = await db.User.findOne({
                where: { id: userId }
            })
            const userUpdated = await db.User.update({ ...data }, {
                where: {
                    id: userId,
                },
                raw: true
            });
            resolve(userUpdated)
        } catch (err) {
            reject(err)
        }
    })
}
const deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userDeleted = await db.User.destroy({
                where: {
                    id: userId,
                },
                raw: true
            });

            resolve(userDeleted)
        } catch (err) {
            reject(err)
        }
    })
}
export const CRUDService = { createNewUser, getAllUser, getUserInfoById, updateUserData, deleteUserById }