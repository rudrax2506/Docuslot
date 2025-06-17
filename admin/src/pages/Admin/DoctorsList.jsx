import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const {doctors, aToken, getAllDoctors} = useContext(AdminContext)
  return (
    <div>
        DoctorsList
      
    </div>
  )
}

export default DoctorsList
