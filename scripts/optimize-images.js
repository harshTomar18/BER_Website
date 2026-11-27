import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimizeImages() {
  console.log('--- Starting Image Optimization ---');

  // 1. Optimize Background.png -> Background.webp (Quality 82)
  const bgPath = path.resolve('public/images/Background.png');
  const bgWebpPath = path.resolve('public/images/Background.webp');
  const rootBgPath = path.resolve('public/Background.png');
  const rootBgWebpPath = path.resolve('public/Background.webp');

  if (fs.existsSync(bgPath)) {
    const bgMeta = await sharp(bgPath).metadata();
    console.log(`Original Background.png: ${bgMeta.width}x${bgMeta.height}, size: ${(fs.statSync(bgPath).size / 1024).toFixed(1)} KB`);

    // Scale to max width 1920 (desktop background)
    await sharp(bgPath)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(bgWebpPath);
    console.log(`Created Background.webp: ${(fs.statSync(bgWebpPath).size / 1024).toFixed(1)} KB`);

    // Copy to root public
    fs.copyFileSync(bgWebpPath, rootBgWebpPath);

    // Overwrite PNG with compressed version
    const pngTmp = path.resolve('public/images/Background_opt.png');
    await sharp(bgWebpPath).png({ compressionLevel: 9 }).toFile(pngTmp);
    fs.copyFileSync(pngTmp, bgPath);
    fs.copyFileSync(pngTmp, rootBgPath);
    fs.unlinkSync(pngTmp);
    console.log(`Replaced Background.png with compressed: ${(fs.statSync(bgPath).size / 1024).toFixed(1)} KB`);
  }

  // 2. Optimize ber_capabilities_mockup.jpg -> webp
  const mockupPath = path.resolve('public/images/ber_capabilities_mockup.jpg');
  const mockupWebpPath = path.resolve('public/images/ber_capabilities_mockup.webp');
  if (fs.existsSync(mockupPath)) {
    console.log(`Original mockup size: ${(fs.statSync(mockupPath).size / 1024).toFixed(1)} KB`);
    await sharp(mockupPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(mockupWebpPath);
    console.log(`Created ber_capabilities_mockup.webp: ${(fs.statSync(mockupWebpPath).size / 1024).toFixed(1)} KB`);
  }

  // 3. Optimize BER Services Neo-Glass Tech Orbit.jpeg -> webp
  const orbitPath = path.resolve('public/images/BER Services Neo-Glass Tech Orbit.jpeg');
  const orbitWebpPath = path.resolve('public/images/BER Services Neo-Glass Tech Orbit.webp');
  if (fs.existsSync(orbitPath)) {
    console.log(`Original Orbit size: ${(fs.statSync(orbitPath).size / 1024).toFixed(1)} KB`);
    await sharp(orbitPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(orbitWebpPath);
    console.log(`Created Orbit.webp: ${(fs.statSync(orbitWebpPath).size / 1024).toFixed(1)} KB`);
  }

  // 4. Generate sleek hero video poster (hero-poster.webp)
  // Create an ultra-crisp, lightweight poster from the mockup / orbit image
  const posterWebpPath = path.resolve('public/images/hero-poster.webp');
  if (fs.existsSync(orbitWebpPath)) {
    await sharp(orbitWebpPath)
      .resize({ width: 800, height: 450, fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(posterWebpPath);
    console.log(`Created hero-poster.webp: ${(fs.statSync(posterWebpPath).size / 1024).toFixed(1)} KB`);
  } else if (fs.existsSync(mockupWebpPath)) {
    await sharp(mockupWebpPath)
      .resize({ width: 800, height: 450, fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(posterWebpPath);
    console.log(`Created hero-poster.webp: ${(fs.statSync(posterWebpPath).size / 1024).toFixed(1)} KB`);
  }

  // 5. Optimize logo files
  for (const lName of ['logo.png', 'logo-white.png', 'logo final.png', 'logo-final.png', 'logo-web.png']) {
    const lPath = path.resolve('public/images', lName);
    if (fs.existsSync(lPath)) {
      const baseName = lName.replace(/\.png$/, '');
      const outWebp = path.resolve('public/images', `${baseName}.webp`);
      await sharp(lPath)
        .resize({ width: 300, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outWebp);
      console.log(`Created ${baseName}.webp: ${(fs.statSync(outWebp).size / 1024).toFixed(1)} KB`);
    }
  }

  // 6. Optimize all suppliers icons to compact webp (max 70px)
  const suppDir = path.resolve('public/images/suppliers');
  if (fs.existsSync(suppDir)) {
    const files = fs.readdirSync(suppDir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        const full = path.join(suppDir, file);
        const webpOut = path.join(suppDir, file.replace(/\.png$/, '.webp'));
        await sharp(full)
          .resize({ width: 80, height: 80, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(webpOut);
        // Also compress the png
        const tmp = full + '.tmp';
        await sharp(full)
          .resize({ width: 80, height: 80, fit: 'inside', withoutEnlargement: true })
          .png({ compressionLevel: 9 })
          .toFile(tmp);
        fs.renameSync(tmp, full);
        console.log(`Optimized supplier ${file}: webp=${(fs.statSync(webpOut).size / 1024).toFixed(1)} KB, png=${(fs.statSync(full).size / 1024).toFixed(1)} KB`);
      }
    }
  }

  console.log('--- Image Optimization Finished ---');
}

optimizeImages().catch(console.error);
