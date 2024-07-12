import { Button, Stack } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import DoctorImage from '../assets/Doctor_Patient.png';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Home = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        if (user && user.role === 'user') {
            navigate('/dashboard');
        } else if (user && user.role === 'doctor') {
            navigate('/doctor/home');
        } else if (user && user.role === 'admin') {
            navigate('/admin/doctor');
        }
    }, [user, navigate]);

    return (
        // Hero Section with Logo and Call to Action
        <section
            id="hero"
            className="w-full min-h-[calc(100vh-72px)] py-14 hero-bg"
        >
            <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Call to Action */}
                <div className="flex flex-col items-center lg:items-start font-bold text-center lg:text-left gap-8 order-last lg:order-first">
                    <h1 className="text-xl md:text-2xl lg:text-4xl uppercase text-blue-500">
                        Online Appointment Booking <br /> {/* Updated heading */}
                    </h1>
                    <p className="max-w-md md:text-xl  ">
                        Find doctors, specialists, and book appointments online easily and quickly.
                    </p>
                    <div className="w-50 gap-4">
                        <Stack direction="row" spacing={2}>
                            <div className='w-72 flex flex-col text-center gap-3'>
                                <Link to="/login">
                                    <Button variant="contained" color="primary" className='w-60' sx={{
                                        borderRadius: '8px',
                                    }}>
                                        Book now!
                                    </Button>
                                </Link>

                                <Link to="/signup">
                                    <Button variant="outlined" color="error" className='w-60' sx={{
                                        borderRadius: '8px',
                                    }}>
                                        Create an Account
                                    </Button>
                                </Link>
                            </div>
                        </Stack>
                    </div>
                </div>

                {/* Country Logo */}
                <img
                    src={DoctorImage}
                    alt="Logo"
                    className="w-48 h-48 md:w-80 md:h-80 lg:w-[550px] lg:h-[400px] transition-all duration-300 ease-in-out"
                />
            </div>
        </section>
    );
};

export default Home;