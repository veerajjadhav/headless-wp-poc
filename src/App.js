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
        console.log('Fetched blocks:', data.acf?.hero_section);
        setBlocks(data.acf?.hero_section || []);
        setIsLoading(false);
      });
  }, []);

  // Listen for contact form success from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'formSuccess') {
        navigate('/thank-you');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  // Render ACF flexible content blocks
  const renderBlock = (block, index) => {
    switch (block.acf_fc_layout) {
      case 'hero_section':
        return (
          <section key={index} className="bg-blue-100 p-6 text-center">
            <h1 className="text-3xl font-bold">{block.heading}</h1>
            {block.short_description && (
              <div
                className="mt-4 text-lg"
                dangerouslySetInnerHTML={{ __html: block.short_description }}
              />
            )}
            {block.cta_button && block.cta_url && (
              <a
                href={block.cta_url}
                className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded"
              >
                {block.cta_button}
              </a>
            )}
          </section>
        );

      case 'after_hero_section':
        return (
          <section key={index} className="p-6">
            {block.text_img_row?.map((row, i) => (
              <div key={i} className="flex flex-wrap gap-4 items-center my-4">
                <div
                  className="w-full md:w-1/2"
                  dangerouslySetInnerHTML={{ __html: row.left_text }}
                />
                <div className="w-full md:w-1/2">
                  <img
                    src={row.right_image?.url}
                    alt={row.right_image?.alt || ''}
                    className="rounded shadow"
                  />
                </div>
              </div>
            ))}
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
