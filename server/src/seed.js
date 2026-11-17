require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const AlumniProfile = require('./models/AlumniProfile');
const JobPosting = require('./models/JobPosting');

const data = [
  ['Priya Raman', 'alumni1@demo.com', 2019, 'CSE', 'Google', 'Software Engineer', ['React', 'Node.js', 'System Design']],
  ['Arjun Kumar', 'alumni2@demo.com', 2020, 'IT', 'Microsoft', 'SDE II', ['Azure', 'C#', 'MongoDB']],
  ['Meera Nair', 'alumni3@demo.com', 2018, 'ECE', 'Amazon', 'Data Engineer', ['Python', 'AWS', 'Spark']],
  ['Karthik S', 'alumni4@demo.com', 2021, 'CSE', 'Zoho', 'Backend Developer', ['Java', 'SQL']],
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), AlumniProfile.deleteMany({}), JobPosting.deleteMany({})]);
  await User.create({ name: 'Demo Student', email: 'student@demo.com', password: 'password123', role: 'student' });
  await User.create({ name: 'Demo Admin', email: 'admin@demo.com', password: 'password123', role: 'admin' });
  for (const [name, email, graduationYear, department, currentCompany, jobTitle, skills] of data) {
    const u = await User.create({ name, email, password: 'password123', role: 'alumni' });
    await AlumniProfile.create({ user: u._id, fullName: name, graduationYear, department, currentCompany, jobTitle, skills,
      linkedinUrl: 'https://linkedin.com', bio: `${jobTitle} at ${currentCompany}. Happy to help juniors.` });
    await JobPosting.create({ postedBy: u._id, title: `${jobTitle} Intern`, company: currentCompany,
      description: 'Open to final-year students. Referral available.', applyLink: 'https://example.com/apply' });
  }
  console.log('Seeded. Login: student@demo.com / alumni1@demo.com, password: password123');
  process.exit();
})();
