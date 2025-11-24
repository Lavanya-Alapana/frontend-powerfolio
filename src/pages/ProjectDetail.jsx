import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  StarIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ShareIcon
} from "@heroicons/react/24/outline";
import { useAuth } from '../context/AuthContext';


// Mock data - replace with actual API call
// Mock data removed

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`);
        if (!response.ok) {
          throw new Error('Project not found');
        }
        const data = await response.json();

        // Process data
        if (data.images && data.images.length > 0) {
          data.images = data.images.map(img =>
            img.startsWith('http') ? img : `http://localhost:5000/${img}`
          );
        } else {
          // Fallback image if no images
          data.images = ['https://via.placeholder.com/800x500?text=No+Image'];
        }

        // Author handling
        if (data.user && typeof data.user === 'object') {
          data.authorName = data.user.name;
        } else {
          data.authorName = 'Unknown Author';
        }
        data.authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.authorName)}&background=random`;

        // Stats fallback
        if (!data.stats) data.stats = { stars: 0, watchers: 0, forks: 0 };

        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to comment');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/projects/comment/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ text: comment })
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const updatedComments = await response.json();
      setProject(prev => ({ ...prev, comments: updatedComments }));
      setComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Project not found</h2>
        <Link to="/projects" className="text-indigo-600 hover:text-indigo-500">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-20">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <Link
          to="/projects"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
      </div>

      {/* Project header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 lg:mb-0"
          >
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-lg ring-1 ring-slate-900/5 aspect-[16/10]">
              <img
                src={project.images[activeImage]}
                alt={`${project.title} screenshot ${activeImage + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-center space-x-2 p-4 bg-gradient-to-t from-black/60 to-transparent">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${activeImage === index ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {project.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative rounded-lg overflow-hidden aspect-[16/10] ring-2 transition-all ${activeImage === index ? 'ring-indigo-500 ring-offset-2' : 'ring-transparent hover:ring-indigo-300 hover:ring-offset-1'
                    }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-x-4 text-xs mb-4">
              <time dateTime={project.date} className="text-slate-500 font-medium">
                {new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <span className="relative z-10 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-600">
                Full Stack
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display mb-4">{project.title}</h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full ring-2 ring-white"
                  src={project.authorAvatar}
                  alt={project.author}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900">{project.authorName}</p>
                  <p className="text-xs text-slate-500">Project Lead</p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex gap-4 text-sm text-slate-600">
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      if (!token) {
                        alert('Please login to like this project');
                        return;
                      }

                      const response = await fetch(`http://localhost:5000/api/projects/like/${id}`, {
                        method: 'PUT',
                        headers: {
                          'x-auth-token': token
                        }
                      });

                      if (response.ok) {
                        const likes = await response.json();
                        setProject(prev => ({
                          ...prev,
                          likes: likes,
                          stats: { ...prev.stats, stars: likes.length }
                        }));
                      }
                    } catch (err) {
                      console.error('Error liking project:', err);
                    }
                  }}
                  className="flex items-center gap-1 hover:text-yellow-500 transition-colors group"
                >
                  {project.likes && project.likes.some(like => like.user === user?._id) ? (
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <StarIcon className="h-5 w-5 text-slate-400 group-hover:text-yellow-400" />
                  )}
                  <span className="font-medium">{project.likes ? project.likes.length : (project.stats?.stars || 0)}</span>
                </button>
                <div className="flex items-center gap-1">
                  <EyeIcon className="h-5 w-5 text-slate-400" />
                  <span className="font-medium">{project.stats.watchers}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-8">
              <p>{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-4 mt-auto">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                <CodeBracketIcon className="-ml-1 mr-2 h-5 w-5 text-slate-500" />
                View Code
              </a>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-indigo-500/25 hover:-translate-y-0.5"
              >
                <ArrowTopRightOnSquareIcon className="-ml-1 mr-2 h-5 w-5" />
                Live Demo
              </a>
            </div>
          </motion.div>
        </div>

        {/* Detailed Description & Comments */}
        <div className="mt-16 lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display">About This Project</h2>
              <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-line leading-relaxed">
                {project.longDescription}
              </div>
            </section>

            <section className="border-t border-slate-200 pt-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Discussion ({project.comments?.length || 0})</h2>
              </div>

              <form onSubmit={handleCommentSubmit} className="mb-10">
                <div className="flex gap-4">
                  <img
                    className="h-10 w-10 rounded-full bg-slate-100"
                    src="https://www.gravatar.com/avatar/?d=mp"
                    alt="Your avatar"
                  />
                  <div className="flex-1">
                    <div className="relative rounded-2xl shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-indigo-600 transition-all">
                      <textarea
                        rows={3}
                        name="comment"
                        id="comment"
                        className="block w-full border-0 bg-transparent py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6 resize-none"
                        placeholder="Add your comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <div className="py-2 px-3 flex justify-between items-center border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                        <div className="text-xs text-slate-500">Markdown supported</div>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                        >
                          {submittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div className="space-y-8">
                {(project.comments || []).map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <img
                      className="h-10 w-10 rounded-full bg-slate-100"
                      src={comment.avatar}
                      alt={comment.author}
                    />
                    <div className="flex-1">
                      <div className="bg-slate-50 rounded-2xl px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-900">{comment.name || 'User'}</h4>
                          <span className="text-xs text-slate-500">{new Date(comment.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-700">{comment.text}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-4 px-2">
                        <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">Reply</button>
                        <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">Like</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="mt-12 lg:mt-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6 font-display">Project Details</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Share</h4>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                      <span className="sr-only">Copy Link</span>
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    className="w-full flex justify-center items-center px-4 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4 mr-2 text-slate-400" />
                    Contact {project.authorName.split(' ')[0]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
