import React from 'react';
import { ensureUrl, formatDisplayUrl } from '../../utils/linkUtils';

export const TemplateCompactAts = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-900 font-sans text-[12px] leading-snug max-w-[800px] mx-auto shadow-sm text-left px-6 py-4.5">
      {/* Compact header */}
      <header className="border-b border-slate-900 pb-3 mb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {profile.fullName || 'Your Name'}
        </h1>
        <p className="text-xs font-semibold text-slate-700 mt-0.5">
          {careerGoal?.targetRoles?.[0] || `${profile.field} — ${profile.subfield}`}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-[11px] text-slate-600">
          {profile.email && (
            <a href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900 font-medium">
              {profile.email}
            </a>
          )}
          {profile.phone && <span>| {profile.phone}</span>}
          {profile.location && <span>| {profile.location}</span>}
          {profile.linkedin && (
            <span>
              |{' '}
              <a href={ensureUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900 font-medium">
                {formatDisplayUrl(profile.linkedin)}
              </a>
            </span>
          )}
          {profile.portfolio && (
            <span>
              |{' '}
              <a href={ensureUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900 font-medium">
                {formatDisplayUrl(profile.portfolio)}
              </a>
            </span>
          )}
          {profile.github && (
            <span>
              |{' '}
              <a href={ensureUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900 font-medium">
                {formatDisplayUrl(profile.github)}
              </a>
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {careerGoal?.summary && (
        <section className="mb-3.5">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-300 pb-0.5">
            Summary
          </h2>
          <p className="text-[11px] text-slate-700 leading-snug">{careerGoal.summary}</p>
        </section>
      )}

      {/* Skills — compact inline */}
      <section className="mb-3.5">
        <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1 border-b border-slate-300 pb-0.5">
          Skills
        </h2>
        <p className="text-[11px] text-slate-700 leading-snug">
          {[...(skills?.technical || []), ...(skills?.soft || [])].join(' · ')}
        </p>
        {skills?.languages && skills.languages.length > 0 && (
          <p className="text-[11px] text-slate-600 mt-0.5">
            <span className="font-semibold">Languages:</span>{' '}
            {skills.languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
          </p>
        )}
      </section>

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1.5 border-b border-slate-300 pb-0.5">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{exp.role}</span>
                  <span className="text-[10px] text-slate-500 ml-2 whitespace-nowrap">
                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{exp.company} — {exp.location}</p>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-outside pl-4 mt-1 space-y-0.5 text-[11px] text-slate-700">
                    {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1.5 border-b border-slate-300 pb-0.5">
            Education
          </h2>
          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-900 text-[11px]">{edu.degree} in {edu.branch}</span>
                  <p className="text-[11px] text-slate-600">{edu.college}, {edu.location}</p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-[10px] text-slate-500">{edu.startYear} – {edu.graduationYear}</p>
                  {edu.score && <p className="text-[10px] font-bold text-slate-700">{edu.score}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1.5 border-b border-slate-300 pb-0.5">
            Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[11px]">{proj.name}</span>
                  {proj.duration && (
                    <span className="text-[10px] text-slate-500">{proj.duration}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-700 mt-0.5">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    <span className="font-semibold">Tech:</span> {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                  </p>
                )}
                {(proj.github || proj.liveUrl || proj.link) && (
                  <div className="flex items-center gap-3 mt-1 text-[10px]">
                    {(proj.github || (proj.link && proj.link.includes('github'))) && (
                      <a href={ensureUrl(proj.github || proj.link)} target="_blank" rel="noopener noreferrer" className="text-blue-900 underline font-semibold">
                        [GitHub]
                      </a>
                    )}
                    {(proj.liveUrl || (proj.link && !proj.link.includes('github'))) && (
                      <a href={ensureUrl(proj.liveUrl || proj.link)} target="_blank" rel="noopener noreferrer" className="text-blue-900 underline font-semibold">
                        [Live Demo]
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1.5 border-b border-slate-300 pb-0.5">
            Certifications & Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {certifications && certifications.length > 0 && (
              <ul className="space-y-1 text-slate-700">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <span className="font-semibold">{c.name}</span> — {c.issuer} ({c.date})
                    {(c.link || c.url) && (
                      <a href={ensureUrl(c.link || c.url)} target="_blank" rel="noopener noreferrer" className="ml-1.5 text-blue-900 underline font-medium">
                        [View Certificate]
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {achievements && achievements.length > 0 && (
              <ul className="space-y-0.5 text-slate-700">
                {achievements.map((a) => (
                  <li key={a.id}>
                    <span className="font-semibold">{a.title}</span> ({a.year})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
