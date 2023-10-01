import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { database } from '../config/firebase-config';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

export const Chats = () => {

  //state variables to store user chats (chat array)
  const [chats,setChats]=useState([]);

  //Getting currentuser info
  const {currentUser}=useContext(AuthContext);

  const {dispatch}=useContext(ChatContext);

  //using firestore onSnapshot lib to get realtime updated data
  useEffect(()=>{
    const getChats=()=>{
      const unsub=onSnapshot(doc(database,"userChats",currentUser.uid), (doc)=>{
        setChats(doc.data());
      })
      return ()=>{
        unsub();
      }
    }
    currentUser.uid && getChats();
  }, [currentUser.uid])

  // console.log(Object.entries(chats))

  const handleClick=(user)=>{
    //Updating our user
    dispatch({
      type:"CHANGE_USER",
      payload: user});
  }

  return (
    <div className='chats'>
      {/* Retrieving chats from the 'chats' array */}
      {/* Sorting chats according to date and time stamp */}
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat)=>(
        <div className="userChat" key={chat[0]} onClick={() => handleClick(chat[1].userInfo)}>
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
            </div>
        </div>
      ))}
         
    </div>
  )
}
