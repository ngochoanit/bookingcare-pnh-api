import db from "../models/index"
require("dotenv").config()
import { EmailService } from './Emailservice'
import { v4 as uuidv4 } from 'uuid'
const bulidUrlEmail = (token, doctorId) => {
    let result = ''
    result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}
const postPatientBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.email || !data.doctorId || !data.timeType || !data.fullName ||
                !data.doctorName || !data.language || !data.address || !data.gender) {

                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter input required",
                })
            }
            else {
                //upsert
                const [user, created] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: "R3",
                        address: data.address,
                        gender: data.gender,
                        phoneNumber: data.phoneNumber,
                        firstName: data.fullName,
                    },
                    raw: true
                })

                if (user) {
                    let token = uuidv4()
                    await EmailService.sendSimpleEmail({
                        reciverEmail: user.email,
                        patientName: data.fullName,
                        time: data.timeString,
                        doctorName: data.doctorName,
                        language: data.language,
                        redirectLink: bulidUrlEmail(token, data.doctorId)
                    })
                    await db.Booking.findOrCreate({
                        where: { patientId: user.id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "save successed!",
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
const postVerifytBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter input required",
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false,
                })
                if (appointment) {
                    appointment.statusId = "S2"
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: "verify appointment successed!"
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment schedule has been activated or does not exist!",
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
export const patientService = {
    postPatientBookAppointmentService,
    postVerifytBookAppointmentService
}