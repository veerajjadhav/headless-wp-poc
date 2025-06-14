import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ThankYou from './ThankYou';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch ACF flexible content
  useEffect(() => {
    fetch('https://gomowebb.com/headless-poc/wp-json/wp/v2/pages/7')
      .then(res => res.json())
      .then(data => {
        setBlocks(data.acf?.hero_section || []);
        setIsLoading(false);
      });
  }, []);

  // 🔁 Listen for postMessage from iframe (form success)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'formSuccess') {
        navigate('/thank-you');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // ACF flexible layout rendering
  const renderBlock = (block, index) => {
    switch (block.acf_fc_layout) {
      case 'hero_section':
        return (
          <section key={index} className="bg-blue-100 p-6 text-center">
            <h1 className="text-3xl font-bold">{block.banner_text}</h1>
          </section>
        );
      case 'contact_form_section':
        return (
          <section key={index} className="p-6">
            <iframe
              src="https://gomowebb.com/headless-poc/contact/"
              title="Contact Form"
              className="w-full min-h-[600px] border border-gray-300 rounded"
            />
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="App">
            {isLoading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
              blocks.map((block, index) => renderBlock(block, index))
            )}
          </div>
        }
      />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}

export default App;
