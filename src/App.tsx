import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code2, Briefcase, User, ChevronDown, Download, Phone, MapPin, Calendar } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <header className="min-h-screen flex flex-col items-center justify-center relative px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80"
              alt="Profile Picture"
              className="w-40 h-40 rounded-full mx-auto border-4 border-blue-400 shadow-xl"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Full-Stack Developer</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">Building robust and scalable web applications</p>
          <div className="flex gap-4 justify-center mb-8">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
               className="p-2 hover:text-blue-400 transition-colors">
              <Github size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
               className="p-2 hover:text-blue-400 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:your.email@example.com"
               className="p-2 hover:text-blue-400 transition-colors">
              <Mail size={24} />
            </a>
          </div>
          <a 
            href="/path-to-your-cv.pdf" 
            download 
            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Download size={20} className="mr-2" />
            Download CV
          </a>
        </div>
        <ChevronDown className="absolute bottom-8 animate-bounce" size={32} />
      </header>

      {/* About Section */}
      <section className="py-20 px-4" id="about">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <User className="text-blue-400" />
            <h2 className="text-3xl font-bold">About Me</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            I'm a passionate full-stack developer with expertise in modern web technologies.
            I specialize in building scalable applications using React, Node.js, and cloud technologies.
            With a strong foundation in both frontend and backend development, I create seamless user experiences
            backed by robust server architectures.
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="text-blue-400" />
            <h2 className="text-3xl font-bold">Work Experience</h2>
          </div>
          <div className="space-y-8">
            {[
              {
                title: 'Senior Full Stack Developer',
                company: 'Tech Solutions Inc.',
                period: '2021 - Present',
                description: 'Led development of enterprise applications, mentored junior developers, and implemented CI/CD pipelines.'
              },
              {
                title: 'Full Stack Developer',
                company: 'Digital Innovations Ltd.',
                period: '2018 - 2021',
                description: 'Developed and maintained multiple client projects using React, Node.js, and AWS.'
              },
              {
                title: 'Junior Developer',
                company: 'StartUp Co.',
                period: '2016 - 2018',
                description: 'Contributed to frontend development using React and implemented responsive designs.'
              }
            ].map((job) => (
              <div key={job.title} className="bg-gray-700/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <div className="flex items-center gap-2 text-gray-300 mb-3">
                  <Calendar size={16} />
                  <span>{job.period}</span>
                </div>
                <p className="text-gray-300">{job.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Code2 className="text-blue-400" />
            <h2 className="text-3xl font-bold">Skills</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'].map((skill) => (
              <div key={skill} className="bg-gray-700/50 p-4 rounded-lg">
                <p className="font-semibold">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="text-blue-400" />
            <h2 className="text-3xl font-bold">Projects</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'E-Commerce Platform',
                description: 'A full-stack e-commerce solution with React and Node.js',
                image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80'
              },
              {
                title: 'Task Management App',
                description: 'Real-time task management application with collaborative features',
                image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80'
              }
            ].map((project) => (
              <div key={project.title} className="bg-gray-800 rounded-lg overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <a href="#" className="inline-flex items-center text-blue-400 hover:text-blue-300">
                    View Project <ExternalLink size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Mail className="text-blue-400" />
            <h2 className="text-3xl font-bold">Contact</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-400" />
                <a href="mailto:your.email@example.com" className="text-gray-300 hover:text-blue-400">
                  your.email@example.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-blue-400" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-blue-400">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-400" />
                <span className="text-gray-300">San Francisco, CA</span>
              </div>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400">© 2024 Your Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;