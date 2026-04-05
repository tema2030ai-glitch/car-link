import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function analyzeImage(imagePath: string) {
  const zai = await ZAI.create();
  
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = 'image/png';

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Describe this image in detail. What does it show? Is it a UI design? What fields and elements are visible?'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`
            }
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content;
}

async function main() {
  const images = [
    '/home/z/my-project/upload/Order Now.png',
  ];
  
  for (const img of images) {
    console.log(`\n=== Analyzing: ${img} ===`);
    try {
      const result = await analyzeImage(img);
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

main();
