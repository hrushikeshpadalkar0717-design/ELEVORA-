import React from 'react';
import { ensureUrl, formatDisplayUrl } from '../../utils/linkUtils';

export const TemplateMinimal = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 px-6 py-5 sm:px-8 sm:py-6 text-left font-sans text-xs leading-relaxed max-w-[800px] mx-auto shadow-sm">
      {/* Minimal Header */}
      <header className="pb-3 mb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-2xl font-light text-slate-900 tracking-tight">{profile.fullName || 'John Doe'}</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-0.5">
            {careerGoal?.targetRoles?.[0] || profile.field}
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-500 space-y-0.5">
          <div className="flex flex-wrap justify-end gap-x-2">
            {profile.email && (
              <a href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline">
                {profile.email}
              </a>
            )}
            {profile.email && profile.phone && <span>•</span>}
            {profile.phone && <span>{profile.phone}</span>}
          </div>
          {profile.location && <div>{profile.location}</div>}
          <div className="flex flex-wrap justify-end gap-x-2">
            {profile.linkedin && (
              <a href={ensureUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                {formatDisplayUrl(profile.linkedin)}
              </a>
            )}
            {profile.linkedin && profile.portfolio && <span>•</span>}
            {profile.portfolio && (
              <a href={ensureUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                {formatDisplayUrl(profile.portfolio)}
              </a>
            )}
            {profile.portfolio && profile.github && <span>•</span>}
            {profile.github && (
              <a href={ensureUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                {formatDisplayUrl(profile.github)}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {careerGoal?.summary && (
        <section className="mb-6 grid grid-cols-4 gap-4">
          <div className="col-span-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">About</div>
          <div className="col-span-3 text-slate-700 leading-normal">{careerGoal.summary}</div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6 grid grid-cols-4 gap-4">
          <div className="col-span-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Experience</div>
          <div className="col-span-3 space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{exp.role} — {exp.company}</span>
                  <span className="font-normal text-slate-400 text-[11px]">
                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.responsibilities && (
                  <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-slate-600">
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
        <section className="mb-6 grid grid-cols-4 gap-4">
          <div className="col-span-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Projects</div>
          <div className="col-span-3 space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{proj.name}</span>
                  <span className="font-normal text-slate-400 text-[11px]">{proj.duration}</span>
                </div>
                <p className="text-slate-600 mt-0.5">{proj.description}</p>
                {proj.technologies && (
                  <p className="text-[11px] text-slate-400 mt-0.5">Stack: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</p>
                )}
                {(proj.github || proj.liveUrl || proj.link) && (
                  <div className="flex items-center gap-3 mt-1 text-[11px]">
                    {(proj.github || (proj.link && proj.link.includes('github'))) && (
                      <a href={ensureUrl(proj.github || proj.link)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                        GitHub
                      </a>
                    )}
                    {(proj.liveUrl || (proj.link && !proj.link.includes('github'))) && (
                      <a href={ensureUrl(proj.liveUrl || proj.link)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                        Live Demo
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
        <section className="mb-6 grid grid-cols-4 gap-4">
          <div className="col-span-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Education</div>
          <div className="col-span-3 space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <span className="font-semibold text-slate-900">{edu.degree}</span>, {edu.branch}
                  <div className="text-slate-500 text-[11px]">{edu.college}, {edu.location}</div>
                </div>
                <div className="text-right text-slate-500 text-[11px]">
                  {edu.startYear} – {edu.graduationYear}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="mb-6 grid grid-cols-4 gap-4">
        <div className="col-span-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Skills</div>
        <div className="col-span-3 text-slate-700 space-y-1">
          <div><span className="font-medium text-slate-900">Tech:</span> {skills?.technical?.join(' • ')}</div>
          <div><span className="font-medium text-slate-900">Soft:</span> {skills?.soft?.join(' • ')}</div>
          {skills?.languages && <div><span className="font-medium text-slate-900">Languages:</span> {skills.languages.map(l => `${l.name} (${l.proficiency})`).join(' • ')}</div>}
        </div>
      </section>

      {/* Certifications */}
      {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <section className="grid grid-cols-4 gap-4">
          <div className="col-span-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Credentials</div>
          <div className="col-span-3 text-slate-700 space-y-1.5">
            {certifications?.map((c) => (
              <div key={c.id}>
                <span className="font-medium text-slate-900">{c.name}</span> — {c.issuer} ({c.date})
                {(c.link || c.url) && (
                  <a href={ensureUrl(c.link || c.url)} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline font-medium text-[11px]">
                    [View Certificate]
                  </a>
                )}
              </div>
            ))}
            {achievements?.map((a) => (
              <div key={a.id} className="text-slate-500">
                <span className="font-medium text-slate-800">{a.title}</span> ({a.year})
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
