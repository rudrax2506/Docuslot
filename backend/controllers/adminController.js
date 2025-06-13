import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'

// API To add a new doctor
const addDoctor = async (req, res) => {

    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // to check every field has some data
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // To check if valid email format is entered
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // To Check if a strong password has been entered
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // Hashing the doctor password
        const salt = await bcrypt.genSalt(9)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Uploading the image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: 'Doctor Added' })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

// API For Admin Login

const loginAdmin = async (req, res) => {
    try{

        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true,token})


        } else{
            res.json({success:false, message:"Invalid Credentials"})
        }

    } catch(error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
    
}

export { addDoctor, loginAdmin}