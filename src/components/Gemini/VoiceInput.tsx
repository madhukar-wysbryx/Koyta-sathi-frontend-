import React, { useState } from 'react';
import { geminiApi } from '../../api/gemini.api';


interface VoiceInputProps {
  onResult: (data: { amount: number; category: string; source: string; description: string }) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setLoading(true);
      
      try {
        const result = await geminiApi.voiceToExpense(text);
        onResult(result);
      } catch (error) {
        console.error('Failed to parse voice:', error);
      } finally {
        setLoading(false);
      }
    };
    
    recognition.start();
  };

  return (
    <div className="text-center">
      <button
        onClick={startListening}
        disabled={loading}
        className={`p-4 rounded-full ${
          isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'
        } text-white transition`}
      >
        {loading ? '⏳' : isListening ? '🎤 Listening...' : '🎙️ Tap to Speak'}
      </button>
      {transcript && (
        <p className="text-sm text-gray-500 mt-2">"{transcript}"</p>
      )}
    </div>
  );
};