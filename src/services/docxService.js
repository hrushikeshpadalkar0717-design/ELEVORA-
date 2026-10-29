import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType } from 'docx';

export const generateDocxResume = async (resumeData) => {
  const { profile, careerGoal, education, experience, projects, skills, certifications, achievements } = resumeData;

  const docChildren = [
    // Header Name
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: profile.fullName || 'John Doe',
          bold: true,
          size: 36, // 18pt
          color: '1E3A8A',
        }),
      ],
    }),

    // Contact info line
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: `${profile.email || ''} | ${profile.phone || ''} | ${profile.location || ''}`,
          size: 20,
          color: '475569',
        }),
        new TextRun({
          text: profile.linkedin ? `\nLinkedIn: ${profile.linkedin}` : '',
          size: 18,
          color: '2563EB',
        }),
        new TextRun({
          text: profile.portfolio ? ` | Portfolio: ${profile.portfolio}` : '',
          size: 18,
          color: '2563EB',
        }),
      ],
    }),

    // Professional Summary Header
    new Paragraph({
      text: 'PROFESSIONAL SUMMARY',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: careerGoal?.summary || 'Seeking a challenging role to contribute engineering expertise.',
          size: 21,
        }),
      ],
    }),

    // Education Section
    new Paragraph({
      text: 'EDUCATION',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),
  ];

  // Add education entries
  education.forEach(edu => {
    docChildren.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: `${edu.degree} in ${edu.branch}`,
            bold: true,
            size: 22,
          }),
          new TextRun({
            text: ` — ${edu.college}, ${edu.location} (${edu.startYear} - ${edu.graduationYear})`,
            size: 20,
            color: '334155',
          }),
          new TextRun({
            text: edu.score ? ` [Score: ${edu.score}]` : '',
            size: 20,
            bold: true,
            color: '2563EB',
          }),
        ],
      })
    );
  });

  // Experience Section
  const validExperience = (experience || []).filter(
    (exp) => exp && exp.company !== 'Tata Technologies' && (exp.company?.trim() || exp.role?.trim())
  );
  if (validExperience.length > 0) {
    docChildren.push(
      new Paragraph({
        text: 'WORK & INTERNSHIP EXPERIENCE',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 100 },
      })
    );

    validExperience.forEach(exp => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: `${exp.role} — ${exp.company}`,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: ` (${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate}) | ${exp.location}`,
              italics: true,
              size: 20,
              color: '475569',
            }),
          ],
        })
      );

      (exp.responsibilities || []).forEach(resp => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: resp,
                size: 20,
              }),
            ],
          })
        );
      });
    });
  }

  // Projects Section
  if (projects && projects.length > 0) {
    docChildren.push(
      new Paragraph({
        text: 'KEY PROJECTS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 100 },
      })
    );

    projects.forEach(proj => {
      docChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: `${proj.name} [${proj.type}]`,
              bold: true,
              size: 22,
            }),
            new TextRun({
              text: proj.duration ? ` — ${proj.duration} | Role: ${proj.role}` : '',
              italics: true,
              size: 20,
              color: '475569',
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: proj.description,
              size: 20,
            }),
          ],
        })
      );

      if (proj.technologies && proj.technologies.length > 0) {
        docChildren.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'Technologies: ',
                bold: true,
                size: 19,
                color: '2563EB',
              }),
              new TextRun({
                text: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies,
                size: 19,
              }),
            ],
          })
        );
      }

      if (proj.github || proj.liveUrl || proj.link) {
        docChildren.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: (proj.github || proj.link) ? `GitHub: ${proj.github || proj.link}  ` : '',
                size: 18,
                color: '2563EB',
              }),
              new TextRun({
                text: proj.liveUrl ? `Live Demo: ${proj.liveUrl}` : '',
                size: 18,
                color: '2563EB',
              }),
            ],
          })
        );
      }

      (proj.keyFeatures || []).forEach(feature => {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: feature,
                size: 20,
              }),
            ],
          })
        );
      });
    });
  }

  // Technical & Soft Skills
  docChildren.push(
    new Paragraph({
      text: 'SKILLS & EXPERTISE',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'Technical Skills: ',
          bold: true,
          size: 20,
        }),
        new TextRun({
          text: skills?.technical?.join(', ') || 'N/A',
          size: 20,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'Soft Skills: ',
          bold: true,
          size: 20,
        }),
        new TextRun({
          text: skills?.soft?.join(', ') || 'N/A',
          size: 20,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'Languages: ',
          bold: true,
          size: 20,
        }),
        new TextRun({
          text: skills?.languages?.map(l => `${l.name} (${l.proficiency})`).join(', ') || 'N/A',
          size: 20,
        }),
      ],
    })
  );

  // Certifications & Achievements
  if ((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) {
    docChildren.push(
      new Paragraph({
        text: 'CERTIFICATIONS & ACHIEVEMENTS',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 100 },
      })
    );

    (certifications || []).forEach(cert => {
      docChildren.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${cert.name} — ${cert.issuer} (${cert.date})${cert.link || cert.url ? ` | Link: ${cert.link || cert.url}` : ''}`,
              size: 20,
            }),
          ],
        })
      );
    });

    (achievements || []).forEach(ach => {
      docChildren.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${ach.title} — ${ach.description} (${ach.year})`,
              size: 20,
            }),
          ],
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(profile.fullName || 'Resume').replace(/\s+/g, '_')}_ELEVORA.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
