'use client'
import { useState, useEffect } from 'react'

export type Language = 'en' | 'hi'

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

  return { lang, setLanguage }
}
