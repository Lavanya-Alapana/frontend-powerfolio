import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhotoIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  TagIcon,
  CodeBracketIcon,
  ArrowTopRightOnSquareIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  CpuChipIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Form validation schema
const projectSchema = yup.object().shape({
  title: yup.string().required('Project title is required').max(100, 'Title is too long'),
  description: yup.string().required('Project description is required').max(500, 'Description is too long'),
  longDescription: yup.string().required('Detailed description is required').min(100, 'Please provide more details (at least 100 characters)'),
  githubUrl: yup.string().url('Please enter a valid URL').required('GitHub URL is required'),
  liveUrl: yup.string().url('Please enter a valid URL'),
  images: yup.array().min(1, 'Please upload at least one image').max(5, 'Maximum 5 images allowed'),
  category: yup.string().required('Category is required'),
  projectType: yup.string().required('Project type is required'),
  duration: yup.string(),
  completionDate: yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr),
  // demoVideo is now a file, handled separately or mixed
  technologies: yup.array().of(yup.string()),
  customTechnologies: yup.string(),
  teamMembers: yup.array().of(yup.string()),
  contactName: yup.string().required('Contact name is required'),
  contactEmail: yup.string().email('Invalid email').required('Contact email is required'),
});

const categories = [
  'Web Development',
  'Mobile Development',
  'UI/UX',
  'Data Science',
  'Machine Learning',
  'Other'
];

const availableTags = [
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Django', 'Flask',
  'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Express',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'AWS', 'Docker', 'Kubernetes',
  'GraphQL', 'REST', 'API', 'UI/UX', 'Responsive Design', 'Mobile App', 'Web App',
  'Machine Learning', 'AI', 'Blockchain', 'Ethereum', 'Solidity', 'Web3',
  'Game Development', 'AR/VR', 'IoT', 'Cybersecurity'
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export default function SubmitProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  // New state for file uploads
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Technologies state
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [technologyInput, setTechnologyInput] = useState('');
  const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);
  const [showTechnologySuggestions, setShowTechnologySuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      images: [],
      category: '',
      projectType: 'Personal',
      technologies: [],
      teamMembers: [],
      contactName: user?.name || '',
      contactEmail: user?.email || '',
    },
  });

  // Update default values when user loads
  useEffect(() => {
    if (!isEditMode && user) {
      setValue('contactName', user.name);
      setValue('contactEmail', user.email);
    }
  }, [user, isEditMode, setValue]);

  useEffect(() => {
    if (isEditMode) {
      fetchProject();
    }
  }, [isEditMode, id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      const data = response.data;

      // Populate form
      reset({
        title: data.title,
        description: data.description,
        longDescription: data.longDescription,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        tags: data.tags,
        images: data.images,
        category: data.category,
        projectType: data.projectType,
        duration: data.duration,
        completionDate: data.completionDate ? new Date(data.completionDate).toISOString().split('T')[0] : '',
        demoVideo: data.demoVideo,
        technologies: data.technologies,
        customTechnologies: data.customTechnologies,
        teamMembers: data.teamMembers,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        // contactImage handled separately via state
      });

      // Handle profile image
      if (data.contactImage) {
        setProfileImagePreview(data.contactImage.startsWith('http') ? data.contactImage : `${import.meta.env.VITE_API_URL}/${data.contactImage}`);
      }

      // Handle video
      if (data.demoVideo) {
        setVideoPreview(data.demoVideo.startsWith('http') ? data.demoVideo : `${import.meta.env.VITE_API_URL}/${data.demoVideo}`);
      }

      // setSelectedTags(data.tags || []); // Removed tags
      setSelectedTechnologies(data.technologies || []);

      // Handle images
      if (data.images && data.images.length > 0) {
        // Assuming backend returns relative paths like "uploads/..."
        // We need to prepend server URL for preview
        const previews = data.images.map(img =>
          img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL}/${img}`
        );
        setImagePreviews(previews);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Failed to load project data');
      navigate('/dashboard');
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }

    const newImagePreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        if (newImagePreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newImagePreviews]);
          setValue('images', [...watch('images'), ...files]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1);
    setImagePreviews(newImagePreviews);

    const currentImages = [...watch('images')];
    currentImages.splice(index, 1);
    setValue('images', currentImages);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB
        alert('Video size must be less than 100MB');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag handlers removed


  // Technology handlers
  const handleTechnologyInputChange = (e) => {
    const value = e.target.value;
    setTechnologyInput(value);

    if (value.length > 0) {
      const filtered = availableTags
        .filter(tech =>
          tech.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTechnologies.includes(tech)
        )
        .slice(0, 5);
      setSuggestedTechnologies(filtered);
      setShowTechnologySuggestions(true);
    } else {
      setShowTechnologySuggestions(false);
    }
  };

  const addTechnology = (tech) => {
    if (!selectedTechnologies.includes(tech)) {
      const newTechs = [...selectedTechnologies, tech];
      setSelectedTechnologies(newTechs);
      setValue('technologies', newTechs);
      setTechnologyInput('');
      setShowTechnologySuggestions(false);
    }
  };

  const removeTechnology = (techToRemove) => {
    const newTechs = selectedTechnologies.filter(tech => tech !== techToRemove);
    setSelectedTechnologies(newTechs);
    setValue('technologies', newTechs);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const API_URL = import.meta.env.VITE_API_URL;

      // 1. Upload images
      const uploadedImageUrls = [];
      if (data.images && data.images.length > 0) {
        for (const file of data.images) {
          if (typeof file === 'string') {
            uploadedImageUrls.push(file);
            continue;
          }

          console.log('Uploading image:', file.name, file.type, file.size);

          const formData = new FormData();
          formData.append('file', file);

          const uploadRes = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          uploadedImageUrls.push(uploadRes.data.file);
        }
      }

      // 2. Upload Video
      let videoUrl = null;
      if (videoFile) {
        console.log('Uploading video:', videoFile.name, videoFile.type, videoFile.size);

        const formData = new FormData();
        formData.append('file', videoFile);

        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        videoUrl = uploadRes.data.file;
      } else if (videoPreview && typeof videoPreview === 'string' && !videoPreview.startsWith('blob:')) {
        videoUrl = videoPreview.replace(API_URL + '/', '');
      }

      // 3. Upload Profile Image
      let profileImageUrl = null;
      if (profileImage) {
        console.log('Uploading profile image:', profileImage.name, profileImage.type, profileImage.size);

        const formData = new FormData();
        formData.append('file', profileImage);

        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        profileImageUrl = uploadRes.data.file;
      } else if (profileImagePreview && typeof profileImagePreview === 'string' && !profileImagePreview.startsWith('data:')) {
        profileImageUrl = profileImagePreview.replace(API_URL + '/', '');
      }

      // 4. Submit project data
      const projectData = {
        ...data,
        images: uploadedImageUrls,
        demoVideo: videoUrl,
        contactImage: profileImageUrl,
        // tags: selectedTags, // Removed
        technologies: selectedTechnologies,
        teamMembers: typeof data.teamMembers === 'string'
          ? data.teamMembers.split(',').map(m => m.trim()).filter(Boolean)
          : (data.teamMembers || [])
      };

      let savedProject;
      if (isEditMode) {
        const response = await api.put(`/projects/${id}`, projectData);
        savedProject = response.data;
      } else {
        const response = await api.post('/projects', projectData);
        savedProject = response.data;
      }

      // Show success message
      alert('Project submitted successfully!');

      // Redirect to the project page after successful submission
      navigate(`/projects/${savedProject._id}`);
    } catch (error) {
      console.error('Error saving project:', error);
      let errorMessage = 'Failed to save project';

      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map(err => err.msg).join('\n');
        } else if (errorData.msg) {
          errorMessage = errorData.msg;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // If message is still an object (edge case), stringify it
      if (typeof errorMessage === 'object') {
        errorMessage = JSON.stringify(errorMessage);
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3 font-display">
              {isEditMode ? 'Edit Project' : 'Share Your Project'}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {isEditMode ? 'Update your project details and settings.' : 'Showcase your work to the community and connect with like-minded developers.'}
            </p>
          </div>

          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
            whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-1"></div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
              {/* Personal Details */}
              <div className="flex items-center mb-8">
                <div className="p-2 rounded-xl bg-indigo-50 mr-4">
                  <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">Personal Details</h2>
                  <p className="text-sm text-slate-500">Your contact information for this project</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Profile Picture */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Profile Picture <span className="text-xs text-slate-400">(optional)</span>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="profile-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all duration-200 overflow-hidden relative group"
                    >
                      {profileImagePreview ? (
                        <>
                          <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <PhotoIcon className="h-8 w-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UserCircleIcon className="w-10 h-10 text-slate-400 mb-2" />
                          <p className="text-xs text-slate-500">Upload Photo</p>
                        </div>
                      )}
                      <input
                        id="profile-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      {...register('contactName')}
                      className={`block w-full px-4 py-3 rounded-xl border-2 ${errors.contactName
                        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                        } transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900`}
                      placeholder="John Doe"
                    />
                    <AnimatePresence>
                      {errors.contactName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.contactName.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      {...register('contactEmail')}
                      className={`block w-full px-4 py-3 rounded-xl border-2 ${errors.contactEmail
                        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                        } transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900`}
                      placeholder="john@example.com"
                    />
                    <AnimatePresence>
                      {errors.contactEmail && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.contactEmail.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 my-8"></div>

              <div className="flex items-center mb-8">
                <div className="p-2 rounded-xl bg-indigo-50 mr-4">
                  <ArrowUpTrayIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">Project Information</h2>
                  <p className="text-sm text-slate-500">Basic information about your project</p>
                </div>
              </div>

              {/* Project Title */}
              <div className="mb-8">
                <div className="relative">
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      {...register('title')}
                      className={`block w-full px-4 py-3 rounded-xl border-2 ${errors.title
                        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                        } transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900`}
                      placeholder="My Awesome Project"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.title && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.title.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Project Type, Duration, Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Project Type */}
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-slate-700 mb-2">
                    Project Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="projectType"
                    {...register('projectType')}
                    className={`block w-full px-4 py-3 rounded-xl border-2 ${errors.projectType
                      ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                      : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                      } transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900 appearance-none`}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Academic">Academic</option>
                    <option value="Professional">Professional</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
                    Duration
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="duration"
                      {...register('duration')}
                      className="block w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900"
                      placeholder="e.g. 2 weeks"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <ClockIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="completionDate" className="block text-sm font-medium text-slate-700 mb-2">
                    Completion Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="completionDate"
                      {...register('completionDate')}
                      className="block w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-8">
                <div className="relative">
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      {...register('category')}
                      className={`block w-full px-4 py-3 rounded-xl border-2 ${errors.category
                        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                        } transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900 appearance-none`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <AnimatePresence>
                    {errors.category && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.category.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>



              {/* Project Description */}
              <div className="mb-8">
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-slate-500">
                      {watch('description')?.length || 0}/500
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      id="description"
                      rows={3}
                      {...register('description')}
                      className={`block w-full px-4 py-3 rounded-xl border-2 ${errors.description
                        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                        } transition-all duration-200 resize-none bg-slate-50 focus:bg-white text-slate-900`}
                      placeholder="A brief description of your project..."
                      maxLength={500}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.description && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.description.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="mb-10">
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="longDescription" className="block text-sm font-medium text-slate-700">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      id="longDescription"
                      rows={6}
                      {...register('longDescription')}
                      className={`block w-full px-4 py-3 rounded-xl border-2 ${errors.longDescription
                        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                        } transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900`}
                      placeholder="Tell us more about your project. What problem does it solve? What technologies did you use? What challenges did you face?"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.longDescription && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.longDescription.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border-t border-slate-100 my-8"></div>

              {/* Technical Details */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-xl bg-indigo-50 mr-4">
                    <CpuChipIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">Technical Details</h3>
                    <p className="text-sm text-slate-500">Technologies and team info</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Technologies (Multi-select) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Technologies Used
                    </label>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {selectedTechnologies.map((tech) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-800 group border border-indigo-200"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => removeTechnology(tech)}
                              className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
                            >
                              <span className="sr-only">Remove technology</span>
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                          </motion.span>
                        ))}
                      </div>

                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={technologyInput}
                            onChange={handleTechnologyInputChange}
                            onFocus={() => technologyInput.length > 0 && setShowTechnologySuggestions(true)}
                            onBlur={() => setTimeout(() => setShowTechnologySuggestions(false), 200)}
                            className="block w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900"
                            placeholder="Add a technology (e.g., React, Node.js)"
                          />
                        </div>

                        <AnimatePresence>
                          {showTechnologySuggestions && suggestedTechnologies.length > 0 && (
                            <motion.ul
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute z-10 mt-2 w-full bg-white shadow-xl max-h-60 rounded-xl py-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                            >
                              {suggestedTechnologies.map((tech) => (
                                <li
                                  key={tech}
                                  className="text-slate-900 cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-indigo-50 transition-colors duration-150"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    addTechnology(tech);
                                  }}
                                >
                                  <div className="flex items-center">
                                    <span className="block font-medium">{tech}</span>
                                  </div>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Custom Technologies */}
                  <div>
                    <label htmlFor="customTechnologies" className="block text-sm font-medium text-slate-700 mb-2">
                      Other Custom Technologies <span className="text-xs text-slate-400">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      id="customTechnologies"
                      {...register('customTechnologies')}
                      className="block w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900"
                      placeholder="React, Node.js, MongoDB, TailwindCSS..."
                    />
                  </div>

                  {/* Team Members */}
                  <div>
                    <label htmlFor="teamMembers" className="block text-sm font-medium text-slate-700 mb-2">
                      Team Members <span className="text-xs text-slate-400">(comma separated names)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="teamMembers"
                        {...register('teamMembers')}
                        className="block w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900"
                        placeholder="Alice, Bob, Charlie..."
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <UsersIcon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 my-8"></div>

              {/* Project URLs */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-xl bg-indigo-50 mr-4">
                    <CodeBracketIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-display">Project Links</h3>
                    <p className="text-sm text-slate-500">Where can people find your code?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700 mb-2">
                      GitHub Repository <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="githubUrl"
                        {...register('githubUrl')}
                        className={`block w-full px-4 py-3 rounded-xl border-2 ${errors.githubUrl
                          ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                          : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                          } transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900`}
                        placeholder="username/repository"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.githubUrl && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.githubUrl.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label htmlFor="liveUrl" className="block text-sm font-medium text-slate-700 mb-2">
                      Live Demo <span className="text-xs text-slate-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="liveUrl"
                        {...register('liveUrl')}
                        className={`block w-full px-4 py-3 rounded-xl border-2 ${errors.liveUrl
                          ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                          : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                          } transition-all duration-200 bg-slate-50 focus:bg-white text-slate-900`}
                        placeholder="your-project.vercel.app"
                      />
                    </div>
                    {errors.liveUrl && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.liveUrl.message}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 my-8"></div>



              {/* Project Media */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 rounded-xl bg-indigo-50 mr-4">
                      <PhotoIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-display">Project Media</h3>
                      <p className="text-sm text-slate-500">Screenshots and demo video</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {imagePreviews.length}/5 images
                  </span>
                </div>

                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                  <p className="font-semibold mb-1">Media Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li>Screenshots: 2MB each (auto-compressed)</li>
                    <li>Video: 100MB maximum (direct upload)</li>
                    <li>Total upload: 125MB maximum</li>
                    <li>Tips: Use fewer screenshots (3-4 is ideal), compress video before upload.</li>
                  </ul>
                </div>

                {/* Demo Video Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Demo Video <span className="text-xs text-slate-400">(optional, max 100MB)</span>
                  </label>

                  {!videoFile && !videoPreview ? (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="video-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all duration-200 group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <VideoCameraIcon className="w-12 h-12 text-slate-400 mb-3 group-hover:text-indigo-500 transition-colors" />
                          <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload video</span> or drag and drop</p>
                          <p className="text-xs text-slate-500">MP4, WebM, OGG (MAX. 100MB)</p>
                        </div>
                        <input
                          id="video-upload"
                          type="file"
                          className="hidden"
                          accept="video/*"
                          onChange={handleVideoUpload}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                      <video
                        src={videoPreview}
                        className="w-full h-full object-contain"
                        controls
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-500 rounded-xl p-2 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {errors.images && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start border border-red-100"
                    >
                      <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.images.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-6">
                  {/* Main Cover Image Upload */}
                  {imagePreviews.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 flex flex-col items-center justify-center px-6 pt-12 pb-10 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                          <PhotoIcon className="h-8 w-8 text-indigo-500" />
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center text-sm text-slate-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                          >
                            <span>Upload images</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={imagePreviews.length >= 5}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          PNG, JPG, GIF up to 5MB. First image will be used as the cover.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="space-y-6">
                      {/* Cover Image */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                          Cover Image
                        </h4>
                        <div className="relative group">
                          <img
                            src={imagePreviews[0]}
                            alt="Cover preview"
                            className="h-64 w-full object-cover rounded-2xl shadow-md ring-1 ring-slate-900/5"
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center shadow-sm">
                            <StarIcon className="h-3.5 w-3.5 mr-1.5" />
                            Cover Image
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(0)}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-500 rounded-xl p-2 shadow-sm hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                            title="Remove cover image"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Additional Images & Add Button */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                            Gallery
                          </h4>
                          {imagePreviews.length < 5 && (
                            <label
                              htmlFor="file-upload-link"
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer flex items-center"
                            >
                              <PlusIcon className="h-4 w-4 mr-1" />
                              Add more
                              <input
                                id="file-upload-link"
                                name="file-upload-link"
                                type="file"
                                className="sr-only"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={imagePreviews.length >= 5}
                              />
                            </label>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {imagePreviews.slice(1).map((preview, index) => (
                            <motion.div
                              key={index + 1}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 ring-1 ring-slate-900/5"
                            >
                              <img
                                src={preview}
                                alt={`Additional preview ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index + 1)}
                                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 rounded-lg p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                                title="Remove image"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </motion.div>
                          ))}

                          {imagePreviews.length < 5 && (
                            <label
                              htmlFor="file-upload-card"
                              className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all duration-200 group"
                            >
                              <div className="p-2 rounded-full bg-slate-100 group-hover:bg-white transition-colors">
                                <PlusIcon className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                              </div>
                              <input
                                id="file-upload-card"
                                name="file-upload-card"
                                type="file"
                                className="sr-only"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={imagePreviews.length >= 5}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8 mt-8 border-t border-slate-100">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                  <p className="text-sm text-slate-500 text-center sm:text-left">
                    By submitting, you agree to our Terms of Service.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                          Publish Project
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function StarIcon(props) {
  return (
    <svg {...props} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}
