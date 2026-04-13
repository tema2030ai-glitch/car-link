import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, model, year, color, angle } = body;

    const zai = await ZAI.create();

    // Build the prompt for car image generation
    const prompts = {
      front: `Professional car photography, front view of ${year || '2025'} ${brand || 'modern'} ${model || 'sedan'}, ${color || 'white'} color, studio lighting, clean white background, high detail, automotive advertising quality, 8k resolution`,
      side: `Professional car photography, side profile view of ${year || '2025'} ${brand || 'modern'} ${model || 'sedan'}, ${color || 'white'} color, perfect lighting, showroom setting, high detail, automotive advertising quality`,
      rear: `Professional car photography, rear view of ${year || '2025'} ${brand || 'modern'} ${model || 'sedan'}, ${color || 'white'} color, studio lighting, clean background, high detail, automotive advertising quality`,
      interior: `Professional car interior photography, ${brand || 'luxury'} ${model || 'sedan'} dashboard and cockpit, premium materials, ambient lighting, detailed center console, high quality, realistic`,
      '3q': `Professional car photography, 3-quarter front view of ${year || '2025'} ${brand || 'modern'} ${model || 'sedan'}, ${color || 'white'} color, dramatic lighting, outdoor setting at golden hour, high detail, automotive advertising quality`,
      action: `Professional car photography, ${year || '2025'} ${brand || 'modern'} ${model || 'sedan'} in motion, dynamic angle, ${color || 'white'} color, motion blur background, professional automotive photography`
    };

    const selectedPrompt = prompts[angle as keyof typeof prompts] || prompts['3q'];

    // Generate the image
    const response = await zai.images.generations.create({
      prompt: selectedPrompt,
      size: '1344x768' // Landscape for car images
    });

    const imageBase64 = response.data[0].base64;

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
      prompt: selectedPrompt,
      metadata: {
        brand: brand || 'Unknown',
        model: model || 'Unknown',
        year: year || new Date().getFullYear().toString(),
        color: color || 'white',
        angle: angle || '3q'
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Image Generation Error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في توليد صورة السيارة' },
      { status: 500 }
    );
  }
}

// GET for quick image generation with query params
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const brand = searchParams.get('brand') || 'Toyota';
  const model = searchParams.get('model') || 'Camry';
  const year = searchParams.get('year') || '2025';
  const color = searchParams.get('color') || 'white';
  const angle = searchParams.get('angle') || '3q';

  try {
    const zai = await ZAI.create();

    const prompt = `Professional car photography, ${angle} view of ${year} ${brand} ${model}, ${color} color, studio lighting, high detail, automotive advertising quality`;

    const response = await zai.images.generations.create({
      prompt,
      size: '1344x768'
    });

    const imageBase64 = response.data[0].base64;

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
      prompt,
      metadata: { brand, model, year, color, angle }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في توليد الصورة' },
      { status: 500 }
    );
  }
}
