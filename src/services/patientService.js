import db from "../models/index"
require("dotenv").config()
const postPatientBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data)
            if (!data.email || !data.doctorId || !data.timeType) {

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
                console.log("patient service ", user.id)
                if (user) {
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