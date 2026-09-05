import { Mail } from 'lucide-react'
import { Section } from '../ui/Section'
import { ButtonAnchor } from '../ui/Button'
import { mailto } from '../../config/site'
import { services } from '../../data/services'

/**
 * Services.
 *
 * One card per offer: what it is, and what the client hands over. Copy stays
 * concrete ("you send X — you get Y") instead of agency prose, and every
 * service maps to practice the site already describes. A single shared CTA
 * opens an email — there is no backend, so there is no fake form.
 */
export function Services() {
  return (
    <Section
      id="services"
      eyebrow="Services"
      title="What you can hire me for"
      intro="Fixed, understandable offers. Tell me which one fits and what you have — I reply by email."
      action={
        <ButtonAnchor href={mailto} variant="primary">
          <Mail aria-hidden="true" className="size-4" />
          Discuss a project
        </ButtonAnchor>
      }
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <li key={service.id} className="panel panel--interactive flex flex-col p-6">
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-[var(--r-sm)] border border-[var(--c-line)] bg-[var(--c-glass-1)] text-[var(--c-accent)]"
              >
                <Icon className="size-5" />
              </span>
              <h3 className="font-display mt-4 text-lg font-semibold tracking-tight">
                {service.title}
              </h3>
              <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                {service.description}
              </p>
              <p className="text-faint mt-4 border-t border-[var(--c-line)] pt-3 text-xs leading-relaxed">
                {service.input}
              </p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
