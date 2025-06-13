import { useEffect, useState } from 'react';

function App() {
  const [bannerText, setBannerText] = useState(null); // Start with null
  const [isLoading, setIsLoading] = useState(true);   // Add loading state

  useEffect(() => {
    fetch('https://gomowebb.com/headless-poc/wp-json/wp/v2/pages/7')
      .then(response => response.json())
      .then(data => {
        setBannerText(data.acf?.banner_text || ''); // fallback to empty string if undefined
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <div className="text-gray-500 p-4">Loading...</div>
      ) : bannerText ? (
        <div className="bg-blue-200 text-center text-2xl font-bold p-4">
          {bannerText}
        </div>
      ) : (
        <div className="text-gray-400 italic p-4 text-center">
          Add content to get started
        </div>
      )}
    </div>
  );
}

export default App;
