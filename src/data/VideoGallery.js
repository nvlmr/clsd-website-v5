//C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\data\VideoGallery.js

import sampleDocument from "../assets/documents/Video Gallery/Testing Document.pdf";

const VideoGallery = [
  {
    id: 1,
    title: "Top 20 Largest Lakes in the Philippines",
    year: 2023,
    description: "No description available.",
    cover_image: "https://img.youtube.com/vi/8KK-HxW26EI/maxresdefault.jpg", // https://img.youtube.com/vi/YOUTUBE_ID/maxresdefault.jpg
    video_url: "https://youtu.be/8KK-HxW26EI?si=gEQZ5s61A-TkyUnn", // EXAMPLE: https://youtu.be/YOUTUBE_ID?si=gEQZ5s61A-TkyUnn
    document: [
      {
        name: "Testing Document.pdf",
        file_name: "Testing Document.pdf",
        url: sampleDocument,
        download_url: sampleDocument,
        size: 15 * 1024
      }
    ],
    published: 1,
    created_by: 1,
    updated_by: null,
    created_at: "2024-09-22 00:00:00",
    updated_at: "2024-09-22 00:00:00"
  },
  {
    id: 1,
    title: "Center for Lakes Sustainable Development | NICER",
    year: 2022,
    description: "No description available.",
    cover_image: "https://img.youtube.com/vi/vErBTHQQM1Y/maxresdefault.jpg",
    video_url: "https://youtu.be/vErBTHQQM1Y?si=jV9tMQxiw6KQZ98x",
    document: [
      {
        name: "Testing Document.pdf",
        file_name: "Testing Document.pdf",
        url: sampleDocument,
        download_url: sampleDocument,
        size: 15 * 1024
      }
    ],
    published: 1,
    created_by: 1,
    updated_by: null,
    created_at: "2024-04-22 00:00:00",
    updated_at: "2024-04-22 00:00:00"
  }
];

export default VideoGallery;