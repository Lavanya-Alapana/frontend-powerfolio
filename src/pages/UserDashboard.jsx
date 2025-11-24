import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, CalendarIcon, FolderIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Modal from '../components/common/Modal';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserProjects();
  }, [isAuthenticated, navigate]);

  const fetchUserProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-powerfolio-dv2i.onrender.com/api/projects/my-projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error(error.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-powerfolio-dv2i.onrender.com/api/projects/${projectToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      toast.success('Project deleted successfully');
      setProjects(projects.filter(p => p._id !== projectToDelete._id));
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          <div className="px-8 pb-8">
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6 text-center sm:text-left">
              <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-xl">
                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-4xl font-bold text-indigo-600 border border-indigo-100">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 mb-2 flex-1">
                <h1 className="text-3xl font-bold text-slate-900 font-display">{user?.name}</h1>
                <p className="text-slate-500 font-medium">{user?.email}</p>
              </div>
              <div className="mt-6 sm:mt-0">
                <Link
                  to="/submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/20 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:-translate-y-1"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Project
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-100 pt-8">
              <div className="flex items-center justify-center sm:justify-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600 mr-4">
                  <FolderIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Projects</p>
                  <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-600 mr-4">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Member Since</p>
                  <p className="text-lg font-bold text-slate-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 font-display">Your Projects</h2>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
              {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>

          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200"
            >
              <div className="mx-auto h-16 w-16 text-slate-300 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <PlusIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No projects yet</h3>
              <p className="mt-2 text-slate-500 max-w-sm mx-auto">Get started by creating your first project to showcase your work to the world.</p>
              <div className="mt-8">
                <Link
                  to="/submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create Project
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col group"
                >
                  <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0].startsWith('http') ? project.images[0] : `https://backend-powerfolio-dv2i.onrender.com/${project.images[0]}`}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                        <FolderIcon className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-indigo-600 shadow-sm">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <Link
                        to={`/projects/${project._id}`}
                        className="text-sm font-bold text-slate-600 hover:text-indigo-600 flex items-center transition-colors bg-slate-50 hover:bg-indigo-50 px-3 py-2 rounded-lg"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </Link>

                      <div className="flex space-x-2">
                        <Link
                          to={`/projects/${project._id}/edit`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(project)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Project"
        actionLabel="Delete"
        actionType="danger"
        onAction={handleDeleteProject}
      >
        <div className="mt-2">
          <p className="text-sm text-slate-500">
            Are you sure you want to delete <span className="font-bold text-slate-900">"{projectToDelete?.title}"</span>? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default UserDashboard;
