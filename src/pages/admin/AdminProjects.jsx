import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, EyeIcon, FolderIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/admin/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/admin/projects/${id}/status`, { status });
            toast.success(`Project ${status}`);
            fetchProjects(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 font-display">Manage Projects</h1>
                        <p className="text-slate-600 mt-2">Review and manage project submissions</p>
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
                        {['all', 'pending', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${filter === status
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredProjects.map((project) => (
                                    <tr key={project._id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {project.images && project.images[0] ? (
                                                         <img className="h-10 w-10 rounded-lg object-cover" src={project.images[0].startsWith('http') ? project.images[0] : `${import.meta.env.VITE_API_URL}/${project.images[0]}`} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                            <FolderIcon className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{project.title}</div>
                                                    <div className="text-sm text-slate-500">{project.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{project.user?.name || 'Unknown'}</div>
                                            <div className="text-sm text-slate-500">{project.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                project.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {project.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/projects/${project._id}`}
                                                    className="text-slate-400 hover:text-indigo-600"
                                                    title="View"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleStatusUpdate(project._id, 'approved')}
                                                    className="text-slate-400 hover:text-green-600"
                                                    title="Approve"
                                                >
                                                    <CheckCircleIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(project._id, 'rejected')}
                                                    className="text-slate-400 hover:text-red-600"
                                                    title="Reject"
                                                >
                                                    <XCircleIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
