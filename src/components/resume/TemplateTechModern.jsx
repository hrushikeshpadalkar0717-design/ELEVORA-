import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/BrandIcons';
import { ensureUrl, formatDisplayUrl } from '../../utils/linkUtils';

export const TemplateTechModern = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 font-sans text-sm leading-relaxed max-w-[800px] mx-auto shadow-sm text-left">
      {/* Teal Header */}
      <header className="bg-teal-700 text-white px-6 py-4.5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{profile.fullName || 'Your Name'}</h1>
        <p className="text-teal-200 font-semibold text-xs sm:text-sm mt-0.5">
          {careerGoal?.targetRoles?.[0] || `${profile.field} — ${profile.subfield}`}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-teal-100">
          {profile.email && (
            <a href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3 h-3 text-teal-300" />
              <span>{profile.email}</span>
            </a>
          )}
          {profile.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-teal-300" />
              <span>{profile.phone}</span>
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-teal-300" />
              <span>{profile.location}</span>
            </span>
          )}
          {profile.linkedin && (
            <a href={ensureUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <LinkedinIcon className="w-3 h-3 text-teal-300" />
              <span>{formatDisplayUrl(profile.linkedin)}</span>
            </a>
          )}
          {profile.github && (
            <a href={ensureUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <GithubIcon className="w-3 h-3 text-teal-300" />
              <span>{formatDisplayUrl(profile.github)}</span>
            </a>
          )}
          {profile.portfolio && (
            <a href={ensureUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Globe className="w-3 h-3 text-teal-300" />
              <span>{formatDisplayUrl(profile.portfolio)}</span>
            </a>
          )}
        </div>
      </header>

      <div className="px-6 py-4 space-y-3.5">
        {/* Professional Summary */}
        {careerGoal?.summary && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-200 pb-1 mb-2">
              About Me
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">{careerGoal.summary}</p>
          </section>
        )}

        {/* Technical Skills */}
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-200 pb-1 mb-3">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills?.technical?.map((s) => (
              <span key={s} className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-teal-300 text-teal-800 bg-teal-50">
                {s}
              </span>
            ))}
          </div>
          {skills?.soft && skills.soft.length > 0 && (
            <p className="text-xs text-slate-600 mt-2">
              <span className="font-semibold text-slate-700">Soft Skills:</span>{' '}
              {skills.soft.join(' • ')}
            </p>
          )}
        </section>

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-200 pb-1 mb-3">
              Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                      <p className="text-xs text-teal-700 font-semibold">{exp.company} — {exp.location}</p>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-outside pl-4 mt-1 space-y-0.5 text-xs text-slate-600">
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

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-200 pb-1 mb-3">
              Featured Projects
            </h2>
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div key={proj.id} className="border-l-2 border-teal-500 pl-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-slate-900">
                      {proj.name}
                      {proj.type && (
                        <span className="ml-2 text-[10px] text-teal-700 border border-teal-200 bg-teal-50 px-1.5 py-0.5 rounded font-medium">
                          {proj.type}
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-slate-500">{proj.duration}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-600">Stack:</span> {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </p>
                  )}
                  {(proj.github || proj.liveUrl || proj.link) && (
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      {(proj.github || (proj.link && proj.link.includes('github'))) && (
                        <a
                          href={ensureUrl(proj.github || proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold hover:underline"
                        >
                          <GithubIcon className="w-3 h-3" />
                          <span>GitHub</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      )}
                      {(proj.liveUrl || (proj.link && !proj.link.includes('github'))) && (
                        <a
                          href={ensureUrl(proj.liveUrl || proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
                        >
                          <Globe className="w-3 h-3" />
                          <span>Live Demo</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-200 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{edu.degree} in {edu.branch}</h3>
                    <p className="text-xs text-slate-600">{edu.college}, {edu.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-600">{edu.startYear} – {edu.graduationYear}</span>
                    {edu.score && <p className="text-[11px] text-teal-700 font-bold">{edu.score}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-200 pb-1 mb-2.5">
              Certifications & Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {certifications && certifications.length > 0 && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Certifications:</span>
                  <ul className="space-y-1 text-slate-600">
                    {certifications.map((c) => (
                      <li key={c.id}>
                        <span>▹ <span className="font-semibold">{c.name}</span> — {c.issuer} ({c.date})</span>
                        {(c.link || c.url) && (
                          <a
                            href={ensureUrl(c.link || c.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-0.5 text-teal-700 hover:text-teal-900 underline font-semibold text-[11px]"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>View Certificate</span>
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {achievements && achievements.length > 0 && (
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Achievements:</span>
                  <ul className="space-y-0.5 text-slate-600">
                    {achievements.map((a) => (
                      <li key={a.id}>▹ <span className="font-semibold">{a.title}</span> ({a.year})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Languages */}
        {skills?.languages && skills.languages.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-200 pb-1 mb-2">
              Languages
            </h2>
            <p className="text-xs text-slate-600">
              {skills.languages.map((l) => `${l.name} (${l.proficiency})`).join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
