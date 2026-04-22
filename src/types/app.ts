export type AppSection = {
  readonly title: string
  readonly description: string
}

export const appSections = [
  {
    title: 'app',
    description: 'Application-level providers and store bootstrap live here.',
  },
  {
    title: 'routes',
    description: 'Route modules are isolated from presentational components.',
  },
  {
    title: 'components',
    description: 'UI primitives, layouts, and feature-specific blocks stay separate.',
  },
  {
    title: 'api',
    description: 'Transport, shared API configuration, and models are grouped together.',
  },
  {
    title: 'store',
    description: 'Feature slices and selectors can be added without bloating app setup.',
  },
  {
    title: 'lib',
    description: 'Reusable environment and helper utilities stay framework-agnostic.',
  },
] satisfies ReadonlyArray<AppSection>
