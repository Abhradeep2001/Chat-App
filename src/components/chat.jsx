import React, { useContext } from 'react'
import AddUser from '../images/addUser(1).png';
import More from "../images/moreInfo(1).png"
import { Messages } from './messages';
import { Input } from './input';
import { ChatContext } from '../context/ChatContext';

export const Chat = () => {

  const {data}=useContext(ChatContext);

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
      <div className="chatIcons">
        <img src={AddUser} alt="" />
        <img src={More} alt="" />
      </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}
