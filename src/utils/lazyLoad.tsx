import { ReactNode, Suspense } from "react"

export function Loading() {
  return (
    <div>
      <span>
        加载中
      </span>
    </div>
  )
}

export const lazyLoad = (children: ReactNode) => {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  )
}