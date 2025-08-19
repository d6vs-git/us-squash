"use client"

import type { FC } from "react"
import Lottie from "lottie-react"
import loadingAnimation from "../../../public/assets/lottie/loading.json"

interface LoadingProps {
  className?: string
  width?: number
  height?: number
}

const Loading: FC<LoadingProps> = ({ className, width = 80, height = 80 }) => (
  <div
    className={`fixed inset-0 flex items-center justify-center bg-background text-foreground z-50 ${className || ""}`}
  >
    <div style={{ width, height }}>
      <Lottie animationData={loadingAnimation} loop autoplay style={{ width: "100%", height: "100%" }} />
    </div>
  </div>
)

export default Loading
