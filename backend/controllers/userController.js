import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'

// API to register a new user

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })

        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })
        }

        // Vaidating Strong Password
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })
        }

        // Hashing the User Password

        const salt = await bcrypt.genSalt(9)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// API for User Login

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User Account Does Not Exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Password" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

const getProfile = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// In your userController.js

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        // pull the real ID out of req.userId, not req.body
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        // basic validation
        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        // First update (without image), returning the new document
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                name,
                phone,
                address: JSON.parse(address),
                dob,
                gender
            },
            { new: true }               // <-- return the updated document
        );

        // If there’s a file, upload it then update the image URL
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            });
            updatedUser.image = imageUpload.secure_url;
            await updatedUser.save();   // persist the new image URL
        }

        // send back the fresh user object
        res.json({
            success: true,
            message: "Profile Updated",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


export { registerUser, loginUser, getProfile, updateProfile }