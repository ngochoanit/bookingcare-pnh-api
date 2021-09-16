const db = require("../models/index")

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
export const doctorService = {
    getTopDoctorHome
}