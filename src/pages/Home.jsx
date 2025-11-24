import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import ProjectCard from '../components/projects/ProjectCard';

const projects = [
  {
    id: 1,
    title: 'AI-Powered Study Assistant',
    description: 'An intelligent study companion that generates quizzes and summaries from your notes using OpenAI API.',
    category: 'AI/ML',
    author: { name: 'Sarah Chen', role: 'Computer Science Student' },
    date: 'Mar 15, 2024',
    datetime: '2024-03-15',
    href: '/projects/1',
    githubUrl: '#',
    liveUrl: '#',
  },
  {
    id: 2,
    title: 'EcoTrack: Carbon Footprint Calculator',
    description: 'A mobile-first web app to track and reduce your daily carbon footprint with gamification elements.',
    category: 'Web App',
    author: { name: 'Alex Rivera', role: 'Full Stack Developer' },
    date: 'Mar 10, 2024',
    datetime: '2024-03-10',
    href: '/projects/2',
    githubUrl: '#',
    liveUrl: '#',
  },
  {
    id: 3,
    title: 'CryptoVis: Blockchain Visualizer',
    description: 'Real-time visualization of blockchain transactions and network activity using D3.js and WebSockets.',
    category: 'Blockchain',
    author: { name: 'David Kim', role: 'Software Engineer' },
    date: 'Feb 28, 2024',
    datetime: '2024-02-28',
    href: '/projects/3',
    githubUrl: '#',
    liveUrl: '#',
  },
];

export default function Home() {
  return (
    <div className="bg-slate-50">
      <Hero />

      {/* About Section */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">
                  Showcase your journey. <br />
                  <span className="text-indigo-600">Connect with opportunities.</span>
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  PowerFolio is a community-driven platform for developers to share projects, get feedback, and find opportunities. We provide the tools you need to stand out.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Beautiful Templates</h3>
                      <p className="text-sm text-slate-500 mt-1">Modern, responsive designs ready to use.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Instant Sharing</h3>
                      <p className="text-sm text-slate-500 mt-1">Share your work with a single link.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden shadow-2xl ring-1 ring-slate-900/10 transform hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 mix-blend-multiply z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
                    alt="Developer working"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -left-6 -z-10 w-full h-full rounded-2xl bg-indigo-50/50 blur-2xl"></div>
                <div className="absolute -top-6 -right-6 -z-10 w-full h-full rounded-2xl bg-purple-50/50 blur-2xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="py-24 sm:py-32 bg-white relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-display">Featured Projects</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Discover the latest and greatest projects from our community of talented developers.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Link
              to="/projects"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:ring-slate-400 transition-all"
            >
              View All Projects
            </Link>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-900 via-slate-900/40"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display"
            >
              Ready to share your work?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-slate-300"
            >
              Join thousands of developers who are building their portfolio and career with PowerFolio. It's free and easy to get started.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex items-center gap-x-6"
            >
              <Link
                to="/submit"
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
              >
                Get started
              </Link>
              <Link to="/projects" className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors">
                Explore projects <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

