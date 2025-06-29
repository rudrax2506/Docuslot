// C:\Docuslot\backend\routes\adminRoute.js
import express from 'express'
import { addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard, allUsers, toggleUserBlock } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin, allDoctors)
adminRouter.post('/change-availability',authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)
adminRouter.get('/all-users', authAdmin, allUsers)
adminRouter.post('/toggle-user-block', authAdmin, toggleUserBlock)


export default adminRouter