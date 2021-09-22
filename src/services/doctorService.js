import _ from "lodash"
import db from "../models/index"
require("dotenv").config()
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

const getTopDoctorHome = (limit) => {
    console.log('service')
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                limit: limit,
                order: [['updatedAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                nest: true,
                raw: true
            })

            resolve({
                errCode: 0,
                errMessage: "Get top doctor seccessed",
                data: users
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
// handle get all doctor
const getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                errMessage: "Get all doctor successfully",
                data: doctors
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
// handle get all doctor
const postInforDoctorSevice = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown || !data.action) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter input required",
                })
            }

            else {
                if (data.action === "CREATE") {
                    await db.Markdown.create({
                        ...data
                    })
                }
                else if (data.action === "EDIT") {
                    const doctorId = data.doctorId
                    delete data.doctorId
                    await db.Markdown.update(
                        { ...data },
                        {
                            where: {
                                doctorId: doctorId
                            }
                        })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Create infor doctor successfully",
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
// get deatail doctor by id 
const getDetailDoctorByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 3,
                    errMessage: "Missing required parameter"
                })
            }
            else {
                let data = await db.User.findOne({
                    where: {
                        id: id
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentMarkdown', 'contentHTML']
                        },
                        {
                            model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: "Get detail doctor by id successfully ",
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
//create multi schedule
const bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data && !data.arrSchedule && !data.doctorId && data.date) {

                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }
            else {
                let schedule = data.arrSchedule
                const doctorId = data.doctorId
                const date = data.date
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = Number(MAX_NUMBER_SCHEDULE)
                        return item
                    })
                }
                const findAll = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    attributes: ['doctorId', 'date', 'timeType', 'maxNumber'],
                    raw: true
                })
                findAll.map((item) => {
                    item.date = item.date.getTime()
                    return item
                })
                const toCreate = _.differenceWith(schedule, findAll, _.isEqual)
                if (toCreate) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
export const doctorService = {
    getTopDoctorHome,
    getAllDoctorsService,
    postInforDoctorSevice,
    getDetailDoctorByIdService,
    bulkCreateScheduleService
}