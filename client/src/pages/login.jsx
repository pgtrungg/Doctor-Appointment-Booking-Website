import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaExclamationCircle } from 'react-icons/fa';
import BackGround from '../assets/Home.jpg';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/userSlice';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // state for displaying error message
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null); // Reference to the form element
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);


    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);
        const inputData = Object.fromEntries(formData.entries());
        try {
            const res = await axios.post('/auth/login', inputData);
            if (res.status === 200) {
                dispatch(login(res.data.userData));
                const role= res.data.userData.role
                if(role=='user'){
                    navigate('/dashboard')
                } else if(role=='doctor'){
                    navigate('/doctor/home')
                } else if(role=='admin'){
                    navigate('/admin/doctor')
                } 
            } else {
                setErrorMessage('An error occurred');
            }
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
    };

    return (
        <section
            id="login"
            className="w-full min-h-[calc(100vh-72px)] py-14 flex justify-center hero-bg"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: 'cover' }}
        >
            {/* Log in form */}
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="form-container-style">
                <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>

                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="email">
                            Email
                        </label>
                        <input
                            className="form-input-style px-3 py-2"
                            type="email"
                            id="email"
                            name="email"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="form-input-style w-full pl-3 pr-2 py-2 overflow-hidden"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                autoComplete="off"
                                required
                            />

                        </div>
                    </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                    <p className="text-red-500 mt-6 inline-flex items-center text-sm text-center">
                        <FaExclamationCircle className="mr-1" />
                        {errorMessage}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    className={`w-full mt-6 py-3 px-6 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-xl border border-green-500 focus:outline-none`}
                    type="submit"
                >
                    Login
                </button>

                <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-bold text-primary hover:text-primary-shade hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </section>
    );
}
