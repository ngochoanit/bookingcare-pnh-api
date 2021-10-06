import db from "../models/index"
require("dotenv").config()
import { EmailService } from './Emailservice'
const postPatientBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.email || !data.doctorId || !data.timeType || !data.fullName ||
                !data.doctorName || !data.language) {

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
                        roleId: "R3"
                    },
                    raw: true
                })

                if (user) {
                    await EmailService.sendSimpleEmail({
                        reciverEmail: user.email,
                        patientName: data.fullName,
                        time: data.timeString,
                        doctorName: data.doctorName,
                        language: data.language,
                        redirectLink: "https://www.facebook.com/pnh.it/"
                    })
                    console.log(user)
                    await db.Booking.findOrCreate({
                        where: { patientId: user.id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType,
                        }

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "save successed!",
                    data: user
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
export const patientService = {
    postPatientBookAppointmentService
}