import imgUrls from "./imgur-urls.json";

const projects = [
  {
    name: "Endubis Wallet (with Endubis Blockchain Solutions)",
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
      imgUrls.endubis_1,
      imgUrls.endubis_2
    ],
    responsibilities:
      "v1 of Endubis Wallet was built completely by me through months of iteration and research. We are proud to have amassed more than 7000 users!",
    otherTeamMembers: [
      "Founder and Manager - Nebiyu Sultan",
    ],
    color: "#58595b"
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
    desc: "A modern e-commerce platform featuring real-time product browsing, dynamic cart management, and multi-currency support.",
    github: "https://github.com/tamirkifle/ecommerce-shop",
    hostedAt: "https://tamirkifle.github.io/ecommerce-shop",
    coverImg: imgUrls.shophaven_cover,
    images: [
      imgUrls.shophaven_1,
      imgUrls.shophaven_2,
    ],
    responsibilities:
      "Built the whole frontend of the e-commerce app and connected it with a sample data GraphQL database. Used React with Typescript for the frontend and Apollo Client to write coneection to the backend.",
    color: "#ffffff"
  },
  {
    name: "Property Rental Web App",
    tech: [
      "Angular",
      "Firebase",
      "TypeScript",
      "Authentication",
      "Cloud Storage"
    ],
    desc: "A full-featured property marketplace connecting landlords and tenants with real-time listings and secure authentication.",
    github: "https://github.com/tamirkifle/property-rental",
    hostedAt: "https://property-rental-fca0f.web.app/",
    coverImg: imgUrls.property_rental_cover,
    images: [
      imgUrls.property_rental_with_iphone,
      imgUrls.property_rental_with_macbook,
    ],
    responsibilities:
      "I was the frontend engineer for this project, in a team of 4 people. I also took on the role of backend developer to get a fully-fledged working application.",
    otherTeamMembers: [
      "Business Analyst - Betelhem Kokeb",
      "UX/UI - Sahlit Girma",
      "Android App Developer - Heran Semre",
    ],
    color: "#495fa6"
  },
  {
    name: "Similar Faces: An AI Game",
    tech: [
      "Angular",
      "Azure AI",
      "Face Recognition",
      "Cloud Storage",
      "TypeScript"
    ],
    desc: "An innovative AI-powered game that challenges players to match faces while competing against Microsoft's facial recognition technology.",
    coverImg: imgUrls.similar_faces_cover,
    images: [imgUrls.similar_faces_ss_1, imgUrls.similar_faces_ss_2],
    responsibilities: "Frontend engineer and AI Engineer",
    scale: 1.53,
    color: "#e5e5e5"
  },
  {
    name: "Portfolio Page",
    tech: [
      "React",
      "CSS",
      "JavaScript",
      "Responsive Design"
    ],
    desc: "A sleek, responsive portfolio showcasing my projects and technical expertise with a modern, minimalist design.",
    github: "https://github.com/tamirkifle/my-portfolio",
    hostedAt: "https://tamirkifle.github.io",
    coverImg: imgUrls.portfolio_cover,
    images: [],
    scale: 1.52,
    color: "#37b845"
  },
  {
    name: "Number to Amharic Text Converter",
    tech: [
      "JavaScript",
      "NPM",
      "Localization"
    ],
    desc: "A utility package converting numeric values to Amharic text, bridging language and technology for Ethiopian users.",
    github: "https://github.com/tamirkifle/number-to-amharic-text",
    hostedAt: "https://www.npmjs.com/package/number-to-amharic-text",
    coverImg: imgUrls.number_to_amharic_cover,
    images: [imgUrls.number_to_amharic_ss_1],
    color: "#296be1"
  }
];

export default projects;
