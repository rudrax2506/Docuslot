import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-14 my-10 mt-40 text-sm'>
        
        {/* Column 1 */}
        <div className='flex-[3] flex flex-col'>
          <div className='mb-4 w-40 h-15 flex items-start'>
            <img 
              className='w-full h-full object-contain object-left-top' 
              src={assets.logo} 
              alt="Logo"
            />
          </div>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>
        
        {/* Column 2 */}
        <div className='flex-1 flex flex-col'>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        
        {/* Column 3 */}
        <div className='flex-1 flex flex-col'>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+61424552808</li>
            <li>rudraxrishu@gmail.com</li>
          </ul>
        </div>
      </div>
      
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          Copyright 2025 @ DocuSlot.com - All Right Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer