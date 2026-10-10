import { Mail, Phone, MapPin, Award, Briefcase, GraduationCap } from 'lucide-react';

export const TemplateExecutive = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 text-left font-sans text-xs leading-relaxed max-w-[800px] mx-auto shadow-sm overflow-hidden">
      {/* Executive Dark Navy Banner */}
      <header className="bg-[#0b132b] text-white p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{profile.fullName || 'John Doe'}</h1>
            <p className="text-sm font-medium text-blue-300 mt-1 uppercase tracking-wider">
              {careerGoal?.targetRoles?.[0] || 'Senior Engineering Specialist'}
            </p>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1 sm:text-right border-t sm:border-t-0 border-slate-700 pt-2 sm:pt-0">
            <div className="flex items-center sm:justify-end gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* Executive Summary */}
        {careerGoal?.summary && (
          <section className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-700" />
              Executive Profile & Vision
            </h2>
            <p className="text-slate-700 leading-relaxed text-xs">{careerGoal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
              Leadership & Industry Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{exp.role}</span>
                    <span className="text-slate-500 font-normal text-[11px]">
                      {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-blue-800 font-semibold text-[11px]">{exp.company} • {exp.location}</div>
                  {exp.responsibilities && (
                    <ul className="list-disc list-outside pl-4 mt-1.5 space-y-1 text-slate-700">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
              Strategic Technical Initiatives
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="border-l-2 border-blue-600 pl-3">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{proj.name} ({proj.role || 'Lead'})</span>
                    <span className="font-normal text-slate-500 text-[11px]">{proj.duration}</span>
                  </div>
                  <p className="text-slate-700 mt-0.5">{proj.description}</p>
                  {proj.keyFeatures && (
                    <ul className="list-disc list-outside pl-4 mt-1 space-y-0.5 text-slate-600 text-[11px]">
                      {proj.keyFeatures.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
              Academic Background
            </h2>
            {education?.map((edu) => (
              <div key={edu.id} className="text-xs mb-2">
                <p className="font-bold text-slate-900">{edu.degree} — {edu.branch}</p>
                <p className="text-slate-600">{edu.college}</p>
                <p className="text-slate-400 text-[11px]">{edu.startYear} - {edu.graduationYear} {edu.score ? `• ${edu.score}` : ''}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-700" />
              Key Competencies
            </h2>
            <p className="text-slate-700 mb-1"><strong>Core Skills:</strong> {skills?.technical?.join(', ')}</p>
            <p className="text-slate-700 mb-1"><strong>Leadership:</strong> {skills?.soft?.join(', ')}</p>
            {certifications?.length > 0 && (
              <p className="text-slate-700 mt-2">
                <strong>Certified:</strong> {certifications.map(c => c.name).join(', ')}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
