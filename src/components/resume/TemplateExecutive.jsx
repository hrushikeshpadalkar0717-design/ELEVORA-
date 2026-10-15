import { Mail, Phone, MapPin, Award, Briefcase, GraduationCap, Globe, ExternalLink } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../common/BrandIcons';
import { ensureUrl, formatDisplayUrl } from '../../utils/linkUtils';

export const TemplateExecutive = ({ data }) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = data;

  return (
    <div className="bg-white text-slate-800 text-left font-sans text-xs leading-relaxed max-w-[800px] mx-auto shadow-sm overflow-hidden">
      {/* Executive Dark Navy Banner */}
      <header className="bg-[#0b132b] text-white px-6 py-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{profile.fullName || 'John Doe'}</h1>
            <p className="text-sm font-medium text-blue-300 mt-1 uppercase tracking-wider">
              {careerGoal?.targetRoles?.[0] || 'Senior Engineering Specialist'}
            </p>
          </div>
          <div className="text-[11px] text-slate-300 space-y-1 sm:text-right border-t sm:border-t-0 border-slate-700 pt-2 sm:pt-0">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center sm:justify-end gap-1.5 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{profile.email}</span>
              </a>
            )}
            {profile.phone && (
              <div className="flex items-center sm:justify-end gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center sm:justify-end gap-2 pt-1 text-[10px]">
              {profile.linkedin && (
                <a
                  href={ensureUrl(profile.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-300 hover:text-white hover:underline"
                >
                  <LinkedinIcon className="w-3 h-3 text-blue-400" />
                  <span>{formatDisplayUrl(profile.linkedin)}</span>
                </a>
              )}
              {profile.portfolio && (
                <a
                  href={ensureUrl(profile.portfolio)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-300 hover:text-white hover:underline"
                >
                  <Globe className="w-3 h-3 text-blue-400" />
                  <span>{formatDisplayUrl(profile.portfolio)}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-4 space-y-3.5">
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
                  {(proj.github || proj.liveUrl || proj.link) && (
                    <div className="flex items-center gap-3 mt-1.5 text-[11px]">
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
              <div className="mt-2 text-slate-700">
                <strong>Certified:</strong>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {certifications.map(c => (
                    <li key={c.id}>
                      <span>{c.name}</span>
                      {(c.link || c.url) && (
                        <a
                          href={ensureUrl(c.link || c.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1.5 text-blue-700 hover:underline font-semibold inline-flex items-center gap-0.5"
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
          </div>
        </section>
      </div>
    </div>
  );
};
