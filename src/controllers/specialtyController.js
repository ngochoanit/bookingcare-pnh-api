import { specialtyService } from '../services/specialtyService'
const postCreateNewSpecialty = async (req, res) => {
    try {
        const response = await specialtyService.postCreateNewSpecialtyService(req.body)
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
const getAllSpecialty = async (req, res) => {
    try {
        const response = await specialtyService.getAllSpecialtyService()
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
const getDetailSpecialtyById = async (req, res) => {
    try {
        const response = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location)
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
export const specialtyController = {
    postCreateNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}