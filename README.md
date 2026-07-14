# 🤖 Fodify - AI Powered Food Ordering Platform

A modern, full-stack MERN (MongoDB, Express, React, Node.js) food ordering application with **AI-powered recommendations, mood-based food discovery, smart search, and sentiment analysis**. Inspired by Swiggy and Zomato, featuring a beautiful UI with Tailwind CSS, Redux state management, and JWT authentication.

## 🌟 Features

### Frontend
- ✨ **Modern UI/UX** - Swiggy/Zomato-style interface with Tailwind CSS
- 🎨 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- 🎭 **Smooth Animations** - Framer Motion animations for enhanced user experience
- 🛒 **Smart Cart** - Redux-powered cart with restaurant validation
- 🔐 **Authentication** - JWT-based secure login and signup
- 📦 **Order Tracking** - View order history and real-time status updates
- 💀 **Skeleton Loaders** - Beautiful loading states
- 🔔 **Toast Notifications** - User-friendly feedback messages

### Backend
- 🏗️ **MVC Architecture** - Clean, maintainable code structure
- 🔒 **Secure Authentication** - JWT tokens with bcrypt password hashing
- 📊 **MongoDB Database** - Efficient NoSQL data storage
- 🎯 **RESTful APIs** - Well-structured API endpoints
- ✅ **Data Validation** - Express validator for input validation
- 🚀 **Error Handling** - Comprehensive error management

## 📁 Project Structure

```
fodify/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── restaurantController.js
│   │   ├── foodController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Restaurant.js         # Restaurant schema
│   │   ├── Food.js               # Food schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── foodRoutes.js
│   │   └── orderRoutes.js
│   ├── seeders/
│   │   └── seedData.js           # Sample data seeder
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── RestaurantCard.jsx
    │   │   ├── FoodCard.jsx
    │   │   ├── Skeleton.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── RestaurantDetails.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Orders.jsx
    │   ├── services/
    │   │   ├── api.js              # Axios configuration
    │   │   ├── authService.js
    │   │   ├── restaurantService.js
    │   │   ├── foodService.js
    │   │   └── orderService.js
    │   ├── store/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       └── cartSlice.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Edit the `.env` file in the backend folder:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# Option 1: Local MongoDB
MONGO_URI=mongodb://localhost:27017/fodify

# Option 2: MongoDB Atlas (recommended)
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fodify?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
```

**MongoDB Atlas Setup (Free Tier):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Get your connection string
6. Replace `<username>` and `<password>` in the connection string

4. **Seed the database with sample data**
```bash
npm run seed
```

5. **Start the backend server**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory (new terminal)**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Restaurants
- `GET /api/restaurants` - Get all restaurants (with search & filters)
- `GET /api/restaurants/:id` - Get single restaurant

### Food Items
- `GET /api/foods/restaurant/:restaurantId` - Get food items by restaurant
- `GET /api/foods/:id` - Get single food item

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/user` - Get user orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `PATCH /api/orders/:id/status` - Update order status (Admin)

## 💻 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 👤 Test Accounts

After seeding the database, you can create your own account or use these credentials:

**Customer Account:**
- Email: test@example.com
- Password: test123

(You'll need to create this account through the signup page)

## 🎨 Features Highlights

### Smart Cart Management
- Prevents mixing items from different restaurants
- Persistent cart using Redux and localStorage
- Real-time price calculations

### Secure Authentication
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes on both frontend and backend

### Beautiful UI
- Premium design with gradients and animations
- Skeleton loaders for better UX
- Responsive design for all devices
- Custom color palette and typography

## 📱 Screenshots

The app features:
- Hero section with search
- Restaurant grid with filters
- Detailed restaurant pages with menu
- Shopping cart with bill breakdown
- Order history with status tracking
- Modern login/signup pages

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
- Make sure MongoDB is running (if using local)
- Check your connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
```bash
# Change port in backend/.env
PORT=5001
```

### CORS Errors
- Ensure backend is running on port 5000
- Check CORS configuration in server.js

## 📝 Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔐 Security Best Practices

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Protected routes and API endpoints
- ✅ Input validation and sanitization
- ✅ Environment variables for sensitive data
- ⚠️ Change JWT_SECRET in production
- ⚠️ Enable HTTPS in production

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables on hosting platform
2. Update MONGO_URI to production database
3. Set NODE_ENV=production
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Update API base URL in `src/services/api.js`
2. Build project: `npm run build`
3. Deploy dist folder

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for learning purposes

---

**Happy Coding! 🍕🍔🍜**
