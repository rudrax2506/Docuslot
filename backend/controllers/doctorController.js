import doctorModel from "../models/doctorModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";



const changeAvailability = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availabilty Changed' })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel

const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req;  // ✅ Now read from req.docId
        const appointments = await appointmentModel.find({ docId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.docId;  // ← pulled from authDoctor middleware

        // 1) fetch the appointment
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        // 2) ensure this doctor owns it
        if (appointmentData.docId.toString() !== docId) {
            return res.json({ success: false, message: 'Cancellation Failed' });
        }

        // 3) mark it cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // 4) release that slot in the doctor's record
        const { slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        const slots_booked = { ...doctorData.slots_booked };

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        return res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};


// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.docId;                     // ← get from middleware
        const appointmentData = await appointmentModel.findById(appointmentId);

        // compare as strings
        if (appointmentData && appointmentData.docId.toString() === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.json({ success: true, message: 'Appointment Completed' });
        }

        return res.json({ success: false, message: 'Mark Failed' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// API To get Dashboard data for doctor panel

// Controller to get doctor's dashboard data
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId;  // ✅ Use the ID set by the middleware

        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;
        appointments.forEach((item) => {
            if (item.isCompleted) {
                earnings += item.amount;
            }
        });

        // ✅ Use Set to ensure unique patients
        const patientSet = new Set();
        appointments.forEach((item) => {
            patientSet.add(item.userId.toString());
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patientSet.size,
            latestAppointments: appointments.reverse().slice(0, 5)
        };

        res.json({ success: true, dashData });  // ✅ FIXED: should be res.json
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// API To get the Doctor Profile

const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId;
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {

        console.log(error);
        return res.json({ success: false, message: error.message });

    }
}

// API To update the Doctor Profile data from doctor panel

const updateDoctorProfile = async (req, res) => {
    try {

        const docId = req.docId;
        const {fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })
        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });

    }
}





export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}
