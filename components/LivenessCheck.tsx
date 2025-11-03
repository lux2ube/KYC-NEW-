import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRightIcon, CameraIcon } from './icons.tsx';

interface LivenessCheckProps {
  onBack: () => void;
  onSubmit: (selfieDataUrl: string) => void;
}

const LivenessCheck: React.FC<LivenessCheckProps> = ({ onBack, onSubmit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setIsCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setIsCameraReady(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setCameraError("تم رفض الوصول إلى الكاميرا. يرجى السماح بالوصول في إعدادات المتصفح.");
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);
  
  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onSubmit(capturedImage);
    }
  };

  return (
    <div className="animate-fade-in" dir="rtl">
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">صورة السيلفي</h2>
        <p className="text-gray-500 mt-2">
          {capturedImage ? 'تأكد من أن الصورة واضحة قبل المتابعة.' : 'انظر مباشرة إلى الكاميرا وضع وجهك داخل الإطار.'}
        </p>
      </div>

      <div className="relative w-full max-w-md mx-auto aspect-square bg-gray-200 rounded-full overflow-hidden shadow-inner flex items-center justify-center">
        {cameraError && <div className="p-4 text-center text-red-600 font-semibold">{cameraError}</div>}
        
        {capturedImage ? (
          <img src={capturedImage} alt="Captured selfie" className="w-full h-full object-cover" />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            {!isCameraReady && !cameraError && (
                 <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">جاري تشغيل الكاميرا...</p>
                </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 max-w-md mx-auto">
        {capturedImage ? (
          <div className="flex flex-col sm:flex-row-reverse gap-4">
            <button onClick={handleConfirm} className="w-full sm:w-auto flex-1 inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              تأكيد والمتابعة
            </button>
            <button onClick={handleRetake} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
              إعادة الالتقاط
            </button>
          </div>
        ) : (
          <button onClick={handleCapture} disabled={!!cameraError || !isCameraReady} className="w-full h-16 inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed">
            <CameraIcon className="w-8 h-8 mr-3" />
            <span className="text-lg">التقاط صورة</span>
          </button>
        )}
        
        <div className="mt-4">
            <button type="button" onClick={onBack} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-transparent text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowRightIcon className="w-5 h-5 ml-2" />
              <span>رجوع</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default LivenessCheck;