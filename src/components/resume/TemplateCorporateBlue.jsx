import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { ensureUrl, formatDisplayUrl } from '../../utils/linkUtils';

export const TemplateCorporateBlue = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 font-sans text-sm leading-relaxed max-w-[800px] mx-auto shadow-sm text-left">
      {/* Navy Blue Header Banner */}
      <header className="bg-[#1a3560] px-6 py-4.5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {profile.fullName || 'Your Name'}
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm font-semibold mt-0.5">
              {careerGoal?.targetRoles?.[0] || `${profile.field} — ${profile.subfield}`}
            </p>
          </div>
          <div className="sm:text-right text-[11px] text-blue-200 space-y-0.5">
            {profile.email && (
              <p>
                <a href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {profile.email}
                </a>
              </p>
            )}
            {profile.phone && <p>{profile.phone}</p>}
            {profile.location && <p>{profile.location}</p>}
            <div className="flex flex-wrap sm:justify-end gap-2 pt-0.5">
              {profile.linkedin && (
                <a href={ensureUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white hover:underline font-medium">
                  {formatDisplayUrl(profile.linkedin)}
                </a>
              )}
              {profile.portfolio && (
                <a href={ensureUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white hover:underline font-medium">
                  {formatDisplayUrl(profile.portfolio)}
                </a>
              )}
              {profile.github && (
                <a href={ensureUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white hover:underline font-medium">
                  {formatDisplayUrl(profile.github)}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Thin accent line */}
      <div className="h-0.5 bg-gradient-to-r from-blue-600 to-blue-300" />

      <div className="px-6 py-4 space-y-3.5">
        {/* Summary */}
        {careerGoal?.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a3560] mb-1.5 pb-1 border-b border-slate-200">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">{careerGoal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a3560] mb-2 pb-1 border-b border-slate-200">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                      <p className="text-xs font-semibold text-blue-700">{exp.company}</p>
                      <p className="text-[11px] text-slate-500">{exp.location}</p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap ml-4 border border-slate-200 rounded px-2 py-0.5">
                      {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.responsibilities && (
                    <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-xs text-slate-600">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a3560] mb-2 pb-1 border-b border-slate-200">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree} — {edu.branch}</span>
                    <p className="text-slate-600">{edu.college}, {edu.location}</p>
                  </div>
                  <div className="text-right text-slate-500">
                    <span>{edu.startYear} – {edu.graduationYear}</span>
                    {edu.score && <p className="font-semibold text-blue-700">{edu.score}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a3560] mb-2 pb-1 border-b border-slate-200">
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-slate-900">{proj.name}
                      {proj.type && (
                        <span className="ml-2 text-[10px] text-blue-700 font-semibold border border-blue-200 px-1.5 py-0.5 rounded">
                          {proj.type}
                        </span>
                      )}
                    </h3>
                    {proj.duration && <span className="text-[11px] text-slate-500">{proj.duration}</span>}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold">Tech:</span> {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    </p>
                  )}
                  {(proj.github || proj.liveUrl || proj.link) && (
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      {(proj.github || (proj.link && proj.link.includes('github'))) && (
                        <a
                          href={ensureUrl(proj.github || proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 hover:underline font-semibold"
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
                          className="inline-flex items-center gap-1 text-indigo-700 hover:underline font-semibold"
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

        {/* Skills */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a3560] mb-2 pb-1 border-b border-slate-200">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-800 block mb-1">Technical:</span>
              <p className="text-slate-600">{skills?.technical?.join(', ') || 'None added'}</p>
            </div>
            <div>
              <span className="font-bold text-slate-800 block mb-1">Soft Skills:</span>
              <p className="text-slate-600">{skills?.soft?.join(', ') || 'None added'}</p>
            </div>
            {skills?.languages && skills.languages.length > 0 && (
              <div className="col-span-2">
                <span className="font-bold text-slate-800 block mb-1">Languages:</span>
                <p className="text-slate-600">
                  {skills.languages.map((l) => `${l.name} (${l.proficiency})`).join(' | ')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Certifications & Achievements */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1a3560] mb-2 pb-1 border-b border-slate-200">
              Certifications & Honors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {certifications && certifications.length > 0 && (
                <div>
                  <ul className="space-y-1.5 text-slate-600">
                    {certifications.map((c) => (
                      <li key={c.id}>
                        <span className="font-semibold text-slate-800">{c.name}</span>
                        <br />
                        <span className="text-[11px]">{c.issuer} — {c.date}</span>
                        {(c.link || c.url) && (
                          <div className="mt-0.5">
                            <a
                              href={ensureUrl(c.link || c.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:underline font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>View Certificate</span>
                            </a>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {achievements && achievements.length > 0 && (
                <div>
                  <ul className="space-y-1 text-slate-600">
                    {achievements.map((a) => (
                      <li key={a.id}>
                        <span className="font-semibold text-slate-800">{a.title}</span>
                        <br /><span className="text-[11px]">{a.description} — {a.year}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
