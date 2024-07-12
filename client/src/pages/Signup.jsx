import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaExclamationCircle } from 'react-icons/fa';
import BackGround from '../assets/Home.jpg';
import axios from 'axios';

export default function Signup()  {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // state for displaying error message
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const { password, confirmPassword, name, email } = formData;
  
      if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match');
          return;
      }
  
      try {
          const res = await axios.post('/auth/signup', { name, email, password });
          if (res.status === 200) {
              navigate('/login');
          } else {
              setErrorMessage('An error occurred while registering');
          }
      } catch (error) {
          setErrorMessage(error.response.data.message);
      }
  };
  

    return (
        <section
            id="signup"
            className="w-full min-h-[calc(100vh-72px)] py-14 flex justify-center hero-bg"
            style={{ backgroundImage: `url(${BackGround})`, backgroundSize: 'cover' }}
        >
            {/* Sign up form */}
            <form
                onSubmit={handleSubmit}
                className="form-container-style"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Sign up</h1>

                <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            className="form-input-style px-3 py-2"
                            type="name"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="form-input-style px-3 py-2"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="form-input-style w-full pl-3 pr-2 py-2 overflow-hidden"
                                id="password"
                                name="password"
                                value={formData.password}
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            className="font-bold"
                            htmlFor="confirmPassword"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                className="form-input-style w-full pl-3 pr-2 py-2 overflow-hidden"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
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
                    type="submit">
               
                    Sign Up
                    </button>

                    <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-bold text-primary hover:text-primary-shade hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </form>
            </section>
        );
      }
