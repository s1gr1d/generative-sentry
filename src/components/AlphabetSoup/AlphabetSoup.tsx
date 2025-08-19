import React, { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import * as THREE from 'three'
import { 
  COLOR_PALETTE, 
  NORMALIZED_RGB
} from '@/utils/colorPalette'
import type { SentryEnvelope } from '@/types/sentryEnvelope'

export interface AlphabetSoupProps {
  /** Sentry envelope data to extract text from */
  envelopes: SentryEnvelope[]
  /** Maximum number of letters to display (default: 150) */
  maxLetters?: number
  /** Radius of the soup bowl (default: 800) */
  bowlRadius?: number
  /** Base floating speed (default: 0.3) */
  floatSpeed?: number
  /** Force multiplier for mouse interactions (default: 5) */
  forceMultiplier?: number
}

interface LetterData {
  id: string
  character: string
  position: THREE.Vector3
  originalPosition: THREE.Vector3
  velocity: THREE.Vector3
  color: keyof typeof COLOR_PALETTE
  size: number
  sourceType: 'message' | 'function' | 'exception' | 'module' | 'platform'
  errorLevel: SentryEnvelope['level']
  errorType: string
  phaseOffset: number
  rotationSpeed: THREE.Vector3
  isHovered: boolean
  lastHoverTime: number
}

const AlphabetSoup: React.FC<AlphabetSoupProps> = ({
  envelopes,
  maxLetters = 150,
  bowlRadius = 800,
  floatSpeed = 0.3,
  forceMultiplier = 5
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const lettersRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const { camera, raycaster, pointer } = useThree()
  const setHoveredLetter = useState<string | null>(null)[1]
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })

  // Extract meaningful text from Sentry envelopes
  const extractTextFromEnvelopes = (envelopes: SentryEnvelope[]): Array<{
    text: string
    sourceType: LetterData['sourceType']
    errorLevel: SentryEnvelope['level']
    errorType: string
  }> => {
    const textSources: Array<{
      text: string
      sourceType: LetterData['sourceType']
      errorLevel: SentryEnvelope['level']
      errorType: string
    }> = []

    envelopes.forEach(envelope => {
      const errorType = envelope.platform || 'unknown'
      
      // Extract from error messages
      if (envelope.message) {
        textSources.push({
          text: envelope.message,
          sourceType: 'message',
          errorLevel: envelope.level,
          errorType
        })
      }

      // Extract from error titles
      if (envelope.title) {
        textSources.push({
          text: envelope.title,
          sourceType: 'exception',
          errorLevel: envelope.level,
          errorType
        })
      }

      // Extract from platform
      textSources.push({
        text: envelope.platform,
        sourceType: 'platform',
        errorLevel: envelope.level,
        errorType
      })

      // Extract from function names in stack traces
      if (envelope.exception?.values) {
        envelope.exception.values.forEach(exception => {
          if (exception.stacktrace?.frames) {
            exception.stacktrace.frames.forEach(frame => {
              if (frame.function) {
                textSources.push({
                  text: frame.function,
                  sourceType: 'function',
                  errorLevel: envelope.level,
                  errorType
                })
              }
              if (frame.module) {
                textSources.push({
                  text: frame.module,
                  sourceType: 'module',
                  errorLevel: envelope.level,
                  errorType
                })
              }
            })
          }
        })
      }
    })

    return textSources
  }

  // Get color based on error level and type
  const getColorForError = (level: SentryEnvelope['level']): keyof typeof COLOR_PALETTE => {
    // Map error levels to color intensities
    switch (level) {
      case 'fatal':
        return 'DK_PURPLE'  // Most critical
      case 'error':
        return 'DK_PINK'    // High severity
      case 'warning':
        return 'DK_ORANGE'  // Medium severity
      case 'info':
        return 'DK_BLUE'    // Low severity
      case 'debug':
        return 'DK_GREEN'   // Lowest severity
      default:
        return 'BLURPLE'    // Default
    }
  }

  // Generate letter data from envelopes
  const lettersData = useMemo<LetterData[]>(() => {
    const textSources = extractTextFromEnvelopes(envelopes)
    const letters: LetterData[] = []
    
    // Convert text sources to individual letters
    textSources.forEach((source, sourceIndex) => {
      // Clean and split text into words, then letters
      const words = source.text
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .split(/\s+/)
        .filter(word => word.length > 0)

      words.forEach((word, wordIndex) => {
        // Split camelCase and PascalCase
        const splitWord = word.replace(/([a-z])([A-Z])/g, '$1 $2')
        const chars = splitWord.split('').filter(char => /[a-zA-Z0-9]/.test(char))

        chars.forEach((char, charIndex) => {
          if (letters.length >= maxLetters) return

          // Generate random position within bowl radius
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * bowlRadius * 0.8
          const height = (Math.random() - 0.5) * bowlRadius * 0.6

          const position = new THREE.Vector3(
            Math.cos(angle) * distance,
            height,
            Math.sin(angle) * distance
          )

          // Size based on source type and error level
          const baseSizeMap = {
            'exception': 0.8,
            'message': 0.6,
            'function': 0.5,
            'module': 0.4,
            'platform': 0.7
          }
          const levelMultiplier = {
            'fatal': 1.4,
            'error': 1.2,
            'warning': 1.0,
            'info': 0.8,
            'debug': 0.6
          }

          const size = (baseSizeMap[source.sourceType] || 0.5) * 
                      (levelMultiplier[source.errorLevel] || 1.0) * 
                      (40 + Math.random() * 20) // Base size 40-60

          letters.push({
            id: `${sourceIndex}-${wordIndex}-${charIndex}`,
            character: char.toUpperCase(),
            position: position.clone(),
            originalPosition: position.clone(),
            velocity: new THREE.Vector3(0, 0, 0),
            color: getColorForError(source.errorLevel),
            size,
            sourceType: source.sourceType,
            errorLevel: source.errorLevel,
            errorType: source.errorType,
            phaseOffset: Math.random() * Math.PI * 2,
            rotationSpeed: new THREE.Vector3(
              (Math.random() - 0.5) * 0.02,
              (Math.random() - 0.5) * 0.02,
              (Math.random() - 0.5) * 0.02
            ),
            isHovered: false,
            lastHoverTime: 0
          })
        })
      })
    })

    return letters.slice(0, maxLetters)
  }, [envelopes, maxLetters, bowlRadius])

  // Mouse interaction handling
  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    
    // Update raycaster
    raycaster.setFromCamera(pointer, camera)
    
    // Track mouse movement for force direction
    const currentMouse = { x: pointer.x, y: pointer.y }
    const mouseDelta = {
      x: currentMouse.x - lastMousePosition.x,
      y: currentMouse.y - lastMousePosition.y
    }
    setLastMousePosition(currentMouse)

    // Check for intersections with letters
    const letterMeshes = Array.from(lettersRef.current.values())
    const intersects = raycaster.intersectObjects(letterMeshes)
    
    // Reset hover states
    lettersData.forEach(letter => {
      letter.isHovered = false
    })

    // Set hover for intersected letters
    let newHoveredLetter: string | null = null
    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object as THREE.Mesh
      const letterId = intersectedMesh.userData.letterId
      if (letterId) {
        const letter = lettersData.find(l => l.id === letterId)
        if (letter) {
          letter.isHovered = true
          letter.lastHoverTime = time
          newHoveredLetter = letterId

          // Apply directional force based on mouse movement
          const forceDirection = new THREE.Vector3(
            mouseDelta.x * forceMultiplier,
            -mouseDelta.y * forceMultiplier,
            0
          )
          
          // Transform force to world space
          forceDirection.unproject(camera)
          forceDirection.sub(camera.position).normalize()
          forceDirection.multiplyScalar(forceMultiplier * 50)

          letter.velocity.add(forceDirection)
        }
      }
    }
    setHoveredLetter(newHoveredLetter)

    // Update letter positions and animations
    lettersData.forEach((letter) => {
      const letterMesh = lettersRef.current.get(letter.id)
      if (!letterMesh) return

      // Gentle floating animation
      const floatX = Math.sin(time * floatSpeed + letter.phaseOffset) * 10
      const floatY = Math.cos(time * floatSpeed * 0.7 + letter.phaseOffset) * 15
      const floatZ = Math.sin(time * floatSpeed * 0.5 + letter.phaseOffset) * 8

      // Apply velocity (from mouse interactions)
      letter.position.add(letter.velocity)
      
      // Apply damping to velocity
      letter.velocity.multiplyScalar(0.95)
      
      // Gentle return to original position
      const returnForce = letter.originalPosition.clone()
        .sub(letter.position)
        .multiplyScalar(0.002)
      letter.velocity.add(returnForce)

      // Combine floating animation with physics
      letterMesh.position.set(
        letter.position.x + floatX,
        letter.position.y + floatY,
        letter.position.z + floatZ
      )

      // Rotation animation
      letterMesh.rotation.x += letter.rotationSpeed.x
      letterMesh.rotation.y += letter.rotationSpeed.y
      letterMesh.rotation.z += letter.rotationSpeed.z

      // Scale effect for hovered letters
      const targetScale = letter.isHovered ? 1.2 : 1.0
      const currentScale = letterMesh.scale.x
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
      letterMesh.scale.setScalar(newScale)
    })
  })

  return (
    <group ref={groupRef}>
      {lettersData.map((letter) => (
        <Text3D
          key={letter.id}
          ref={(mesh) => {
            if (mesh) {
              lettersRef.current.set(letter.id, mesh)
              mesh.userData.letterId = letter.id
            }
          }}
          font="/fonts/rubik-bold.json"
          size={letter.size}
          height={letter.size * 0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={letter.size * 0.02}
          bevelSize={letter.size * 0.01}
          bevelOffset={0}
          bevelSegments={5}
          position={letter.position}
        >
          {letter.character}
          <meshStandardMaterial
            color={new THREE.Color(...NORMALIZED_RGB[letter.color])}
            metalness={0.3}
            roughness={0.4}
            emissive={new THREE.Color(...NORMALIZED_RGB[letter.color]).multiplyScalar(0.1)}
          />
        </Text3D>
      ))}
    </group>
  )
}

export { AlphabetSoup }
