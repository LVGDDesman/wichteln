import { useEffect, useRef } from "react"

type Flake = {
    x: number
    y: number
    radius: number
    speed: number
    drift: number
    phase: number
    opacity: number
}

type SnowfallProps = {
    /** Schneeflocken pro 10.000 px² Bildschirmfläche */
    density?: number
}

/**
 * Leichter Schneefall als Canvas-Overlay über der ganzen Seite.
 * Blockiert keine Klicks und pausiert bei "prefers-reduced-motion".
 */
export function Snowfall({ density = 0.18 }: SnowfallProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        )
        if (reducedMotion.matches) return

        let width = 0
        let height = 0
        let flakes: Flake[] = []
        let frameId = 0
        let lastTime = performance.now()

        const createFlake = (randomY: boolean): Flake => ({
            x: Math.random() * width,
            y: randomY ? Math.random() * height : -5,
            radius: 1 + Math.random() * 2.5,
            speed: 20 + Math.random() * 40,
            drift: 10 + Math.random() * 20,
            phase: Math.random() * Math.PI * 2,
            opacity: 0.5 + Math.random() * 0.5,
        })

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            const target = Math.round(((width * height) / 10000) * density)
            if (flakes.length > target) flakes = flakes.slice(0, target)
            while (flakes.length < target) flakes.push(createFlake(true))
        }

        const tick = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.1)
            lastTime = now

            ctx.clearRect(0, 0, width, height)
            for (let i = 0; i < flakes.length; i++) {
                const f = flakes[i]
                f.phase += dt
                f.y += f.speed * dt
                f.x += Math.sin(f.phase) * f.drift * dt

                if (f.y - f.radius > height) {
                    flakes[i] = createFlake(false)
                    continue
                }
                if (f.x < -5) f.x = width + 5
                else if (f.x > width + 5) f.x = -5

                ctx.beginPath()
                ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`
                ctx.fill()
                // dezenter Rand, damit die Flocken auch auf hellem Hintergrund sichtbar sind
                ctx.strokeStyle = `rgba(160, 180, 210, ${f.opacity * 0.5})`
                ctx.lineWidth = 0.5
                ctx.stroke()
            }
            frameId = requestAnimationFrame(tick)
        }

        resize()
        window.addEventListener("resize", resize)
        frameId = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(frameId)
            window.removeEventListener("resize", resize)
        }
    }, [density])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-50"
        />
    )
}
