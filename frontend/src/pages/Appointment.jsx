import 'react-toastify/dist/ReactToastify.css'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const found = doctors.find(doc => doc._id === docId)
    setDocInfo(found)
  }

  const getAvailableSlots = async () => {
    if (!docInfo) return
    setDocSlots([])

    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(today)
      dayDate.setDate(today.getDate() + i)

      const endTime = new Date(today)
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      const slotPointer = new Date(dayDate)
      if (today.getDate() === dayDate.getDate()) {
        slotPointer.setHours(slotPointer.getHours() > 10 ? slotPointer.getHours() + 1 : 10)
        slotPointer.setMinutes(slotPointer.getMinutes() > 30 ? 30 : 0)
      } else {
        slotPointer.setHours(10)
        slotPointer.setMinutes(0)
      }

      const timeSlots = []
      while (slotPointer < endTime) {
        const formattedTime = slotPointer.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        const d = slotPointer.getDate()
        const m = slotPointer.getMonth() + 1
        const y = slotPointer.getFullYear()
        const slotDate = `${d}/${m}/${y}`

        const isBooked =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(formattedTime)

        if (!isBooked) {
          timeSlots.push({
            dateTime: new Date(slotPointer),
            time: formattedTime
          })
        }
        slotPointer.setMinutes(slotPointer.getMinutes() + 30)
      }

      setDocSlots(prev => [...prev, { date: dayDate, slots: timeSlots }])
    }
  }

  const bookAppointment = async () => {
  if (!token) {
    toast.warn('Login to Book Appointment')
    setTimeout(() => {
      navigate('/login')
    }, 2500) // 2.5 seconds delay to allow toast to show
    return
  }

  if (!slotTime) {
    toast.warn('Please select a time slot')
    return
  }

  try {
    const selectedDay = docSlots[slotIndex]?.date
    const d = selectedDay.getDate()
    const m = selectedDay.getMonth() + 1
    const y = selectedDay.getFullYear()
    const slotDate = `${d}/${m}/${y}`

    const { data } = await axios.post(
      `${backendUrl}/api/user/book-appointment`,
      { docId, slotDate, slotTime },
      { headers: { token } }
    )

    if (data.success) {
      toast.success(data.message, {
        position: 'top-right',
        autoClose: 2000,
        onClose: () => {
          getDoctorsData()
          navigate('/my-appointments')
        }
      })
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.error(error)
    toast.error(error.message)
  }
}


  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  return docInfo && (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/*-----------Doctor Details---------------*/}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img
            className='bg-primary w-full sm:max-w-72 rounded-lg'
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="verified" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="info" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
              {docInfo.about}
            </p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment Fee: <span className='text-gray-600'>
              {currencySymbol}{docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/*-----Booking Slots-------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.map((dayObj, index) => (
            <div
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-[4rem] rounded-full cursor-pointer ${
                slotIndex === index
                  ? 'bg-primary text-white'
                  : 'border border-gray-200'
              }`}
            >
              <p>{daysOfWeek[dayObj.date.getDay()]}</p>
              <p>{dayObj.date.getDate()}</p>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots[slotIndex]?.slots?.length > 0 ? (
            docSlots[slotIndex].slots.map((s, i) => (
              <p
                key={i}
                onClick={() => setSlotTime(s.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  s.time === slotTime
                    ? 'bg-primary text-white'
                    : 'text-gray-400 border border-gray-300'
                }`}
              >
                {s.time.toLowerCase()}
              </p>
            ))
          ) : (
            <p className='text-gray-500'>No slots available</p>
          )}
        </div>

        <button
          onClick={bookAppointment}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'
        >
          Book an appointment
        </button>
      </div>

      {/* Listing Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
