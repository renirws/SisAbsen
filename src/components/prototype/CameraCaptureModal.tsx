import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle, X } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string) => void;
  title: string;
  subtitle: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title,
  subtitle,
}) => {
  const [useRealCamera, setUseRealCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fallback simulated avatar pictures for fast and reliable demo
  const sampleAvatars = [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230f172a"/><circle cx="150" cy="120" r="60" fill="%2338bdf8"/><path d="M70,270 C70,200 230,200 230,270 Z" fill="%2338bdf8"/><text x="150" y="280" font-family="sans-serif" font-size="12" fill="%23ffffff" text-anchor="middle">VERIFIED SELFIE - SIAbsensi</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231e293b"/><circle cx="150" cy="120" r="60" fill="%2310b981"/><path d="M70,270 C70,200 230,200 230,270 Z" fill="%2310b981"/><text x="150" y="280" font-family="sans-serif" font-size="12" fill="%23ffffff" text-anchor="middle">VERIFIED SELFIE - SIAbsensi</text></svg>',
  ];

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPhoto(null);
      setCameraError(null);
    }
  }, [isOpen]);

  const startRealCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setUseRealCamera(true);
    } catch {
      setCameraError('Kamera fisik tidak dapat diakses atau izin ditolak. Menggunakan mode simulasi foto selfie otomatis.');
      setUseRealCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setUseRealCamera(false);
  };

  const handleSnapRealCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
      }
    }
  };

  const handleSimulateCapture = () => {
    const randomAvatar = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
    setCapturedPhoto(randomAvatar);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button 
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {cameraError && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Viewport Box */}
          <div className="relative aspect-4/3 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
            {capturedPhoto ? (
              <img 
                src={capturedPhoto} 
                alt="Foto Selfie Presensi" 
                className="w-full h-full object-cover"
              />
            ) : useRealCamera ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover transform -scale-x-100" 
              />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-sky-400">
                  <Camera className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-slate-200">Kamera Selfie Siap</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Arahkan wajah ke depan layar untuk verifikasi bukti kehadiran.
                </p>
              </div>
            )}

            {/* Oval Face Guide Overlay */}
            {!capturedPhoto && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-44 h-56 border-2 border-dashed border-sky-400/60 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-sky-300 font-mono tracking-wider bg-slate-950/70 px-2 py-0.5 rounded">
                    POSISIKAN WAJAH
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex flex-col gap-2.5">
            {capturedPhoto ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCapturedPhoto(null)}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Foto Ulang
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  Gunakan Foto Ini
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {useRealCamera ? (
                  <button
                    type="button"
                    onClick={handleSnapRealCamera}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Camera className="w-4 h-4" />
                    Ambil Foto Sekarang
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSimulateCapture}
                      className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Camera className="w-4 h-4" />
                      Ambil Foto Selfie (Simulasi Instan)
                    </button>
                    {navigator.mediaDevices && (
                      <button
                        type="button"
                        onClick={startRealCamera}
                        className="w-full py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        Buka Kamera Asli Perangkat (Webcam/Smartphone)
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
