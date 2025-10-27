import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const { humanImage, garmentImage } = req.body;
    if (!humanImage || !garmentImage) {
      return res.status(400).json({ error: 'Missing image data.' });
    }
    const model = "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";
    const input = {
      human_img: humanImage,
      garm_img: garmentImage,
      garment_des: "a clothing item",
    };
    const output = await replicate.run(model, { input });
    res.status(200).json({ resultUrl: output[0] });
  } catch (error) {
    console.error('Error calling Replicate API:', error);
    res.status(500).json({ error: 'Failed to process image.' });
  }
}
