import React from 'react';

export const TemplateMinimal = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 p-8 sm:p-10 text-left font-sans text-xs leading-relaxed max-w-[800px] mx-auto shadow-sm">
      {/* Minimal Header */}
      <header className="pb-6 mb-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-2xl font-light text-slate-900 tracking-tight">{profile.fullName || 'John Doe'}</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-0.5">
            {careerGoal?.targetRoles?.[0] || profile.field}
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-500 space-y-0.5">
          <div>{profile.email} • {profile.phone}</div>
          <div>{profile.location}</div>
          {profile.linkedin && <div>{profile.linkedin.replace(/^https?:\/\//, '')}</div>}
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
                  <p className="text-[11px] text-slate-400 mt-0.5">Stack: {proj.technologies.join(', ')}</p>
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
      <section className="grid grid-cols-4 gap-4">
        <div className="col-span-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Skills</div>
        <div className="col-span-3 text-slate-700 space-y-1">
          <div><span className="font-medium text-slate-900">Tech:</span> {skills?.technical?.join(' • ')}</div>
          <div><span className="font-medium text-slate-900">Soft:</span> {skills?.soft?.join(' • ')}</div>
          <div><span className="font-medium text-slate-900">Languages:</span> {skills?.languages?.map(l => `${l.name} (${l.proficiency})`).join(' • ')}</div>
        </div>
      </section>
    </div>
  );
};
