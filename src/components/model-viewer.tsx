import { useEffect, useRef, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { useChatStore } from "@/modules/chat/hooks/use-chat-store"
import modelUrl from "../models/3d_small.glb?url"

export function ModelViewer() {
  const mountRef = useRef<HTMLDivElement>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const clockRef = useRef<THREE.Clock | null>(null)
  const idleActionRef = useRef<THREE.AnimationAction | null>(null)
  const speakingActionRef = useRef<THREE.AnimationAction | null>(null)

  const isSpeaking = useChatStore((s) => s.isSpeaking)
  const setSpeaking = useChatStore((s) => s.setSpeaking)

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) return
    const session = useChatStore.getState().sessions.find(
      (s) => s.id === useChatStore.getState().activeSessionId
    )
    const lastMsg = session?.messages.filter((m) => m.role === "assistant").pop()
    if (!lastMsg?.content) return
    const utterance = new SpeechSynthesisUtterance(lastMsg.content)
    utterance.rate = 1.1
    utterance.pitch = 1.0
    speechSynthesis.speak(utterance)
    setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
  }, [setSpeaking])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    // Camera positioned closer and lower to frame a half-body model
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 1.2, 3.0)
    camera.lookAt(0, 0.8, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const dir = new THREE.DirectionalLight(0xffffff, 2)
    dir.position.set(1, 3, 2)
    scene.add(dir)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableRotate = true
    controls.enableZoom = true
    controls.enablePan = false
    // Limit rotation to not go behind the model
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI * 0.85
    controls.target.set(0, 0.8, 0)

    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene

        // Center and scale the model for half-body framing
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.0 / maxDim
        model.scale.setScalar(scale)

        // Position model so feet are near bottom, upper body visible
        const newBox = new THREE.Box3().setFromObject(model)
        const newCenter = newBox.getCenter(new THREE.Vector3())
        model.position.x -= newCenter.x
        model.position.y -= newCenter.y
        model.position.y += size.y * scale * 0.05

        scene.add(model)

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(gltf.scene)
          mixerRef.current = mixer
          clockRef.current = new THREE.Clock()

          const actions = gltf.animations.map((clip) => {
            const action = mixer.clipAction(clip)
            const name = clip.name.toLowerCase()
            action.clampWhenFinished = true
            action.loop = THREE.LoopRepeat
            if (name.includes("talk") || name.includes("speak") || name.includes("mouth")) {
              speakingActionRef.current = action
            } else if (name.includes("idle") || name.includes("breath") || name.includes("stand")) {
              idleActionRef.current = action
            }
            return action
          })

          if (!speakingActionRef.current) {
            speakingActionRef.current = actions[0] || null
          }
          if (!idleActionRef.current) {
            idleActionRef.current = actions[0] || null
          }

          if (idleActionRef.current) {
            idleActionRef.current.play()
          }
        }
      },
      undefined,
      (err) => console.error("Failed to load model:", err),
    )

    const animate = () => {
      requestAnimationFrame(animate)
      const dt = clockRef.current?.getDelta() ?? 0.016
      mixerRef.current?.update(dt)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      controls.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (!mixerRef.current || !speakingActionRef.current || !idleActionRef.current) return

    if (isSpeaking) {
      idleActionRef.current.fadeOut(0.5)
      speakingActionRef.current.reset()
      speakingActionRef.current.fadeIn(0.5)
      speakingActionRef.current.play()
    } else {
      speakingActionRef.current.fadeOut(0.5)
      idleActionRef.current.reset()
      idleActionRef.current.fadeIn(0.5)
      idleActionRef.current.play()
    }
  }, [isSpeaking])

  return (
    <div ref={mountRef} className="h-full w-full" aria-label="3D model viewer">
      <button
        onClick={speak}
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          padding: "8px 16px",
          borderRadius: 20,
          border: "none",
          background: "rgba(99,102,241,0.9)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
        }}
      >
        💬 Chat
      </button>
    </div>
  )
}
