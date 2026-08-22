/** Primary navigation. Order here is the order everywhere — header and footer. */
export interface NavItem {
  label: string
  to: string
}

export const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Tools', to: '/tools' },
  { label: 'Games', to: '/games' },
  { label: 'Blog', to: '/blog' },
]
