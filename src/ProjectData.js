import imgUrls from "./imgur-urls.json";

const projects = [
  {
    name: "Endubis Wallet (with Endubis Blockchain Solutions)",
    tech: [
      "React",
      "Telegraf Framework for Telegram Bots",
      "Node.js",
      "Cloud Firestore",
      "Javascript",
      "Blockchain APIs (Blockfrost, AdaLite)",
      "A lot of cryptography to find our way around in blockchain land :)",
      "AWS for hosting",
    ],
    desc: "A Cardano wallet running as a telegram bot",
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
    ]
  },
  {
    name: "Shophaven Web Shop",
    tech: [
      "React",
      "TypeScript",
      "GraphQL",
      "Apollo Client",
      "Local Storage API"
    ],
    desc: "An e-commerce web shop with product browsing, cart management and currency switching features.",
    github: "https://github.com/tamirkifle/ecommerce-shop",
    hostedAt: "https://tamirkifle.github.io/ecommerce-shop",
    coverImg: imgUrls.shophaven_cover,
    images: [
      imgUrls.shophaven_1,
      imgUrls.shophaven_2,
    ],
    responsibilities:
      "Built the whole frontend of the e-commerce app and connected it with a sample data GraphQL database. Used React with Typescript for the frontend and Apollo Client to write coneection to the backend."
  },
  {
    name: "Property Rental Web App",
    tech: [
      "Angular",
      "Firebase Authentication",
      "Firebase Storage",
      "Firestore Database",
      "Firebase Hosting",
      "Typescript",
    ],
    desc: "Property Rental is a hub for people looking to rent out or to lease out properties. It connects prospective tenants to people with property for rent in their area.",
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
  },
  {
    name: "Similar Faces: An AI Game",
    tech: [
      "Angular",
      "Microsoft Azure AI",
      "Face API",
      "Azure Blob Storage",
      "Typescript",
    ],
    desc: "Similar Faces: A Game was a project built during a AI bootcamp hosted by Microsoft and Gebeya Inc. A simple game where the goal is to guess the most similar face out of a list of faces comparing your instincts to Microsoft's Artificial Intelligence.",
    coverImg: imgUrls.similar_faces_cover,
    images: [imgUrls.similar_faces_ss_1, imgUrls.similar_faces_ss_2],
    responsibilities: "Frontend engineer and AI Engineer",
  },
  {
    name: "Portfolio Page",
    tech: ["React", "HTML", "CSS", "Javascript"],
    desc: "This portfolio page showcasing me and my projects and is home for my blog.",
    github: "https://github.com/tamirkifle/my-portfolio",
    hostedAt: "",
    coverImg: imgUrls.portfolio_cover,
    images: [],
  },
  {
    name: "Number to Amharic Text Converter",
    tech: ["Javascript", "npm"],
    desc: "A javascript package that tranforms normal (arabic) numbers into their amharic text counterparts.",
    github: "https://github.com/tamirkifle/number-to-amharic-text",
    hostedAt: "https://www.npmjs.com/package/number-to-amharic-text",
    coverImg: imgUrls.number_to_amharic_cover,
    images: [imgUrls.number_to_amharic_ss_1],
  }

];

export default projects;
