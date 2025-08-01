import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { 
  fetchYouTubeVideos, 
  searchYouTubeVideos, 
  formatDuration, 
  formatViewCount 
} from "../services/youtubeService";
import "./EducationPage.css";

const EducationPage = () => {
  const [language, setLanguage] = useState("en");
  const [crop, setCrop] = useState("All");
  const [materials, setMaterials] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("youtube"); // youtube or firebase

  // Categories for educational content
  const categories = [
    { id: "general", name: "🌾 General Farming", icon: "🌾" },
    { id: "wheat", name: "🌾 Wheat Farming", icon: "🌾" },
    { id: "rice", name: "🍚 Rice Farming", icon: "🍚" },
    { id: "maize", name: "🌽 Maize/Corn", icon: "🌽" },
    { id: "cotton", name: "🧵 Cotton Farming", icon: "🧵" },
    { id: "organic", name: "🌱 Organic Farming", icon: "🌱" },
    { id: "pest", name: "🐛 Pest Management", icon: "🐛" },
    { id: "soil", name: "🌍 Soil Management", icon: "🌍" },
    { id: "irrigation", name: "💧 Irrigation", icon: "💧" },
    { id: "machinery", name: "🚜 Farm Machinery", icon: "🚜" }
  ];

  // Fetch Firebase educational content
  const fetchFirebaseContent = useCallback(async () => {
    try {
      let q = collection(db, "education");
      const filters = [];
      if (language !== "All") filters.push(where("language", "==", language));
      if (crop !== "All") filters.push(where("crop", "==", crop));

      if (filters.length > 0) {
        q = query(q, ...filters);
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      
              // If no data in Firebase, show demo materials
        if (data.length === 0) {
          const demoMaterials = [
            {
              title: "🌾 Complete Wheat Farming Guide",
              crop: "Wheat",
              language: "en",
              type: "pdf",
              url: "https://example.com/wheat-farming-guide.pdf",
              description: "Comprehensive guide covering wheat cultivation from seed to harvest"
            },
            {
              title: "🍚 Rice Cultivation Best Practices",
              crop: "Rice", 
              language: "en",
              type: "pdf",
              url: "https://example.com/rice-cultivation.pdf",
              description: "Modern rice farming techniques and water management"
            },
            {
              title: "🌽 Maize Farming Handbook",
              crop: "Maize",
              language: "en", 
              type: "pdf",
              url: "https://example.com/maize-handbook.pdf",
              description: "Complete maize farming guide with pest control methods"
            },
            {
              title: "🧵 Cotton Farming Techniques",
              crop: "Cotton",
              language: "en",
              type: "pdf", 
              url: "https://example.com/cotton-techniques.pdf",
              description: "Advanced cotton farming and harvesting techniques"
            },
            {
              title: "🌱 Organic Farming Principles",
              crop: "General",
              language: "en",
              type: "pdf",
              url: "https://example.com/organic-farming.pdf", 
              description: "Sustainable and organic farming methods"
            },
            {
              title: "🐛 Pest Management in Agriculture",
              crop: "General",
              language: "en",
              type: "pdf",
              url: "https://example.com/pest-management.pdf",
              description: "Natural and chemical pest control methods"
            },
            {
              title: "گندم کی کاشت کا مکمل گائیڈ",
              crop: "Wheat",
              language: "ur",
              type: "pdf",
              url: "https://example.com/wheat-urdu.pdf",
              description: "گندم کی کاشت سے لے کر کٹائی تک کا مکمل طریقہ کار"
            },
            {
              title: "चावल की खेती के बेहतरीन तरीके",
              crop: "Rice",
              language: "hi", 
              type: "pdf",
              url: "https://example.com/rice-hindi.pdf",
              description: "आधुनिक चावल खेती तकनीक और जल प्रबंधन"
            }
          ];
        
        // Filter demo materials based on selected filters
        let filteredMaterials = demoMaterials;
        if (language !== "All") {
          filteredMaterials = filteredMaterials.filter(item => item.language === language);
        }
        if (crop !== "All") {
          filteredMaterials = filteredMaterials.filter(item => item.crop === crop);
        }
        
        setMaterials(filteredMaterials);
      } else {
        setMaterials(data);
      }
    } catch (error) {
      console.error("Error fetching Firebase content:", error);
      
      // Show demo materials on error
      const demoMaterials = [
        {
          title: "🌾 Complete Wheat Farming Guide",
          crop: "Wheat",
          language: "en",
          type: "pdf",
          url: "https://example.com/wheat-farming-guide.pdf",
          description: "Comprehensive guide covering wheat cultivation from seed to harvest"
        },
        {
          title: "🍚 Rice Cultivation Best Practices", 
          crop: "Rice",
          language: "en",
          type: "pdf",
          url: "https://example.com/rice-cultivation.pdf",
          description: "Modern rice farming techniques and water management"
        }
      ];
      setMaterials(demoMaterials);
    }
  }, [language, crop]);

  // Fetch YouTube videos
  const fetchVideos = useCallback(async (category = selectedCategory) => {
    setLoading(true);
    setError("");
    
    try {
      const videos = await fetchYouTubeVideos(category, 12);
      setYoutubeVideos(videos);
    } catch (error) {
      if (error.message.includes('API key') || error.message.includes('403')) {
        setError("YouTube API key is invalid or missing. Please check your configuration.");
      } else {
        setError("Failed to fetch YouTube videos. Please try again later.");
      }
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  // Search YouTube videos
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const videos = await searchYouTubeVideos(searchTerm, 12);
      setYoutubeVideos(videos);
      setSelectedCategory("search");
    } catch (error) {
      if (error.message.includes('API key') || error.message.includes('403')) {
        setError("YouTube API key is invalid or missing. Please check your configuration.");
      } else {
        setError("Failed to search videos. Please try again.");
      }
      console.error("Error searching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm("");
    fetchVideos(categoryId);
  };

  // Handle video click
  const handleVideoClick = (videoId) => {
    if (videoId.startsWith('demo') || videoId.startsWith('search')) {
      // For demo videos, show a message
      alert('This is a demo video. In production, this would open the actual YouTube video.');
    } else {
      // For real YouTube videos
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    fetchFirebaseContent();
    fetchVideos();
  }, [fetchFirebaseContent, fetchVideos]);

  return (
    <div className="education-page">
      {/* Header */}
      <div className="education-header">
        <h2>🎓 Farmer's Educational Hub</h2>
        <p>
          Discover comprehensive farming tutorials, techniques, and best practices 
          through video guides and educational materials. Learn from experts and 
          improve your agricultural skills.
        </p>
      </div>

      {/* Demo Mode Notice */}
      <div className="youtube-notice"> 
        <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noreferrer">
        </a>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <button 
          className={`category-tab ${activeTab === 'youtube' ? 'active' : ''}`}
          onClick={() => setActiveTab('youtube')}
        >
          📺 Video Tutorials
        </button>
        <button 
          className={`category-tab ${activeTab === 'firebase' ? 'active' : ''}`}
          onClick={() => setActiveTab('firebase')}
        >
          📚 Educational Materials
        </button>
      </div>

      {activeTab === 'youtube' ? (
        <>
          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-section">
              <div className="filter-group">
                <label>Search Topics:</label>
                <input
                  type="text"
                  placeholder="e.g., wheat planting, pest control..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button className="search-button" onClick={handleSearch}>
                🔍 Search
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>Loading educational videos...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-message">
              <h3>⚠️ Error</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Videos Grid */}
          {!loading && !error && youtubeVideos.length > 0 && (
            <div className="videos-grid">
              {youtubeVideos.map((video) => (
                <div 
                  key={video.id} 
                  className="video-card"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="play-button">▶</div>
                    {video.duration && (
                      <div className="video-duration">
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-channel">{video.channelTitle}</p>
                    <div className="video-stats">
                      <span>👁 {formatViewCount(video.viewCount)} views</span>
                      <span>📅 {formatDate(video.publishedAt)}</span>
                    </div>
                    <p className="video-description">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Videos State */}
          {!loading && !error && youtubeVideos.length === 0 && (
            <div className="no-videos">
              <h3>📺 No Videos Found</h3>
              <p>Try selecting a different category or searching for specific topics.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Firebase Content Filters */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Language:</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="All">All Languages</option>
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="hi">Hindi</option>
                <option value="pa">Punjabi</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Crop Type:</label>
              <select value={crop} onChange={(e) => setCrop(e.target.value)}>
                <option value="All">All Crops</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Pulses">Pulses</option>
              </select>
            </div>
          </div>

          {/* Firebase Educational Materials */}
          <div className="videos-grid">
            {materials.map((item, idx) => (
              <div key={idx} className="video-card">
                <div className="video-thumbnail">
                  {item.type === "pdf" ? (
                    <div style={{ 
                      background: '#f8f9fa', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      📄
                    </div>
                  ) : (
                    <video width="100%" height="100%" controls>
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                                  <div className="video-info">
                    <h3 className="video-title">{item.title}</h3>
                    <p className="video-channel">Crop: {item.crop}</p>
                    <div className="video-stats">
                      <span>📚 {item.type?.toUpperCase() || 'Document'}</span>
                      <span>🌐 {item.language || 'Unknown'}</span>
                    </div>
                    {item.description && (
                      <p className="video-description">{item.description}</p>
                    )}
                  {item.type === "pdf" && (
                    <button 
                      onClick={() => alert('This is a demo PDF. In production, this would open the actual PDF document.')}
                      className="search-button"
                      style={{ display: 'inline-block', marginTop: '1rem' }}
                    >
                      📄 View PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {materials.length === 0 && (
            <div className="no-videos">
              <h3>📚 No Educational Materials Found</h3>
              <p>Try adjusting your filters or check back later for new content.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EducationPage;
