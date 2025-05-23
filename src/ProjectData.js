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
    desc: "A fault-tolerant microservices system processing 8,000+ events/second with 99.99% reliability, featuring zero message loss and sub-20ms query performance.",
    github: "https://github.com/tamirkifle/skier-tracking-system",
    hostedAt: null,
    coverImg: imgUrls.skier_tracking_cover || null,
    images: [
      imgUrls.skier_tracking_1 || null,
    ].filter(Boolean),
    responsibilities: "Architected the entire distributed system from scratch, implementing message queuing with RabbitMQ, designing optimized DynamoDB schemas, and deploying auto-scaling infrastructure on AWS EC2.",
    highlights: [
      "Processes 8,000+ events/second with 99.99% reliability",
      "Zero message loss with dead letter queues and exponential backoff",
      "Sub-20ms query performance with optimized DynamoDB schema",
      "Auto-scaling AWS deployment with comprehensive monitoring"
    ],
    color: "#FF9500"
  },
  {
    name: "Recession Foresight Models + Dashboard",
    tech: [
      "Python",
      "TensorFlow",
      "scikit-learn",
      "pandas",
      "Machine Learning",
      "Data Science"
    ],
    desc: "A high-precision economic prediction system with 11 competing models achieving 96% AUC on near-term forecasts, featuring an interactive dashboard for real-time risk assessment.",
    github: "https://github.com/tamirkifle/recession-dashboard",
    hostedAt: "https://recession-dashboard.vercel.app/",
    coverImg: imgUrls.recession_model_cover || null,
    images: [
      imgUrls.recession_model_1 || null,
      imgUrls.recession_model_2 || null
    ].filter(Boolean),
    responsibilities: "Built the entire prediction system including model development, feature engineering, and interactive dashboard. Enhanced model performance by 31% through advanced feature selection from 14 macroeconomic indicators.",
    highlights: [
      "96% AUC on near-term, 85% on long-term forecasts",
      "31% performance improvement through feature engineering",
      "Interactive dashboard for real-time risk assessment",
      "11 competing models including neural networks and ensemble methods"
    ],
    color: "#007AFF"
  },
  {
    name: "Endubis Wallet",
    tech: [
      "React",
      "Node.js",
      "Telegram Bot API",
      "Blockchain APIs",
      "Cryptography",
      "AWS",
      "Firestore"
    ],
    desc: "A revolutionary Telegram-based Cardano wallet serving 7,000+ users with seamless blockchain transactions.",
    github: "http://github.com/endubis-Solutions/",
    hostedAt: "https://t.me/EndubisWalletBot",
    coverImg: imgUrls.endubis_cover,
    images: [
      imgUrls.endubis_design,
      imgUrls.endubis_1,
      imgUrls.endubis_2
    ],
    responsibilities: "v1 of Endubis Wallet was built completely by me through months of iteration and research. We are proud to have amassed more than 7000 users!",
    highlights: [
      "7,000+ active users",
      "Seamless Cardano blockchain integration",
      "Secure Telegram-based interface",
      "Built entirely from scratch as sole developer"
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
    desc: "A scalable ETL pipeline with two-phase deduplication achieving near-perfect accuracy and 65% faster data processing through specialized indexing and containerized microservices.",
    github: "https://github.com/tamirkifle/job-scraping-pipeline",
    hostedAt: null,
    coverImg: imgUrls.job_scraping_cover || null,
    images: [
      imgUrls.job_scraping_1 || null,
      imgUrls.job_scraping_2 || null
    ].filter(Boolean),
    responsibilities: "Designed and implemented the entire ETL pipeline architecture, including scraping logic, deduplication algorithms, database optimization, and containerization strategy.",
    highlights: [
      "65% faster data processing with optimized architecture",
      "Near-perfect accuracy with two-phase deduplication",
      "Containerized microservices for seamless deployment",
      "Fault-tolerant design with Redis caching"
    ],
    color: "#34C759"
  },
  {
    name: "Distributed System Performance Observatory (In Progress)",
    tech: [
      "C++",
      "Linux Kernel APIs",
      "Prometheus",
      "TensorFlow",
      "System Programming"
    ],
    desc: "A low-latency metrics collector with <1% CPU overhead monitoring 200+ system metrics, featuring ML-powered automatic optimization reducing system latency by 20%+.",
    github: "https://github.com/tamirkifle/perf-observatory",
    hostedAt: null,
    coverImg: imgUrls.perf_observatory_cover || null,
    images: [
      imgUrls.perf_observatory_1 || null,
      imgUrls.perf_observatory_2 || null
    ].filter(Boolean),
    responsibilities: "Developing the entire system including low-level C++ metrics collection, ML optimization engine, and distributed monitoring infrastructure.",
    highlights: [
      "<1% CPU overhead while monitoring 200+ metrics",
      "ML-powered automatic parameter tuning",
      "20%+ latency reduction through optimization",
      "Work in progress - actively developing"
    ],
    isWIP: true,
    color: "#FF3B30"
  },
  {
    name: "Shophaven Web Shop",
    tech: [
      "React",
      "TypeScript",
      "GraphQL",
      "Apollo",
      "Local Storage"
    ],
    desc: "A modern e-commerce platform featuring real-time product browsing, dynamic cart management, and multi-currency support with 65% API call reduction.",
    github: "https://github.com/tamirkifle/ecommerce-shop",
    hostedAt: "https://tamirkifle.github.io/ecommerce-shop",
    coverImg: imgUrls.shophaven_cover,
    images: [
      imgUrls.shophaven_1,
      imgUrls.shophaven_2,
    ],
    responsibilities: "Built the whole frontend of the e-commerce app and connected it with a sample data GraphQL database. Used React with Typescript for the frontend and Apollo Client to write connection to the backend.",
    highlights: [
      "65% reduction in API calls with GraphQL",
      "3.2x improvement in page load performance",
      "Sub-16ms render times for complex configurations",
      "40% improvement in code maintainability"
    ],
    color: "#ffffff"
  }
];

export default projects;
