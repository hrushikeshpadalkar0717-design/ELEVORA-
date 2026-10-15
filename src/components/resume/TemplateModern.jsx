import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../common/BrandIcons';
import { ensureUrl, formatDisplayUrl } from '../../utils/linkUtils';

export const TemplateModern = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 px-6 py-5 sm:px-8 sm:py-6 text-left font-sans text-xs sm:text-sm leading-relaxed max-w-[800px] mx-auto shadow-sm">
      {/* Header */}
      <header className="border-b-2 border-blue-600 pb-3 mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {profile.fullName || 'John Doe'}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-0.5 tracking-wide">
          {careerGoal?.targetRoles?.[0] || `${profile.field} — ${profile.subfield}`}
        </p>

        {/* Contact info grid */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-600">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-colors shrink-0"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{profile.email}</span>
            </a>
          )}
          {profile.phone && (
            <span className="flex items-center gap-1.5 shrink-0">
              <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{profile.phone}</span>
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{profile.location}</span>
            </span>
          )}
          {profile.linkedin && (
            <a
              href={ensureUrl(profile.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-colors font-medium shrink-0"
            >
              <LinkedinIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{formatDisplayUrl(profile.linkedin)}</span>
            </a>
          )}
          {profile.portfolio && (
            <a
              href={ensureUrl(profile.portfolio)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-colors font-medium shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{formatDisplayUrl(profile.portfolio)}</span>
            </a>
          )}
          {profile.github && (
            <a
              href={ensureUrl(profile.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 hover:underline transition-colors font-medium shrink-0"
            >
              <GithubIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{formatDisplayUrl(profile.github)}</span>
            </a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {careerGoal?.summary && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">{careerGoal.summary}</p>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900">
                    {edu.degree} in {edu.branch}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">{edu.college}, {edu.location}</p>
                </div>
                <div className="text-right shrink-0 whitespace-nowrap">
                  <span className="text-xs font-semibold text-slate-600">
                    {edu.startYear} – {edu.graduationYear}
                  </span>
                  {edu.score && (
                    <p className="text-[11px] font-bold text-blue-600 mt-0.5">Score: {edu.score}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
            Work Experience
          </h2>
          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium shrink-0 whitespace-nowrap">
                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-outside pl-4 mt-1.5 space-y-0.5 text-xs text-slate-600 leading-relaxed">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
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
        <section className="mb-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
            Key Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="pb-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-900">{proj.name}</h3>
                    {proj.type && (
                      <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                        {proj.type}
                      </span>
                    )}
                  </div>
                  {proj.duration && <span className="text-xs text-slate-500 shrink-0 whitespace-nowrap">{proj.duration}</span>}
                </div>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700">Tech:</span> {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.keyFeatures && proj.keyFeatures.length > 0 && (
                  <ul className="list-disc list-outside pl-4 mt-1 space-y-0.5 text-xs text-slate-600">
                    {proj.keyFeatures.map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>
                )}
                {/* Clickable Project Links */}
                {(proj.github || proj.liveUrl || proj.link) && (
                  <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs font-semibold">
                    {(proj.github || (proj.link && proj.link.includes('github'))) && (
                      <a
                        href={ensureUrl(proj.github || proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                    {(proj.liveUrl || (proj.link && !proj.link.includes('github'))) && (
                      <a
                        href={ensureUrl(proj.liveUrl || proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
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
      <section className="mb-3.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
          Skills & Languages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-xs">Technical Skills</span>
            <p className="text-slate-600 mt-0.5 leading-relaxed">{skills?.technical?.join(', ') || 'None added'}</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block text-xs">Soft Skills</span>
            <p className="text-slate-600 mt-0.5 leading-relaxed">{skills?.soft?.join(', ') || 'None added'}</p>
          </div>
          {skills?.languages && skills.languages.length > 0 && (
            <div className="sm:col-span-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 block text-xs">Languages</span>
              <p className="text-slate-600 mt-0.5">
                {skills.languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Certifications & Achievements */}
      {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-2">
            Certifications & Honors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {certifications && certifications.length > 0 && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1.5 text-xs">Certifications</span>
                <ul className="space-y-2 text-slate-600">
                  {certifications.map((c) => (
                    <li key={c.id} className="leading-snug">
                      <div className="font-semibold text-slate-800">{c.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {c.issuer} ({c.date})
                        {(c.link || c.url) && (
                          <a
                            href={ensureUrl(c.link || c.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded transition-colors"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>View Certificate</span>
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {achievements && achievements.length > 0 && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1.5 text-xs">Achievements</span>
                <ul className="space-y-1.5 text-slate-600">
                  {achievements.map((a) => (
                    <li key={a.id} className="leading-snug">
                      <span className="font-semibold text-slate-800">{a.title}</span>{' '}
                      <span className="text-slate-500 text-[11px]">({a.year})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
