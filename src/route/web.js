/**
 * Config route
 */

import express from 'express'
import { homeController } from '../controllers/homeController'
import { userController } from '../controllers/userController'
import { doctorController } from '../controllers/doctorController'
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
    router.get('/api/get-detail-doctor-by-id', doctorController.handlegetDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.handleBulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.handleGetScheduleDoctorByDate)
    return app.use('/', router)
}
export default initWebRoutes