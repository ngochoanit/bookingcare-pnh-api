import { clinicService } from '../services/clinicService'
const postCreateNewClinic = async (req, res) => {
    try {
        const response = await clinicService.postCreateNewClinicService(req.body)
        res.status(200).json(
            response
        )
    } catch (e) {
        console.log(e.message)
        res.status(200).json(
            {
                errCode: -1,
                errMessage: "Error from server"
            }
        )
    }
}
const getAllClinic = async (req, res) => {
    try {
        const response = await clinicService.getAllClinicService()
        res.status(200).json(
            response
        )
    }
    catch (e) {
        console.log(e.message)
        res.status(200).json(
            {
                errCode: -1,
                errMessage: "Error from server"
            }
        )
    }
}
const getDetailClinicById = async (req, res) => {
    try {
        const response = await clinicService.getDetailClinicByIdService(req.query.id)
        res.status(200).json(
            response
        )
    } catch (e) {
        console.log(e.message)
        res.status(200).json(
            {
                errCode: -1,
                errMessage: "Error from server"
            }
        )
    }
}
export const clinicController = {
    postCreateNewClinic,
    getAllClinic,
    getDetailClinicById
}