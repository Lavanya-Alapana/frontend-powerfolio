import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CodeBracketIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function ProjectCard({ project }) {
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            onClick={() => navigate(project.href)}
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-900/5 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 group cursor-pointer"
        >
            <div className="flex-1 p-8 flex flex-col">
                <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={project.datetime} className="text-slate-500 font-medium">
                        {project.date}
                    </time>
                    <span className="relative z-10 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-600 hover:bg-indigo-100 transition-colors">
                        {project.category}
                    </span>
                </div>
                <div className="relative mt-6 flex-1">
                    <h3 className="text-xl font-bold leading-7 text-slate-900 group-hover:text-indigo-600 transition-colors font-display">
                        {project.title}
                    </h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                        {project.description}
                    </p>
                </div>
                <div className="mt-8 flex items-center gap-x-4 border-t border-slate-100 pt-6">
                    <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-sm ring-2 ring-white">
                        {project.author?.name?.charAt(0) || '?'}
                    </div>
                    <div className="text-sm leading-6">
                        <p className="font-semibold text-slate-900">
                            {project.author?.name || 'Unknown Author'}
                        </p>
                        <p className="text-slate-500 text-xs">{project.author?.role || 'Developer'}</p>
                    </div>
                </div>
            </div>
            <div className="bg-slate-50/50 px-8 py-5 flex items-center justify-between border-t border-slate-100 group-hover:bg-slate-50 transition-colors">
                <div className="flex gap-5">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-sm font-medium relative z-10"
                        >
                            <CodeBracketIcon className="h-4 w-4" />
                            Code
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-sm font-medium relative z-10"
                        >
                            <EyeIcon className="h-4 w-4" />
                            Demo
                        </a>
                    )}
                </div>
                <div className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors flex items-center gap-1">
                    View Details <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
            </div>
        </motion.div>
    );
}

