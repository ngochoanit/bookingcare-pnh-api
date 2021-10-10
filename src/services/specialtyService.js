import db from "../models/index"

const postCreateNewSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHtml || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter input required"
                })
            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHtml: data.descriptionHtml
                })
                resolve({
                    errCode: 0,
                    errMessage: "create new specialty successed"
                })
            }
        } catch (err) {
            reject(err);
        }
    })

}
const getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({

                attributes: {
                    exclude: ['descriptionHtml', 'descriptionMarkdown']
                }
            })
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
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
export const specialtyService = {
    postCreateNewSpecialtyService,
    getAllSpecialtyService
}