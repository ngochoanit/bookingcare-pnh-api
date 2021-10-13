import db from "../models/index"

const postCreateNewClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name
                || !data.address
                || !data.imageBase64
                || !data.descriptionHtml
                || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter input required"
                })
            }
            else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHtml: data.descriptionHtml
                })
                resolve({
                    errCode: 0,
                    errMessage: "create new clinic successed"
                })
            }
        } catch (err) {
            reject(err);
        }
    })

}
const getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({

                attributes: {
                    exclude: ['descriptionHtml', 'descriptionMarkdown']
                }
            })
            if (data && data.length > 0) {
                data.map((item) => {
                    if (item.image) {

                        item.image = new Buffer(item.image, 'base64').toString('binary')
                    }
                    return item
                })
            }
            else {
                data = {}
            }
            resolve({
                errCode: 0,
                errMessage: "get all specialty fail",
                data: data
            })
        } catch (err) {
            reject(err);
        }
    })

}
const getDetailClinicByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (inputId) {
                let data = {}
                data = await db.Clinic.findOne({
                    where: {
                        id: Number(inputId),
                    },
                    include: [
                        { model: db.Doctor_infor, as: 'doctorDataClinic', attributes: ['doctorId'] }
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) {
                    data = {}
                }
                else {
                    if (data.image) {
                        data.image = new Buffer(data.image, 'base64').toString('binary')
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    data: data
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter input required"
                })
            }
        } catch (err) {
            reject(err);
        }
    })
}
export const clinicService = {
    postCreateNewClinicService,
    getAllClinicService,
    getDetailClinicByIdService
}