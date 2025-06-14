import { useEffect, useState } from 'react';

function renderBlock(block, index) {
  switch (block.acf_fc_layout) {
    case 'hero_section':
      return (
        <section key={index} className="bg-gray-100 text-center p-6">
          <img
            src={block.hero_image?.url}
            alt={block.hero_image?.alt || ''}
            className="mx-auto max-w-xl"
          />
          <h1 className="text-3xl font-bold mt-4">{block.heading}</h1>
          <div
            className="prose mx-auto mt-2"
            dangerouslySetInnerHTML={{ __html: block.short_description }}
          />
          {block.cta_button && block.cta_url && (
            <a
              href={block.cta_url}
              className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              {block.cta_button}
            </a>
          )}
        </section>
      );

    case 'after_hero_section':
      return (
        <section key={index} className="grid gap-6 p-6">
          {block.text_img_row?.map((row, idx) => (
            <div key={idx} className="grid md:grid-cols-2 gap-4 items-center">
              <div
                dangerouslySetInnerHTML={{ __html: row.left_text }}
                className="prose"
              />
              <img
                src={row.right_image?.url}
                alt={row.right_image?.alt || ''}
                className="w-full h-auto"
              />
            </div>
          ))}
        </section>
      );
      case 'contact_form_section':
  return (
    <section key={index} className="p-6 bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2>
      <iframe
        src="https://gomowebb.com/headless-poc/contact/"
        className="w-full min-h-[600px] border border-gray-300 rounded"
        title="Contact Form"
      />
    </section>
  );

    default:
      return null;
  }
}

function App() {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://gomowebb.com/headless-poc/wp-json/wp/v2/pages/7')
      .then(res => res.json())
      .then(data => {
        setBlocks(data.acf?.hero_section || []);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        blocks.map((block, index) => renderBlock(block, index))
      )}
    </div>
  );
}

export default App;

