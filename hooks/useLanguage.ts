'use client'
import { useState, useEffect } from 'react'

export type Language = 'en' | 'hi'

export const translations = {
  en: {
    appName: 'EDULYTICS',
    tagline: 'See the REAL truth about schools',
    getStarted: 'Get Started',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    dashboard: 'Dashboard',
    explore: 'Explore Schools',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log Out',
    writeReview: 'Write a Review',
    searchSchools: 'Search schools...',
    addSchool: 'Add School',
    noReviews: 'No reviews yet. Be the first!',
    loading: 'Loading...',
    teaching: 'Teaching Quality',
    concept_clarity: 'Concept Clarity',
    doubt_solving: 'Doubt Solving',
    homework: 'Homework Load',
    pressure: 'Academic Pressure',
    overallRating: 'Overall Rating',
    trustWeighted: 'Trust-Weighted Score',
    reviews: 'Reviews',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    schoolName: 'School Name',
    city: 'City',
    state: 'State',
    board: 'Board',
  },
  hi: {
    appName: 'EDULYTICS',
    tagline: 'स्कूलों के बारे में सच्चाई जानें',
    getStarted: 'शुरू करें',
    signIn: 'लॉग इन',
    signUp: 'साइन अप',
    dashboard: 'डैशबोर्ड',
    explore: 'स्कूल खोजें',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    writeReview: 'समीक्षा लिखें',
    searchSchools: 'स्कूल खोजें...',
    addSchool: 'स्कूल जोड़ें',
    noReviews: 'अभी तक कोई समीक्षा नहीं। पहले बनें!',
    loading: 'लोड हो रहा है...',
    teaching: 'शिक्षण गुणवत्ता',
    concept_clarity: 'अवधारणा स्पष्टता',
    doubt_solving: 'संशय समाधान',
    homework: 'गृहकार्य भार',
    pressure: 'शैक्षणिक दबाव',
    overallRating: 'समग्र रेटिंग',
    trustWeighted: 'विश्वास-भारित स्कोर',
    reviews: 'समीक्षाएं',
    username: 'उपयोगकर्ता नाम',
    email: 'ईमेल',
    password: 'पासवर्ड',
    schoolName: 'स्कूल का नाम',
    city: 'शहर',
    state: 'राज्य',
    board: 'बोर्ड',
  },
}

export const useLanguage = () => {
  const [lang, setLang] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem('edulytics_lang') as Language
    if (stored === 'en' || stored === 'hi') setLang(stored)
  }, [])

  const setLanguage = (l: Language) => {
    localStorage.setItem('edulytics_lang', l)
    setLang(l)
  }

  const t = translations[lang]
  return { lang, setLanguage, t }
}
