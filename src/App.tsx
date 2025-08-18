import { Layout, Section } from './components/Layout'
import { sections } from './sections'

export function App() {
  return (
    <Layout>
      {sections.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          title={section.title}
          description={section.description}
        >
          {section.component()}
        </Section>
      ))}
    </Layout>
  )
}
