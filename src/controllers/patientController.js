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
export const patientController = {
    postPatientBookAppointment
}