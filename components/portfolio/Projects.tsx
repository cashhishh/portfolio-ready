'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiGithub, FiPlay, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ---------------- HELPERS ----------------
function resolveImage(url: string): string {
  // Normalize any Google Drive URL variant to thumbnail embed format
  const driveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|uc\?(?:[^&]*&)*id=|thumbnail\?(?:[^&]*&)*id=)([a-zA-Z0-9_-]+)/)
  if (driveMatch) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`
  }
  return url
}

// ---------------- TYPES ----------------
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
  images?: string[] // ✅ FIXED
  featured: boolean
}

interface ProjectsProps {
  projects: ProjectItem[]
}

// ---------------- MAIN ----------------
export default function Projects({ projects }: ProjectsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  return (
    <section id="projects" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-4xl font-bold text-white mb-12">
            Projects
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// ---------------- CARD ----------------
function ProjectCard({
  project,
  onClick
}: {
  project: ProjectItem
  onClick: () => void
}) {

  const image = project.images?.[0] ? resolveImage(project.images[0]) : null

  return (
    <div
      onClick={onClick}
      className="rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:scale-[1.02] transition"
    >

      {/* Image */}
      <div className="h-48 bg-black flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl text-white/10">
            {project.name[0]}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold mb-2">
          {project.name}
        </h3>

        <p className="text-white/50 text-sm mb-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech, i) => (
            <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------- MODAL ----------------
function ProjectModal({
  project,
  onClose
}: {
  project: ProjectItem
  onClose: () => void
}) {
  const image = project.images?.[0] ? resolveImage(project.images[0]) : null
  const [expanded, setExpanded] = useState(false)
  const isLong = (project.mdContent?.length ?? 0) > 800

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-white/10 max-w-3xl w-full rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header image */}
        {image && (
          <div className="relative h-56 shrink-0">
            <img src={image} alt={project.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-[#111] to-transparent" />
          </div>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
          >
            <FiX className="w-4 h-4" />
          </button>

          <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
          <p className="text-white/60 mb-5">{project.description}</p>

          {/* Tech Stack */}
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {project.techStack.map((tech, i) => (
                <span key={i} className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {project.githubURL && (
              <a
                href={project.githubURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors"
              >
                <FiGithub className="w-4 h-4" /> GitHub
              </a>
            )}
            {project.videoURL && (
              <a
                href={project.videoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors"
              >
                <FiPlay className="w-4 h-4" /> Demo
              </a>
            )}
            {project.links?.filter(l => l.url?.trim() && l.name?.trim()).map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors"
              >
                <FiExternalLink className="w-4 h-4" /> {link.name}
              </a>
            ))}
          </div>

          {/* Markdown content */}
          {project.mdContent && (
            <div className="border-t border-white/10 pt-5">
              <div className={`relative overflow-hidden transition-all duration-300 ${!expanded && isLong ? 'max-h-64' : ''}`}>
                <div className="prose prose-invert prose-sm max-w-none
                  prose-headings:text-white prose-headings:font-semibold
                  prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                  prose-p:text-white/70 prose-p:leading-relaxed
                  prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-strong:font-semibold
                  prose-code:text-emerald-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                  prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                  prose-blockquote:border-l-white/20 prose-blockquote:text-white/50
                  prose-ul:text-white/70 prose-ol:text-white/70
                  prose-li:marker:text-white/30
                  prose-table:text-white/70
                  prose-th:text-white prose-th:border-white/20
                  prose-td:border-white/10
                  prose-hr:border-white/10
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.mdContent}
                  </ReactMarkdown>
                </div>
                {!expanded && isLong && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#111] to-transparent" />
                )}
              </div>

              {isLong && (
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="mt-3 flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                >
                  {expanded ? <><FiChevronUp className="w-4 h-4" /> Show less</> : <><FiChevronDown className="w-4 h-4" /> Read more</>}
                </button>
              )}
            </div>
          )}

          {/* Extra Images */}
          {project.images && project.images.length > 1 && (
            <div className="grid grid-cols-2 gap-2 mt-6">
              {project.images.slice(1).map((img, i) => (
                <img key={i} src={resolveImage(img)} alt={`${project.name} screenshot ${i + 2}`} className="rounded-xl w-full object-cover" />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}