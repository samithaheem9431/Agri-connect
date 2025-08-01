# 🌾 AgriConnect - AI-Powered Agriculture Assistant

A comprehensive web application that provides AI-powered assistance for agricultural queries, crop management, disease detection, and farming best practices.

## ✨ Features

### 🤖 AI Chatbot Assistant
- **Multi-modal Input Support**: Text, voice, and file uploads
- **Agriculture-Specific Knowledge**: Specialized responses for farming queries
- **Real-time Chat Interface**: Professional chat UI with typing indicators
- **File Analysis**: Support for images, PDFs, and documents
- **Voice Recognition**: Speech-to-text functionality for hands-free operation

### 🌱 Agricultural Expertise
- **Crop Management**: Planting guides, care instructions, and harvesting tips
- **Disease Detection**: Identification and treatment recommendations
- **Soil Management**: pH testing, fertilization, and soil health advice
- **Weather Adaptation**: Drought, flooding, frost, and heat management
- **Pest Control**: Integrated pest management strategies
- **Irrigation Tips**: Water management and efficiency techniques

### 📱 Modern User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional Styling**: Modern gradient backgrounds and smooth animations
- **Chat History**: Persistent conversation tracking
- **File Preview**: Visual feedback for uploaded files
- **Voice Feedback**: Real-time voice input display

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account (for data storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agri_connect
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure Firebase**
   - Create a Firebase project
   - Enable Firestore and Storage
   - Add your Firebase config to `src/firebase.js`
   - Add service account key to `backend/serviceAccountKey.json`

5. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   PORT=5000
   NODE_ENV=development
   ```

6. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run both
   
   # Or start separately:
   # Frontend: npm start
   # Backend: cd backend && npm start
   ```

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern UI framework
- **React Speech Recognition**: Voice input functionality
- **Axios**: HTTP client for API communication
- **Firebase**: Real-time database and file storage
- **CSS3**: Custom styling with animations and responsive design

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **Multer**: File upload handling
- **Firebase Admin**: Server-side Firebase integration
- **CORS**: Cross-origin resource sharing

## 📋 API Endpoints

### POST `/api/query`
Handles user queries with support for text, voice, and file inputs.

**Request:**
```javascript
// Text query
{
  "text": "How to grow wheat?"
}

// File upload (multipart/form-data)
{
  "text": "What's wrong with this plant?",
  "file": [image/document file]
}
```

**Response:**
```javascript
{
  "success": true,
  "response": "🌱 Wheat Planting Guide: Plant wheat in fall...",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET `/api/query/health`
Health check endpoint for the AI assistant.

## 🌾 Agricultural Knowledge Base

The AI assistant includes comprehensive knowledge about:

### Crops
- **Wheat**: Planting, care, diseases, harvesting
- **Corn**: Growth requirements, pest management
- **Rice**: Water management, disease control
- **Soybeans**: Care instructions, harvesting tips

### Diseases
- **Rust**: Fungal disease management
- **Blight**: Plant tissue damage control
- **Mildew**: Air circulation and fungicide use
- **Nematodes**: Root damage prevention

### Soil Management
- **pH Testing**: Optimal ranges for different crops
- **Nutrient Management**: Nitrogen, phosphorus, potassium
- **Soil Health**: Organic matter and structure

### Weather Adaptation
- **Drought Management**: Water conservation techniques
- **Flooding**: Drainage and raised bed systems
- **Frost Protection**: Row covers and timing
- **Heat Stress**: Shade and irrigation strategies

## 🎯 Usage Examples

### Text Queries
```
"How to plant wheat?"
"What causes rust disease?"
"Best soil pH for corn?"
"How to manage drought conditions?"
```

### Voice Input
- Click the microphone button
- Speak your agricultural question
- The AI will process and respond

### File Upload
- Upload images of crops or diseases
- Submit PDF documents for analysis
- Get specific recommendations based on content

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Storage
4. Generate service account key
5. Update configuration files

### Environment Variables
```bash
# Backend .env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

## 📱 Browser Compatibility

- Chrome (recommended for voice features)
- Firefox
- Safari
- Edge

**Note**: Voice recognition requires HTTPS in production.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Machine Learning Integration**: Advanced crop disease detection
- **Weather API Integration**: Real-time weather-based recommendations
- **Multi-language Support**: Localized agricultural advice
- **Mobile App**: Native mobile application
- **Expert Consultation**: Connect with agricultural experts
- **Market Analysis**: Crop pricing and market trends

---

**Built with ❤️ for the agricultural community**
