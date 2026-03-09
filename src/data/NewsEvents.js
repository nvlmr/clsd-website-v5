// Sample data structure for NewsEvents.js with only the specified attributes
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
    date: "January 20-24, 2025",
    location: "Los Baños, Laguna",
    type: "Training and workshop",
    image: image1,
    description: "A 5-day hands-on training on modern water quality monitoring techniques, including sampling methods, laboratory analysis, and data interpretation for lake ecosystem assessment. Participants will learn proper sampling techniques, use of modern monitoring equipment, laboratory analysis methods, and statistical tools for data interpretation."
  },
  {
    id: 2,
    title: "CLSD Participation: International Lake Conservation Conference",
    date: "November 15-17, 2024",
    location: "Manila, Philippines",
    type: "CLSD participation on R&D",
    image: image2,
    description: "The Center for Lake Sustainable Development (CLSD) will present research findings on lake biodiversity conservation at the 3rd International Conference on Lake Conservation. Our researchers will share insights on sustainable lake management practices and climate change adaptation strategies for freshwater ecosystems."
  },
  {
    id: 3,
    title: "Call for Proposals: Lake Research Grant 2025",
    date: "Deadline: December 15, 2024",
    location: "Nationwide",
    type: "Opportunities",
    image: image3,
    description: "We are accepting research proposals focused on Philippine lakes for the 2025 Research Grant Program. Priority areas include water quality assessment, biodiversity conservation, sustainable fisheries, and climate change impacts. Selected projects will receive funding up to ₱500,000 for a one-year implementation period."
  },
  {
    id: 4,
    title: "Newly Approved: Lake Biodiversity Assessment Project",
    date: "Approved: October 2024",
    location: "Laguna de Bay, Taal Lake, Lanao Lake",
    type: "Newly Approved R&D Projects",
    image: image4,
    description: "A comprehensive biodiversity assessment project has been approved for implementation across three major Philippine lakes. The project will document aquatic species, identify threatened habitats, and develop conservation strategies. Implementation will begin in January 2025 in collaboration with local universities and LGUs."
  },
  {
    id: 5,
    title: "Training Workshop: Geographic Information Systems for Lake Management",
    date: "February 10-14, 2025",
    location: "University of the Philippines, Diliman",
    type: "Training and workshop",
    image: image5,
    description: "This workshop introduces participants to GIS applications in lake management. Topics include mapping lake boundaries, analyzing land use changes in watersheds, and creating vulnerability maps. No prior GIS experience required. Limited to 20 participants."
  },
  {
    id: 6,
    title: "CLSD Researchers Present at National Symposium",
    date: "March 5-6, 2025",
    location: "Cebu City",
    type: "CLSD participation on R&D",
    image: image6,
    description: "Three CLSD researchers will present their studies on lake water quality, aquatic biodiversity, and community-based resource management at the Philippine National Research Symposium. The presentations highlight recent findings from ongoing research projects in various Philippine lakes."
  },
  {
    id: 7,
    title: "Scholarship Opportunity: MS in Limnology",
    date: "Application Deadline: April 30, 2025",
    location: "University of the Philippines Los Baños",
    type: "Opportunities",
    image: image7,
    description: "CLSD is offering two full scholarships for Master of Science in Limnology at UPLB. The scholarship covers tuition, monthly stipend, and research support. Applicants must have a BS degree in biology, environmental science, or related fields. Priority will be given to applicants from lake communities."
  },
  {
    id: 8,
    title: "Newly Approved: Community-Based Lake Restoration Initiative",
    date: "Approved: November 2024",
    location: "Seven Lakes of San Pablo",
    type: "Newly Approved R&D Projects",
    image: image8,
    description: "A community-based restoration project for the Seven Lakes of San Pablo has been approved. The project will work with local communities to implement water quality improvement measures, native vegetation restoration, and sustainable livelihood development. Project duration: 3 years."
  },
  {
    id: 9,
    title: "Workshop: Scientific Writing for Publication",
    date: "April 15-17, 2025",
    location: "Online via Zoom",
    type: "Training and workshop",
    image: image9,
    description: "Learn how to write and publish your research in international journals. This workshop covers manuscript structure, effective writing techniques, journal selection, and responding to reviewer comments. Open to graduate students, researchers, and faculty members."
  },
  {
    id: 10,
    title: "CLSD at ASEAN Conference on Sustainable Development",
    date: "May 20-22, 2025",
    location: "Bangkok, Thailand",
    type: "CLSD participation on R&D",
    image: image1,
    description: "CLSD will participate in the ASEAN Conference on Sustainable Development, showcasing the center's research contributions to lake conservation in Southeast Asia. A special session on Philippine lakes will be organized, featuring presentations from CLSD researchers and partners."
  },
  {
    id: 11,
    title: "Postdoctoral Fellowship in Lake Ecology",
    date: "Open until filled",
    location: "CLSD Headquarters, Los Baños",
    type: "Opportunities",
    image: image2,
    description: "CLSD invites applications for a postdoctoral fellowship in lake ecology. The fellow will conduct research on food web dynamics, nutrient cycling, or ecosystem modeling. The position is for one year, renewable for a second year based on performance. PhD in limnology, ecology, or related field required."
  },
  {
    id: 12,
    title: "Newly Approved: Lake Monitoring Network Expansion",
    date: "Approved: December 2024",
    location: "10 Priority Lakes Nationwide",
    type: "Newly Approved R&D Projects",
    image: image3,
    description: "The Lake Monitoring Network will be expanded to include 10 additional priority lakes across the Philippines. The project will establish water quality monitoring stations, train local monitoring teams, and create a centralized database accessible to researchers and policymakers."
  }
];

export default NewsEvents;