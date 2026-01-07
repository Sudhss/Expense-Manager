# Expense Manager

A modern expense tracking application built with React, Node.js, and MongoDB. Track your spending, set budgets, and visualize your financial data with interactive charts. Features secure authentication with Google OAuth and JWT.

## Features

- **Secure Authentication**
  - Email/Password login with JWT
  - **Google OAuth 2.0** integration for seamless sign-in
  - Protected routes and API endpoints
  - Session management

- **Expense Management**
  - Add, edit, and delete expenses
  - Categorize expenses
  - Add notes and receipts
  - Filter and search functionality

- **Budgeting**
  - Set monthly budgets
  - Track spending against budgets
  - Visual budget progress indicators
  - Category-wise budget allocation

- **Data Visualization**
  - Interactive charts and graphs
  - Spending trends and patterns
  - Category-wise expense breakdown
  - Monthly/Yearly reports

- **Data Management**
  - CSV import/export
  - Data backup and restore
  - Responsive design for all devices

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Context API** for state management
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Google OAuth 2.0** for authentication

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **Google Auth Library** for OAuth verification
- **CORS** for cross-origin requests
- **MongoDB Atlas** for cloud database (optional)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Git
- Google OAuth 2.0 credentials from [Google Cloud Console](https://console.cloud.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sudhanshu-shukl/Expense-Manager.git
   cd Expense-Manager
   ```

2. **Set up environment variables**

   **Frontend (root directory)**:
   Create a `.env` file:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_API_URL=http://localhost:3000
   ```

   **Backend (server directory)**:
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/expense-manager
   JWT_SECRET=your-strong-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   NODE_ENV=development
   PORT=3000
   ```

3. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server** (in a new terminal)
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the consent screen
6. For development, add these authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
7. Add authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:3000/api/auth/google/callback`
8. Copy the Client ID to your `.env` files

## Project Structure

```
Expense-Manager/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── context/            # React Context for state management
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   └── App.jsx             # Main App component
│
├── server/                 # Backend source code
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
│
├── public/                 # Static files
└── package.json            # Frontend dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Expenses
- `GET /api/expenses` - Get all expenses (filterable by date, category)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `POST /api/expenses/import` - Import expenses from CSV
- `GET /api/expenses/export` - Export expenses as CSV

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets` - Get user budgets
- `POST /api/budgets` - Create/update budget
- `GET /api/budgets/summary` - Get budget summary

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Push your code to a GitHub repository
2. Import the repository to Vercel/Netlify
3. Set environment variables in the deployment settings
4. Deploy!

### Backend Deployment (Railway/Heroku)

1. Push your code to a GitHub repository
2. Create a new project on Railway/Heroku
3. Connect your GitHub repository
4. Add environment variables
5. Deploy the application

### MongoDB Setup

For production, it's recommended to use MongoDB Atlas:
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP address
4. Update the `MONGODB_URI` in your environment variables

### Environment Variables for Production

```env
# Frontend
VITE_API_URL=https://your-api-url.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Backend
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-strong-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
NODE_ENV=production
PORT=3000
```

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation when necessary
- Keep pull requests focused and small

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

Thanks to these wonderful people who have contributed to this project:

[//]: contributor-faces
<a href="https://github.com/Sudhanshu-shukl"><img src="https://avatars.githubusercontent.com/u/your-username" title="Sudhanshu Shukla" width="80" height="80"></a>
[//]: contributor-faces

##  Author

**Sudhanshu Shukla**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Sudhanshu-shukl)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-linkedin)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=about.me&logoColor=white)](https://sudhanshu-shukl.github.io/portfolio)

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
