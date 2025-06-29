import React, { useEffect, useContext, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const UserList = () => {
  const { users = [], getAllUsers } = useContext(AdminContext)
  const { calculateAge } = useContext(AppContext)

  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')

  useEffect(() => {
    getAllUsers()
  }, [])

  const filterUsers = users.filter(user => {
    const age = user.dob !== 'Not Selected' ? calculateAge(user.dob) : null
    const nameMatch = user.name.toLowerCase().includes(search.toLowerCase())
    const emailMatch = user.email.toLowerCase().includes(search.toLowerCase())
    const genderMatch = genderFilter ? user.gender === genderFilter : true
    const minAgeMatch = minAge ? age >= Number(minAge) : true
    const maxAgeMatch = maxAge ? age <= Number(maxAge) : true

    return (nameMatch || emailMatch) && genderMatch && minAgeMatch && maxAgeMatch
  })

  const exportToExcel = () => {
    const exportData = filterUsers.map((user, index) => ({
      '#': index + 1,
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Gender: user.gender,
      DOB: user.dob,
      Age: user.dob !== 'Not Selected' ? calculateAge(user.dob) : 'N/A',
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })

    saveAs(data, 'Filtered_Users.xlsx')
  }

  const isUsersEmpty = !Array.isArray(filterUsers) || filterUsers.length === 0

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users List</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm text-gray-700 mb-1">Search by Name or Email</label>
          <input
            type="text"
            className="border px-3 py-2 rounded w-full"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Gender</label>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="border px-3 py-2 rounded w-40"
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Not Selected">Not Selected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Min Age</label>
          <input
            type="number"
            className="border px-3 py-2 rounded w-24"
            value={minAge}
            onChange={(e) => setMinAge(e.target.value)}
            placeholder="e.g. 18"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Max Age</label>
          <input
            type="number"
            className="border px-3 py-2 rounded w-24"
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            placeholder="e.g. 60"
          />
        </div>

        {(search || genderFilter || minAge || maxAge) && (
          <button
            onClick={() => {
              setSearch('')
              setGenderFilter('')
              setMinAge('')
              setMaxAge('')
            }}
            className="text-sm text-blue-600 underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Export Button */}
      {!isUsersEmpty && (
        <div className="flex justify-end mb-4">
          <button
            onClick={exportToExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow"
          >
            Export to Excel
          </button>
        </div>
      )}

      {/* Table */}
      {isUsersEmpty ? (
        <p className="text-gray-500 text-base">No users found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-2xl shadow-md bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">#</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Gender</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">DOB</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filterUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-11 h-11 rounded-full border object-cover"
                    />
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4">{user.gender}</td>
                  <td className="px-6 py-4">{user.dob}</td>
                  <td className="px-6 py-4">
                    {user.dob !== 'Not Selected' ? calculateAge(user.dob) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UserList
