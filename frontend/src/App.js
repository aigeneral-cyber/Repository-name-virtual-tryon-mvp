import React, { useState } from 'react';
import './App.css';

function App() {
  const [humanImage, setHumanImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!humanImage || !garmentImage) {
      setError('Please upload both images.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedImage(null);

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    try {
      const humanImageBase64 = await toBase64(humanImage);
      const garmentImageBase64 = await toBase64(garmentImage);

      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          humanImage: humanImageBase64,
          garmentImage: garmentImageBase64,
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGeneratedImage(data.resultUrl);
    } catch (e) {
      console.error("Error:", e);
      setError('Failed to generate image. Check Vercel logs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header"><h1>Virtual Try-On MVP</h1><p>Upload a person and a clothing item.</p></header>
      <main className="main-content">
        <div className="input-section">
          <div className="upload-box"><h2>1. Person Image</h2><input type="file" accept="image/*" onChange={(e) => setHumanImage(e.target.files[0])} /></div>
          <div className="upload-box"><h2>2. Garment Image</h2><input type="file" accept="image/*" onChange={(e) => setGarmentImage(e.target.files[0])} /></div>
        </div>
        <button onClick={handleGenerate} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate Image'}</button>
        {error && <p className="error-message">{error}</p>}
        <div className="output-section">
          {isLoading && <div className="loader"></div>}
          {generatedImage && ( <div className="result-container"><h2>Result:</h2><img src={generatedImage} alt="Generated try-on" className="result-image" /></div> )}
        </div>
      </main>
    </div>
  );
}
export default App;
