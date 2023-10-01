import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

export const Message = ({message}) => {

  const {currentUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);
  
  const ref=useRef();

  useEffect(()=>{
    //To scroll automatically into new messages
    ref.current?.scrollIntoView({behavior: "smooth"});
  } , [message]);

  return (
    <div ref={ref} className={`message  ${message.senderID === currentUser.uid && "owner"}  `}>
        <div className="messageInfo">
            <img src={
              message.senderID === currentUser.uid ? currentUser.photoURL : data.user.photoURL
            }
            alt="" 
             />
            <span>just now</span>
        </div>
        <div className="messageContent">
            <p>{message.text}</p>
            {/* //if image exists */}
            {message.img && <img src={message.img} alt="chatImg" />}
        </div>
    </div>
  )
}
