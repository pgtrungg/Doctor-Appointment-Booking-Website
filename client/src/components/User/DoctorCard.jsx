import React from 'react'
import DoctorImage from '../../assets/DoctorImage.png'
import Button from '@mui/material/Button'


export default function DoctorCard({name,avatar, speciality, experience,onCardClick}) {
  return (
    <div className="flex items-center cursor-pointer hover:shadow-md justify-between shadow-lg p-4 rounded-lg bg-white my-4"
    role='button'
    onClick={onCardClick()}>
    <div className="flex items-center">
      <img src={avatar || DoctorImage} alt="Doctor" className="w-16 h-16 rounded-full mr-4" />
      <div>
        <p className="font-semibold">Dr. {name}</p>
        <p>Specialty: {speciality}</p>
        <p>Experience: {experience} years</p>
      </div>
    </div>
  </div>
  )
}
