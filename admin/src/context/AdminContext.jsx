import { createContext, useState } from "react";
import axios from 'axios'
export const AdminContext = createContext()
import { toast } from 'react-toastify'

const AdminContextProvier = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([])
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

    const changeAvailability = async(docId) => {
        try{

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', {docId},{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)

            }



        } catch (error) {
            toast.error(error.message)

        }
    }

    const value = {
        aToken, setAToken,
        backendUrl, doctors, getAllDoctors, changeAvailability,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvier