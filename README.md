# EDULYTICS — The Real Truth About Schools

> Student-driven, trust-weighted school review platform

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore + Firebase Auth)
- **Fonts**: Playfair Display (headings) + DM Sans (body)
- **Icons**: Lucide React

---

## Project Structure

```
edulytics/
├── app/
│   ├── layout.tsx              # Root layout (fonts, auth provider, navbar)
│   ├── globals.css             # Global styles + Tailwind
│   ├── page.tsx                # Landing page (/)
│   ├── language/page.tsx       # Language selection (/language)
│   ├── onboarding/page.tsx     # Onboarding slides (/onboarding)
│   ├── auth/page.tsx           # Sign in / Sign up (/auth)
│   ├── dashboard/page.tsx      # Main dashboard (/dashboard)
│   ├── profile/page.tsx        # User profile (/profile)
│   ├── settings/page.tsx       # Settings (/settings)
│   ├── school/
│   │   ├── select/page.tsx     # Browse schools (/school/select)
│   │   └── [id]/page.tsx       # School profile (/school/:id)
│   └── review/
│       └── [schoolId]/page.tsx # Write review (/review/:schoolId)
├── components/
│   ├── Navbar.tsx              # Top navigation bar
│   ├── SchoolCard.tsx          # School preview card
│   ├── ReviewCard.tsx          # Review display card
│   ├── RatingStars.tsx         # Interactive star rating
│   ├── SearchBar.tsx           # Autocomplete search
│   ├── AddSchoolForm.tsx       # Modal to add a school
│   └── Skeleton.tsx            # Loading skeletons
├── firebase/
│   ├── config.ts               # Firebase initialization
│   └── firestore.rules         # Firestore security rules
├── hooks/
│   ├── useAuth.tsx             # Auth context + provider
│   └── useLanguage.ts          # Language context (EN/HI)
├── lib/
│   ├── auth.ts                 # signUp, signIn, logOut, getUserProfile
│   ├── schools.ts              # addSchool, getSchool, searchSchools
│   ├── reviews.ts              # addReview, getSchoolReviews (trust-weighted)
│   └── utils.ts                # cn(), formatDate(), INDIAN_STATES
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd edulytics
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g., `edulytics-app`)
3. **Enable Authentication**:
   - Go to Authentication > Sign-in method
   - Enable **Email/Password**
4. **Enable Firestore**:
   - Go to Firestore Database > Create database
   - Start in **test mode** (update rules later)
5. **Get config**:
   - Project Settings > General > Your apps > Add Web App
   - Copy the `firebaseConfig` values

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Deploy Firestore Rules

In Firebase Console > Firestore > Rules tab, paste the contents of `firebase/firestore.rules`.

OR install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project
firebase deploy --only firestore:rules
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy on Vercel

```bash
npm install -g vercel
vercel

# Or connect GitHub repo to Vercel dashboard
# Add environment variables in Vercel Project Settings > Environment Variables
```

---

## Core Algorithm

```
Final Score = Σ(rating × trust_score) / Σ(trust_score)
```

- Each user starts with `trust_score = 1.0`
- Writing reviews > 100 chars: `+0.10`
- Writing reviews 30–100 chars: `+0.05`
- Maximum trust score: `5.0`
- Score is capped to prevent inflation

---

## Firestore Collections

### `users/{userId}`
```json
{
  "user_id": "uid",
  "username": "student123",
  "email": "student@example.com",
  "trust_score": 1.05,
  "review_count": 2,
  "schools_added": 1,
  "created_at": "timestamp"
}
```

### `schools/{schoolId}`
```json
{
  "name": "Delhi Public School",
  "city": "New Delhi",
  "state": "Delhi",
  "board": "CBSE",
  "created_by": "uid",
  "review_count": 14,
  "confidence_level": "high",
  "avg_overall": 3.82,
  "avg_teaching": 4.1,
  "avg_concept_clarity": 3.9,
  "avg_doubt_solving": 3.6,
  "avg_homework": 3.2,
  "avg_pressure": 4.3,
  "weighted_sum": 16.5,
  "created_at": "timestamp"
}
```

### `reviews/{userId_schoolId}`
```json
{
  "user_id": "uid",
  "username": "student123",
  "school_id": "schoolId",
  "ratings": {
    "teaching": 4,
    "concept_clarity": 4,
    "doubt_solving": 3,
    "homework": 3,
    "pressure": 4
  },
  "written_review": "The science teachers are excellent...",
  "trust_score": 1.1,
  "timestamp": "timestamp"
}
```

---

## User Flow

```
/ (Landing) → /language → /onboarding → /auth → /school/select → /school/:id → /review/:schoolId
```

---

## Features Checklist

- [x] Landing page with hero, problem/solution, features
- [x] Language toggle (English / Hindi)
- [x] Onboarding slides
- [x] Auth (signup/login) with Firebase
- [x] School search with autocomplete
- [x] Add school form (duplicate check)
- [x] School profile with trust-weighted ratings
- [x] Category breakdown (5 dimensions)
- [x] Anonymous review submission
- [x] One review per user per school enforcement
- [x] Trust score system
- [x] User profile with review history
- [x] Settings (language toggle, logout)
- [x] Loading skeletons
- [x] Mobile responsive
- [x] Framer Motion animations
- [x] Firestore security rules
- [x] Input validation & abuse word filtering

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```
