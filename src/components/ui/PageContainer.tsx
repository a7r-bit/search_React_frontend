import type { PropsWithChildren } from 'react'

type PageContainerProps = PropsWithChildren

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div
      style={{
        // width: 'min(960px, 100%)',
        width: '100%',
        margin: '0 auto',
        padding: '0 1.5rem',
      }}
    >
      {children}
    </div>
  )
}
