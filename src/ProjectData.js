import imgUrls from "./imgur-urls.json";

const projects = [
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
    name: "Similar Faces: A Game",
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
    name: "Number to Amharic Text Converter",
    tech: ["Javascript", "npm"],
    desc: "A javascript package that tranforms normal (arabic) numbers into their amharic text counterparts.",
    github: "https://github.com/tamirkifle/number-to-amharic-text",
    hostedAt: "https://www.npmjs.com/package/number-to-amharic-text",
    coverImg: imgUrls.number_to_amharic_cover,
    images: [imgUrls.number_to_amharic_ss_1],
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
    name: "Grid Image Gallery",
    tech: ["HTML", "CSS", "Javascript"],
    desc: "An image gallery where images are fit in different random sizes to create a beautiful random collage.",
    github:
      "https://github.com/tamirkifle/100-days-of-code/tree/master/r1-projects/11-grid-image-gallery",
    hostedAt: "",
    coverImg: imgUrls.grid_gallery_cover,
    images: [imgUrls.grid_gallery_ss_1, imgUrls.grid_gallery_ss_2],
  },
  {
    name: "Responsive Image Slider component",
    tech: ["HTML", "CSS", "Javascript"],
    desc: "A responsive infinite images slider with slider buttons",
    github:
      "https://github.com/tamirkifle/100-days-of-code/tree/master/r1-projects/15-photo-slider",
    hostedAt: "",
    coverImg: imgUrls.image_slider_cover,
    images: [imgUrls.image_slider_ss_1],
  },
];

export default projects;
