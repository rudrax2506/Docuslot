import { createContext, useState } from "react";
import axios from 'axios'
export const AdminContext = createContext()
import { toast } from 'react-toastify'

const AdminContextProvier = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)

            }



        } catch (error) {
            toast.error(error.message)

        }
    }

    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.sucess) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }


        } catch (error) {

        }
    }

    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)


        }
    }

    const [users, setUsers] = useState([])

const getAllUsers = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/admin/all-users', {
            headers: { aToken }
        })

        if (data.success) {
            setUsers(data.users)
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
}

    const value = {
        aToken, setAToken,
        backendUrl, doctors, getAllDoctors, changeAvailability, appointments, setAppointments, getAllAppointments, cancelAppointment, dashData, getDashData, users, getAllUsers
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvier