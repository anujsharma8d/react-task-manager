import React from 'react'
import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import axios from "axios"


const Login = () => {
    const navigate = useNavigate()

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const baseUrl = import.meta.env.VITE_API_URL

    const handleSubmit = async (e)=>{
        e.preventDefault()

        try{
            const res = await axios.post(`${baseUrl}/api/auth/login`,{name,password})

            localStorage.setItem("token",res.data.token)

            alert(res.data.message)
            setName("")
            setPassword("")

            navigate("/")
        }catch(err){
            console.log(err)
            alert(err.response?.data?.message || "Something went wrong");
        }

    }


    return (
    <section className='flex justify-center items-center bg-black min-h-screen text-white'>
        <div className='bg-zinc-900 p-10 w-sm h-80 flex flex-col justify-center items-center gap-5 rounded-2xl'>
            <div className='flex flex-col justify-center items-center gap-1'>
        <h2>Login</h2>
        <p>Welcome Back</p>
            </div>
        <form onSubmit={handleSubmit} action="" className='flex flex-col justify-center gap-3'>
            <div>
            <p>Username</p>
            <input value={name} type="name" placeholder='Enter your username' required
            onChange={(e)=>setName(e.target.value)}
            />
            </div>
            <div>
            <p>Password</p>
            <input value={password} type="password" placeholder='Enter the password' required
            onChange={(e)=>setPassword(e.target.value)}
            />
            </div>
            <button type='submit'>Login</button>
        </form>
        <div>
            <p>
                Don't have an account? <Link to="/signup">Sign Up </Link>
            </p>
        </div>

        </div>
    </section>
  )
}

export default Login
