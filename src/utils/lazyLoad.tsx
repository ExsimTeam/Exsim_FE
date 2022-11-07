import { Spin } from "antd"
import { ReactNode, Suspense } from "react"

export function Loading() {
  return (
    <div
      style={{
        width: '100%',
        paddingTop: '100px'
      }}
    >
      <Spin
        size="large"
        style={{
          width: '100%',
          textAlign: 'center'
        }}
      />
      <div
        style={{
          textAlign: 'center',
          paddingTop: 30
        }}
      >
        <span
          style={{
            fontSize: 16
          }}
        >请稍候</span>
      </div>
    </div >
  )
}

export const lazyLoad = (children: ReactNode) => {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  )
}