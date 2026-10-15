import React from 'react';
import { ensureUrl, formatDisplayUrl } from '../../utils/linkUtils';

export const TemplateClassic = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-black p-8 sm:p-10 text-left font-serif text-sm leading-relaxed max-w-[800px] mx-auto shadow-sm">
      {/* Centered Classic Header */}
      <header className="text-center pb-4 mb-6 border-b border-black">
        <h1 className="text-3xl font-bold tracking-normal uppercase">{profile.fullName || 'John Doe'}</h1>
        <div className="text-xs italic mt-1 font-sans flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
          {profile.email && (
            <a href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {profile.email}
            </a>
          )}
          {profile.email && profile.phone && <span>•</span>}
          {profile.phone && <span>{profile.phone}</span>}
          {profile.phone && profile.location && <span>•</span>}
          {profile.location && <span>{profile.location}</span>}
        </div>
        {(profile.linkedin || profile.portfolio || profile.github) && (
          <div className="text-xs font-sans mt-1 flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
            {profile.linkedin && (
              <a href={ensureUrl(profile.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900 font-medium">
                {formatDisplayUrl(profile.linkedin)}
              </a>
            )}
            {profile.linkedin && profile.portfolio && <span>•</span>}
            {profile.portfolio && (
              <a href={ensureUrl(profile.portfolio)} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900 font-medium">
                {formatDisplayUrl(profile.portfolio)}
              </a>
            )}
            {profile.portfolio && profile.github && <span>•</span>}
            {profile.github && (
              <a href={ensureUrl(profile.github)} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900 font-medium">
                {formatDisplayUrl(profile.github)}
              </a>
            )}
          </div>
        )}
      </header>

      {/* Summary */}
      {careerGoal?.summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-sans">
            Career Objective
          </h2>
          <p className="text-xs leading-normal">{careerGoal.summary}</p>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline gap-4">
                <div className="min-w-0">
                  <span className="font-bold text-xs">{edu.college}</span>{edu.location ? `, ${edu.location}` : ''}
                  <div className="text-xs italic">{edu.degree} in {edu.branch}</div>
                </div>
                <div className="text-right text-xs shrink-0 whitespace-nowrap">
                  <span>{edu.startYear} - {edu.graduationYear}</span>
                  {edu.score && <div className="font-semibold">{edu.score}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-4 text-xs">
                  <span className="font-bold min-w-0">{exp.company}</span>
                  <span className="italic shrink-0 whitespace-nowrap">{exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-xs italic text-neutral-800">{exp.role} {exp.location ? `— ${exp.location}` : ''}</div>
                {exp.responsibilities && (
                  <ul className="list-disc list-outside pl-5 mt-1 space-y-0.5 text-xs">
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
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline gap-4 font-bold">
                  <span className="min-w-0">{proj.name} ({proj.role || 'Contributor'})</span>
                  <span className="font-normal italic shrink-0 whitespace-nowrap">{proj.duration}</span>
                </div>
                <p className="mt-0.5 leading-relaxed">{proj.description}</p>
                {proj.technologies && (
                  <p className="italic text-[11px] mt-0.5 font-sans">Technologies: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</p>
                )}
                {(proj.github || proj.liveUrl || proj.link) && (
                  <div className="flex items-center gap-3 mt-1 font-sans text-[11px]">
                    {(proj.github || (proj.link && proj.link.includes('github'))) && (
                      <a href={ensureUrl(proj.github || proj.link)} target="_blank" rel="noopener noreferrer" className="text-blue-900 underline font-semibold">
                        [GitHub Repo]
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

      {/* Skills */}
      <section className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-sans">
          Technical & Key Skills
        </h2>
        <p className="text-xs">
          <strong>Technical:</strong> {skills?.technical?.join(', ') || 'N/A'}<br />
          <strong>Professional:</strong> {skills?.soft?.join(', ') || 'N/A'}<br />
          <strong>Languages:</strong> {skills?.languages?.map(l => `${l.name} (${l.proficiency})`).join(', ') || 'N/A'}
        </p>
      </section>

      {/* Honors */}
      {((certifications?.length > 0) || (achievements?.length > 0)) && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5 font-sans">
            Certifications & Honors
          </h2>
          <ul className="list-disc list-outside pl-5 text-xs space-y-0.5">
            {certifications?.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong>, {c.issuer} ({c.date})
                {(c.link || c.url) && (
                  <a href={ensureUrl(c.link || c.url)} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-900 underline font-sans text-[11px]">
                    [View Certificate]
                  </a>
                )}
              </li>
            ))}
            {achievements?.map((a) => (
              <li key={a.id}><strong>{a.title}</strong> — {a.description} ({a.year})</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
