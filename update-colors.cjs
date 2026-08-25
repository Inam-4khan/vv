const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        filelist = walkSync(path.join(dir, file), filelist);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.html')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('./');
let changedFiles = 0;

const replacements = {
  '#062B34': 'var(--app-primary)',
  '#0A2832': 'var(--app-bg-surface)',
  '#03171C': 'var(--app-bg-ghost)',
  '#2EC4B6': 'var(--app-accent)',
  '#80FFEC': 'var(--app-accent-light)',
  '#0B1720': 'var(--text-primary)',
  '#FFF9E6': 'var(--app-bg)'
};

files.forEach(file => {
  if (file.includes('update-colors.js')) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace utility classes with opacities
  // e.g. bg-[#062B34]/60 -> bg-[color-mix(in_srgb,var(--app-primary)_60%,transparent)]
  for (const [hex, cssVar] of Object.entries(replacements)) {
    // Regex for opacity matches: classPrefix-[hex]/opacity
    // Examples: bg-[#062B34]/60, text-[#2EC4B6]/50, border-[#062B34]/20, ring-[#062B34]/30, shadow-[#062B34]/15
    const regexOpacity = new RegExp(`([a-z-]+)-\\[${hex}\\]\\/([0-9]+)`, 'gi');
    content = content.replace(regexOpacity, (match, prefix, opacity) => {
      return `${prefix}-[color-mix(in_srgb,${cssVar}_${opacity}%,transparent)]`;
    });

    // Replace straight colors
    // e.g. bg-[#062B34] -> bg-[var(--app-primary)]
    const regexStraight = new RegExp(`([a-z-]+)-\\[${hex}\\]`, 'gi');
    content = content.replace(regexStraight, (match, prefix) => {
      return `${prefix}-[${cssVar}]`;
    });
    
    // Also replace standalone hexes in code like color="#062B34" -> color="var(--app-primary)"
    // Or other inline styles, if any.
    const regexStandalone = new RegExp(`(?<!\\[)(?<!\\#)${hex}(?!\\])`, 'gi');
    content = content.replace(regexStandalone, cssVar);
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Updated ${changedFiles} files`);
