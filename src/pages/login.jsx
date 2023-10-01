import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase-config";

export const Login=()=>{

    const [error,setError]=useState(false);
    const navigate=useNavigate();

    const handleSubmit= async(event)=>{
        //To prevent auto-refresing
        event.preventDefault();

        //Taking only the email and password field from the login form
        const email=event.target[0].value;
        const password=event.target[1].value;

        try{
            //To sign with email and password (/Authenticate)
            await signInWithEmailAndPassword(auth,email,password);

            //After authenticating navigate to the '/Home' page
            navigate("/")
        }
        catch(error){
            setError(true);
        }
    }

     return(
        <div className="registerFormContainer">
            <div className="registerFormWrapper">
                <span className="logo">Chat App</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Enter your email address"/>
                    <input type="password" placeholder="password"/>
                    <button>Sign In</button>
                     {error && <span>Something went wrong!! Try Again!!</span>}
                </form>
                <p>Don't Have An Account? Then <Link to="/register">Sign Up!! </Link></p>
            </div>
        </div>
    )
}