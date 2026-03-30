import { useRef, useState, useEffect } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File, previewUrl: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Preferred for artefacts
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Camera access denied. Please check permissions.");
      }
    }
    setupCamera();

    return () => {
      // Cleanup: Turn off camera when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas size to match video resolution
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            const previewUrl = canvas.toDataURL('image/jpeg');
            onCapture(file, previewUrl);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  return (
    <div style={containerStyle}>
      {error ? (
        <div style={{ color: 'white', textAlign: 'center' }}>
          <p>{error}</p>
          <button onClick={onClose} style={btnStyle}>Close</button>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline style={videoStyle} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          <div style={controlsStyle}>
            <button onClick={onClose} style={{ ...btnStyle, backgroundColor: '#666' }}>Cancel</button>
            <button onClick={handleCapture} style={shutterBtnStyle}>
                <div style={innerShutterStyle} />
            </button>
            <div style={{ width: '60px' }} /> {/* Spacer for balance */}
          </div>
        </>
      )}
    </div>
  );
}

// --- Styles ---
const containerStyle: React.CSSProperties = {
  position: 'relative', width: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem'
};
const videoStyle: React.CSSProperties = { width: '100%', display: 'block' };
const controlsStyle: React.CSSProperties = {
  position: 'absolute', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px'
};
const btnStyle: React.CSSProperties = { padding: '10px 20px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const shutterBtnStyle: React.CSSProperties = {
  width: '60px', height: '60px', borderRadius: '50%', border: '4px solid white', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
};
const innerShutterStyle: React.CSSProperties = { width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'white' };