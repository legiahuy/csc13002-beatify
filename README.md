<!-- title: BEATIFY -->
<br />
<div align="center">
  <h1 align="center">Beatify</h1>
  <p align="center">
    A modern music streaming platform designed for seamless user experience
  </p>
</div>

# Description

**Beatify** is a music streaming platform aiming to redefine how users explore and enjoy digital music. Focused on providing an intuitive and user-friendly experience, Beatify introduces innovative features that set it apart from existing platforms. It aspires to offer a powerful alternative to platforms like Spotify by blending convenience with creative functionalities.

## Key Features

1. **User Account Management:**
   - Sign up, log in, log out
   - Password recovery (Forgot Password)
   - Email verification and session management

2. **Music Playback:**
   - Search and play music from an extensive library
   - Essential playback controls: Play, Pause, Next, Previous, Shuffle, Repeat

3. **Premium Audio Features:**
   - Custom playback speed
   - Equalizer for personalized sound quality adjustments

4. **Playlists and Personal Library:**
   - Create and manage playlists
   - Save favorite songs
   - View listening history

5. **Payment Integration:**
   - Manage subscription plans (Free and Premium) via Stripe

6. **Personalized Music Recommendations (Optional):**
   - AI-powered song suggestions based on user preferences

# Tech Stack

### Frontend
- **Next.js** Framework and library for building dynamic user interfaces
- **Tailwind CSS:** Styling with modern, customizable utility-first CSS framework

![NextJS][NextJS] 
![TailwindCSS][TailwindCSS]

### Backend
- **Express.js:** API creation, authentication, and backend logic
- **MongoDB:** Database management for songs, users, playlists

![Express.js][Express.js]
![MongoDB][MongoDB] ![Mongoose][Mongoose]

### Cloud and Media Management
- **Cloudinary:** For storing and delivering media assets like audio files and album art

![Cloudinary][Cloudinary]

### Payment Integration
- **Stripe:** Secure and efficient handling of subscription payments

![Stripe][Stripe] 


# Building the Project

1. Install [Node.js](https://nodejs.org/en/)
2. Clone the repository:
   ```sh
   git clone https://github.com/legiahuy/csc13002-beatify.git
   ```
3. Install dependencies for both backend and frontend:
   ```sh
   npm install
   ```
5. Run the project (from the ./frontend & ./backend):
   ```sh
   npm run dev (FE)
   npm run server (BE)
   ```