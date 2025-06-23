import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadBusinessPhoto(file: File, submissionId: string, photoIndex: number): Promise<string> {
  const compressedFile = await compressImage(file);
  const fileName = `${submissionId}-${photoIndex}-${Date.now()}.jpg`;
  const filePath = `business-submissions/${fileName}`;

  const { data, error } = await supabase.storage
    .from('business-photos')
    .upload(filePath, compressedFile);

  if (error) {
    throw new Error(`Photo upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('business-photos')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      const maxWidth = 1200;
      const maxHeight = 800;
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(file);
  });
} 