import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { ensureUrl, formatDisplayUrl } from '../../utils/linkUtils';

export const TemplateTwoColumn = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 font-sans text-xs leading-relaxed max-w-[800px] mx-auto shadow-sm text-left flex">
      {/* Left column — dark sidebar */}
      <aside className="w-56 shrink-0 bg-slate-800 text-slate-200 flex flex-col p-5 gap-5">
        {/* Monogram */}
        <div>
          <div className="w-12 h-12 rounded-xl bg-violet-600 text-white font-black text-lg flex items-center justify-center mb-3">
            {profile.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'YN'}
          </div>
          <h1 className="text-sm font-black text-white leading-tight">{profile.fullName || 'Your Name'}</h1>
          <p className="text-[10px] text-violet-300 font-semibold mt-0.5">
            {careerGoal?.targetRoles?.[0] || `${profile.field}`}
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-1.5 text-[10px] text-slate-300">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Contact</p>
          {profile.email && (
            <a href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 hover:text-white transition-colors">
              <Mail className="w-2.5 h-2.5 text-violet-400 shrink-0 mt-0.5" />
              <span className="break-all">{profile.email}</span>
            </a>
          )}
          {profile.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-2.5 h-2.5 text-violet-400 shrink-0" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-2.5 h-2.5 text-violet-400 shrink-0" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.linkedin && (
            <a href={ensureUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 text-violet-300 hover:text-white transition-colors">
              <LinkedinIcon className="w-2.5 h-2.5 text-violet-400 shrink-0 mt-0.5" />
              <span className="break-all">{formatDisplayUrl(profile.linkedin)}</span>
            </a>
          )}
          {profile.portfolio && (
            <a href={ensureUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 text-violet-300 hover:text-white transition-colors">
              <Globe className="w-2.5 h-2.5 text-violet-400 shrink-0 mt-0.5" />
              <span className="break-all">{formatDisplayUrl(profile.portfolio)}</span>
            </a>
          )}
          {profile.github && (
            <a href={ensureUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 text-violet-300 hover:text-white transition-colors">
              <GithubIcon className="w-2.5 h-2.5 text-violet-400 shrink-0 mt-0.5" />
              <span className="break-all">{formatDisplayUrl(profile.github)}</span>
            </a>
          )}
        </div>

        {/* Technical Skills */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Technical Skills</p>
          <div className="flex flex-wrap gap-1">
            {skills?.technical?.map((s) => (
              <span key={s} className="bg-slate-700 text-slate-200 text-[9px] px-1.5 py-0.5 rounded font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        {skills?.soft && skills.soft.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Key Strengths</p>
            <div className="flex flex-wrap gap-1">
              {skills.soft.map((s) => (
                <span key={s} className="bg-slate-700/60 text-slate-300 text-[9px] px-1.5 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Education</p>
            <div className="space-y-2 text-[10px]">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-white leading-tight">{edu.degree}</p>
                  <p className="text-violet-300 text-[9px]">{edu.branch}</p>
                  <p className="text-slate-400 text-[9px]">{edu.college}</p>
                  <p className="text-slate-500 text-[8px]">{edu.startYear} – {edu.graduationYear} {edu.score ? `• ${edu.score}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in Sidebar */}
        {certifications && certifications.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Certifications</p>
            <div className="space-y-1.5 text-[10px]">
              {certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold text-white leading-tight">{c.name}</p>
                  <p className="text-slate-400 text-[9px]">{c.issuer} ({c.date})</p>
                  {(c.link || c.url) && (
                    <a
                      href={ensureUrl(c.link || c.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-300 hover:text-white underline text-[9px] inline-flex items-center gap-0.5 mt-0.5"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      <span>View Certificate</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right column — main content */}
      <main className="flex-1 p-6 space-y-4">
        {/* Summary */}
        {careerGoal?.summary && (
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-violet-700 border-b-2 border-violet-200 pb-0.5 mb-1.5">
              Profile Summary
            </h2>
            <p className="text-[11px] text-slate-700 leading-relaxed">{careerGoal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-violet-700 border-b-2 border-violet-200 pb-0.5 mb-2">
              Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                      <p className="text-[11px] text-violet-700 font-semibold">{exp.company} — {exp.location}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                      {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-outside pl-3.5 mt-1 space-y-0.5 text-[11px] text-slate-600">
                      {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-violet-700 border-b-2 border-violet-200 pb-0.5 mb-2">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-[11px] font-bold text-slate-900">
                      {proj.name}
                      {proj.type && (
                        <span className="ml-1.5 text-[9px] text-violet-700 border border-violet-200 px-1 py-0.5 rounded font-semibold">
                          {proj.type}
                        </span>
                      )}
                    </h3>
                    {proj.duration && (
                      <span className="text-[10px] text-slate-500 ml-2">{proj.duration}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-700 mt-0.5">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-600">Stack:</span> {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </p>
                  )}
                  {proj.keyFeatures && proj.keyFeatures.length > 0 && (
                    <ul className="list-disc list-outside pl-3.5 mt-0.5 space-y-0.5 text-[10px] text-slate-600">
                      {proj.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  )}
                  {(proj.github || proj.liveUrl || proj.link) && (
                    <div className="flex items-center gap-3 mt-1 text-[10px]">
                      {(proj.github || (proj.link && proj.link.includes('github'))) && (
                        <a
                          href={ensureUrl(proj.github || proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-violet-700 hover:underline font-semibold"
                        >
                          <GithubIcon className="w-2.5 h-2.5" />
                          <span>GitHub</span>
                          <ExternalLink className="w-2 h-2" />
                        </a>
                      )}
                      {(proj.liveUrl || (proj.link && !proj.link.includes('github'))) && (
                        <a
                          href={ensureUrl(proj.liveUrl || proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-700 hover:underline font-semibold"
                        >
                          <Globe className="w-2.5 h-2.5" />
                          <span>Live Demo</span>
                          <ExternalLink className="w-2 h-2" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-violet-700 border-b-2 border-violet-200 pb-0.5 mb-2">
              Achievements
            </h2>
            <ul className="space-y-1 text-[11px] text-slate-700">
              {achievements.map((a) => (
                <li key={a.id} className="flex items-start gap-1.5">
                  <span className="text-violet-500 font-bold shrink-0">▸</span>
                  <span>
                    <span className="font-semibold text-slate-900">{a.title}</span>
                    {a.description && ` — ${a.description}`} ({a.year})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};
