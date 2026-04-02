'use client'
import { useEffect, useRef } from 'react'

export default function SmallPixelFire() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 清理可能存在的旧canvas
    const existingCanvas = containerRef.current.querySelector('canvas')
    if (existingCanvas) {
      existingCanvas.remove()
    }

    const PIXI = (window as any).PIXI
    const TweenMax = (window as any).TweenMax

    if (PIXI && TweenMax && PIXI.filters?.AdvancedBloomFilter) {
      initFire()
      return
    }

    const script1 = document.createElement('script')
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.4.3/pixi.min.js'

    const script2 = document.createElement('script')
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.2/TweenMax.min.js'

    const script3 = document.createElement('script')
    script3.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/PixiPlugin.min.js?r=3'

    const script4 = document.createElement('script')
    script4.src = 'https://cdn.jsdelivr.net/npm/pixi-filters@2.6.1/dist/pixi-filters.js'

    let loaded = 0
    const onLoad = () => {
      loaded++
      if (loaded === 4) initFire()
    }

    script1.onload = onLoad
    script2.onload = onLoad
    script3.onload = onLoad
    script4.onload = onLoad

    document.head.appendChild(script1)
    document.head.appendChild(script2)
    document.head.appendChild(script3)
    document.head.appendChild(script4)

    function initFire() {
      const PIXI = (window as any).PIXI
      const TweenMax = (window as any).TweenMax
      const Power1 = (window as any).Power1
      const Power0 = (window as any).Power0

      if (!PIXI?.filters?.AdvancedBloomFilter) {
        setTimeout(initFire, 100)
        return
      }

      class Ember {
        emberBlobs: any[] = []
        embers: any

        constructor(colors: number[], app: any) {
          this.embers = new PIXI.Container()
          colors.forEach(color => {
            const circle = new PIXI.Graphics()
            circle.lineStyle(0)
            circle.beginFill(color, 1)
            circle.drawCircle(0, 0, 3)
            circle.endFill()
            this.emberBlobs.push(app.renderer.generateTexture(circle))
          })
          setInterval(() => this.addEmber(), 800)
        }

        makeBlob() {
          const texture = this.emberBlobs[Math.floor(Math.random() * this.emberBlobs.length)]
          const blob = new PIXI.Sprite(texture)
          blob.anchor.set(0.5)
          const scaleScale = Math.random()
          blob.scale.set(0.4 * scaleScale, 0.5 * scaleScale)
          return blob
        }

        addEmber() {
          const time = (2 + Math.random() * 1.5) * (0.3 + Math.random() * 0.6)
          const blob = this.makeBlob()
          this.embers.addChild(blob)
          const bezier = [
            { x: Math.random() * 30 - 15, y: -30 },
            { x: Math.random() * 40 - 20, y: -40 + Math.random() * -10 },
            { x: Math.random() * 50 - 25, y: -80 + Math.random() * -20 }
          ]
          TweenMax.to(blob, time / 2, { delay: time / 2, ease: Power1.easeOut, alpha: 0 })
          TweenMax.to(blob.position, time, {
            ease: Power1.easeOut,
            bezier,
            onComplete: () => this.embers.removeChild(blob)
          })
        }
      }

      class Fire {
        flame: any
        cutout: any
        fire: any
        fireBlob: any
        cutoutBlob: any

        constructor(color: number, app: any) {
          this.flame = new PIXI.Container()
          this.cutout = new PIXI.Container()
          this.fire = new PIXI.Container()
          this.flame.addChild(this.fire)
          this.flame.addChild(this.cutout)
          this.fire.alpha = 0.7

          const circle = new PIXI.Graphics()
          circle.lineStyle(0)
          circle.beginFill(color, 1)
          circle.drawCircle(0, 0, 15)
          circle.endFill()
          this.fireBlob = app.renderer.generateTexture(circle)

          const cutoutCircle = new PIXI.Graphics()
          cutoutCircle.lineStyle(0)
          cutoutCircle.beginFill(0x000000, 1)
          cutoutCircle.drawCircle(0, 0, 18)
          cutoutCircle.endFill()
          this.cutoutBlob = app.renderer.generateTexture(cutoutCircle)

          const bloom = new PIXI.filters.AdvancedBloomFilter(0.45, 0.5, 0.5)
          const voidFilter = new PIXI.filters.VoidFilter()
          this.flame.filters = [bloom, voidFilter]
          this.flame.filters[this.flame.filters.length - 1].blendMode = PIXI.BLEND_MODES.SCREEN

          setInterval(() => {
            this.addFlame()
            this.addCutout(Math.random() > 0.5)
          }, 80)
        }

        makeBlob(texture: any) {
          const blob = new PIXI.Sprite(texture)
          blob.anchor.set(0.5)
          return blob
        }

        addCutout(left: boolean) {
          const time = (1 + Math.random() * 0.4) * (0.7 + Math.random() * 0.2)
          const blob = this.makeBlob(this.cutoutBlob)
          this.cutout.addChild(blob)
          const scale = [1, 0.75 + Math.random()]
          blob.position.x = (50 + Math.random() * 20) * (left ? -1 : 1)
          const targetX = (5 + Math.random() * 20) * (left ? -1 : 1)
          blob.scale.set(scale[0])
          TweenMax.to(blob, time, {
            ease: Power1.easeIn,
            pixi: { x: targetX, y: -100, scaleX: scale[1], scaleY: scale[1] },
            onComplete: () => this.cutout.removeChild(blob)
          })
        }

        addFlame() {
          const time = 1 + Math.random() * 0.4
          const blob = this.makeBlob(this.fireBlob)
          this.fire.addChild(blob)
          const scale = [1.2 + Math.random(), 0.5 + Math.random()]
          const bezier = [
            { x: 0, y: 0 },
            { x: Math.random() * 30 - 15, y: Math.random() * -10 },
            { x: Math.random() * 30 - 15, y: Math.random() * -20 - 20 },
            { x: 0, y: -60 + Math.random() * -30 }
          ]
          blob.scale.set(scale[0])
          TweenMax.to(blob, time, { ease: Power0.easeOut, bezier })
          TweenMax.to(blob, time, {
            pixi: { scaleX: scale[1], scaleY: scale[1] },
            onComplete: () => this.fire.removeChild(blob)
          })
        }

        setY(y: number) { this.flame.position.y = y }
        setScale(s: number) { this.flame.scale.set(s) }
      }

      const app = new PIXI.Application(120, 120, {
        antialias: true,
        backgroundColor: 0x292726,
        transparent: false
      })
      containerRef.current!.appendChild(app.view)

      const stage = new PIXI.Container()
      const flamesContainer = new PIXI.Container()
      app.stage.addChild(stage)
      stage.addChild(flamesContainer)

      stage.position.x = 60
      stage.position.y = 90

      const flames = [
        { color: 0xE23B00, scale: 0.5, offset: -10 },
        { color: 0xFE8200, scale: 0.5, offset: -5 },
        { color: 0xFBE416, scale: 0.45, offset: 5 },
        { color: 0xFDFDB4, scale: 0.35, offset: 10 }
      ]

      const ember = new Ember([0xFE9C00, 0xFEA600, 0xE27100], app)
      flamesContainer.addChild(ember.embers)

      flames.forEach(settings => {
        const fire = new Fire(settings.color, app)
        fire.setY(settings.offset)
        fire.setScale(settings.scale)
        fire.flame.pivot.set(0, 10)
        flamesContainer.addChild(fire.flame)
      })
    }

    return () => {
      if (document.head.contains(script1)) document.head.removeChild(script1)
      if (document.head.contains(script2)) document.head.removeChild(script2)
      if (document.head.contains(script3)) document.head.removeChild(script3)
      if (document.head.contains(script4)) document.head.removeChild(script4)
    }
  }, [])

  return <div ref={containerRef} style={{ width: '120px', height: '120px' }} />
}
