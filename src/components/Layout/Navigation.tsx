import { useState, useEffect, useRef } from 'react'
import { sections } from '@/sections'
import styles from './Navigation.module.css'

export function Navigation() {
  // Check for hash in URL immediately to prevent visual flash
  const getInitialSection = () => {
    const hash = window.location.hash.slice(1)
    if (hash && sections.find(s => s.id === hash)) {
      return hash
    }
    return sections[0]?.id || ''
  }

  const [activeSection, setActiveSection] = useState(getInitialSection)
  const activeSectionRef = useRef(activeSection)
  const isInitialNavigationRef = useRef(false)
  const buttonRefsRef = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Update ref whenever state changes
  const updateActiveSection = (sectionId: string) => {
    setActiveSection(sectionId)
    activeSectionRef.current = sectionId
  }

  const scrollToSection = (sectionId: string, updateHash: boolean = true) => {
    const section = document.querySelector(`[data-section="${sectionId}"]`)
    const scrollContainer = document.querySelector('main') as HTMLElement ||
                           document.querySelector('[class*="main"]') as HTMLElement
    
    if (section && scrollContainer) {
      // Immediately update active section for instant UI feedback (no focus needed since button click already focuses)
      if (updateHash) {
        updateActiveSection(sectionId)
        if (import.meta.env.DEV) {
          console.log(`🎯 Immediately updating active section to: ${sectionId}`)
        }
      }
      
      // Set flag to prevent scroll detection during navigation
      if (updateHash) {
        isInitialNavigationRef.current = true
        if (import.meta.env.DEV) {
          console.log(`🎯 Navigating to section: ${sectionId}`)
        }
      }
      
      const sectionElement = section as HTMLElement
      scrollContainer.scrollTo({
        top: sectionElement.offsetTop,
        behavior: 'smooth'
      })
      
      // Update URL hash only if requested
      if (updateHash) {
        window.history.pushState(null, '', `#${sectionId}`)
        // Clear the flag after scroll animation completes
        setTimeout(() => {
          isInitialNavigationRef.current = false
          if (import.meta.env.DEV) {
            console.log('✅ Manual navigation complete, re-enabling scroll detection')
          }
        }, 1000)
      }
    }
  }

  useEffect(() => {
    // Initialize ref with initial state
    activeSectionRef.current = activeSection
    
    if (import.meta.env.DEV) {
      console.log(`🎯 Navigation initialized with section: ${activeSection}`)
    }
    
    // If we have a hash section (non-first section), scroll to it
    const hash = window.location.hash.slice(1)
    if (hash && hash !== sections[0]?.id && sections.find(s => s.id === hash)) {
      isInitialNavigationRef.current = true
      if (import.meta.env.DEV) {
        console.log(`🚀 Scrolling to initial hash section: ${hash}`)
      }
      // Small delay to ensure DOM is ready, then scroll to section
      setTimeout(() => {
        scrollToSection(hash, false) // Don't update hash since it's already in URL
        // Clear the flag after scroll animation completes
        setTimeout(() => {
          isInitialNavigationRef.current = false
          if (import.meta.env.DEV) {
            console.log('✅ Initial navigation complete, re-enabling scroll detection')
          }
        }, 1000) // Allow time for smooth scroll to complete
      }, 100)
    } else {
      // No hash, invalid hash, or first section - normal scroll detection can proceed
      isInitialNavigationRef.current = false
    }

    // Find the scrollable main container
    const getScrollContainer = () => {
      return document.querySelector('main') as HTMLElement ||
             document.querySelector('[class*="main"]') as HTMLElement
    }

    const handleScroll = (scrollContainer: HTMLElement) => {
      // Skip scroll detection during initial navigation
      if (isInitialNavigationRef.current) {
        if (import.meta.env.DEV) {
          console.log('⏸️ Skipping scroll detection during initial navigation')
        }
        return
      }

      const sectionElements = document.querySelectorAll('[data-section]')
      const containerRect = scrollContainer.getBoundingClientRect()
      const scrollTop = scrollContainer.scrollTop
      const viewportHeight = containerRect.height
      const scrollPosition = scrollTop + viewportHeight / 3

      let currentSection = ''
      let closestSection = ''
      let closestDistance = Infinity

      // Special case: if we're at the very top, always select the first section
      if (scrollTop <= 50) { // Small threshold for top boundary
        const firstSection = sectionElements[0]
        if (firstSection) {
          currentSection = firstSection.getAttribute('data-section') || ''
          if (import.meta.env.DEV) {
            console.log('Top boundary detected, selecting first section:', currentSection)
          }
        }
      } else {
        // Find the section closest to the scroll position
        sectionElements.forEach((section) => {
          const element = section as HTMLElement
          const top = element.offsetTop
          const bottom = top + element.offsetHeight
          const sectionId = element.dataset.section || ''

          // Check if scroll position is within section bounds
          if (scrollPosition >= top && scrollPosition <= bottom) {
            currentSection = sectionId
          }

          // Also track the closest section for fallback
          const distanceFromTop = Math.abs(scrollPosition - top)
          if (distanceFromTop < closestDistance) {
            closestDistance = distanceFromTop
            closestSection = sectionId
          }
        })
      }

      // Use closest section if no section contains the scroll position
      const detectedSection = currentSection || closestSection

      // Debug logging (remove in production)
      if (import.meta.env.DEV) {
        console.log('Scroll Debug:', {
          scrollTop,
          scrollPosition,
          viewportHeight,
          detectedSection,
          currentActiveSection: activeSectionRef.current,
          isTopBoundary: scrollTop <= 50,
          currentSection,
          closestSection,
          sections: Array.from(sectionElements).map(el => ({
            id: el.getAttribute('data-section'),
            top: (el as HTMLElement).offsetTop,
            bottom: (el as HTMLElement).offsetTop + (el as HTMLElement).offsetHeight,
            isInView: scrollPosition >= (el as HTMLElement).offsetTop && 
                     scrollPosition <= (el as HTMLElement).offsetTop + (el as HTMLElement).offsetHeight
          }))
        })
      }

      if (detectedSection && detectedSection !== activeSectionRef.current) {
        console.log(`🔄 Updating active section from "${activeSectionRef.current}" to "${detectedSection}"`)
        updateActiveSection(detectedSection)
        // Update URL hash without triggering scroll
        window.history.replaceState(null, '', `#${detectedSection}`)
      } else if (import.meta.env.DEV && detectedSection) {
        console.log(`⚪ No update needed - detected: "${detectedSection}", active: "${activeSectionRef.current}"`)
      }
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && sections.find(s => s.id === hash)) {
        isInitialNavigationRef.current = true
        updateActiveSection(hash)
        if (import.meta.env.DEV) {
          console.log(`🔄 Hash changed to section: ${hash}`)
        }
        // Scroll to section if hash changes from URL navigation
        scrollToSection(hash, false) // Don't update hash since it already changed
        // Clear the flag after scroll animation completes
        setTimeout(() => {
          isInitialNavigationRef.current = false
          if (import.meta.env.DEV) {
            console.log('✅ Hash change navigation complete, re-enabling scroll detection')
          }
        }, 1000)
      }
    }

    // Get the scroll container and set up event listeners
    const scrollContainer = getScrollContainer()
    if (!scrollContainer) {
      console.warn('Could not find scroll container')
      return
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll(scrollContainer)
          ticking = false
        })
        ticking = true
      }
    }

    // Initial scroll check to set correct section
    handleScroll(scrollContainer)

    scrollContainer.addEventListener('scroll', throttledHandleScroll, { passive: true })
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      scrollContainer.removeEventListener('scroll', throttledHandleScroll)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

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
              ref={(el) => {
                if (el) {
                  buttonRefsRef.current.set(section.id, el)
                } else {
                  buttonRefsRef.current.delete(section.id)
                }
              }}
              className={`${styles.menuButton} ${
                activeSection === section.id ? styles.active : ''
              }`}
              onClick={() => scrollToSection(section.id)}
              aria-current={activeSection === section.id ? 'true' : 'false'}
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
