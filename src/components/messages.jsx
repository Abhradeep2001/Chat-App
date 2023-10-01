import React, { useContext, useEffect, useState } from 'react'
import { Message } from './message'
import { ChatContext } from '../context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebase-config';

export const Messages = () => {

  const {data}=useContext(ChatContext);

  //State variable to store messages(array[])
  const [messages,setMessages]=useState([]);

  useEffect(()=>{
    //Using firestore snapshot to get realtime messages
    const unSub=onSnapshot(doc(database,"chats",data.chatID), (doc)=>{
      doc.exists() && setMessages(doc.data().messages);
    })
    //Cleanup
    return ()=>{
      unSub();
    }
  }, [data.chatID]);

  console.log(messages)

  return (
    <div className='messages'>
      {/* Mapping the messages array */}
      {messages.map((message)=>(
        <Message message={message} key={message.id}/>
      ))}
    </div>
  )
}
