import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    UsersIcon,
    FolderIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import api from '../../utils/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProjects: 0,
        pendingProjects: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const cards = [
        {
            name: 'Total Users',
            value: stats.totalUsers,
            icon: UsersIcon,
            color: 'bg-blue-500',
            link: '/admin/users'
        },
        {
            name: 'Total Projects',
            value: stats.totalProjects,
            icon: FolderIcon,
            color: 'bg-indigo-500',
            link: '/admin/projects'
        },
        {
            name: 'Pending Approvals',
            value: stats.pendingProjects,
            icon: ClockIcon,
            color: 'bg-yellow-500',
            link: '/admin/projects?status=pending'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 font-display">Admin Dashboard</h1>
                    <p className="text-slate-600 mt-2">Overview of platform activity</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    {cards.map((card) => (
                        <Link
                            key={card.name}
                            to={card.link}
                            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow"
                        >
                            <dt>
                                <div className={`absolute rounded-xl p-3 ${card.color}`}>
                                    <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <p className="ml-16 truncate text-sm font-medium text-slate-500">{card.name}</p>
                            </dt>
                            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                                <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
                            </dd>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Quick Actions or Recent Activity could go here */}
                    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                        <div className="space-y-4">
                            <Link
                                to="/admin/projects"
                                className="block w-full text-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors font-medium"
                            >
                                Review Pending Projects
                            </Link>
                            <Link
                                to="/admin/users"
                                className="block w-full text-center px-4 py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium"
                            >
                                Manage Users
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
