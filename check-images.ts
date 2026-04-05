import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function analyzeImages() {
  const zai = await ZAI.create();
  
  const images = [
    '/home/z/my-project/upload/pasted_image_1772892943520.png',
    '/home/z/my-project/upload/pasted_image_1772893468726.png',
    '/home/z/my-project/upload/pasted_image_1772921070375.png',
    '/home/z/my-project/upload/Order Now.png'
  ];
  
  for (const imagePath of images) {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      const response = await zai.chat.completions.createVision({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this image in detail. What does it show? Is there any error or problem visible? What language is the text in?'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        thinking: { type: 'disabled' }
      });
      
      console.log(`\n=== Image: ${imagePath} ===`);
      console.log(response.choices[0]?.message?.content);
    } catch (error: any) {
      console.error(`Error analyzing ${imagePath}:`, error.message);
    }
  }
}

analyzeImages().catch(console.error);
