import { useState, useCallback, useRef } from 'react'

interface ImageUploaderProps {
  onImageSelected: (file: File, preview: string) => void
  isLoading: boolean
}

export default function ImageUploader({ onImageSelected, isLoading }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [mode, setMode] = useState<'upload' | 'camera'>('upload')
  const [cameraActive, setCameraActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      onImageSelected(file, e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [onImageSelected])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setCameraActive(true)
    } catch {
      alert('Camera access denied. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        const url = canvas.toDataURL('image/jpeg')
        onImageSelected(file, url)
        stopCamera()
      }
    }, 'image/jpeg', 0.95)
  }

  const switchMode = (newMode: 'upload' | 'camera') => {
    if (cameraActive) stopCamera()
    setMode(newMode)
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Mode toggle */}
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '100px',
        padding: '4px',
        gap: '4px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(196,140,60,0.15)',
        width: 'fit-content',
        margin: '0 auto 1.5rem',
      }}>
        {(['upload', 'camera'] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '100px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease',
              background: mode === m ? '#C48C3C' : 'transparent',
              color: mode === m ? '#0F0A05' : 'rgba(232,213,163,0.6)',
              fontWeight: mode === m ? 700 : 400,
            }}
          >
            {m === 'upload' ? '⬆ Upload' : '📷 Camera'}
          </button>
        ))}
      </div>

      {/* Upload zone */}
      {mode === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? '#C48C3C' : 'rgba(196,140,60,0.3)'}`,
            borderRadius: '16px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            background: isDragging
              ? 'rgba(196,140,60,0.08)'
              : 'rgba(255,255,255,0.02)',
            transform: isDragging ? 'scale(1.01)' : 'scale(1)',
          }}
        >
          {/* Decorative Kikuyu motif */}
          <div style={{ marginBottom: '1rem', opacity: isDragging ? 1 : 0.5, transition: 'opacity 0.3s' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="8" width="48" height="48" rx="4" stroke="#C48C3C" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M32 20 L44 38 L20 38 Z" fill="rgba(196,140,60,0.2)" stroke="#C48C3C" strokeWidth="1.5" />
              <circle cx="32" cy="32" r="4" fill="#C48C3C" />
              <path d="M24 52 L32 44 L40 52" stroke="#C48C3C" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <p style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '1.1rem',
            color: '#E8D5A3',
            marginBottom: '0.5rem',
          }}>
            {isDragging ? 'Release to reveal the artefact' : 'Drag your artefact image here'}
          </p>
          <p style={{
            fontFamily: '"EB Garamond", Georgia, serif',
            fontSize: '0.85rem',
            color: 'rgba(196,140,60,0.6)',
            letterSpacing: '0.05em',
          }}>
            or click to browse — JPG, PNG, WEBP supported
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Camera zone */}
      {mode === 'camera' && (
        <div style={{ textAlign: 'center' }}>
          {!cameraActive ? (
            <div
              onClick={startCamera}
              style={{
                border: '2px dashed rgba(196,140,60,0.3)',
                borderRadius: '16px',
                padding: '3.5rem 2rem',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
              <p style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.1rem',
                color: '#E8D5A3',
              }}>
                Activate Camera
              </p>
              <p style={{
                fontFamily: '"EB Garamond", Georgia, serif',
                fontSize: '0.85rem',
                color: 'rgba(196,140,60,0.6)',
                marginTop: '0.4rem',
              }}>
                Point at an artefact and capture
              </p>
            </div>
          ) : (
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(196,140,60,0.4)' }}>
              <video
                ref={videoRef}
                style={{ width: '100%', display: 'block', maxHeight: '400px', objectFit: 'cover' }}
                playsInline
                muted
              />
              {/* Viewfinder overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid rgba(196,140,60,0.5)',
                borderRadius: '16px',
                pointerEvents: 'none',
              }}>
                <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: '2px solid #C48C3C', borderLeft: '2px solid #C48C3C' }} />
                <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: '2px solid #C48C3C', borderRight: '2px solid #C48C3C' }} />
                <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: '2px solid #C48C3C', borderLeft: '2px solid #C48C3C' }} />
                <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: '2px solid #C48C3C', borderRight: '2px solid #C48C3C' }} />
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              }}>
                <button
                  onClick={stopCamera}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '100px',
                    border: '1px solid rgba(232,213,163,0.3)',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#E8D5A3',
                    cursor: 'pointer',
                    fontFamily: '"EB Garamond", Georgia, serif',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  style={{
                    padding: '0.6rem 1.8rem',
                    borderRadius: '100px',
                    border: 'none',
                    background: '#C48C3C',
                    color: '#0F0A05',
                    cursor: 'pointer',
                    fontFamily: '"EB Garamond", Georgia, serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  📸 Capture
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
