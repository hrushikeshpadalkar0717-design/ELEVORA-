import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../common/BrandIcons';
import { ensureUrl, formatDisplayUrl } from '../../utils/linkUtils';

export const TemplateElegantSerif = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div
      className="bg-white text-slate-800 font-serif text-sm leading-relaxed max-w-[800px] mx-auto shadow-sm text-left"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Centered Name Header */}
      <header className="pt-5 pb-3 px-6 text-center border-b-2 border-slate-800">
        <h1
          className="text-4xl font-bold text-slate-900 tracking-tight"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: '0.04em' }}
        >
          {profile.fullName || 'Your Name'}
        </h1>
        <p
          className="text-sm font-normal text-slate-600 mt-1 italic"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {careerGoal?.targetRoles?.[0] || `${profile.field} — ${profile.subfield}`}
        </p>

        {/* Contact row, centered */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-600 font-sans">
          {profile.email && (
            <a href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 hover:underline">
              <Mail className="w-3 h-3" />
              <span>{profile.email}</span>
            </a>
          )}
          {profile.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <span>{profile.phone}</span>
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              <span>{profile.location}</span>
            </span>
          )}
          {profile.linkedin && (
            <a href={ensureUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 hover:underline text-blue-900">
              <LinkedinIcon className="w-3 h-3" />
              <span>{formatDisplayUrl(profile.linkedin)}</span>
            </a>
          )}
          {profile.portfolio && (
            <a href={ensureUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 hover:underline text-blue-900">
              <Globe className="w-3 h-3" />
              <span>{formatDisplayUrl(profile.portfolio)}</span>
            </a>
          )}
          {profile.github && (
            <a href={ensureUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 hover:underline text-blue-900">
              <GithubIcon className="w-3 h-3" />
              <span>{formatDisplayUrl(profile.github)}</span>
            </a>
          )}
        </div>
      </header>

      <div className="px-6 py-4 space-y-3.5">
        {/* Summary */}
        {careerGoal?.summary && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-[0.15em] text-slate-800 text-center border-b border-slate-300 pb-1 mb-2"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Profile
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{careerGoal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-[0.15em] text-slate-800 border-b border-slate-300 pb-1 mb-3"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="text-xs font-bold text-slate-900"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {exp.role}
                    </h3>
                    <span className="text-[11px] text-slate-600 font-sans italic">
                      {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-sans italic">{exp.company} — {exp.location}</p>
                  {exp.responsibilities && (
                    <ul className="list-disc list-outside pl-5 mt-1 space-y-0.5 text-xs text-slate-700 font-sans">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-[0.15em] text-slate-800 border-b border-slate-300 pb-1 mb-3"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Education
            </h2>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3
                      className="text-xs font-bold text-slate-900"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {edu.degree} in {edu.branch}
                    </h3>
                    <p className="text-[11px] italic text-slate-600 font-sans">{edu.college}, {edu.location}</p>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-[11px] text-slate-600 font-sans">{edu.startYear} – {edu.graduationYear}</span>
                    {edu.score && <p className="text-[11px] font-bold text-slate-800 font-sans">{edu.score}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-[0.15em] text-slate-800 border-b border-slate-300 pb-1 mb-3"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Projects
            </h2>
            <div className="space-y-3 font-sans">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <h3
                      className="text-xs font-bold text-slate-900"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {proj.name}
                    </h3>
                    {proj.duration && <span className="text-[11px] text-slate-500">{proj.duration}</span>}
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-slate-500 mt-0.5 italic">
                      Stack: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </p>
                  )}
                  {(proj.github || proj.liveUrl || proj.link) && (
                    <div className="flex items-center gap-3 mt-1 text-[11px]">
                      {(proj.github || (proj.link && proj.link.includes('github'))) && (
                        <a
                          href={ensureUrl(proj.github || proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-900 underline font-semibold inline-flex items-center gap-1"
                        >
                          <GithubIcon className="w-3 h-3" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {(proj.liveUrl || (proj.link && !proj.link.includes('github'))) && (
                        <a
                          href={ensureUrl(proj.liveUrl || proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-900 underline font-semibold inline-flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-[0.15em] text-slate-800 border-b border-slate-300 pb-1 mb-2.5"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs font-sans">
            <div>
              <p className="text-[11px] font-semibold text-slate-700 mb-0.5">Technical</p>
              <p className="text-slate-600">{skills?.technical?.join(', ') || 'None added'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-700 mb-0.5">Interpersonal</p>
              <p className="text-slate-600">{skills?.soft?.join(', ') || 'None added'}</p>
            </div>
          </div>
        </section>

        {/* Certifications & Achievements */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-[0.15em] text-slate-800 border-b border-slate-300 pb-1 mb-2.5"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Certifications & Honours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              {certifications && certifications.length > 0 && (
                <ul className="space-y-1.5 text-slate-700">
                  {certifications.map((c) => (
                    <li key={c.id}>
                      <em>{c.name}</em> — {c.issuer} ({c.date})
                      {(c.link || c.url) && (
                        <a
                          href={ensureUrl(c.link || c.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-900 underline font-semibold text-[11px] inline-flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>View Certificate</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {achievements && achievements.length > 0 && (
                <ul className="space-y-1 text-slate-700">
                  {achievements.map((a) => (
                    <li key={a.id}>
                      <em>{a.title}</em> ({a.year})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Languages */}
        {skills?.languages && skills.languages.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-[0.15em] text-slate-800 border-b border-slate-300 pb-1 mb-2"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Languages
            </h2>
            <p className="text-xs text-slate-600 font-sans italic">
              {skills.languages.map((l) => `${l.name} — ${l.proficiency}`).join(' · ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
