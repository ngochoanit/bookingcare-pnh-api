/**
 * Config route
 */

import express from 'express'
import { homeController } from '../controllers/homeController'
import { userController } from '../controllers/userController'
import { doctorController } from '../controllers/doctorController'
import { patientController } from '../controllers/patientController'
import { specialtyController } from '../controllers/specialtyController'
import { clinicController } from '../controllers/clinicController'
const router = express.Router()
const initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayCRUD)
    router.get('/edit-crud', homeController.getEditCRUD)
    router.post('/put-crud', homeController.putCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/get-all-code', userController.handleGetAllCode)

    router.get('/api/get-top-doctor-home', doctorController.handleGetTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.handleGetAllDoctors)
    router.post('/api/save-infor-doctor', doctorController.handlePostInforDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.handleGetDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.handleBulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.handleGetScheduleDoctorByDate)
    router.get('/api/get-extra-doctor-by-id', doctorController.handleGetExtraDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.handleGetProfileDoctorById)

    router.post('/api/patient-book-appointment', patientController.postPatientBookAppointment)

    router.post('/api/verify-booking-appointment', patientController.postVerifytBookAppointment)

    router.post('/api/create-new-specialty', specialtyController.postCreateNewSpecialty)
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)

    router.post('/api/create-new-clinic', clinicController.postCreateNewClinic)
    router.get('/api/get-all-clinic', clinicController.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)
    return app.use('/', router)
}
export default initWebRoutes