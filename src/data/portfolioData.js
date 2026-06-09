export const portfolioData = {
  personalInfo: {
    name: "Saravana Prabu",
    headline: "Electrical & Electronics Engineering Student & Full Stack Developer",
    location: "Palani, Tamil Nadu, India",
    email: "saravana112006@gmail.com",
    phone: "+91 9345834744",
    github: "https://github.com/saravana-GT",
    linkedin: "https://www.linkedin.com/in/saravana-prabu-m-r-8065a8307"
  },
  districts: [
    {
      id: "intro",
      name: "City Entrance",
      title: "Welcome to Saravana's Smart City",
      subtitle: "Click 'Next' to begin a guided 3D adventure tour of my portfolio!",
      description: "I am a third-year Electrical and Electronics Engineering (EEE) student at Dr. Mahalingam College of Engineering and Technology (MCET) with a passion for Full Stack Development. Let me guide you through my skills, projects, and background.",
      coordinates: [0, 0, 0] // Start position
    },
    {
      id: "about",
      name: "About District",
      title: "About Me",
      subtitle: "Bridging Hardware & Software",
      description: "I am a developer who loves building web applications, automation solutions, and interactive projects. Being an EEE student gives me a unique perspective on hardware-software integration. I enjoy solving real-world problems through clean, efficient code and continuous learning.",
      coordinates: [15, 0, -10]
    },
    {
      id: "education",
      name: "Academy Square",
      title: "Education & Campus",
      subtitle: "Dr. Mahalingam College of Engineering & Technology",
      description: "Pursuing a Bachelor of Engineering (B.E.) in Electrical and Electronics Engineering (EEE) at MCET (Batch 2024 - 2028). Currently in my 3rd year, gaining hands-on knowledge in electrical circuits, control systems, and microcontrollers while developing modern web architectures.",
      coordinates: [30, 0, -20]
    },
    {
      id: "skills",
      name: "Tech Power Grid",
      title: "Technical Skills",
      subtitle: "My Developer Stack & Engineering Expertise",
      description: "My EEE background combined with self-taught software engineering skills covers both programming logic and database systems.",
      skills: [
        { category: "Languages", items: ["Java", "C"] },
        { category: "Web Development", items: ["HTML", "CSS", "JavaScript"] },
        { category: "Database", items: ["MySQL"] },
        { category: "Tools & Tech", items: ["Git", "GitHub", "VS Code"] }
      ],
      coordinates: [45, 0, -10]
    },
    {
      id: "projects",
      name: "Showcase Center",
      title: "Featured Projects",
      subtitle: "Some of my favorite things I've built",
      projects: [
        {
          title: "Form Notification Automation",
          description: "Developed a web-based lead collection system that instantly triggers and sends Telegram notifications whenever a user submits a contact form. Demonstrates API integration, webhooks, and automation workflow efficiency.",
          tech: ["HTML", "CSS", "JavaScript", "Telegram Bot API"],
          liveLink: "https://saravana-gt.github.io/lead-notification-page/",
          codeLink: "https://github.com/saravana-GT/lead-notification-page"
        },
        {
          title: "Gravity Flip Game",
          description: "An interactive obstacle-avoidance game built in Unity (C#) where the player controls a block and flips gravity between top and bottom platforms to dodge oncoming hazards. Highlighting clean game loops, physics logic, and responsive UI.",
          tech: ["Unity", "C#", "Game Physics", "Interactive UI"],
          liveLink: "https://saravana-gt.github.io/GravityFlip_Unity/",
          codeLink: "https://github.com/saravana-GT/GravityFlip_Unity"
        }
      ],
      coordinates: [55, 0, 10]
    },
    {
      id: "contact",
      name: "Telecom Tower",
      title: "Get In Touch",
      subtitle: "Let's collaborate or chat!",
      description: "I am actively seeking internship and full-time job opportunities where I can apply my web development skills and engineering knowledge. Feel free to reach out via email, phone, or connect on LinkedIn and GitHub!",
      coordinates: [35, 0, 25]
    }
  ]
};
