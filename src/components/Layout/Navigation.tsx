import { useState, useEffect } from 'react'
import { COLOR_PALETTE } from '@/utils/colorPalette'
import styles from './Navigation.module.css'

interface NavigationItem {
  id: string
  title: string
  description: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'gradient-waves',
    title: 'Gradient Waves',
    description: 'Flowing animated gradients'
  },
  {
    id: 'moving-gradients',
    title: 'Moving Gradients', 
    description: 'Dynamic color transitions'
  },
  {
    id: 'complex-gradients',
    title: 'Complex Gradients',
    description: 'Multi-layered color effects'
  }
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState(navigationItems[0].id)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]')
      const scrollPosition = window.scrollY + window.innerHeight / 2

      sections.forEach((section) => {
        const element = section as HTMLElement
        const top = element.offsetTop
        const bottom = top + element.offsetHeight

        if (scrollPosition >= top && scrollPosition <= bottom) {
          setActiveSection(element.dataset.section || '')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(`[data-section="${sectionId}"]`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={styles.navigation}>
      <div className={styles.header}>
        <h1 className={styles.title}>Generative<br />Sentry</h1>
        <p className={styles.subtitle}>Interactive Art Collection</p>
      </div>

      <ul className={styles.menu}>
        {navigationItems.map((item, index) => (
          <li key={item.id} className={styles.menuItem}>
            <button
              className={`${styles.menuButton} ${
                activeSection === item.id ? styles.active : ''
              }`}
              onClick={() => scrollToSection(item.id)}
            >
              <div className={styles.menuContent}>
                <span className={styles.menuTitle}>{item.title}</span>
                <span className={styles.menuDescription}>{item.description}</span>
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
