import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(formData.email, formData.password);
        setIsLoading(false);

        if (success) {
            // Check if the logged-in user is an admin
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role === 'admin') {
                navigate('/admin');
            } else {
                // Not an admin - log them out immediately
                logout();
                toast.error('Access Denied: You do not have admin privileges.');
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center pt-24 pb-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 xl:w-5/12 z-10 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                P
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                                PowerFolio Admin
                            </span>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 font-display">
                            Admin Portal
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Please sign in to access the dashboard.
                        </p>
                    </motion.div>

                    <div className="mt-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mt-6"
                        >
                            <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-all duration-200 text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm transition-all duration-200 text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/30 transform hover:-translate-y-0.5"
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        {isLoading ? 'Verifying Access...' : 'Access Dashboard'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Background */}
            <div className="hidden lg:block relative w-0 flex-1 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-90 z-10"></div>
                <div className="absolute inset-0 z-20 flex items-center justify-center p-12 text-center">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-bold text-white font-display mb-6">
                            System Administration
                        </h2>
                        <p className="text-lg text-slate-400">
                            Restricted access for platform administrators only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
