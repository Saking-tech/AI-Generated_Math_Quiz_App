# Quiz Platform

A comprehensive quiz application built with Next.js and Convex backend, featuring role-based access control for quiz masters and general users.

## Features

### For General Users
- Browse and take published quizzes
- Multiple question types: Single/Multiple choice MCQs and Short answers
- Real-time timer during quiz attempts
- Detailed results with score breakdown
- Performance analytics and history

### For Quiz Masters
- Create and manage unlimited quizzes
- Advanced question builder with multiple question types
- Quiz analytics and student performance tracking
- Publish/unpublish quiz controls
- Detailed result analysis

### Question Types Supported
1. **Single Choice MCQ**: Multiple choice with one correct answer
2. **Multiple Choice MCQ**: Multiple choice with multiple correct answers
3. **Short Answer**: Text-based answers

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Convex (Real-time database)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Clerk account for authentication
- Access to the provided Convex deployment

### Environment Variables

Create a `.env.local` file in your project root:

```env
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://academic-bass-666.convex.cloud
CONVEX_DEPLOYMENT=dev:academic-bass-666|eyJ2MiI6IjViMmJjYzFmYmI4NjQwMzdiZTM4MTZjZmRiZTQ2NzJjIn0=

# Clerk Authentication (You need to get these from Clerk dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up Clerk Authentication:**
   - Go to [clerk.com](https://clerk.com) and create a new application
   - Copy your publishable key and secret key
   - Add them to your `.env.local` file
   - Configure your Clerk settings:
     - Enable email/password authentication
     - Set up your sign-in/sign-up pages

3. **Configure Convex:**
   The Convex backend is already configured with the provided deployment key. The schema and functions are included in the project.

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
quiz_app/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Quiz master dashboard
│   ├── quizzes/                # Quiz taking interface
│   ├── results/                # Results viewing
│   ├── sign-in/                # Authentication pages
│   └── ...
├── components/                  # Reusable UI components
│   └── ui/                     # Base UI components
├── convex/                     # Backend functions and schema
│   ├── schema.ts               # Database schema
│   ├── users.ts                # User management
│   ├── quizzes.ts              # Quiz CRUD operations
│   ├── questions.ts            # Question management
│   └── quizAttempts.ts         # Quiz attempt handling
├── lib/                        # Utility functions
└── ...
```

## Usage Guide

### For New Users
1. Sign up for an account
2. Start as a "General User" 
3. Browse available quizzes
4. Take quizzes and view results
5. Request upgrade to "Quiz Master" if needed

### For Quiz Masters
1. Access the dashboard after upgrade
2. Create new quizzes with title, description, and duration
3. Add questions of different types
4. Publish quizzes when ready
5. Monitor student performance and analytics

### Creating Questions

**Single Choice MCQ:**
- Add question text
- Provide 4 options
- Select one correct answer

**Multiple Choice MCQ:**
- Add question text  
- Provide multiple options
- Select multiple correct answers

**Short Answer:**
- Add question text
- Specify correct answer(s)
- Supports multiple acceptable answers

## API Endpoints (Convex Functions)

### Users
- `createUser` - Create new user
- `getUserByClerkId` - Get user by Clerk ID
- `updateUserRole` - Update user role

### Quizzes
- `createQuiz` - Create new quiz
- `updateQuiz` - Update quiz details
- `deleteQuiz` - Delete quiz and related data
- `getQuizzesByCreator` - Get quizzes by creator
- `getPublishedQuizzes` - Get published quizzes
- `getQuizWithQuestions` - Get quiz with questions

### Questions
- `createQuestion` - Add question to quiz
- `updateQuestion` - Update question
- `deleteQuestion` - Delete question
- `getQuestionsByQuiz` - Get all questions for quiz

### Quiz Attempts
- `startQuizAttempt` - Start new quiz attempt
- `submitQuizAttempt` - Submit completed quiz
- `getAttemptsByUser` - Get user's attempts
- `getAttemptsByQuiz` - Get attempts for quiz
- `getAttemptDetails` - Get detailed attempt results

## Database Schema

### Users
- `clerkId` - Clerk authentication ID
- `email` - User email
- `name` - User name
- `role` - "quiz-master" or "general"
- `createdAt` - Registration timestamp

### Quizzes
- `title` - Quiz title
- `description` - Optional description
- `createdBy` - Creator user ID
- `isPublished` - Published status
- `duration` - Time limit in minutes
- `createdAt/updatedAt` - Timestamps

### Questions
- `quizId` - Parent quiz ID
- `questionText` - Question content
- `questionType` - "mcq_single", "mcq_multiple", or "short_answer"
- `options` - Array of options (for MCQs)
- `correctAnswers` - Array of correct answers
- `points` - Points value
- `order` - Display order

### Quiz Attempts
- `quizId` - Quiz being attempted
- `userId` - User taking quiz
- `answers` - Array of user answers
- `score` - Points earned
- `totalPoints` - Maximum possible points
- `startedAt/completedAt` - Timestamps
- `isCompleted` - Completion status

## Deployment

### Convex Backend
The backend is already deployed and configured. The deployment URL and key are provided in the project configuration.

### Frontend Deployment
Deploy to Vercel, Netlify, or your preferred platform:

1. Build the project:
```bash
npm run build
```

2. Set environment variables in your hosting platform
3. Deploy the build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.
