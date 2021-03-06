import _ from "lodash"
import moment from "moment"
import db from "../models/index"
import { EmailService } from "./Emailservice"
require("dotenv").config()
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

const getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({

                limit: limit,
                where: {
                    roleId: "R2"
                },
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
//chec required fields
const checkRequiredFields = (data) => {
    const arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'specialtyId']
    let isValid = true;
    let element = []
    arrFields.forEach((item) => {
        if (item in data === false) {
            isValid = false;
            element.push(item)
            return { isValid, element };
        }
        else {
            if (!data[item]) {

                isValid = false
                element.push(item)
                return { isValid, element }
            }
        }

    })
    return { isValid, element }
}
// handle get all doctor
const postInforDoctorSevice = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            const checkObj = checkRequiredFields(data)
            if (!checkObj.isValid) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter input required ${checkObj.element.join(',')}`,
                })
            }
            else {
                //upsert to markdown
                const markdown = {
                    doctorId: data.doctorId,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description
                }
                const doctorId = data.doctorId
                if (data.action === "CREATE") {
                    await db.Markdown.create({
                        ...markdown
                    })
                }
                else if (data.action === "EDIT") {
                    await db.Markdown.update(
                        { ...markdown },
                        {
                            where: {
                                doctorId: doctorId
                            }
                        })
                }
                //upsert to doctor_infor
                const doctorInforData = {
                    doctorId: data.doctorId,
                    priceId: data.selectedPrice,
                    paymentId: data.selectedPayment,
                    provinceId: data.selectedProvince,
                    nameClinic: data.nameClinic,
                    addressClinic: data.addressClinic,
                    note: data.note,
                    specialtyId: data.specialtyId,
                    clinicId: data.clinicId,
                }

                const doctorInfor = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: doctorId
                    }
                })
                if (!doctorInfor) {
                    await db.Doctor_infor.create({
                        ...doctorInforData
                    })
                }
                else {
                    await db.Doctor_infor.update(
                        { ...doctorInforData },
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
                        {
                            model: db.Doctor_infor,
                            attributes: {

                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary')
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
            console.log(e)
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
                    item.date = moment(item.date).valueOf()
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
//create multi schedule
const getScheduleDoctorByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {

                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }

            else {
                const dateConvert = moment.unix(date / 1000)
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: dateConvert,
                    },
                    include: [

                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    nested: true,
                    raw: false
                })
                if (!data) {
                    data = []
                }

                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const getExtraDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }
            else {
                let data = await db.Doctor_infor.findOne({
                    where: {
                        doctorId: doctorId,
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'priceTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode,
                            as: 'provinceTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode,
                            as: 'paymentTypeData',
                            attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data: data
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
//get profile doctor by id
const getProfileeDoctorByDateService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }
            else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId,
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description']
                        },
                        {
                            model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_infor,
                            attributes: {

                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) {
                    data = {}
                }
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary')
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data: data
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
const getListPaytientForDoctorService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }
            else {
                const dateConvert = moment.unix(date / 1000)
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: +doctorId,
                        date: dateConvert,
                        statusId: 'S2'

                    },
                    include: [
                        {
                            model: db.User,
                            attributes: ['email', 'firstName', 'address', 'gender', 'phoneNumber'],
                            as: 'patientData',
                            include: [
                                {
                                    model: db.Allcode,
                                    attributes: ['valueEn', 'valueVi'],
                                    as: 'genderData'
                                }
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'bookingTypeData',
                            attributes: ['valueEn', 'valueVi']

                        },
                        {
                            model: db.Allcode,
                            as: 'bookingStatusData',
                            attributes: ['valueEn', 'valueVi']

                        }
                    ],
                    nest: true,
                    raw: false
                })
                if (!data) {
                    data = []
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data: data
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
const sendRemedyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data || !data.email || !data.patientId || !data.doctorId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            }
            else {

                //update paytient status
                const appointment = await db.Booking.update(
                    {
                        statusId: "S3"
                    },
                    {
                        where: {
                            doctorId: Number(data.doctorId),
                            patientId: Number(data.patientId),
                            timeType: data.timeType
                        }
                    }

                )
                await EmailService.sendAttachment(data)
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                })

                // send email remedy
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
export const doctorService = {
    getTopDoctorHome,
    getAllDoctorsService,
    postInforDoctorSevice,
    getDetailDoctorByIdService,
    bulkCreateScheduleService,
    getScheduleDoctorByDateService,
    getExtraDoctorByIdService,
    getProfileeDoctorByDateService,
    getListPaytientForDoctorService,
    sendRemedyService
}