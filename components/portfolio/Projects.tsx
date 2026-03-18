'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiGithub, FiPlay, FiX } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface LinkItem {
  name: string
  url: string
}

interface ProjectItem {
  id: string
  name: string
  description: string
  mdContent?: string | null
  techStack: string[]
  links: LinkItem[]
  videoURL?: string | null
  githubURL?: string | null
  images: string[]
  featured: boolean
}

interface ProjectsProps {
  projects: ProjectItem[]
}

export default function Projects({ projects }: ProjectsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)

  return (
    <section id="projects" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/30 text-sm tracking-[0.3em] uppercase mb-4">Projects</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-16">
            Things I&apos;ve built<span className="text-white/20">.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`${project.featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <ProjectCard project={project} onClick={() => setSelectedProject(project)} index={i} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({ project, onClick, index }: { project: ProjectItem; onClick: () => void; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    ref.current.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`
  }

  function handleMouseLeave() {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="View"
      className="group relative rounded-2xl bg-white/2 border border-white/6 overflow-hidden transition-all duration-300 hover:border-white/12 hover:shadow-2xl hover:shadow-white/2 cursor-pointer"
      style={{ transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s' }}
    >
      {/* Image area */}
      <div className="relative h-48 bg-linear-to-br from-white/4 to-white/1 overflow-hidden">
        {project.images[0] ? (
          <img
            src={project.images[0]}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-white/6">{project.name[0]}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 text-sm text-white font-medium border border-white/30 rounded-full"
          >
            View Project →
          </motion.span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
          {project.name}
        </h3>
        <p className="text-white/40 text-sm line-clamp-2 mb-4">{project.description}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((tech, i) => (
            <span key={i} className="px-2.5 py-1 text-xs bg-white/5 text-white/40 rounded-md">
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="px-2.5 py-1 text-[11px] text-white/20 rounded-md">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#111] border border-white/8 shadow-2xl"
      >
        {/* Header image */}
        {project.images[0] && (
          <div className="relative h-40 sm:h-64 overflow-hidden rounded-t-3xl">
            <img src={project.images[0]} alt={project.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-[#111] via-transparent" />
          </div>
        )}

        <div className="p-4 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <FiX className="w-5 h-5" />
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{project.name}</h2>
          <p className="text-white/50 mb-6">{project.description}</p>

          {/* Links */}
          <div className="flex flex-wrap gap-3 mb-8">
            {project.githubURL && (
              <a
                href={project.githubURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                <FiGithub className="w-4 h-4" /> GitHub
              </a>
            )}
            {project.videoURL && (
              <a
                href={project.videoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                <FiPlay className="w-4 h-4" /> Video
              </a>
            )}
            {(project.links || []).map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                <FiExternalLink className="w-4 h-4" /> {link.name}
              </a>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.techStack.map((tech, i) => (
              <span key={i} className="px-3 py-1.5 text-xs bg-white/5 text-white/50 rounded-lg border border-white/6">
                {tech}
              </span>
            ))}
          </div>

          {/* Markdown content */}
          {project.mdContent && (
            <div className="prose prose-invert prose-sm max-w-none prose-p:text-white/60 prose-headings:text-white/80 prose-a:text-blue-400 prose-strong:text-white/70 prose-code:text-emerald-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-white/3 prose-pre:border prose-pre:border-white/6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.mdContent}</ReactMarkdown>
            </div>
          )}

          {/* Additional images */}
          {project.images.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
              {project.images.slice(1).map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/6">
                  <img src={img} alt={`${project.name} screenshot ${i + 2}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
