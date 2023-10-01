import React, { useContext, useState } from 'react'
//Importing query packages from firestore lib
import {query, collection, where, getDoc, setDoc, doc, updateDoc, serverTimestamp, getDocs} from "firebase/firestore"
import { database } from '../config/firebase-config';
import { AuthContext } from '../context/AuthContext';

export const Search = () => {

  const [userName,setUserName]=useState("");
  const [user,setUser]=useState(null);
  const [error,setError]=useState(false);

  //Getting current user info
  const {currentUser}=useContext(AuthContext);

  //Function to search for the user
  const searchUser= async() =>{
    //Query to search names where 'displayName' is equal to input userName
    const qName=query(collection(database,"users"), where("displayName","==",userName));

    //Getting documents from our 'users' collection that matches our query
    try{
      const querySnapShot = await getDocs(qName);
      //Looping thorugh our result
      querySnapShot.forEach((doc) => {
        setUser(doc.data());
      })
    }
    catch(error){
      setError(true);
    }
  };

  const handleKeyDown=(event)=>{
    //On pressing 'Enter' it searches for the user using the search function
    event.code === "Enter" && searchUser();

  }

  const handleClick= async ()=>{
     //Check whether the group(chats coll. in firestore) exists or not, if not then create a new one
     //Logic to combine uid of our 'currentUser' and the 'user' we searched for
     const combinedID= currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
     try{
      const res= await getDoc(doc(database,"chats",combinedID));

      //If the chat doesn't exists, then create a new chat in the 'chats' collection
      if(!res.exists()){
        await setDoc(doc(database,"chats",combinedID), {messages: []})

        //Create user chats
        //For the currentUser
        await updateDoc(doc(database,"userChats", currentUser.uid),{
          [combinedID + ".userInfo"]:{
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedID+".date"]: serverTimestamp()
        })
        //For the user who is searched
         await updateDoc(doc(database,"userChats", user.uid),{
          [combinedID + ".userInfo"]:{
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedID+".date"]: serverTimestamp()
        })
      }
     }
     catch(error){
        //Handles error
        console.log(error);
        setError(true)
     }
     setUser(null);
     setUserName("");

  }

  return (
    <div className='search'>
        <div className="searchForm">
            <input 
             type="text" 
             placeholder='Find User ..' 
             onChange={(event)=>setUserName(event.target.value)}
             onKeyDown={handleKeyDown}
             value={userName}
             />
        </div>
        {/* //If no user display error message */}
        {error && <span>User Doesn't Exists</span>}
        {/* //If User exists then only show username and photo */}
        {user && (<div className="userChat" onClick={handleClick}>
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
                <span>{user.displayName}</span>
            </div>
        </div>)}
    </div>
  )
}
