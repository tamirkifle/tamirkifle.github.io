import imgUrls from "./imgur-urls.json";

const categories = {
  DISTRIBUTED: "Distributed Systems",
  AI_ML: "AI/ML Platforms",
  BLOCKCHAIN: "Blockchain",
  DATA_ENG: "Data Engineering",
  FULLSTACK: "Full-Stack Apps"
};

const projects = [
  // DISTRIBUTED SYSTEMS
  {
    id: "kv-database",
    name: "Distributed KV Database",
    category: categories.DISTRIBUTED,
    tech: [
      "Java",
      "Spring Boot",
      "Docker",
      "AWS EC2",
      "Consensus Algorithms"
    ],
    desc: "A distributed key-value store supporting Leader-Follower and Leaderless modes with configurable W/R quorums and 5-node replication.",
    github: "https://github.com/tamirkifle/distributed-kv-database",
    hostedAt: null,
    coverImg: null, // Placeholder
    images: [],
    responsibilities: "Implemented distributed consensus algorithms with configurable quorum-based replication. Built Leader-Follower and Leaderless architectures supporting 5-node clusters. Deployed on AWS EC2 with Docker orchestration for high availability and fault tolerance.",
    highlights: [
      "Configurable W/R quorums for consistency",
      "Leader-Follower & Leaderless modes",
      "5-node replication with fault tolerance",
      "Docker containerization on AWS EC2"
    ],
    featured: true,
    color: "#1a1f2e"
  },
  {
    id: "skier-tracking",
    name: "Distributed Ski Tracker",
    category: categories.DISTRIBUTED,
    tech: [
      "Java",
      "Spring Boot",
      "AWS",
      "RabbitMQ",
      "DynamoDB",
      "Microservices"
    ],
    desc: "Cloud-native microservices handling 8,000+ skiing events per second with real-time monitoring and auto-scaling capabilities.",
    github: "https://github.com/tamirkifle/skier-tracking-system",
    hostedAt: null,
    coverImg: imgUrls.skier_tracking_cover || null,
    images: [
      imgUrls.skier_tracking_1 || null,
    ].filter(Boolean),
    responsibilities: "Built microservices architecture with RabbitMQ for async message processing. Designed DynamoDB schema with Redis caching and implemented AWS auto-scaling for handling peak loads of 8K+ events/second.",
    highlights: [
      "Processes 8,000+ events/second",
      "Async queue processing with RabbitMQ",
      "Distributed caching with Redis",
      "AWS auto-scaling for peak loads"
    ],
    featured: true,
    color: "#fafdff"
  },
  
  // AI/ML PLATFORMS
  {
    id: "interview-ace",
    name: "InterviewAce",
    category: categories.AI_ML,
    tech: [
      "React",
      "GraphQL",
      "Neo4j",
      "Docker",
      "OpenAI Whisper",
      "LLM Integration"
    ],
    desc: "Video interview practice platform with LLM integration and graph-based semantic modeling for personalized feedback.",
    github: "https://github.com/tamirkifle/interview-ace",
    hostedAt: null,
    coverImg: null, // Placeholder
    images: [],
    responsibilities: "Integrated OpenAI Whisper for speech-to-text transcription with LLM-powered feedback. Built Neo4j graph database for semantic relationship modeling between interview topics. Containerized with Docker for scalable deployment.",
    highlights: [
      "Real-time video transcription with Whisper",
      "LLM-powered interview feedback",
      "Neo4j graph-based knowledge modeling",
      "Distributed storage architecture"
    ],
    featured: true,
    color: "#0e2a47"
  },
  {
    id: "recession-model",
    name: "Recession Prediction Platform",
    category: categories.AI_ML,
    tech: [
      "Python",
      "TensorFlow",
      "React",
      "Next.js",
      "Machine Learning"
    ],
    desc: "ML platform comparing 11 economic models (LSTM, ARIMAX, ensemble) to predict recessions with 96% accuracy.",
    github: "https://github.com/tamirkifle/recession-dashboard",
    hostedAt: "https://recession-dashboard.vercel.app/",
    coverImg: imgUrls.recession_model_cover || null,
    images: [
      imgUrls.recession_model_1 || null,
      imgUrls.recession_model_2 || null
    ].filter(Boolean),
    responsibilities: "Developed ML pipeline comparing 11 models achieving 96% AUC. Built interactive dashboard with React/Next.js for real-time predictions and data visualization.",
    highlights: [
      "96% AUC prediction accuracy",
      "11 model comparison pipeline",
      "Real-time economic indicators",
      "Interactive data visualizations"
    ],
    featured: false,
    color: "#042022"
  },
  
  // BLOCKCHAIN
  {
    id: "endubis-wallet",
    name: "Endubis Wallet",
    category: categories.BLOCKCHAIN,
    tech: [
      "React",
      "Node.js",
      "Firebase/Firestore",
      "Telegram Bot API",
      "Blockchain APIs",
      "Cryptography"
    ],
    desc: "Cryptocurrency wallet enabling secure Cardano asset management through web and Telegram bot interfaces.",
    github: "http://github.com/endubis-Solutions/",
    hostedAt: "https://t.me/EndubisWalletBot",
    coverImg: imgUrls.endubis_cover,
    images: [
      imgUrls.endubis_design,
      imgUrls.endubis_1,
      imgUrls.endubis_2
    ],
    responsibilities: "Built full-stack crypto wallet with end-to-end encryption and secure key management. Integrated Telegram Bot API and Firebase for real-time sync, serving 3,000+ active users.",
    highlights: [
      "3,000+ active users",
      "End-to-end encryption",
      "Multi-platform access (Web & Telegram)",
      "Real-time Firebase sync"
    ],
    featured: false,
    otherTeamMembers: [
      "Founder and Manager - Nebiyu Sultan",
    ],
    color: "#58595b"
  },
  {
    id: "defi-yield",
    name: "DeFi Yield Optimizer",
    category: categories.BLOCKCHAIN,
    tech: [
      "Solidity",
      "Web3.js",
      "React",
      "Hardhat",
      "TheGraph"
    ],
    desc: "Automated yield farming platform optimizing returns across multiple DeFi protocols with smart rebalancing.",
    github: null, // Placeholder
    hostedAt: null,
    coverImg: null,
    images: [],
    responsibilities: "Smart contract development for automated yield optimization. Integration with multiple DeFi protocols for optimal APY hunting.",
    highlights: [
      "Automated yield rebalancing",
      "Multi-protocol integration",
      "Gas-optimized smart contracts",
      "Real-time APY tracking"
    ],
    featured: false,
    isPlaceholder: true,
    color: "#2a1f3d"
  },
  
  // DATA ENGINEERING
  {
    id: "job-scraping",
    name: "Job Scraping Pipeline",
    category: categories.DATA_ENG,
    tech: [
      "Python",
      "Docker",
      "Kubernetes",
      "MongoDB",
      "Scrapy",
      "Redis"
    ],
    desc: "Containerized ETL pipeline for automated large-scale job data collection and processing.",
    github: "https://github.com/tamirkifle/job-scraping-pipeline",
    hostedAt: null,
    coverImg: imgUrls.job_scraping_cover || null,
    images: [
      imgUrls.job_scraping_1 || null
    ].filter(Boolean),
    responsibilities: "Built containerized Python ETL pipeline with Scrapy for web scraping. Implemented MongoDB for data storage with Redis caching, orchestrated with Kubernetes for scalability.",
    highlights: [
      "Automated ETL pipeline",
      "Kubernetes orchestration",
      "MongoDB & Redis integration",
      "Scalable containerized architecture"
    ],
    featured: false,
    color: "#d6eaea"
  },
  {
    id: "streaming-analytics",
    name: "Real-Time Stream Analytics",
    category: categories.DATA_ENG,
    tech: [
      "Apache Kafka",
      "Apache Flink",
      "Elasticsearch",
      "Grafana",
      "Docker"
    ],
    desc: "Stream processing platform for real-time analytics with sub-second latency on high-volume data streams.",
    github: null, // Placeholder
    hostedAt: null,
    coverImg: null,
    images: [],
    responsibilities: "Built real-time stream processing pipeline with Kafka and Flink for low-latency analytics on high-volume data streams.",
    highlights: [
      "Sub-second processing latency",
      "Kafka stream ingestion",
      "Flink stateful computations",
      "Real-time Grafana dashboards"
    ],
    featured: false,
    isPlaceholder: true,
    color: "#1e3a5f"
  },
  
  // FULL-STACK APPLICATIONS
  {
    id: "shophaven",
    name: "ShopHaven E-Commerce",
    category: categories.FULLSTACK,
    tech: [
      "React",
      "TypeScript",
      "GraphQL",
      "Apollo Client"
    ],
    desc: "Modern e-commerce platform with responsive design and optimized GraphQL queries for seamless UX.",
    github: "https://github.com/tamirkifle/ecommerce-shop",
    hostedAt: "https://tamirkifle.github.io/ecommerce-shop",
    coverImg: imgUrls.shophaven_cover,
    images: [
      imgUrls.shophaven_1,
      imgUrls.shophaven_2,
    ],
    responsibilities: "Built type-safe e-commerce app with React 18 and TypeScript. Integrated GraphQL/Apollo for efficient data fetching with optimized caching.",
    highlights: [
      "Type-safe with TypeScript",
      "GraphQL/Apollo integration",
      "Responsive design",
      "Performance optimized"
    ],
    featured: false,
    color: "#ffffff"
  },
  {
    id: "perf-observatory",
    name: "Performance Observatory",
    category: categories.FULLSTACK,
    tech: [
      "C++",
      "React",
      "TensorFlow",
      "Grafana",
      "System Programming"
    ],
    desc: "Real-time monitoring platform tracking distributed system metrics with ML-powered optimization recommendations.",
    github: "https://github.com/tamirkifle/perf-observatory",
    hostedAt: null,
    coverImg: imgUrls.perf_observatory_cover || null,
    images: [],
    responsibilities: "Developing high-performance C++ backend for system metrics collection. Building React dashboard with TensorFlow integration for ML-powered performance insights.",
    highlights: [
      "High-performance C++ backend",
      "Real-time metrics visualization",
      "ML-powered optimization",
      "Work in progress"
    ],
    featured: false,
    isWIP: true,
    color: "#fcfcfc"
  }
];

export { projects, categories };
export default projects;