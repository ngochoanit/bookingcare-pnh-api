import { doctorService } from '../services/doctorService'
const handleGetTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) {
        limit = 10
    }
    try {
        const response = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response)

    } catch (err) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error form server"
        })
    }
}
// handle get all doctor
const handleGetAllDoctors = async (req, res) => {
    try {
        const response = await doctorService.getAllDoctorsService()
        return res.status(200).json(response)

    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
// handle post infor doctor
const handlePostInforDoctor = async (req, res) => {
    try {
        const response = await doctorService.postInforDoctorSevice(req.body)
        return res.status(200).json(response)

    } catch (err) {
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
const handleGetDetailDoctorById = async (req, res) => {
    try {
        const response = await doctorService.getDetailDoctorByIdService(req.query.id)
        return res.status(200).json(response)
    } catch (err) {
        console.log(err)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
const handleGetExtraDoctorById = async (req, res) => {
    try {
        const response = await doctorService.getExtraDoctorByIdService(req.query.id)
        return res.status(200).json(response)
    } catch (err) {
        console.log(err)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
//create multi schedule
const handleBulkCreateSchedule = async (req, res) => {
    try {
        const response = await doctorService.bulkCreateScheduleService(req.body)
        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
//gey schedule doctor by date
const handleGetScheduleDoctorByDate = async (req, res) => {
    try {
        const response = await doctorService.getScheduleDoctorByDateService(req.query.doctorId, req.query.date)
        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
//gey schedule doctor by date
const handleGetProfileDoctorById = async (req, res) => {
    try {
        const response = await doctorService.getProfileeDoctorByDateService(req.query.doctorId)
        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
const getListPaytientForDoctor = async (req, res) => {
    try {
        const response = await doctorService.getListPaytientForDoctorService(req.query.doctorId, req.query.date)
        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
const sendRemedy = async (req, res) => {
    try {
        const response = await doctorService.sendRemedyService(req.body)
        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
export const doctorController = {
    handleGetTopDoctorHome,
    handleGetAllDoctors,
    handlePostInforDoctor,
    handleGetDetailDoctorById,
    handleBulkCreateSchedule,
    handleGetScheduleDoctorByDate,
    handleGetExtraDoctorById,
    handleGetProfileDoctorById,
    getListPaytientForDoctor,
    sendRemedy
}