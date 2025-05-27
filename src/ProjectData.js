import imgUrls from "./imgur-urls.json";

const projects = [
  {
    name: "Distributed Skier Tracking System",
    tech: [
      "Java",
      "Spring Boot",
      "AWS",
      "RabbitMQ",
      "DynamoDB",
      "Microservices"
    ],
    desc: "A high-throughput distributed system that processes over 8,000 skiing events per second with real-time monitoring dashboards and auto-scaling capabilities.",
    github: "https://github.com/tamirkifle/skier-tracking-system",
    hostedAt: null,
    coverImg: imgUrls.skier_tracking_cover || null,
    images: [
      imgUrls.skier_tracking_1 || null,
    ].filter(Boolean),
    responsibilities: "Used Java and Spring Boot to build microservices architecture with RabbitMQ messaging system. Designed DynamoDB schema with Redis caching integration and deployed full-stack solution on AWS with CloudWatch monitoring for high-availability event processing.",
    highlights: [
      "Processes 8,000+ events/second",
      "Full-stack solution with Java backend and Spring Boot APIs",
      "DynamoDB schema with Redis caching integration",
      "AWS deployment with auto-scaling and CloudWatch monitoring"
    ],
    color: "#fafdff"
  },
  {
    name: "Recession Foresight Models + Dashboard",
    tech: [
      "Python",
      "TensorFlow",
      "React",
      "Next.js",
      "Machine Learning"
    ],
    desc: "A machine learning platform that compares 11 different economic models (LSTM, ARIMAX, ensemble methods) to predict economic recessions with 96% accuracy.",
    github: "https://github.com/tamirkifle/recession-dashboard",
    hostedAt: "https://recession-dashboard.vercel.app/",
    coverImg: imgUrls.recession_model_cover || null,
    images: [
      imgUrls.recession_model_1 || null,
      imgUrls.recession_model_2 || null
    ].filter(Boolean),
    responsibilities: "Used Python and TensorFlow to develop ML pipeline comparing 11 models achieving 96% AUC. Built interactive dashboard with React and Next.js for real-time predictions, integrated frontend with backend using RESTful APIs, and deployed to Vercel for public access.",
    highlights: [
      "96% AUC with ML pipeline comparing 11 models",
      "Interactive React dashboard",
      "Real-time ML predictions and data visualization",
      "End-to-end platform with RESTful API integration"
    ],
    color: "#042022"
  },
  {
    name: "Endubis Wallet",
    tech: [
      "React",
      "Node.js",
      "Firebase/Firestore",
      "Telegram Bot API",
      "Blockchain APIs",
      "Cryptography"
    ],
    desc: "A cryptocurrency wallet application that enables users to securely manage Cardano assets through both web interface and Telegram bot integration.",
    github: "http://github.com/endubis-Solutions/",
    hostedAt: "https://t.me/EndubisWalletBot",
    coverImg: imgUrls.endubis_cover,
    images: [
      imgUrls.endubis_design,
      imgUrls.endubis_1,
      imgUrls.endubis_2
    ],
    responsibilities: "Used React.js and Node.js to build full-stack cryptocurrency wallet with end-to-end encryption and secure key management. Integrated Firebase/Firestore for real-time data synchronization, implemented Telegram Bot API for mobile access, and deployed to production serving 3,000+ active users.",
    highlights: [
      "3,000+ users managing Cardano assets",
      "Full-stack with React.js frontend and Node.js backend",
      "End-to-end encryption and secure key management",
      "Real-time features with Firebase/Firestore integration"
    ],
    otherTeamMembers: [
      "Founder and Manager - Nebiyu Sultan",
    ],
    color: "#58595b"
  },
  {
    name: "Job Scraping Pipeline",
    tech: [
      "Python",
      "MongoDB",
      "Redis",
      "Docker",
      "Scrapy",
      "ETL"
    ],
    desc: "An automated ETL pipeline that scrapes job postings from multiple sources, processes the data, and provides clean APIs for job search applications.",
    github: "https://github.com/tamirkifle/job-scraping-pipeline",
    hostedAt: null,
    coverImg: imgUrls.job_scraping_cover || null,
    images: [
      imgUrls.job_scraping_1 || null,
      imgUrls.job_scraping_2 || null
    ].filter(Boolean),
    responsibilities: "Used Python and Scrapy to build web scraping system with MongoDB for data storage and Redis for caching. Containerized microservices with Docker for scalable deployment and implemented RESTful API endpoints for frontend consumption.",
    highlights: [
      "Full-stack ETL pipeline with Scrapy backend",
      "MongoDB storage with Redis for efficient processing",
      "Containerized microservices with Docker",
      "API endpoints for frontend consumption"
    ],
    color: "#d6eaea"
  },
  {
    name: "Distributed System Performance Observatory (In Progress)",
    tech: [
      "C++",
      "React",
      "TensorFlow",
      "Grafana",
      "System Programming"
    ],
    desc: "A real-time monitoring platform that tracks distributed system performance metrics and provides ML-powered optimization recommendations.",
    github: "https://github.com/tamirkifle/perf-observatory",
    hostedAt: null,
    coverImg: imgUrls.perf_observatory_cover || null,
    images: [
      imgUrls.perf_observatory_1 || null,
      imgUrls.perf_observatory_2 || null
    ].filter(Boolean),
    responsibilities: "Using C++ to develop high-performance backend collectors for system metrics and React for visualization dashboard. Integrating TensorFlow for ML-powered performance optimization with automated recommendations currently in active development.",
    highlights: [
      "Full-stack monitoring with C++ backend collectors",
      "React visualization dashboard",
      "ML-powered optimization with TensorFlow",
      "Work in progress - actively developing"
    ],
    isWIP: true,
    color: "#fcfcfc"
  },
  {
    name: "ShopHaven E-Commerce Platform",
    tech: [
      "React",
      "TypeScript",
      "GraphQL",
      "Apollo Client"
    ],
    desc: "A modern e-commerce platform with responsive design, shopping cart functionality, and optimized GraphQL queries for seamless user experience.",
    github: "https://github.com/tamirkifle/ecommerce-shop",
    hostedAt: "https://tamirkifle.github.io/ecommerce-shop",
    coverImg: imgUrls.shophaven_cover,
    images: [
      imgUrls.shophaven_1,
      imgUrls.shophaven_2,
    ],
    responsibilities: "Used React 18 and TypeScript to build type-safe e-commerce application with complex state management. Integrated GraphQL and Apollo Client for efficient data fetching with optimized queries and caching, and deployed to GitHub Pages for public demonstration.",
    highlights: [
      "Full-stack e-commerce app with React 18",
      "TypeScript for type-safe development",
      "GraphQL/Apollo for efficient communication",
      "Responsive UI with performance optimization"
    ],
    color: "#ffffff"
  }
];

export default projects;