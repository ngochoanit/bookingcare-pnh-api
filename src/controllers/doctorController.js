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
export const doctorController = {
    handleGetTopDoctorHome,
}