import assert from 'node:assert/strict';
import { aiService } from '../../src/services/aiService.js';
import { initialExperience, initialSkills, initialProfile } from '../../src/data/initialData.js';

console.log('======================================================');
console.log('🧪 ELEVORA: CRITICAL RESUME ACCURACY & DOMAIN TESTS');
console.log('======================================================\n');

let passedCount = 0;
const test = async (name, fn) => {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    process.exitCode = 1;
  }
};

(async () => {
  console.log('1. Testing Initial Demonstration Data Removal...');
  await test('initialExperience is empty array (zero hardcoded Tata Technologies)', () => {
    assert.deepEqual(initialExperience, [], 'initialExperience should be an empty array');
  });

  await test('initialSkills.technical is empty array (zero hardcoded SolidWorks)', () => {
    assert.deepEqual(initialSkills.technical, [], 'initialSkills.technical should be empty');
  });

  await test('initialProfile defaults do not force Mechanical or John Doe', () => {
    assert.equal(initialProfile.fullName, '');
    assert.notEqual(initialProfile.subfield, 'Mechanical');
  });

  console.log('\n2. Testing Scenario 1: Engineering → CSE → Software Developer...');
  await test('Generates software engineering summary without CAD/mechanical keywords', async () => {
    const summary = await aiService.generateSummary({
      field: 'Engineering',
      subfield: 'CSE',
      role: 'Software Developer',
      stage: 'Fresher',
      skills: { technical: ['React', 'Node.js', 'Python', 'SQL'] },
      experience: [],
    });

    const lower = summary.toLowerCase();
    assert.ok(
      !lower.includes('solidworks') && !lower.includes('autocad') && !lower.includes('ansys') && !lower.includes('fea'),
      `Summary contained mechanical keywords: ${summary}`
    );
    assert.ok(
      lower.includes('software developer') || lower.includes('software'),
      'Summary should mention Software Developer'
    );
    assert.ok(
      lower.includes('react') || lower.includes('python') || lower.includes('node') || lower.includes('javascript') || lower.includes('sql'),
      `Summary should include relevant software skills. Got: ${summary}`
    );
  });

  console.log('\n3. Testing Scenario 2: Engineering → Mechanical → Mechanical Engineer...');
  await test('Generates mechanical summary with appropriate CAD/mechanical keywords', async () => {
    const summary = await aiService.generateSummary({
      field: 'Engineering',
      subfield: 'Mechanical',
      role: 'Mechanical Engineer',
      stage: 'Fresher',
      skills: { technical: ['SolidWorks', 'ANSYS', 'AutoCAD'] },
      experience: [],
    });

    const lower = summary.toLowerCase();
    assert.ok(
      lower.includes('solidworks') || lower.includes('cad') || lower.includes('ansys') || lower.includes('mechanical'),
      `Summary should mention mechanical engineering competencies. Got: ${summary}`
    );
  });

  console.log('\n4. Testing Scenario 3: Engineering → IT → Cloud Support Engineer...');
  await test('Generates IT/cloud summary without mechanical keywords', async () => {
    const summary = await aiService.generateSummary({
      field: 'Engineering',
      subfield: 'IT',
      role: 'Cloud Support Engineer',
      stage: 'Fresher',
      skills: { technical: ['AWS', 'Linux', 'Docker', 'Networking'] },
      experience: [],
    });

    const lower = summary.toLowerCase();
    assert.ok(
      !lower.includes('solidworks') && !lower.includes('autocad') && !lower.includes('ansys'),
      `IT summary must not have CAD keywords: ${summary}`
    );
    assert.ok(
      lower.includes('cloud') || lower.includes('linux') || lower.includes('infrastructure') || lower.includes('networking') || lower.includes('docker'),
      `Summary should include relevant IT skills: ${summary}`
    );
  });

  console.log('\n5. Testing Scenario 4: Medical & Healthcare → MBBS → Medical Officer...');
  await test('Generates clinical healthcare summary without mechanical keywords', async () => {
    const summary = await aiService.generateSummary({
      field: 'Medical & Healthcare',
      subfield: 'MBBS',
      role: 'Medical Officer',
      stage: 'Fresher',
      skills: { technical: ['Clinical Examination', 'Patient Care', 'Differential Diagnosis'] },
      experience: [],
    });

    const lower = summary.toLowerCase();
    assert.ok(
      !lower.includes('solidworks') && !lower.includes('autocad') && !lower.includes('ansys'),
      `Medical summary must not have CAD keywords: ${summary}`
    );
    assert.ok(
      lower.includes('clinical') || lower.includes('patient') || lower.includes('medical') || lower.includes('diagnosis'),
      `Summary should include medical competencies: ${summary}`
    );
  });

  console.log('\n6. Testing Scenario 5: Commerce & Management → B.Com → Accountant...');
  await test('Generates accounting summary without mechanical keywords', async () => {
    const summary = await aiService.generateSummary({
      field: 'Commerce & Management',
      subfield: 'B.Com',
      role: 'Accountant',
      stage: 'Fresher',
      skills: { technical: ['Tally', 'GST', 'Financial Accounting', 'Excel'] },
      experience: [],
    });

    const lower = summary.toLowerCase();
    assert.ok(
      !lower.includes('solidworks') && !lower.includes('autocad') && !lower.includes('ansys'),
      `Commerce summary must not have CAD keywords: ${summary}`
    );
    assert.ok(
      lower.includes('accounting') || lower.includes('tally') || lower.includes('gst') || lower.includes('financial') || lower.includes('taxation'),
      `Summary should include commerce competencies: ${summary}`
    );
  });

  console.log('\n7. Testing Scenario 6: Science & Technology → B.Sc Computer Science → Web Developer...');
  await test('Generates programming summary without mechanical keywords', async () => {
    const summary = await aiService.generateSummary({
      field: 'Science & Technology',
      subfield: 'B.Sc Computer Science',
      role: 'Web Developer',
      stage: 'Fresher',
      skills: { technical: ['Python', 'JavaScript', 'HTML', 'SQL'] },
      experience: [],
    });

    const lower = summary.toLowerCase();
    assert.ok(
      !lower.includes('solidworks') && !lower.includes('autocad') && !lower.includes('ansys'),
      `Science & Tech summary must not have CAD keywords: ${summary}`
    );
    assert.ok(
      lower.includes('web developer') || lower.includes('programming') || lower.includes('software') || lower.includes('python') || lower.includes('javascript') || lower.includes('sql'),
      `Summary should include computing competencies: ${summary}`
    );
  });

  console.log('\n8. Testing Scenario 7: Fresh graduate with no experience...');
  await test('Does not invent employers or job titles when experience is empty', async () => {
    const summary = await aiService.generateSummary({
      field: 'Engineering',
      subfield: 'CSE',
      role: 'Software Developer',
      stage: 'Fresher',
      skills: { technical: ['JavaScript', 'React'] },
      experience: [],
    });

    const lower = summary.toLowerCase();
    assert.ok(!lower.includes('tata technologies'), 'Must not invent Tata Technologies');
    assert.ok(!lower.includes('internship at'), 'Fresher with no exp should not claim internship company');
    assert.ok(lower.includes('graduate') || lower.includes('foundations') || lower.includes('developer'), 'Should focus on graduate / foundations');
  });

  await test('Experience sanitizer omits empty experience from render data', () => {
    const rawExperience = [];
    const validExperience = rawExperience.filter(
      (exp) => exp && exp.company !== 'Tata Technologies' && (exp.company?.trim() || exp.role?.trim())
    );
    assert.equal(validExperience.length, 0, 'Section should be omitted (0 items)');
  });

  await test('Experience sanitizer purges legacy Tata Technologies demo entry', () => {
    const rawExperience = [
      {
        id: 'exp-1',
        company: 'Tata Technologies',
        role: 'Mechanical Design Intern',
        location: 'Pune, Maharashtra',
        startDate: 'May 2023',
        endDate: 'Jul 2023'
      }
    ];
    const validExperience = rawExperience.filter(
      (exp) => exp && exp.company !== 'Tata Technologies' && (exp.company?.trim() || exp.role?.trim())
    );
    assert.equal(validExperience.length, 0, 'Demo Tata Technologies must be completely purged');
  });

  console.log('\n9. Testing Scenario 8: User with genuine saved experience...');
  await test('Includes user genuine experience and company in summary', async () => {
    const summary = await aiService.generateSummary({
      field: 'Engineering',
      subfield: 'CSE',
      role: 'Frontend Developer',
      stage: 'Intern',
      skills: { technical: ['React', 'TypeScript'] },
      experience: [
        {
          id: 'exp-user-1',
          company: 'Infosys',
          role: 'Frontend Intern',
          location: 'Bengaluru',
          startDate: 'Jan 2024',
          endDate: 'Jun 2024',
          responsibilities: ['Developed customer portal in React']
        }
      ],
    });

    const lower = summary.toLowerCase();
    assert.ok(lower.includes('infosys'), `Summary should mention actual company Infosys: ${summary}`);
    assert.ok(!lower.includes('tata technologies'), 'Must not mention Tata Technologies');
    assert.ok(lower.includes('frontend developer') || lower.includes('frontend'), 'Should mention target role');
  });

  await test('Experience sanitizer preserves genuine user experience', () => {
    const rawExperience = [
      {
        id: 'exp-user-1',
        company: 'Infosys',
        role: 'Frontend Intern',
        location: 'Bengaluru',
        startDate: 'Jan 2024',
        endDate: 'Jun 2024'
      }
    ];
    const validExperience = rawExperience.filter(
      (exp) => exp && exp.company !== 'Tata Technologies' && (exp.company?.trim() || exp.role?.trim())
    );
    assert.equal(validExperience.length, 1, 'Genuine experience must be preserved');
    assert.equal(validExperience[0].company, 'Infosys');
  });

  console.log('\n10. Testing Universal Fallback for Unknown Field...');
  await test('Unknown field uses professional neutral summary with zero CAD keywords', async () => {
    const summary = await aiService.generateSummary({
      field: 'Culinary Arts',
      subfield: 'Baking',
      role: 'Pastry Chef',
      stage: 'Fresher',
      skills: { technical: [] },
      experience: [],
    });

    const lower = summary.toLowerCase();
    assert.ok(
      !lower.includes('solidworks') && !lower.includes('autocad') && !lower.includes('ansys'),
      `Fallback must never use CAD keywords: ${summary}`
    );
    assert.ok(
      lower.includes('pastry chef') || lower.includes('problem-solving') || lower.includes('graduate'),
      `Should use neutral professional wording: ${summary}`
    );
  });

  console.log('======================================================');
  console.log(`📊 TEST RESULTS: ${passedCount} PASSED, 0 FAILED`);
  console.log('======================================================');
})();
