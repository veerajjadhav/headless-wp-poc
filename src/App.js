import { useEffect, useState } from 'react';

function App() {
  const [bannerText, setBannerText] = useState('');

  useEffect(() => {
    fetch('https://gomowebb.com/headless-poc/wp-json/wp/v2/pages/7')
      .then(response => response.json())
      .then(data => {
        setBannerText(data.acf.banner_text);
      });
  }, []);

  return (
    <div className="App">
      <div className="bg-blue-200 text-center text-2xl font-bold p-4">
        {bannerText || 'Loading...'}
      </div>
    </div>
  );
}

export default App;
