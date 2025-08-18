import { ReactNode } from 'react'
import styles from './Section.module.css'

interface SectionProps {
  id: string
  title: string
  bodyText: string
  children: ReactNode
  className?: string
}

export function Section({ id, title, bodyText, children, className }: SectionProps) {
  return (
    <section 
      className={`${styles.section} ${className || ''}`}
      data-section={id}
    >
      <div className={styles.content}>
        <div className={styles.artContainer}>
          {children}
        </div>
        <div className={styles.textContainer}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{bodyText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
