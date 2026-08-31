const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        filelist = walkSync(fullPath, filelist);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.html')) {
        filelist.push(fullPath);
      }
    }
  });
  return filelist;
};

const files = walkSync('./');
let changedFiles = 0;

files.forEach(file => {
  if (file.includes('fix-classes.cjs') || file.includes('update-colors.cjs')) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Remove malformed var expressions
  content = content.replace(/text-\[var\(--text-primary dark:text-white,var\(--text-primary dark:text-white\)\)\]/g, 'text-slate-900 dark:text-[#F1FAEE]');
  content = content.replace(/text-\[var\(--text-primary dark:text-white\),var\(--text-primary dark:text-white\)\)/g, 'text-slate-900 dark:text-[#F1FAEE]');
  content = content.replace(/text-\[var\(--text-primary dark:text-white\)\)/g, 'text-slate-900 dark:text-[#F1FAEE]');
  content = content.replace(/text-\[var\(--text-primary dark:text-white\)\]/g, 'text-slate-900 dark:text-[#F1FAEE]');
  content = content.replace(/bg-\[var\(--app-bg,var\(--app-bg\)\)\]/g, 'bg-[var(--app-bg)]');
  content = content.replace(/border-\[var\(--app-bg,var\(--app-bg\)\)\]/g, 'border-[var(--app-bg)]');
  
  // 2. Fix repeated / broken class strings
  content = content.replace(/text-primary dark:text-white\/([0-9]+)/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/text-primary\/([0-9]+) dark:text-white\/([0-9]+)/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/placeholder:text-primary\/([0-9]+) dark:text-white\/([0-9]+)/g, 'placeholder:text-slate-400 dark:placeholder:text-slate-500');
  content = content.replace(/placeholder:text-primary dark:text-white\/([0-9]+)/g, 'placeholder:text-slate-400 dark:placeholder:text-slate-500');

  // Fix header text-primary dark:text-white in headers that have bg-[var(--app-primary)] or bg-primary
  content = content.replace(/bg-\[var\(--app-primary\)\]\s+text-primary dark:text-white/g, 'bg-[var(--app-primary)] text-white');
  content = content.replace(/text-primary dark:text-white\s+(sticky.*bg-\[var\(--app-primary\)\])/g, 'text-white $1');

  // Fix button text on bright accent buttons
  content = content.replace(/bg-\[var\(--app-accent\)\]\s+text-primary dark:text-white/g, 'bg-[var(--app-accent)] text-[#062B34] font-black');
  content = content.replace(/bg-secondary\s+text-primary dark:text-white/g, 'bg-secondary text-white font-bold');

  // Fix remaining text-primary dark:text-white in regular elements
  content = content.replace(/text-primary dark:text-white/g, 'text-slate-900 dark:text-[#F1FAEE]');

  if (content !== original) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log(`Cleaned ${file}`);
  }
});

console.log(`Cleaned ${changedFiles} files`);
