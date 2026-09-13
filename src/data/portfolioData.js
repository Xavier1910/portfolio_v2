export const profile = {
  name: 'Xavier Akash M',
  handle: 'xavier-fsd',
  title: 'Junior Developer',
  roles: ['Backend Developer', 'Full Stack Engineer', 'Magento 2 Expert', 'Spring Boot Developer', 'REST API Architect'],
  summary: 'Building scalable, production-grade web applications with Spring Boot, Magento 2, and React. Obsessed with clean architecture, performance, and shipping features end-to-end — from DB schema to REST API to UI.',
  location: 'Chennai, India',
  email: 'akashmsm275@gmail.com',
  phone: '+91 86102 06655',
  github: 'https://github.com/Xavier1910',
  linkedin: 'https://www.linkedin.com/in/xavier-fsd/',
  whatsapp: 'https://wa.me/918610206655',
  instagram: 'https://www.instagram.com/xavier_akash_19/',
  available: true,
  stats: { experience: '1+', projects: '5+', cgpa: '8.99' },
};

export const experience = [
  {
    id: 'ewsol-2025',
    company: 'EWall Solutions Pvt. Ltd.',
    location: 'Chennai, India',
    role: 'Junior Developer',
    period: 'Apr 2025 – Present',
    hash: 'a91f3c2',
    stack: ['Magento 2', 'PHP', 'Alpine.js', 'Tailwind CSS', 'MySQL'],
    changes: [
      'Designed and deployed Magento 2 extensions (RMA, SCA, Helpdesk) implementing service contracts, repository pattern, ACL permissions, plugins, and observers following SOLID principles.',
      'Independently handled full feature lifecycle — requirement analysis, DB schema design, API integration, admin grid implementation, testing, and deployment.',
      'Improved query efficiency via indexing and EAV optimization, reducing response times by approx. 25–30% on high-traffic catalog pages.',
      'Built and consumed RESTful APIs for payment and third-party integrations; developed Alpine.js + Tailwind CSS UI components for dynamic data rendering.',
    ],
  },
];

export const skills = {
  Languages: ['Java', 'PHP', 'JavaScript', 'SQL'],
  Backend: ['Spring Boot', 'Magento 2', 'Laravel', 'REST APIs'],
  Frontend: ['React.js', 'Alpine.js', 'Tailwind CSS', 'HTML5', 'CSS3'],
  Databases: ['MySQL', 'Oracle'],
  Architecture: ['MVC', 'SOLID Principles', 'RBAC', 'JWT Auth', 'SaaS Design', 'EAV'],
  Tools: ['Git', 'GitHub', 'Postman', 'Composer', 'Linux CLI'],
};

export const projects = [
  {
    id: 'socialshe',
    slug: 'socialshe',
    name: 'SocialShe',
    subtitle: 'Instagram Clone',
    path: '~/projects/socialshe',
    description: 'Full-stack social media platform with user auth, posts, follow-graph, real-time feed, and profile management. Scalable REST APIs with JWT auth and standardized error handling.',
    stack: ['Spring Boot', 'React.js', 'MySQL', 'JWT'],
    category: 'Full Stack',
    github: 'https://github.com/Xavier1910/instagramClone',
    features: ['User authentication with JWT', 'Follow / unfollow graph', 'Real-time feed', 'Profile management', 'REST APIs with error handling'],
  },
  {
    id: 'luxelane',
    slug: 'luxelane',
    name: 'LuxeLane',
    subtitle: 'E-Commerce Platform',
    path: '~/projects/luxelane',
    description: 'SaaS-style e-commerce app with layered MVC architecture, JWT auth, RBAC, and full product/cart/order REST API lifecycle. Normalized MySQL schema with strategic indexing for high-throughput operations.',
    stack: ['Spring Boot', 'MySQL', 'JavaScript', 'Bootstrap'],
    category: 'Backend',
    github: 'https://github.com/Xavier1910/E-CommerceWebsite',
    features: ['Layered MVC architecture', 'JWT + RBAC auth', 'Full cart & order lifecycle', 'Normalized MySQL schema', 'Strategic indexing'],
  },
  {
    id: 'recipe',
    slug: 'recipe',
    name: 'Recipe Sharing',
    subtitle: 'Discovery Platform',
    path: '~/projects/recipe-sharing',
    description: 'Professional recipe discovery platform with server-side pagination, dynamic search/filter, and indexing strategies to simulate SaaS-style content performance at scale.',
    stack: ['Spring Boot', 'React.js', 'MySQL'],
    category: 'Full Stack',
    github: 'https://github.com/Xavier1910/Recipe-Sharing',
    features: ['Server-side pagination', 'Dynamic search & filter', 'Performance indexing', 'SaaS-style architecture'],
  },
  {
    id: 'whatsapp',
    slug: 'whatsapp',
    name: 'WhatsApp Clone',
    subtitle: 'Frontend UI',
    path: '~/projects/whatsapp-clone',
    description: 'Frontend-only WhatsApp clone featuring real-time chat UI, contact lists, message display, and media sharing, built with modern web technologies.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Frontend',
    github: 'https://github.com/Xavier1910',
    features: ['Real-time chat UI', 'Contact list', 'Message display', 'Media sharing layout'],
  },
  {
    id: 'ecom-fe',
    slug: 'ecom-fe',
    name: 'Frontend E-Commerce',
    subtitle: 'Responsive Storefront',
    path: '~/projects/ecommerce-frontend',
    description: 'Responsive shopping experience with product listings, cart functionality, and checkout pages — pixel-perfect frontend built with vanilla web tech.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Frontend',
    github: 'https://github.com/Xavier1910/e-commerce',
    features: ['Product listings', 'Cart functionality', 'Checkout flow', 'Responsive design'],
  },
];

export const education = [
  {
    degree: 'B.E. Electrical & Electronics Engineering',
    institution: 'V.V. College of Engineering',
    period: 'Aug 2019 – Jun 2023',
    grade: 'CGPA: 8.99 / 10',
    status: 'COMPLETED',
  },
];

export const certifications = [
  { name: 'Master in Full Stack Web Dev with Core Java', issuer: 'Training Institute' },
  { name: 'Java Fundamentals', issuer: 'IBM' },
  { name: 'SQL & Relational Databases', issuer: 'IBM' },
];

export const chatResponses = {
  'who are you': `Xavier Akash M is a Junior Developer at EWall Solutions Pvt. Ltd. in Chennai, India. He specializes in backend and full-stack development — primarily Spring Boot, Magento 2, and React.js.`,
  'who is this developer': `Xavier Akash M — Junior Developer based in Chennai. He builds production-grade web applications end-to-end: DB schema → REST API → UI. Currently working at EWall Solutions.`,
  'what does he build': `Xavier builds scalable backend systems and full-stack apps. His work includes Magento 2 extensions (RMA, Helpdesk, SCA), REST APIs with Spring Boot, and React frontends. He handles the full lifecycle — architecture, implementation, testing, deployment.`,
  'what are his skills': `Core stack:\n• Java, PHP, JavaScript\n• Spring Boot, Magento 2, Laravel\n• React.js, Alpine.js, Tailwind CSS\n• MySQL, Oracle\n• SOLID, MVC, JWT, RBAC, EAV\n• Git, Linux CLI, Postman`,
  'tell me about his experience': `EWall Solutions Pvt. Ltd. — Junior Developer (Apr 2025–Present)\n\nBuilt Magento 2 extensions using service contracts, repository pattern, and observers. Optimized query performance by ~25-30% via EAV indexing. Integrated RESTful payment APIs and built Alpine.js UI components.`,
  'show me his projects': `Projects:\n1. SocialShe — Instagram clone (Spring Boot + React + MySQL)\n2. LuxeLane — E-commerce platform (Spring Boot + RBAC + JWT)\n3. Recipe Sharing — Discovery platform (Spring Boot + React)\n4. WhatsApp Clone — Frontend UI\n5. Frontend E-Commerce — Responsive storefront`,
  'what technologies does he use': `Primary stack:\n→ Spring Boot (backend APIs)\n→ Magento 2 (e-commerce)\n→ React.js (frontend)\n→ MySQL (database)\n→ PHP, Laravel\n→ Alpine.js + Tailwind CSS`,
  'how can i contact him': `Email: akashmsm275@gmail.com\nPhone: +91 86102 06655\nLinkedIn: linkedin.com/in/xavier-fsd/\nGitHub: github.com/Xavier1910\n\nCurrently open to backend/full-stack engineering roles.`,
  'what is his education': `B.E. Electrical & Electronics Engineering\nV.V. College of Engineering — CGPA: 8.99/10 (2019–2023)\n\nCertifications:\n• Master in Full Stack Web Dev with Core Java\n• Java Fundamentals — IBM\n• SQL & Relational Databases — IBM`,
};
