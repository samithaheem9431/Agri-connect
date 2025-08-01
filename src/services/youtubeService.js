// YouTube API service for educational farming content
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || 'AIzaSyCZdTPBHNN5d3TgwpTslDs1zNLIB8D3QwM'; // Replace with your actual API key
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Farming-related search queries for different categories
const FARMING_QUERIES = {
  wheat: ['wheat farming tutorial', 'wheat cultivation guide', 'wheat harvesting techniques'],
  rice: ['rice farming tutorial', 'rice cultivation guide', 'rice harvesting methods'],
  maize: ['maize farming tutorial', 'corn cultivation guide', 'maize harvesting'],
  cotton: ['cotton farming tutorial', 'cotton cultivation guide', 'cotton harvesting'],
  general: ['farming techniques', 'agriculture tutorial', 'farming guide', 'crop management'],
  organic: ['organic farming tutorial', 'natural farming methods', 'sustainable agriculture'],
  pest: ['pest management farming', 'crop protection', 'natural pest control'],
  soil: ['soil management farming', 'soil health', 'soil preparation'],
  irrigation: ['irrigation methods farming', 'water management agriculture', 'drip irrigation'],
  machinery: ['farming machinery tutorial', 'agricultural equipment', 'farm tools']
};

export const fetchYouTubeVideos = async (category = 'general', maxResults = 10) => {
  try {
    const queries = FARMING_QUERIES[category] || FARMING_QUERIES.general;
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(randomQuery)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}&relevanceLanguage=en&videoDuration=medium&videoEmbeddable=true`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch YouTube videos');
    }

    const data = await response.json();
    
    // Get video details including duration and view count
    const videoIds = data.items.map(item => item.id.videoId).join(',');
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    if (detailsResponse.ok) {
      const detailsData = await detailsResponse.json();
      
      // Combine search results with video details
      return data.items.map((item, index) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: detailsData.items[index]?.contentDetails?.duration || '',
        viewCount: detailsData.items[index]?.statistics?.viewCount || '0',
        category: category
      }));
    }

    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: '',
      viewCount: '0',
      category: category
    }));

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    if (error.message.includes('API key')) {
      console.error('Invalid or missing API key. Please check your configuration.');
    }
    
    // Return mock data for demonstration purposes
    return [
      {
        id: 'demo1',
        title: '🌾 Wheat Farming Complete Guide - From Seed to Harvest',
        description: 'Learn the complete process of wheat farming including soil preparation, planting, care, and harvesting techniques.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        channelTitle: 'Agricultural Education Channel',
        publishedAt: '2024-01-15T10:00:00Z',
        duration: 'PT15M30S',
        viewCount: '125000',
        category: category
      },
      {
        id: 'demo2',
        title: '🍚 Rice Cultivation Methods - Traditional vs Modern',
        description: 'Explore different rice cultivation methods, water management, and modern farming techniques for better yields.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        channelTitle: 'Farm Science',
        publishedAt: '2024-01-10T14:30:00Z',
        duration: 'PT12M45S',
        viewCount: '89000',
        category: category
      },
      {
        id: 'demo3',
        title: '🌽 Maize Farming Best Practices - High Yield Techniques',
        description: 'Discover the best practices for maize farming including soil preparation, spacing, fertilization, and pest control.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        channelTitle: 'Crop Master',
        publishedAt: '2024-01-05T09:15:00Z',
        duration: 'PT18M20S',
        viewCount: '156000',
        category: category
      }
    ];
  }
};

export const searchYouTubeVideos = async (searchTerm, maxResults = 10) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(searchTerm + ' farming tutorial')}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}&relevanceLanguage=en&videoDuration=medium&videoEmbeddable=true`
    );

    if (!response.ok) {
      throw new Error('Failed to search YouTube videos');
    }

    const data = await response.json();
    
    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: '',
      viewCount: '0',
      category: 'search'
    }));

  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    if (error.message.includes('API key')) {
      console.error('Invalid or missing API key. Please check your configuration.');
    }
    
    // Return mock search results for demonstration
    return [
      {
        id: 'search1',
        title: `🔍 ${searchTerm} - Complete Farming Tutorial`,
        description: `Learn everything about ${searchTerm} including best practices, techniques, and expert tips for successful farming.`,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        channelTitle: 'Farming Experts',
        publishedAt: '2024-01-20T11:00:00Z',
        duration: 'PT20M15S',
        viewCount: '98000',
        category: 'search'
      },
      {
        id: 'search2',
        title: `${searchTerm} Techniques - Modern Agricultural Methods`,
        description: `Discover modern techniques and innovative approaches for ${searchTerm} that can improve your crop yields.`,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        channelTitle: 'Modern Agriculture',
        publishedAt: '2024-01-18T16:45:00Z',
        duration: 'PT14M30S',
        viewCount: '75000',
        category: 'search'
      }
    ];
  }
};

// Format duration from ISO 8601 format to readable format
export const formatDuration = (duration) => {
  if (!duration) return '';
  
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  let result = '';
  if (hours) result += `${hours}:`;
  if (minutes) result += `${minutes.padStart(2, '0')}:`;
  else result += '00:';
  if (seconds) result += seconds.padStart(2, '0');
  else result += '00';
  
  return result;
};

// Format view count
export const formatViewCount = (viewCount) => {
  if (!viewCount) return '0';
  
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}; 