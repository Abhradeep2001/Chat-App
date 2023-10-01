import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider= ({children})=>{
    //currentUser Info
    const {currentUser}=useContext(AuthContext);

    //Initial state of user Chat
    const INITIAL_STATE={
        chatID: "null",
        user: {},
    }

    //Creating a Reducer Function to update the state of our chat
    const chatReducer=(state,action)=>{
        switch(action.type){
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatID: currentUser.uid > action.payload.uid 
                    ? currentUser.uid + action.payload.uid 
                    : action.payload.uid + currentUser.uid,
                };
            default:
                return state;
        }
    }

    //Creating a useReducer Hook
    const [state,dispatch]=useReducer(chatReducer,INITIAL_STATE);
    
    return(
    <ChatContext.Provider value={{data: state,dispatch}}>
        {children}
    </ChatContext.Provider>
    )
}