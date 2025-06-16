import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {

  const {aToken} = useContext(AppContext)
  return aToken ? (
    <div>
      <Login />
      <ToastContainer />
    </div>
  )
}

export default App

