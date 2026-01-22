import { useRef, useState } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isReady, setIsReady] = useState(false);

  const startAudio = async () => {
    try {
      const context = new AudioContext();
      if (context.state === 'suspended') await context.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const analyser = context.createAnalyser();
      
      analyser.smoothingTimeConstant = 0.7; 
      analyser.fftSize = 512; 
      
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = context;
      analyserRef.current = analyser;
      setIsReady(true);
    } catch (err) {
      console.error("Error al acceder al micro:", err);
    }
  };

  const getFrequencyData = () => {
    if (!analyserRef.current) return new Uint8Array(0);
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    return dataArray;
  };

  return { startAudio, getFrequencyData, isReady };
};