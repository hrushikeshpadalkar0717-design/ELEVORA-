export const defaultInterviewQuestions = {
  'Mechanical Design Engineer': [
    {
      id: 'q-1',
      category: 'Technical',
      difficulty: 'Medium',
      question: 'What is GD&T and why is it crucial in mechanical manufacturing drawing specifications?',
      keyPoints: [
        'Explaining Geometric Dimensioning and Tolerancing symbols (True Position, Perpendicularity, Flatness)',
        'Datum reference frames and bonus tolerance concepts',
        'Cost reduction and interchangeability in mass production'
      ],
      suggestedAnswer: 'Geometric Dimensioning and Tolerancing (GD&T) is an international symbolic language used on engineering drawings to communicate the exact allowable variation in component geometry. Unlike coordinate tolerancing, GD&T defines clear datum references, offers bonus tolerance (like with MMC - Maximum Material Condition), prevents tolerance stack-up errors, and guarantees part interchangeability in assembly while reducing manufacturing scrap.',
      roleSpecific: true
    },
    {
      id: 'q-2',
      category: 'Technical',
      difficulty: 'Hard',
      question: 'How do you choose between casting, forging, and machining when designing a structural bracket?',
      keyPoints: [
        'Production volume and tooling investment economics',
        'Grain flow and mechanical strength requirements (forging superior)',
        'Geometric complexity and internal cooling/weight cavities (casting)'
      ],
      suggestedAnswer: 'The selection depends on batch size, stress concentrations, and material characteristics. For high structural strength under cyclic fatigue, forging provides optimal grain flow. For intricate shapes or internal cavities at high volumes, casting (die casting or sand casting) is cost-effective. For low batch sizes, prototypes, or tight tolerances (<0.02 mm), CNC machining is preferred to avoid high upfront tooling costs.',
      roleSpecific: true
    },
    {
      id: 'q-3',
      category: 'Behavioral',
      difficulty: 'Medium',
      question: 'Describe a situation where your initial 3D design failed simulation or validation. How did you react?',
      keyPoints: [
        'STAR method (Situation, Task, Action, Result)',
        'Objectively analyzing stress concentration contours in FEA',
        'Iterating rib design or fillet radius instead of panic redesign'
      ],
      suggestedAnswer: 'During my space-frame chassis design project, initial FEA under torsional load showed high von Mises stress exceeding yield strength at the suspension mounting nodes. Rather than redesigning the entire tubular cage, I investigated the stress contours, identified sharp sharp notches causing stress risers, introduced gusset plates, and increased fillet radii. Re-running the simulation showed a 34% stress reduction and satisfied safety factor requirements.',
      roleSpecific: false
    },
    {
      id: 'q-4',
      category: 'HR',
      difficulty: 'Easy',
      question: 'Where do you see your mechanical engineering career progressing in the next 3 to 5 years?',
      keyPoints: [
        'Mastering end-to-end product lifecycle (DFM, DFA, prototyping)',
        'Taking ownership of turnkey mechanical assemblies',
        'Earning professional credentials like CSWE or Six Sigma Green Belt'
      ],
      suggestedAnswer: 'Over the next 3-5 years, I aim to grow into a Lead Design Engineer responsible for complete product architectures from concept to fabrication. I plan to expand my DFM/DFA mastery, optimize supplier collaboration, and achieve senior CAD and structural simulation certifications.',
      roleSpecific: false
    },
    {
      id: 'q-5',
      category: 'Role-specific',
      difficulty: 'Hard',
      question: 'Explain the principles of Design for Manufacturing (DFM) and Design for Assembly (DFA).',
      keyPoints: [
        'Minimizing unique fasteners and standardized hardware',
        'Draft angles for injection molded or cast parts',
        'Mistake-proofing (Poka-yoke) alignment features'
      ],
      suggestedAnswer: 'DFM focuses on minimizing part complexity and manufacturing difficulty (e.g., maintaining uniform wall thickness, adding draft angles, avoiding deep pockets requiring special tooling). DFA focuses on simplifying the assembly process (e.g., minimizing part counts, self-locating snap-fits, unidirectional top-down assembly, and symmetry or obvious asymmetry to eliminate human error).',
      roleSpecific: true
    }
  ],
  'CAD Engineer': [
    {
      id: 'q-cad-1',
      category: 'Technical',
      difficulty: 'Medium',
      question: 'How do you handle top-down vs bottom-up assembly modeling in SolidWorks or Creo?',
      keyPoints: [
        'Skeleton models and master layout sketches in Top-Down',
        'Managing external references and preventing circular dependencies',
        'Bottom-Up advantages for standard catalog parts'
      ],
      suggestedAnswer: 'Top-down design builds parts in the context of the assembly driven by master control sketches or surfaces. It ensures associative updates when overall product dimensions change. Bottom-up builds discrete parts individually and mates them together, which is ideal for standard components like motors and fasteners. I use top-down for the core structural envelope and bottom-up for off-the-shelf items.',
      roleSpecific: true
    }
  ],
  'R&D Engineer': [
    {
      id: 'q-rd-1',
      category: 'Technical',
      difficulty: 'Hard',
      question: 'What is your process for validating an unproven mechanical concept before physical fabrication?',
      keyPoints: [
        'Analytical first-principles hand calculations',
        'Parametric FEA and computational fluid dynamics (CFD)',
        'Rapid 3D printed proof-of-concept testing'
      ],
      suggestedAnswer: 'I begin with hand calculations and free-body diagrams to verify basic orders of magnitude. Next, I build parametric CAD models and execute multi-physics FEA simulations with conservative boundary conditions. Finally, I fabricate rapid 3D printed scale prototypes to physically inspect clearances and kinematics before committing to hard tooling.',
      roleSpecific: true
    }
  ]
};
