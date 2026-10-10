import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon } from '../common/BrandIcons';

export const TemplateModern = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 p-8 sm:p-10 text-left font-sans text-sm leading-relaxed max-w-[800px] mx-auto shadow-sm">
      {/* Header */}
      <header className="border-b-2 border-blue-600 pb-5 mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{profile.fullName || 'John Doe'}</h1>
        <p className="text-base font-semibold text-blue-600 mt-1">
          {careerGoal?.targetRoles?.[0] || `${profile.field} — ${profile.subfield}`}
        </p>

        {/* Contact info grid */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs text-slate-600">
          {profile.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              {profile.email}
            </span>
          )}
          {profile.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              {profile.phone}
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {profile.location}
            </span>
          )}
          {profile.linkedin && (
            <span className="flex items-center gap-1.5">
              <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" />
              {profile.linkedin.replace(/^https?:\/\//, '')}
            </span>
          )}
          {profile.portfolio && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              {profile.portfolio.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {careerGoal?.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{careerGoal.summary}</p>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    {edu.degree} in {edu.branch}
                  </h3>
                  <p className="text-xs text-slate-600">{edu.college}, {edu.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-600">
                    {edu.startYear} – {edu.graduationYear}
                  </span>
                  {edu.score && (
                    <p className="text-[11px] font-bold text-blue-600">Score: {edu.score}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                    <p className="text-xs font-medium text-slate-700">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-xs text-slate-600">
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
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">
            Key Projects
          </h2>
          <div className="space-y-3.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{proj.name}</h3>
                    {proj.type && (
                      <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                        {proj.type}
                      </span>
                    )}
                  </div>
                  {proj.duration && <span className="text-xs text-slate-500">{proj.duration}</span>}
                </div>
                <p className="text-xs text-slate-700 mt-1">{proj.description}</p>
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
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
          Skills & Languages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-800">Technical Skills:</span>
            <p className="text-slate-600 mt-0.5">{skills?.technical?.join(', ') || 'None added'}</p>
          </div>
          <div>
            <span className="font-bold text-slate-800">Soft Skills:</span>
            <p className="text-slate-600 mt-0.5">{skills?.soft?.join(', ') || 'None added'}</p>
          </div>
          {skills?.languages && skills.languages.length > 0 && (
            <div className="sm:col-span-2">
              <span className="font-bold text-slate-800">Languages:</span>
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
            Certifications & Honors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {certifications && certifications.length > 0 && (
              <div>
                <span className="font-bold text-slate-800 block mb-1">Certifications:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {certifications.map((c) => (
                    <li key={c.id}>
                      <span className="font-semibold text-slate-700">{c.name}</span> — {c.issuer} ({c.date})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {achievements && achievements.length > 0 && (
              <div>
                <span className="font-bold text-slate-800 block mb-1">Achievements:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {achievements.map((a) => (
                    <li key={a.id}>
                      <span className="font-semibold text-slate-700">{a.title}</span> ({a.year})
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
