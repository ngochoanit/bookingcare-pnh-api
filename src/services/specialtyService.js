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
export const specialtyService = {
    postCreateNewSpecialtyService
}