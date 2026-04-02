'use client'
import { useEffect, useRef } from 'react'

export default function PixelFire() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const fireWidth = 100
    const fireHeight = 80
    const firePixels = new Uint8ClampedArray(fireWidth * fireHeight)

    canvas.width = fireWidth
    canvas.height = fireHeight

    // 火焰调色板 - DOOM 风格
    const firePalette: Array<{ r: number; g: number; b: number }> = []
    for (let x = 0; x < 256; x++) {
      const r = x < 128 ? x * 2 : 255
      const g = x < 128 ? 0 : (x - 128) * 2
      const b = x < 192 ? 0 : (x - 192) * 4
      firePalette.push({ r, g, b })
    }

    // 初始化底部为白色
    for (let i = 0; i < fireWidth; i++) {
      firePixels[(fireHeight - 1) * fireWidth + i] = 255
    }

    function spreadFire(src: number) {
      const pixel = firePixels[src]
      if (pixel === 0) {
        firePixels[src - fireWidth] = 0
      } else {
        const randIdx = Math.round(Math.random() * 3.0) & 3
        const dst = src - randIdx + 1
        firePixels[dst - fireWidth] = pixel - (randIdx & 1)
      }
    }

    function doFire() {
      for (let x = 0; x < fireWidth; x++) {
        for (let y = 1; y < fireHeight; y++) {
          spreadFire(y * fireWidth + x)
        }
      }
    }

    function renderFire() {
      const image = ctx.createImageData(fireWidth, fireHeight)
      for (let i = 0; i < firePixels.length; i++) {
        const color = firePalette[firePixels[i]]
        image.data[i * 4] = color.r
        image.data[i * 4 + 1] = color.g
        image.data[i * 4 + 2] = color.b
        image.data[i * 4 + 3] = 255
      }
      ctx.putImageData(image, 0, 0)
    }

    function animate() {
      doFire()
      renderFire()
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '400px',
        height: '320px',
        imageRendering: 'pixelated',
      }}
    />
  )
}
