import React, { useState } from 'react';


interface SlipUploaderProps {
  onExtracted: (data: { amount: number; date: string | null; description: string }) => void;
}

export const SlipUploader: React.FC<SlipUploaderProps> = ({ onExtracted }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setLoading(true);
    // Simulate extraction (backend API would go here)
    setTimeout(() => {
      onExtracted({ amount: 500, date: null, description: 'Extracted from slip' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="text-center">
      <label className="cursor-pointer inline-block">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition">
          <span className="text-3xl block mb-2">📸</span>
          <p className="text-sm text-gray-500">Tap to upload slip photo</p>
        </div>
      </label>
      
      {image && (
        <div className="mt-3">
          <img src={image} alt="Slip" className="max-h-32 mx-auto rounded" />
        </div>
      )}
      
      {loading && <p className="text-sm text-green-600 mt-2">🤖 AI reading slip...</p>}
    </div>
  );
};