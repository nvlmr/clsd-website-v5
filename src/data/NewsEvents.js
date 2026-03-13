// Updated NewsEvents.js with correct enum values ('news' or 'event')
import image1 from "../assets/images/News and Events/event1.jpg";
import image2 from "../assets/images/News and Events/event2.jpg";
import image3 from "../assets/images/News and Events/event3.jpg";
import image4 from "../assets/images/News and Events/event4.jpg";
import image5 from "../assets/images/News and Events/event5.jpg";
import image6 from "../assets/images/News and Events/event6.jpg";
import image7 from "../assets/images/News and Events/event7.jpg";
import image8 from "../assets/images/News and Events/event8.jpg";
import image9 from "../assets/images/News and Events/event9.jpg";

const NewsEvents = [
  {
    id: 1,
    title: "Training Workshop on Water Quality Monitoring",
    content: "A comprehensive 5-day hands-on training on modern water quality monitoring techniques, including sampling methods, laboratory analysis, and data interpretation for lake ecosystem assessment. Participants will learn proper sampling techniques, use of modern monitoring equipment, laboratory analysis methods, and statistical tools for data interpretation. The workshop combines theoretical sessions with practical field exercises at Laguna de Bay. Experts from CLSD and partner institutions will serve as resource speakers. Participants will receive certificates of completion and training materials.",
    excerpt: "A 5-day hands-on training on modern water quality monitoring techniques for lake ecosystem assessment.",
    type: "news", // Changed from "Training and workshop" to "event"
    category: "Training",
    featured_image: image1,
    gallery: [image1, image2, image3],
    attachments: [
      { name: "Training Manual.pdf", url: "/attachments/training-manual.pdf" },
      { name: "Workshop Schedule.pdf", url: "/attachments/workshop-schedule.pdf" }
    ],
    event_start_date: "2025-01-20",
    event_end_date: "2025-01-24",
    event_location: "Los Baños, Laguna",
    event_registration_link: "https://forms.google.com/water-quality-training",
    views: 245,
    published: true,
    featured: true,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    published_at: "2024-01-15"
  },
  {
    id: 2,
    title: "CLSD Participation: International Lake Conservation Conference",
    content: "The Center for Lake Sustainable Development (CLSD) will present research findings on lake biodiversity conservation at the 3rd International Conference on Lake Conservation. Our researchers will share insights on sustainable lake management practices and climate change adaptation strategies for freshwater ecosystems. The conference brings together scientists, policymakers, and practitioners from across the globe to discuss pressing issues in lake conservation. CLSD will present three papers on the status of Philippine lakes and community-based conservation approaches.",
    excerpt: "CLSD researchers present findings on lake biodiversity conservation at international conference.",
    type: "news", // Changed from "CLSD participation on R&D" to "event"
    category: "Conference Participation",
    featured_image: image2,
    gallery: [image2, image4, image6],
    attachments: [
      { name: "Conference Program.pdf", url: "/attachments/conference-program.pdf" },
      { name: "Presentation Abstract.pdf", url: "/attachments/presentation-abstract.pdf" }
    ],
    event_start_date: "2024-11-15",
    event_end_date: "2024-11-17",
    event_location: "Manila, Philippines",
    event_registration_link: null,
    views: 189,
    published: true,
    featured: false,
    created_at: "2024-10-01",
    updated_at: "2024-10-01",
    published_at: "2024-10-01"
  },
  {
    id: 3,
    title: "Call for Proposals: Lake Research Grant 2025",
    content: "We are accepting research proposals focused on Philippine lakes for the 2025 Research Grant Program. Priority areas include water quality assessment, biodiversity conservation, sustainable fisheries, and climate change impacts. Selected projects will receive funding up to ₱500,000 for a one-year implementation period. Eligible applicants include researchers from Philippine universities and research institutions, graduate students, and civil society organizations. Proposals will be evaluated based on scientific merit, relevance to lake conservation, and potential for community impact.",
    excerpt: "Apply for research funding up to ₱500,000 for projects focused on Philippine lakes.",
    type: "event", // Changed from "Opportunities" to "event"
    category: "Grant Opportunity",
    featured_image: image3,
    gallery: [image3, image5, image7],
    attachments: [
      { name: "Grant Guidelines.pdf", url: "/attachments/grant-guidelines.pdf" },
      { name: "Application Form.docx", url: "/attachments/application-form.docx" }
    ],
    event_start_date: "2024-12-15",
    event_end_date: "2024-12-15",
    event_location: "Nationwide",
    event_registration_link: "https://forms.google.com/research-grant-application",
    views: 567,
    published: true,
    featured: true,
    created_at: "2024-11-01",
    updated_at: "2024-11-01",
    published_at: "2024-11-01"
  },
  {
    id: 4,
    title: "Newly Approved: Lake Biodiversity Assessment Project",
    content: "A comprehensive biodiversity assessment project has been approved for implementation across three major Philippine lakes: Laguna de Bay, Taal Lake, and Lanao Lake. The project will document aquatic species, identify threatened habitats, and develop conservation strategies. Implementation will begin in January 2025 in collaboration with local universities and LGUs. The three-year project includes regular monitoring, capacity building for local researchers, and community engagement activities. Expected outputs include a comprehensive database of lake biodiversity, conservation action plans, and scientific publications.",
    excerpt: "Three-year biodiversity assessment project approved for major Philippine lakes.",
    type: "event", // Changed from "Newly Approved R&D Projects" to "event"
    category: "Research Project",
    featured_image: image4,
    gallery: [image4, image8, image1],
    attachments: [
      { name: "Project Brief.pdf", url: "/attachments/project-brief.pdf" },
      { name: "Implementation Plan.pdf", url: "/attachments/implementation-plan.pdf" }
    ],
    event_start_date: "2025-01-01",
    event_end_date: "2027-12-31",
    event_location: "Laguna de Bay, Taal Lake, Lanao Lake",
    event_registration_link: null,
    views: 312,
    published: true,
    featured: true,
    created_at: "2024-12-01",
    updated_at: "2024-12-01",
    published_at: "2024-12-01"
  },
  {
    id: 5,
    title: "Training Workshop: Geographic Information Systems for Lake Management",
    content: "This workshop introduces participants to GIS applications in lake management. Topics include mapping lake boundaries, analyzing land use changes in watersheds, and creating vulnerability maps. No prior GIS experience required. Limited to 20 participants. The workshop combines lectures with hands-on exercises using QGIS, an open-source GIS software. Participants will learn to create maps, analyze spatial data, and apply GIS techniques to lake management challenges. By the end of the workshop, participants will be able to produce professional-quality maps and conduct basic spatial analysis.",
    excerpt: "Learn GIS applications for lake management in this 5-day hands-on workshop.",
    type: "event", // Changed from "Training and workshop" to "event"
    category: "Training",
    featured_image: image5,
    gallery: [image5, image2, image9],
    attachments: [
      { name: "GIS Workshop Syllabus.pdf", url: "/attachments/gis-syllabus.pdf" },
      { name: "QGIS Tutorial.pdf", url: "/attachments/qgis-tutorial.pdf" }
    ],
    event_start_date: "2025-02-10",
    event_end_date: "2025-02-14",
    event_location: "University of the Philippines, Diliman",
    event_registration_link: "https://forms.google.com/gis-workshop-registration",
    views: 178,
    published: true,
    featured: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    published_at: "2025-01-01"
  },
  {
    id: 6,
    title: "CLSD Researchers Present at National Symposium",
    content: "Three CLSD researchers will present their studies on lake water quality, aquatic biodiversity, and community-based resource management at the Philippine National Research Symposium. The presentations highlight recent findings from ongoing research projects in various Philippine lakes. The symposium provides a platform for researchers to share their work and receive feedback from peers. CLSD's presentations will cover water quality trends in Laguna de Bay, fish diversity in Taal Lake, and community-based resource management in Lake Lanao.",
    excerpt: "CLSD researchers share findings at the Philippine National Research Symposium.",
    type: "event", // Changed from "CLSD participation on R&D" to "event"
    category: "Conference Participation",
    featured_image: image6,
    gallery: [image6, image3, image8],
    attachments: [
      { name: "Symposium Program.pdf", url: "/attachments/symposium-program.pdf" },
      { name: "Presentation Slides.pdf", url: "/attachments/presentation-slides.pdf" }
    ],
    event_start_date: "2025-03-05",
    event_end_date: "2025-03-06",
    event_location: "Cebu City",
    event_registration_link: null,
    views: 145,
    published: true,
    featured: false,
    created_at: "2025-02-01",
    updated_at: "2025-02-01",
    published_at: "2025-02-01"
  },
  {
    id: 7,
    title: "Scholarship Opportunity: MS in Limnology",
    content: "CLSD is offering two full scholarships for Master of Science in Limnology at UPLB. The scholarship covers tuition, monthly stipend, and research support. Applicants must have a BS degree in biology, environmental science, or related fields. Priority will be given to applicants from lake communities. The program includes coursework in limnology, aquatic ecology, and research methods, followed by a thesis research project focused on Philippine lakes. Scholars will be mentored by CLSD researchers and have access to CLSD facilities.",
    excerpt: "Full scholarships available for MS in Limnology at UPLB. Priority for applicants from lake communities.",
    type: "event", // Changed from "Opportunities" to "event"
    category: "Scholarship",
    featured_image: image7,
    gallery: [image7, image4, image2],
    attachments: [
      { name: "Scholarship Guidelines.pdf", url: "/attachments/scholarship-guidelines.pdf" },
      { name: "Application Form.docx", url: "/attachments/scholarship-application.docx" }
    ],
    event_start_date: "2025-04-30",
    event_end_date: "2025-04-30",
    event_location: "University of the Philippines Los Baños",
    event_registration_link: "https://forms.google.com/scholarship-application",
    views: 423,
    published: true,
    featured: true,
    created_at: "2025-03-01",
    updated_at: "2025-03-01",
    published_at: "2025-03-01"
  },
  {
    id: 8,
    title: "Newly Approved: Community-Based Lake Restoration Initiative",
    content: "A community-based restoration project for the Seven Lakes of San Pablo has been approved. The project will work with local communities to implement water quality improvement measures, native vegetation restoration, and sustainable livelihood development. Project duration: 3 years. The initiative adopts a participatory approach, involving community members in planning, implementation, and monitoring. Activities include water quality monitoring, bamboo planting along buffer zones, and training on sustainable aquaculture. The project aims to serve as a model for community-based lake restoration in the Philippines.",
    excerpt: "Community-based restoration project approved for the Seven Lakes of San Pablo.",
    type: "event", // Changed from "Newly Approved R&D Projects" to "event"
    category: "Research Project",
    featured_image: image8,
    gallery: [image8, image5, image9],
    attachments: [
      { name: "Project Proposal.pdf", url: "/attachments/restoration-proposal.pdf" },
      { name: "Community Engagement Plan.pdf", url: "/attachments/community-plan.pdf" }
    ],
    event_start_date: "2025-01-01",
    event_end_date: "2027-12-31",
    event_location: "Seven Lakes of San Pablo",
    event_registration_link: null,
    views: 267,
    published: true,
    featured: true,
    created_at: "2024-12-15",
    updated_at: "2024-12-15",
    published_at: "2024-12-15"
  },
  {
    id: 9,
    title: "Workshop: Scientific Writing for Publication",
    content: "Learn how to write and publish your research in international journals. This workshop covers manuscript structure, effective writing techniques, journal selection, and responding to reviewer comments. Open to graduate students, researchers, and faculty members. The workshop will be conducted online via Zoom over three half-days. Participants will have opportunities for hands-on exercises and feedback on their writing. Resource persons are experienced publishers and journal editors who will share insights on the publication process.",
    excerpt: "Three-day online workshop on scientific writing for international journal publication.",
    type: "event", // Changed from "Training and workshop" to "event"
    category: "Training",
    featured_image: image9,
    gallery: [image9, image1, image6],
    attachments: [
      { name: "Workshop Outline.pdf", url: "/attachments/writing-workshop-outline.pdf" },
      { name: "Writing Resources.pdf", url: "/attachments/writing-resources.pdf" }
    ],
    event_start_date: "2025-04-15",
    event_end_date: "2025-04-17",
    event_location: "Online via Zoom",
    event_registration_link: "https://forms.google.com/scientific-writing-workshop",
    views: 198,
    published: true,
    featured: false,
    created_at: "2025-03-15",
    updated_at: "2025-03-15",
    published_at: "2025-03-15"
  },
  {
    id: 10,
    title: "CLSD at ASEAN Conference on Sustainable Development",
    content: "CLSD will participate in the ASEAN Conference on Sustainable Development, showcasing the center's research contributions to lake conservation in Southeast Asia. A special session on Philippine lakes will be organized, featuring presentations from CLSD researchers and partners. The conference provides an opportunity to share best practices and forge partnerships with regional institutions working on lake and freshwater conservation. CLSD will also showcase its research facilities and ongoing projects through a poster exhibit.",
    excerpt: "CLSD showcases lake conservation research at regional ASEAN conference.",
    type: "event", // Changed from "CLSD participation on R&D" to "event"
    category: "Conference Participation",
    featured_image: image1,
    gallery: [image1, image3, image7],
    attachments: [
      { name: "Conference Brochure.pdf", url: "/attachments/asean-conference.pdf" },
      { name: "CLSD Poster.pdf", url: "/attachments/clsd-poster.pdf" }
    ],
    event_start_date: "2025-05-20",
    event_end_date: "2025-05-22",
    event_location: "Bangkok, Thailand",
    event_registration_link: null,
    views: 156,
    published: true,
    featured: false,
    created_at: "2025-04-01",
    updated_at: "2025-04-01",
    published_at: "2025-04-01"
  },
  {
    id: 11,
    title: "Postdoctoral Fellowship in Lake Ecology",
    content: "CLSD invites applications for a postdoctoral fellowship in lake ecology. The fellow will conduct research on food web dynamics, nutrient cycling, or ecosystem modeling. The position is for one year, renewable for a second year based on performance. PhD in limnology, ecology, or related field required. The fellow will work with CLSD researchers and have access to field sites and laboratory facilities. Opportunities for collaboration with international partners and publication of research findings in high-impact journals. Competitive salary and research support provided.",
    excerpt: "One-year postdoctoral fellowship in lake ecology at CLSD Headquarters.",
    type: "event", // Changed from "Opportunities" to "event"
    category: "Fellowship",
    featured_image: image2,
    gallery: [image2, image4, image8],
    attachments: [
      { name: "Fellowship Description.pdf", url: "/attachments/postdoc-description.pdf" },
      { name: "Application Requirements.pdf", url: "/attachments/postdoc-requirements.pdf" }
    ],
    event_start_date: "2025-06-01",
    event_end_date: "2026-05-31",
    event_location: "CLSD Headquarters, Los Baños",
    event_registration_link: "https://forms.google.com/postdoc-application",
    views: 289,
    published: true,
    featured: true,
    created_at: "2025-04-15",
    updated_at: "2025-04-15",
    published_at: "2025-04-15"
  },
  {
    id: 12,
    title: "Newly Approved: Lake Monitoring Network Expansion",
    content: "The Lake Monitoring Network will be expanded to include 10 additional priority lakes across the Philippines. The project will establish water quality monitoring stations, train local monitoring teams, and create a centralized database accessible to researchers and policymakers. The expansion builds on the success of the existing monitoring network and aims to provide comprehensive data on the health of Philippine lakes. Partner institutions include local government units, state universities and colleges, and community organizations. Data collected will inform policy decisions and management interventions.",
    excerpt: "Lake monitoring network expands to 10 additional priority lakes nationwide.",
    type: "event", // Changed from "Newly Approved R&D Projects" to "event"
    category: "Research Project",
    featured_image: image3,
    gallery: [image3, image5, image9],
    attachments: [
      { name: "Network Expansion Plan.pdf", url: "/attachments/network-expansion.pdf" },
      { name: "Monitoring Protocol.pdf", url: "/attachments/monitoring-protocol.pdf" }
    ],
    event_start_date: "2025-01-01",
    event_end_date: "2026-12-31",
    event_location: "10 Priority Lakes Nationwide",
    event_registration_link: null,
    views: 234,
    published: true,
    featured: true,
    created_at: "2024-12-20",
    updated_at: "2024-12-20",
    published_at: "2024-12-20"
  }
];

export default NewsEvents;