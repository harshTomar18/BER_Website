import https from 'https';
import fs from 'fs';

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const html = await fetchPage('https://digistreetmedia.com/showcase/');

  // Look for the main section containing showcase cards
  // Let's find images or portfolio project titles
  const regex = /<img[^>]+src=["'](https:\/\/digistreetmedia\.com\/wp-content\/uploads\/[^"']+)["'][^>]*alt=["']([^"']*)["']/gi;
  let match;
  const projects = [];
  while ((match = regex.exec(html)) !== null) {
    if (match[2] && !match[1].includes('logo') && !match[1].includes('icon') && !match[1].includes('favicon')) {
      projects.push({ src: match[1], alt: match[2] });
    }
  }
  console.log(`Found ${projects.length} project images:`, projects.slice(0, 15));

  // Find filter tabs buttons / list items
  const filterSection = html.match(/<ul[^>]*class=["'][^"']*(?:filter|portfolio|category)[^"']*["'][\s\S]*?<\/ul>/gi) || 
                        html.match(/<div[^>]*class=["'][^"']*(?:filter|tab|isotope)[^"']*["'][\s\S]*?<\/div>/gi) || [];
  console.log('Filter sections:', filterSection.slice(0, 3));

  // Let's search for "Website", "Social", "B2B", "International" filter tabs
  const tabRegex = />(All|Website|International|B2B|Education|Social Media|Brand Identity|Healthcare|Real Estate)</gi;
  const foundTabs = [];
  while ((match = tabRegex.exec(html)) !== null) {
    foundTabs.push(match[1]);
  }
  console.log('Found category tabs:', [...new Set(foundTabs)]);

  // Let's check the container layout classes around projects
  const mainShowcase = html.indexOf('Client Campaigns &amp; Creative Work') > -1 
    ? html.indexOf('Client Campaigns &amp; Creative Work')
    : html.indexOf('Digital Marketing Agency Work Showcase');
  if (mainShowcase > -1) {
    console.log('--- HTML around Main Showcase Heading ---');
    console.log(html.substring(mainShowcase, mainShowcase + 2500).replace(/<style[\s\S]*?<\/style>/gi, '').replace(/\s+/g, ' '));
  }
}

run().catch(console.error);
