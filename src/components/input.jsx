import React, { useContext, useState } from 'react'
import AddImage from "../images/addImage.png"
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { database, storage } from '../config/firebase-config'
import {v4 as uuid} from "uuid" //To generate unique id's
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

export const Input = () => {

  const [text, setText]=useState("");
  const [img, setImg]=useState(null);

  const {currentUser}=useContext(AuthContext);
  const {data}=useContext(ChatContext);

  const handleSend= async()=>{
    //If image is send
    // If image is sent
if (img) {
  const storageRef = ref(storage, uuid());
  const uploadTask = uploadBytesResumable(storageRef, img);

  uploadTask.on(
    (error) => {
      // Handle any Error
      console.error(error); // Log the error
    },
    async () => {
      try {
        // Wait for the upload to complete before getting the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Now that you have the download URL, you can update the Firestore document
        await updateDoc(doc(database, "chats", data.chatID), {
          messages: arrayUnion({
            id: uuid(),
            text: text,
            senderID: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
          }),
        });
      } catch (error) {
        // Handle the case where the object doesn't exist
        console.error("Object does not exist in Firebase Storage:", error);
      }
    }
  );
}

    //If text is send
    else{
      await updateDoc(doc(database,"chats",data.chatID),{
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderID: currentUser.uid,
          date: Timestamp.now(),

        })
      })
    }

    await updateDoc(doc(database,"userChats",currentUser.uid),{
      [data.chatID+".lastMessage"]:{
        text,
      },
      [data.chatID+".date"]: serverTimestamp()
    })

     await updateDoc(doc(database,"userChats",data.user.uid),{
      [data.chatID+".lastMessage"]:{
        text,
      },
      [data.chatID+".date"]: serverTimestamp()
    })

    setText("");
    setImg(null);
  }

  return (
    <div className='input'>
        <input 
          type="text" 
          placeholder='Type Your Message...' 
          onChange={(event)=>setText(event.target.value)} 
          value={text}
          />
        <div className="send">
            <input 
              type="file" 
              style={{display:"none"}} 
              id="file" 
              onChange={(event)=>setImg(event.target.files[0])}
            />
            <label htmlFor="file">
                <img src={AddImage} alt="" />
            </label>
            <button onClick={handleSend}>Send</button>
        </div>
    </div>
  )
}
