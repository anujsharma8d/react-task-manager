import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const baseUrl = import.meta.env.VITE_API_URL

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${baseUrl}/api/auth/signup`, { name, password })
            alert(res.data.message)
            setName("")
            setPassword("")

            navigate("/login")
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || "Something went wrong");
        }
    }


    return (
        <section className='flex justify-center items-center bg-black min-h-screen text-white'>
            <div className='bg-zinc-900 p-10 w-sm h-xl flex flex-col justify-center items-center gap-5 rounded-2xl'>
                <div className='flex flex-col justify-center items-center gap-1'>
                    <h2 className='text-2xl sm:text-3xl font-extrabold text-center'>Sign Up</h2>
                    <p className='text-xl font-light text-center'>Create Account</p>
                </div>
                <form onSubmit={handleSubmit} action="" className='flex flex-col justify-center gap-5'>
                    <div className='flex flex-col gap-2'>
                        <p className='font-light'>Username :</p>
                        <input value={name} type="name" placeholder='Enter your username' required
                            onChange={(e) => setName(e.target.value)}
                            className='bg-zinc-700 font-medium p-1 rounded-sm'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='font-light'>Password :</p>
                        <input value={password} type="password" placeholder='Enter the password' required
                            onChange={(e) => setPassword(e.target.value)}
                            className='bg-zinc-700 font-medium p-1 rounded-sm'
                        />
                    </div>
                    <div className='flex justify-center items-center mt-3'>
                        <button type='submit' className="bg-white text-black hover:bg-zinc-700 hover:text-white transition-colors duration-200 font-bold p-2 rounded-xl cursor-pointer w-full">Sign Up</button>
                    </div>
                </form>
                <div className='flex flex-col gap-3'>
                    <p>
                        Already have an account? <Link to="/login" className='text-blue-500 hover:text-blue-600 underline'>Login</Link>
                    </p>
                    <p className='text-center'>
                        Try Demo? <Link to="/" className='text-blue-500 hover:text-blue-600 underline'>Demo</Link>
                    </p>
                </div>

            </div>
        </section>
    )
}

export default Signup
