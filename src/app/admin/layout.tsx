// This layout marks all /admin/* routes as dynamic (server-rendered on each request)
// so they are never statically prerendered at build time.
export const dynamic = 'force-dynamic'

import type { ReactNode } from 'react'

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
