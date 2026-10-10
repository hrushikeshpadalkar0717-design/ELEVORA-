import React from 'react';
import { Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';

export const TemplateCreative = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 text-left font-sans text-xs leading-relaxed max-w-[800px] mx-auto shadow-sm flex flex-col md:flex-row">
      {/* Left Column (Creative Indigo Sidebar) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-200 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl shadow-lg mb-4">
            {profile.fullName?.slice(0, 2).toUpperCase() || 'JD'}
          </div>

          <h1 className="text-xl font-black text-white tracking-tight">{profile.fullName || 'John Doe'}</h1>
          <p className="text-xs text-indigo-400 font-semibold mt-1">
            {careerGoal?.targetRoles?.[0] || 'Design Specialist'}
          </p>

          <div className="mt-6 space-y-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{profile.location}</span>
            </div>
            {profile.portfolio && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{profile.portfolio.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>

          {/* Technical Skills Badges */}
          <div className="mt-8">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills?.technical?.map((t) => (
                <span key={t} className="bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-2 py-0.5 rounded text-[10px]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="mt-6">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
              Strengths
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills?.soft?.map((s) => (
                <span key={s} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          {skills?.languages?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
                Languages
              </h3>
              <ul className="text-[11px] text-slate-300 space-y-1">
                {skills.languages.map((l) => (
                  <li key={l.name} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="text-slate-400">{l.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>ResumeAI Verified</span>
        </div>
      </aside>

      {/* Right Column (Main Content) */}
      <main className="flex-1 p-6 sm:p-8 space-y-5">
        {/* Profile statement */}
        {careerGoal?.summary && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
              Profile
            </h2>
            <p className="text-slate-700 leading-relaxed text-xs">{careerGoal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-3">
              Experience
            </h2>
            <div className="space-y-3.5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="text-xs">{exp.role}</span>
                    <span className="text-slate-500 font-normal text-[11px]">
                      {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-indigo-600 font-medium text-[11px]">{exp.company} • {exp.location}</p>
                  {exp.responsibilities && (
                    <ul className="list-disc list-outside pl-4 mt-1 space-y-1 text-slate-600">
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
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-3">
              Featured Work
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{proj.name}</span>
                    <span className="text-slate-500 font-normal text-[10px]">{proj.duration}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{proj.description}</p>
                  {proj.technologies && (
                    <p className="text-[10px] text-indigo-600 font-medium mt-1">Tech: {proj.technologies.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between text-xs mb-1.5">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span> in {edu.branch}
                  <p className="text-slate-500 text-[11px]">{edu.college}, {edu.location}</p>
                </div>
                <div className="text-right text-slate-500 text-[11px]">
                  <span>{edu.startYear} – {edu.graduationYear}</span>
                  {edu.score && <p className="font-semibold text-indigo-600">{edu.score}</p>}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};
