import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'

const DoctorAppointment = () => {

  const {dToken, appointments, getAppointments} = useContext(DoctorContext)

  useEffect(() => {
    if(dToken){
      getAppointments()
    }

  }, [dToken])



  return (
    <div>
      
    </div>
  )
}

export default DoctorAppointment
