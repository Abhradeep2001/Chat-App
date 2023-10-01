import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../config/firebase-config'
import { AuthContext } from '../context/AuthContext'

export const Navbar = () => {

  //Calling current user using context api
  const {currentUser}=useContext(AuthContext);

  //Function to logOut
  const logOut=  ()=>{
     signOut(auth);
  }
  
  return (
    <div className='navbar'>
        <span className='logo'>Welcome !!</span>
        <div className="user">
            <img src={currentUser.photoURL} alt="" />
            <span>{currentUser.displayName}</span>
            <button onClick={logOut}>Logout</button>
        </div>
    </div>
  )
}
