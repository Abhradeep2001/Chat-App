import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { auth, storage, database } from "../config/firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import UserAvatar from "../images/userAvatar.png"


export const Register=()=>{

    const [error,setError]=useState(false);
    const navigate=useNavigate();

    const handleSubmit= async (event)=>{

        //Prevent the page from refreshing
        event.preventDefault();

        //To get data from register form
        const displayName=event.target[0].value;
        const email=event.target[1].value;
        const password=event.target[2].value;
        //To get the image from the storage
        const file=event.target[3].files[0];

        try{
        //To create new user with their email and password (First Time)
        const result= await createUserWithEmailAndPassword(auth,email,password)

        //Create image name for the user to upload
        const currTime=new Date().getTime();
        const storageRef= ref(storage,`${displayName + currTime}`);

        await uploadBytesResumable(storageRef,file).then(()=>{
            getDownloadURL(storageRef).then(async(downloadURL)=>{
                try{
                    //Update profile
                    await updateProfile(result.user,{
                        //Updating username and photo(/avatar) of the user
                        displayName:displayName,
                        photoURL: downloadURL,
                    })

                    //Creating a new document in the "users" collection in our database
                    await setDoc(doc(database,"users",result.user.uid),{
                        uid: result.user.uid,
                        displayName: displayName,
                        email: email,
                        photoURL: downloadURL,
                        password: password,
                    })

                    //Creating a new collection for userChats
                    await setDoc(doc(database,"userChats",result.user.uid),{})
                    navigate("/");

                }catch(error){
                    setError(true);
                }
            })
        })
        }
        catch(error){
            setError(true);
        }
        
    }

    return(
        <div className="registerFormContainer">
            <div className="registerFormWrapper">
                <span className="logo">Chat App</span>
                <span className="title">New User? Please Register!!</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Enter your Name" required/>
                    <input type="email" placeholder="Enter your email address" required/>
                    <input type="password" placeholder="password" required/>
                    <input style={{display:"none"}} type="file" id="file" />
                    <label htmlFor="file">
                        <img src={UserAvatar} alt=""/>
                        <span>Add an avatar for your profile</span>
                    </label>
                    <button>Sign Up</button>
                    {error && <span>Something went wrong!! Try Again!!</span>}
                </form>
                <p>Already Have An Account? Then <Link to="/login">Log In!!</Link></p>
            </div>
        </div>
    )
}