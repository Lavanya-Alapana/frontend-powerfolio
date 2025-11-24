import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    // Check if we are on auth pages to adjust styling if needed
    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || isAuthPage
                ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50'
                : 'bg-transparent'
                }`}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2 group">
                        <span className="sr-only">PowerFolio</span>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105">
                            P
                        </div>
                        <span className={`font-display font-bold text-xl tracking-tight transition-colors ${scrolled || isAuthPage ? 'text-slate-900' : 'text-slate-900'}`}>
                            PowerFolio
                        </span>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`text-sm font-medium leading-6 transition-colors relative group ${scrolled || isAuthPage ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-indigo-600'}`}
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Link
                            to="/dashboard"
                            className={`text-sm font-medium leading-6 transition-colors relative group ${scrolled || isAuthPage ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-indigo-600'}`}
                        >
                            Dashboard
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    )}
                    {isAuthenticated && user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className={`text-sm font-medium leading-6 transition-colors relative group ${scrolled || isAuthPage ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-indigo-600'}`}
                        >
                            Admin
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    )}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="hidden xl:block">{user?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold leading-6 text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                Log out
                            </button>
                            <Link
                                to="/submit"
                                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-slate-900/30 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Submit Project <span aria-hidden="true" className="ml-1">&rarr;</span>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={`text-sm font-semibold leading-6 transition-colors my-auto ${scrolled || isAuthPage ? 'text-slate-900 hover:text-indigo-600' : 'text-slate-900 hover:text-indigo-600'}`}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between">
                                <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                        P
                                    </div>
                                    <span className="font-display font-bold text-xl text-slate-900">
                                        PowerFolio
                                    </span>
                                </Link>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-slate-700 hover:bg-slate-100 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-8 flow-root">
                                <div className="-my-6 divide-y divide-gray-100">
                                    <div className="space-y-2 py-6">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        {isAuthenticated && (
                                            <Link
                                                to="/dashboard"
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                        {isAuthenticated && user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                            >
                                                Admin
                                            </Link>
                                        )}
                                    </div>
                                    <div className="py-6">
                                        {isAuthenticated ? (
                                            <>
                                                <div className="flex items-center gap-3 mb-4 px-3">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                        {user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="font-medium text-slate-900">{user?.name}</span>
                                                </div>
                                                <Link
                                                    to="/submit"
                                                    className="block w-full rounded-lg bg-slate-900 px-3 py-2.5 text-center text-base font-semibold text-white shadow-md hover:bg-slate-800 transition-all mb-3"
                                                >
                                                    Submit Project
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-red-600 hover:bg-red-50 text-left transition-colors"
                                                >
                                                    Log out
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to="/login"
                                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                                >
                                                    Log in
                                                </Link>
                                                <Link
                                                    to="/register"
                                                    className="mt-4 block w-full rounded-lg bg-indigo-600 px-3 py-2.5 text-center text-base font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
                                                >
                                                    Sign up
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

