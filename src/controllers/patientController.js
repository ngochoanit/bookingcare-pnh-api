import { patientService } from '../services/patientService'
const postPatientBookAppointment = async (req, res) => {
    try {
        const response = await patientService.postPatientBookAppointmentService(req.body)
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
const postVerifytBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifytBookAppointmentService(req.body)
        return res.status(200).json(
            infor
        )
    }
    catch (err) {
        console.log(err)
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
export const patientController = {
    postPatientBookAppointment,
    postVerifytBookAppointment
}