import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from "@mui/material/styles";
import Logo from "../assets/Logo.png";

const Navbar = () => {
    const user = useSelector((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleProfile = () => {
        setAnchorEl(null);
        navigate('/profile');
    };
    const handleMyAppointment = () => {
        setAnchorEl(null);
        navigate('/my-appointment');
    };
    const handleLogout = () => {
        setAnchorEl(null);
        dispatch(logout());
        navigate('/');
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    let linkTo;
    if (user) {
        switch (user.role) {
            case 'user':
                linkTo = '/dashboard';
                break;
            case 'admin':
                linkTo = '/admin/doctor';
                break;
            case 'doctor':
                linkTo = '/doctor/home';
                break;
            default:
                linkTo = '/home';
        }
    } else {
        linkTo = '/'
    }

    return (
        <header className="bg-gray-100 dark:bg-slate-700 border-b z-50 shadow-lg">
            <nav className="mx-auto max-w-7xl flex items-center justify-between p-3 lg:px-8">
                <Link to={linkTo} >
                    <img
                        src={Logo}
                        alt="HustEdu Logo"
                        className="w-14 "
                    />
                </Link>

                {/* For unlogin user */}
                {!user && (
                    <div className="flex items-center space-x-4">
                        <Link to="/signup">
                            <Button
                                // color is blue
                                color="primary"
                                sx={{ margin: '5px', borderRadius: '8px' }}
                            >
                                Sign Up
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button
                                variant="contained"
                                color='primary'
                                sx={{ margin: '5px', borderRadius: '8px' }}
                            >
                                Login
                            </Button>
                        </Link>
                    </div>
                )}
                {/* For admins */}
                {user && user.role === "admin" && (
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => navigate('/admin/user')}
                            color="primary"
                            sx={{ margin: '5px', borderRadius: '8px', color: 'black', '&:hover': { color: theme.palette.primary.main }, }}
                        >
                            Users
                        </Button>
                        <Button
                            onClick={() => navigate('/admin/doctor')}
                            color="primary"
                            sx={{ margin: '5px', borderRadius: '8px', color: 'black', '&:hover': { color: theme.palette.primary.main }, }}
                        >
                            Doctors
                        </Button>
                        <Button
                            onClick={handleLogout}
                            color="primary"
                            sx={{ margin: '5px', borderRadius: '8px', color: 'black', '&:hover': { color: theme.palette.primary.main }, }}
                        >
                            <LogoutIcon />
                        </Button>
                    </div>
                )}
                {/* For patient */}
                {user && user.role === "user" && (
                    <div>
                        <Avatar
                            src="/broken-image.jpg"
                            onClick={handleClick}
                            sx={{ cursor: 'pointer' }}
                        />
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleMyAppointment}>My Appointment</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                )}
                {/* For doctor */}
                {user && user.role === "doctor" && (
                    <div>
                        <Button
                            onClick={() => navigate('/doctor/home')}
                            color="primary"
                            sx={{ margin: '5px', borderRadius: '8px', color: 'black', '&:hover': { color: theme.palette.primary.main }, }}
                        >
                            Appointments
                        </Button>
                        <Button
                            onClick={() => navigate('/doctor/slots')}

                            sx={{ margin: '5px', borderRadius: '8px', color: 'black', '&:hover': { color: theme.palette.primary.main }, }}
                        >
                            Register Working Time
                        </Button>
                        <Button
                            onClick={handleLogout}
                            color="primary"
                            sx={{ margin: '5px', borderRadius: '8px', color: 'black', '&:hover': { color: theme.palette.primary.main }, }}
                        >
                            <LogoutIcon />
                        </Button>
                    </div>
                )}

            </nav>
        </header>
    );
};

export default Navbar;
