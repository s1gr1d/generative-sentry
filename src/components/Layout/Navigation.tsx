import { useState, useEffect } from 'react'
import { sections } from '@/sections'
import styles from './Navigation.module.css'

export function Navigation() {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')

  useEffect(() => {
    // Set initial section from URL hash
    const hash = window.location.hash.slice(1)
    if (hash && sections.find(s => s.id === hash)) {
      setActiveSection(hash)
    }

    const handleScroll = () => {
      const sectionElements = document.querySelectorAll('[data-section]')
      const scrollPosition = window.scrollY + window.innerHeight / 2

      sectionElements.forEach((section) => {
        const element = section as HTMLElement
        const top = element.offsetTop
        const bottom = top + element.offsetHeight

        if (scrollPosition >= top && scrollPosition <= bottom) {
          const sectionId = element.dataset.section || ''
          if (sectionId !== activeSection) {
            setActiveSection(sectionId)
            // Update URL hash without triggering scroll
            window.history.replaceState(null, '', `#${sectionId}`)
          }
        }
      })
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && sections.find(s => s.id === hash)) {
        setActiveSection(hash)
        // Scroll to section if hash changes from URL navigation
        scrollToSection(hash)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [activeSection])

  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(`[data-section="${sectionId}"]`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      // Update URL hash
      window.history.pushState(null, '', `#${sectionId}`)
    }
  }

  return (
    <nav className={styles.navigation}>
      <div className={styles.header}>
        <h1 className={styles.title}>Generative<br />Sentry</h1>
        <p className={styles.subtitle}>Interactive Art Collection</p>
      </div>

      <ul className={styles.menu}>
        {sections.map((section) => (
          <li key={section.id} className={styles.menuItem}>
            <button
              className={`${styles.menuButton} ${
                activeSection === section.id ? styles.active : ''
              }`}
              onClick={() => scrollToSection(section.id)}
            >
              <div className={styles.menuContent}>
                <span className={styles.menuTitle}>{section.title}</span>
                <span className={styles.menuDescription}>{section.description}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Scroll to explore<br />
          <span className={styles.accent}>↓</span>
        </p>
      </div>
    </nav>
  )
}
