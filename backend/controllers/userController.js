import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'

// API to register a new user

const registerUser = async (req, res) => {

    try{
        const {name, email, password} = req.body

        if(!name || !password || !email ) {
            return res.json({success:false,message:"Missing Details"})

        }

        if(!validator.isEmail(email)) {
            return res.json({success:false,message:"enter a valid email"})
        }

        // Vaidating Strong Password
        if (password.length < 8){
            return res.json({success:false,message:"enter a strong password"})
        }

        // Hashing the User Password

        const salt = await bcrypt.genSalt(9)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password:hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        // 





    } catch (error) {

    }
}