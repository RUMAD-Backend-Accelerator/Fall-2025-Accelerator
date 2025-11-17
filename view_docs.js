#!/usr/bin/env node
/*
  Student Documentation Viewer
  
  Serves homework documentation files through a clean web interface.
  Designed for students to view homework assignments, test cases, and results.
  
  Usage:
    node view_docs.js [port]
    npm run view-docs
*/

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Import shared utilities - use relative path if in Fall-2025-Backend, otherwise assume scripts/helpers
let sharedModule;
try {
  // Try loading from scripts/helpers first (for when running from mentor repo)
  sharedModule = require('./helpers/doc_viewer_shared');
} catch (err) {
  // If that fails, try loading from current directory (for when copied to student repo)
  try {
    sharedModule = require('./doc_viewer_shared');
  } catch (err2) {
    console.error('❌ Error: Could not find doc_viewer_shared module.');
    console.error('   Make sure doc_viewer_shared.js is in the same directory as view_docs.js');
    process.exit(1);
  }
}

const {
  parseMarkdown,
  formatJson,
  formatLog,
  getFileIcon,
  getFileTypeBadge,
  discoverDocFiles,
  categorizeFiles,
  generateFileListHTML,
  generateHTML
} = sharedModule;

const PORT = process.argv[2] || 3001;
const ROOT = process.cwd();

// Create HTTP server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  if (url.pathname === '/') {
    // Home page
    const files = discoverDocFiles(ROOT);
    const categories = categorizeFiles(files);
    const fileList = generateFileListHTML(categories, '📚 Homework Viewer');
    
    let content = '<h1>📚 Backend Accelerator - Homework Viewer</h1>';
    content += '<p>Browse through homework assignments, test cases, and documentation using the sidebar navigation.</p>';
    
    // Organize categories for homework display
    const hwCategories = [];
    const otherDocs = [];
    
    for (const [category, categoryContent] of Object.entries(categories)) {
      const totalFiles = categoryContent.files.length + 
        Object.values(categoryContent.subcategories).reduce((sum, files) => sum + files.length, 0);
      
      // Find if there's a README in this category
      let readmePath = null;
      const readmeFile = categoryContent.files.find(f => f.name === 'README.md');
      if (readmeFile) {
        readmePath = readmeFile.path;
      } else {
        // Check subcategories for README
        for (const subcatFiles of Object.values(categoryContent.subcategories)) {
          const subcatReadme = subcatFiles.find(f => f.name === 'README.md');
          if (subcatReadme) {
            readmePath = subcatReadme.path;
            break;
          }
        }
      }
      
      const card = {
        title: category,
        count: totalFiles,
        category: categoryContent,
        readmePath: readmePath
      };
      
      // Categorize as homework or other
      if (category.includes('HW') || category.match(/📝 Hw\d+/)) {
        hwCategories.push(card);
      } else {
        otherDocs.push(card);
      }
    }
    
    // Helper function to create clickable or non-clickable card
    const createCard = (card) => {
      if (card.readmePath) {
        return `<a href="/view?file=${encodeURIComponent(card.readmePath)}" class="home-card">
          <h3>${card.title}</h3>
          <p>${card.count} document${card.count !== 1 ? 's' : ''}</p>
        </a>`;
      } else {
        return `<div class="home-card">
          <h3>${card.title}</h3>
          <p>${card.count} document${card.count !== 1 ? 's' : ''}</p>
        </div>`;
      }
    };
    
    // Homework Assignments section
    if (hwCategories.length > 0) {
      content += '<h2>📝 Homework Assignments</h2>';
      content += '<div class="home-grid">';
      
      // Sort homework by number
      hwCategories.sort((a, b) => {
        const aNum = parseInt(a.title.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(b.title.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
      });
      
      for (const card of hwCategories) {
        content += createCard(card);
      }
      content += '</div>';
    }
    
    // Root Documentation section
    if (otherDocs.length > 0) {
      content += '<h2>📄 Documentation</h2>';
      content += '<div class="home-grid">';
      for (const card of otherDocs) {
        content += createCard(card);
      }
      content += '</div>';
    }
    
    // Quick stats
    const totalFiles = files.length;
    const totalMd = files.filter(f => f.type === 'md').length;
    const totalJson = files.filter(f => f.type === 'json').length;
    const totalLog = files.filter(f => f.type === 'log').length;
    
    content += '<h2>📊 Statistics</h2>';
    content += '<ul>';
    content += `<li>Total Files: ${totalFiles}</li>`;
    content += `<li>Markdown Files: ${totalMd}</li>`;
    content += `<li>JSON Files: ${totalJson}</li>`;
    content += `<li>Log Files: ${totalLog}</li>`;
    content += '</ul>';
    
    const html = generateHTML('Home', content, fileList, 'Homework Viewer');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (url.pathname === '/view') {
    // View specific file
    const filePath = url.searchParams.get('file');
    
    if (!filePath) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing file parameter');
      return;
    }
    
    const fullPath = path.join(ROOT, filePath);
    
    // Security check: ensure file is within ROOT
    if (!fullPath.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access denied');
      return;
    }
    
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const files = discoverDocFiles(ROOT);
      const categories = categorizeFiles(files);
      const fileList = generateFileListHTML(categories, '📚 Homework Viewer');
      
      const fileName = path.basename(filePath);
      const fileDir = path.dirname(filePath);
      const fileType = path.extname(filePath).slice(1);
      
      // File type badge - show for all file types
      const icon = getFileIcon(fileType);
      const badge = getFileTypeBadge(fileType);
      
      let htmlContent = `<div class="file-info">${icon} ${fileDir}/${fileName} ${badge}</div>`;
      
      // Process content based on file type
      if (fileType === 'md') {
        htmlContent += parseMarkdown(content);
      } else if (fileType === 'json') {
        htmlContent += formatJson(content);
      } else if (fileType === 'log') {
        htmlContent += formatLog(content);
      }
      
      const html = generateHTML(fileName, htmlContent, fileList, `${fileName} - Homework Viewer`);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.clear();
  console.log('\x1b[36m╔════════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║\x1b[0m   \x1b[1mBackend Accelerator - Homework Viewer\x1b[0m              \x1b[36m║\x1b[0m');
  console.log('\x1b[36m╚════════════════════════════════════════════════════════╝\x1b[0m');
  console.log('');
  console.log('🌐 Server running at: \x1b[34m\x1b[4mhttp://localhost:' + PORT + '\x1b[0m');
  console.log('');
  console.log('📚 Available homework and documentation:');
  
  const files = discoverDocFiles(ROOT);
  const categories = categorizeFiles(files);
  
  for (const [category, content] of Object.entries(categories)) {
    const totalFiles = content.files.length + 
      Object.values(content.subcategories).reduce((sum, files) => sum + files.length, 0);
    console.log(`   \x1b[32m•\x1b[0m ${category}: \x1b[33m${totalFiles}\x1b[0m file${totalFiles !== 1 ? 's' : ''}`);
  }
  
  console.log('');
  console.log('💡 Supported file types: Markdown (.md), JSON (.json), Log (.log)');
  console.log('\x1b[90mPress Ctrl+C to stop the server\x1b[0m');
  console.log('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
});
