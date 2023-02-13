# Zello

A real time chat application built using Firebase and Next.js.

## Features

- Anonymous Sign up
- Profile Generation
- Easy Profile Editing (username and profile image)
- Real Time Chatting using Firestore's onSnapshot method
- Uses Firestore's getDoc, updateDoc and other methods for data manipulation
- Tailwind for Styling
- Mobile Responsive
- Hosted on Vercel
- Typescript

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Firebase account (with Firestore enabled)

### Installing

1. Clone the repository

```
git clone https://github.com/zello.git
cd zello
npm install
```

2. Create a `.env.local` file in the root directory and add your Firebase credentials as follows:

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
```

3. Start the development server

```
npm run dev
```

4. Open your browser and go to `http://localhost:3000`

## Deployment

The application is currently hosted on Vercel. To deploy to Vercel, make sure you have the Vercel CLI installed.

```
npm i -g vercel
```

1. Login to Vercel

## Built With

- [Next.js](https://nextjs.org/) - A React Framework for Server-Rendered or Static Applications
- [Firebase](https://firebase.google.com/) - A Backend-as-a-Service platform
- [Tailwind](https://tailwindcss.com/) - A Utility-First CSS Framework for Rapid UI Development

## Author

- [Adienox](https://github.com/adienox)
