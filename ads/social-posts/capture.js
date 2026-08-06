const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HTML = path.resolve(__dirname, 'posts.html');
const OUT = __dirname;

// We'll create one mini-HTML per post, screenshot it, then delete it
const posts = [
  { id: 'p1', label: 'post-1-prix-hero' },
  { id: 'p2', label: 'post-2-stat-choc' },
  { id: 'p3', label: 'post-3-comment-ca-marche' },
  { id: 'p4', label: 'post-4-comparaison' },
  { id: 'p5', label: 'post-5-temoignage' },
  { id: 'p6', label: 'post-6-faq' },
  { id: 'p7', label: 'post-7-conseils' },
  { id: 'p8', label: 'post-8-douleur' },
  { id: 'p9', label: 'post-9-preuve-sociale' },
  { id: 'p10', label: 'post-10-devis-cta' },
];

const fullHTML = fs.readFileSync(HTML, 'utf8');

// Extract the <style> block
const styleMatch = fullHTML.match(/<style>([\s\S]*?)<\/style>/);
const style = styleMatch ? styleMatch[1] : '';

// Extract each .post div — find all post divs between post-wrapper divs
const postDivRegex = /<div class="post (p\d+)">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
const postBlocks = [];
let m;
// Better: extract by post class
const allPosts = fullHTML.match(/<div class="post p\d+"[\s\S]*?(?=<div class="post-wrapper">|<p style)/g) || [];

// Alternative: split by post-wrapper
const wrappers = fullHTML.split('<div class="post-wrapper">').slice(1);

wrappers.forEach((block, i) => {
  if (i >= posts.length) return;
  // Get the .post div content (everything up to the closing wrapper)
  const postMatch = block.match(/(<div class="post [^"]*">[\s\S]*?<\/div>)\s*<\/div>/);
  if (!postMatch) {
    console.log(`Post ${i+1}: could not extract div`);
    return;
  }
  const postDiv = postMatch[1];
  const label = posts[i].label;
  const tmpFile = path.join(OUT, `_tmp_${label}.html`);
  const outFile = path.join(OUT, `${label}.png`);

  const miniHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
html, body { width:1080px; height:1080px; overflow:hidden; display:block; }
body > div { width:1080px !important; height:1080px !important; }
${style}
</style>
</head>
<body>
${postDiv}
</body>
</html>`;

  fs.writeFileSync(tmpFile, miniHTML, 'utf8');
  console.log(`Capturing ${label}...`);

  const result = spawnSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--window-size=1080,1080`,
    `--screenshot=${outFile}`,
    `file:///${tmpFile.replace(/\\/g, '/')}`,
  ], { timeout: 15000 });

  fs.unlinkSync(tmpFile);

  if (fs.existsSync(outFile)) {
    const size = fs.statSync(outFile).size;
    console.log(`  ✓ ${label}.png (${Math.round(size/1024)}KB)`);
  } else {
    console.log(`  ✗ FAILED — stderr: ${result.stderr?.toString().slice(0,200)}`);
  }
});

console.log('\nDone! Check the social-posts folder.');
