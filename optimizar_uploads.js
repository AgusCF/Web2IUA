import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadsDir = path.join(process.cwd(), 'uploads');

fs.readdir(uploadsDir, async (err, files) => {
  if (err) {
    console.error('Error leyendo la carpeta uploads:', err);
    return;
  }

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const nombreBase = path.basename(file, ext);
    // Solo procesa imágenes que no sean ya webp optimizadas
    if (
      ['.jpg', '.jpeg', '.png'].includes(ext) &&
      !file.startsWith('opt_')
    ) {
      const inputPath = path.join(uploadsDir, file);
      const outputPath = path.join(uploadsDir, `opt_${nombreBase}.webp`);
      try {
        await sharp(inputPath)
          .resize({ width: 600 })
          .toFormat('webp', { quality: 60 })
          .toFile(outputPath);
        console.log(`Optimizada: ${file} -> opt_${nombreBase}.webp`);
      } catch (e) {
        console.error(`Error optimizando ${file}:`, e);
      }
    }
  }
});
