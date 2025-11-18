/*
  Shared Documentation Viewer Utilities
  
  Common functions and styles for documentation viewer scripts.
  Used by both serve_docs.js (mentor-side) and view_docs.js (student-side).
*/

const fs = require('fs');
const path = require('path');

// Try to use marked library if available, fall back to simple parsing
let marked;
try {
  marked = require('marked').marked;
} catch (err) {
  // Fallback if marked is not installed
}

// ============================================================================
// MARKDOWN & CONTENT PARSING
// ============================================================================

/**
 * Parse markdown content to HTML
 */
function parseMarkdown(content) {
  if (marked) {
    return marked(content);
  }
  
  // Basic markdown to HTML conversion (fallback)
  let html = content
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Tables
    .replace(/^\|(.+)\|$/gim, function(match) {
      const cells = match.slice(1, -1).split('|').map(c => c.trim());
      return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    })
    // Horizontal rules
    .replace(/^---$/gim, '<hr>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  return '<p>' + html + '</p>';
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format JSON with syntax highlighting
 */
function formatJson(content) {
  return `<pre><code class="language-json">${escapeHtml(content)}</code></pre>`;
}

/**
 * Format log files with syntax highlighting
 */
function formatLog(content) {
  return `<pre><code class="language-log">${escapeHtml(content)}</code></pre>`;
}

/**
 * Get file type icon
 */
function getFileIcon(fileType) {
  const icons = {
    'md': '📝',
    'json': '📊',
    'log': '📋'
  };
  return icons[fileType] || '📄';
}

/**
 * Get file type badge HTML
 */
function getFileTypeBadge(fileType, isSmall = false) {
  const sizeClass = isSmall ? 'small' : '';
  const typeClass = fileType === 'json' ? 'json' : fileType === 'log' ? 'log' : fileType === 'md' ? 'md' : '';
  return `<span class="file-type-badge ${typeClass} ${sizeClass}">${fileType.toUpperCase()}</span>`;
}

// ============================================================================
// FILE DISCOVERY
// ============================================================================

/**
 * Discover all documentation files (.md, .json, .log) in a directory
 * @param {string} rootDir - Root directory to scan
 * @param {Array<string>} excludeDirs - Directories to exclude (e.g., ['node_modules', '.git'])
 * @returns {Array} Array of file objects with metadata
 */
function discoverDocFiles(rootDir, excludeDirs = []) {
  const docFiles = [];
  const defaultExcludes = ['node_modules', '.git'];
  const allExcludes = [...defaultExcludes, ...excludeDirs];
  
  function walkDir(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      // Skip excluded directories and hidden files
      if (file.startsWith('.')) continue;
      if (allExcludes.includes(file)) continue;
      
      if (stat.isDirectory()) {
        walkDir(filePath, path.join(prefix, file));
      } else if (file.endsWith('.md') || file.endsWith('.json') || file.endsWith('.log')) {
        const relativePath = path.join(prefix, file);
        const ext = path.extname(file);
        docFiles.push({
          path: relativePath,
          fullPath: filePath,
          name: file,
          dir: prefix || 'root',
          size: stat.size,
          modified: stat.mtime,
          type: ext.slice(1) // 'md', 'json', or 'log'
        });
      }
    }
  }
  
  walkDir(rootDir);
  return docFiles;
}

/**
 * Categorize files by directory with subcategories for homework folders
 * @param {Array} files - Array of file objects from discoverDocFiles
 * @returns {Object} Categorized files
 */
function categorizeFiles(files) {
  const categories = {};
  
  for (const file of files) {
    let category;
    let subcategory = null;
    
    if (file.dir === 'root') {
      category = '📄 Root Documentation';
    } else {
      // Get the top-level directory and potential subdirectory
      const pathParts = file.dir.split(path.sep);
      const topDir = pathParts[0];
      const subDir = pathParts[1];
      
      // Convert dashes to spaces and capitalize
      const displayName = topDir.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      // Add icon based on directory type
      if (topDir.includes('Backend')) {
        category = `📚 ${displayName}`;
        // Check for hw folders (hw1, hw2, hw1_submissions, etc.)
        if (subDir && subDir.match(/^hw\d+(_submissions)?$/)) {
          const hwNum = subDir.match(/hw(\d+)/)[1];
          const isSubmissions = subDir.includes('_submissions');
          subcategory = isSubmissions ? `📥 HW${hwNum} Submissions` : `📝 HW${hwNum}`;
        }
      } else if (topDir === 'automation-requests') {
        category = `⚙️ Automation Requests`;
      } else if (topDir === 'automation-data') {
        category = `⚙️ Automation Data`;
      } else if (topDir.startsWith('.')) {
        category = `⚙️ ${displayName.slice(1)}`; // Remove leading dot from display
      } else if (topDir.includes('hw') || topDir.includes('template')) {
        category = `📝 ${displayName}`;
      } else if (topDir === 'scripts') {
        category = `🔧 ${displayName}`;
      } else {
        category = `📁 ${displayName}`;
      }
    }
    
    if (!categories[category]) {
      categories[category] = { files: [], subcategories: {} };
    }
    
    if (subcategory) {
      if (!categories[category].subcategories[subcategory]) {
        categories[category].subcategories[subcategory] = [];
      }
      categories[category].subcategories[subcategory].push(file);
    } else {
      categories[category].files.push(file);
    }
  }
  
  // Sort categories: Root first, then alphabetically
  const sortedCategories = {};
  const rootKey = Object.keys(categories).find(k => k.includes('Root'));
  if (rootKey) {
    sortedCategories[rootKey] = categories[rootKey];
  }
  
  Object.keys(categories)
    .filter(k => k !== rootKey)
    .sort()
    .forEach(key => {
      sortedCategories[key] = categories[key];
    });
  
  return sortedCategories;
}

// ============================================================================
// HTML GENERATION
// ============================================================================

/**
 * Generate HTML for file listing with subcategories
 */
function generateFileListHTML(categories, title = '📚 Documentation') {
  let html = '<div class="sidebar">';
  html += `<h2><a href="/">${title}</a></h2>`;
  
  for (const [category, content] of Object.entries(categories)) {
    html += `<div class="category">`;
    html += `<h3>${category}</h3>`;
    html += '<ul>';
    
    // Add files that are directly under the category (no subcategory)
    for (const file of content.files) {
      const icon = getFileIcon(file.type);
      const displayName = file.name === 'README.md' 
        ? `${file.dir}/README` 
        : file.name.replace(/\.(md|json|log)$/, '');
      const badge = getFileTypeBadge(file.type, true);
      html += `<li><a href="/view?file=${encodeURIComponent(file.path)}">${badge}<span>${icon} ${displayName}</span></a></li>`;
    }
    
    // Add subcategories with their files
    const sortedSubcategories = Object.keys(content.subcategories).sort((a, b) => {
      // Extract HW numbers for proper sorting
      const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
      if (aNum !== bNum) return aNum - bNum;
      // If same HW number, put regular before submissions
      return a.includes('Submissions') ? 1 : -1;
    });
    
    for (const subcategory of sortedSubcategories) {
      const subFiles = content.subcategories[subcategory];
      html += `</ul><h4 class="subcategory">${subcategory}</h4><ul>`;
      
      for (const file of subFiles) {
        const icon = getFileIcon(file.type);
        const displayName = file.name === 'README.md' 
          ? 'README' 
          : file.name.replace(/\.(md|json|log)$/, '');
        const badge = getFileTypeBadge(file.type, true);
        html += `<li><a href="/view?file=${encodeURIComponent(file.path)}">${badge}<span>${icon} ${displayName}</span></a></li>`;
      }
    }
    
    html += '</ul></div>';
  }
  
  html += '</div>';
  return html;
}

/**
 * Get shared CSS styles
 */
function getSharedStyles() {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html {
      font-size: 16px;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      background: #0d1117;
      color: #c9d1d9;
      display: flex;
      min-height: 100%;
    }
    
    .sidebar {
      width: 20rem;
      background: #161b22;
      border-right: 1px solid #30363d;
      padding: 1.5rem 0;
      overflow-y: auto;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
    }
    
    .sidebar h2 {
      margin: 0 1.5rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #8b949e;
      border-bottom: 1px solid #21262d;
      padding-bottom: 1rem;
      letter-spacing: 0.03em;
    }
    
    .sidebar h2 a {
      color: inherit;
      text-decoration: none;
      display: block;
      transition: color 0.15s ease;
    }
    
    .sidebar h2 a:hover {
      color: #58a6ff;
    }
    
    .category {
      margin-bottom: 1.5rem;
    }
    
    .category h3 {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #8b949e;
      margin: 0 1.5rem 0.75rem;
      letter-spacing: 0.03em;
    }
    
    .subcategory {
      font-size: 0.69rem;
      font-weight: 600;
      color: #6e7681;
      margin: 0.75rem 1.5rem 0.5rem;
      padding-left: 0.75rem;
      border-left: 2px solid #21262d;
    }
    
    .sidebar ul {
      list-style: none;
    }
    
    .sidebar li {
      margin-bottom: 0.125rem;
    }
    
    .sidebar a {
      color: #c9d1d9;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.5rem;
      transition: all 0.15s ease;
      font-size: 0.875rem;
      border-left: 3px solid transparent;
    }
    
    .sidebar a .file-type-badge {
      order: -1;
      flex-shrink: 0;
      margin-left: 0;
    }
    
    .sidebar a:hover {
      background: #1c2128;
      border-left-color: #58a6ff;
      color: #58a6ff;
    }
    
    .sidebar a:active {
      background: #21262d;
    }
    
    .sidebar a.active {
      background: #1c2128;
      border-left-color: #58a6ff;
      color: #58a6ff;
      font-weight: 500;
    }
    
    .content {
      margin-left: 20rem;
      flex: 1;
      padding: 3rem;
      max-width: 75rem;
    }
    
    .content-inner {
      background: #0d1117;
      padding: 3rem;
      border-radius: 0.375rem;
      border: 1px solid #30363d;
    }
    
    h1 { 
      color: #f0f6fc; 
      margin-bottom: 1.5rem;
      font-size: 2rem;
      font-weight: 600;
      border-bottom: 1px solid #21262d;
      padding-bottom: 1rem;
    }
    
    h2 { 
      color: #f0f6fc; 
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-size: 1.5rem;
      font-weight: 600;
      border-bottom: 1px solid #21262d;
      padding-bottom: 0.5rem;
    }
    
    h3 { 
      color: #f0f6fc; 
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    h4 {
      color: #f0f6fc;
      margin-top: 1.25rem;
      margin-bottom: 0.625rem;
      font-size: 1rem;
      font-weight: 600;
    }
    
    p { 
      line-height: 1.6; 
      margin-bottom: 1rem;
      color: #c9d1d9;
    }
    
    code {
      background: #161b22;
      padding: 0.1875rem 0.375rem;
      border-radius: 0.375rem;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
      font-size: 85%;
      color: #f0f6fc;
      border: 1px solid #30363d;
    }
    
    pre {
      background: #161b22;
      color: #c9d1d9;
      padding: 1rem;
      border-radius: 0.375rem;
      overflow-x: auto;
      margin: 1rem 0;
      line-height: 1.5;
      border: 1px solid #30363d;
    }
    
    pre code {
      background: none;
      color: inherit;
      padding: 0;
      border: none;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1rem 0;
      border: 1px solid #30363d;
    }
    
    th, td {
      border: 1px solid #30363d;
      padding: 0.75rem 1rem;
      text-align: left;
    }
    
    th {
      background: #161b22;
      color: #f0f6fc;
      font-weight: 600;
    }
    
    tr:nth-child(even) {
      background: #161b22;
    }
    
    tr:hover {
      background: #1c2128;
    }
    
    hr {
      border: none;
      border-top: 1px solid #21262d;
      margin: 2rem 0;
    }
    
    a {
      color: #58a6ff;
      text-decoration: none;
      transition: font-weight 0.15s ease;
    }
    
    a:hover {
      font-weight: 600;
    }
    
    a.home-card {
      font-weight: 400;
    }
    
    a.home-card:hover {
      font-weight: 400;
    }
    
    strong {
      color: #f0f6fc;
      font-weight: 600;
    }
    
    em {
      color: #c9d1d9;
      font-style: italic;
    }
    
    blockquote {
      border-left: 3px solid #30363d;
      padding-left: 1rem;
      margin: 1rem 0;
      color: #8b949e;
    }
    
    ul, ol {
      margin: 1rem 0;
      padding-left: 2rem;
    }
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
    
    .home-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .home-card {
      background: #161b22;
      padding: 1.5rem;
      border-radius: 0.375rem;
      border: 1px solid #30363d;
      transition: border-color 0.15s ease, transform 0.15s ease;
      text-decoration: none;
      color: inherit;
      display: block;
    }
    
    .home-card:hover {
      border-color: #58a6ff;
      transform: translateY(-0.125rem);
    }
    
    a.home-card:hover h3 {
      color: #58a6ff;
    }
    
    a.home-card:hover code {
      color: #58a6ff;
    }
    
    .home-card h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      color: #f0f6fc;
      font-size: 1rem;
      transition: color 0.15s ease;
    }
    
    .home-card code {
      transition: color 0.15s ease;
    }
    
    .home-card p {
      margin: 0;
      color: #8b949e;
      font-size: 0.875rem;
    }
    
    .file-info {
      background: #161b22;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      margin-bottom: 1.5rem;
      font-size: 0.8125rem;
      color: #8b949e;
      border: 1px solid #30363d;
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
    }
    
    .file-type-badge {
      display: inline-block;
      background: #1f6feb;
      color: #ffffff;
      padding: 0.125rem 0.5rem;
      border-radius: 0.75rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-left: 0.5rem;
    }
    
    .file-type-badge.small {
      font-size: 0.5625rem;
      padding: 0.0625rem 0.375rem;
      margin-left: 0.375rem;
    }
    
    .file-type-badge.md {
      background: #1f6feb;
    }
    
    .file-type-badge.json {
      background: #f85149;
    }
    
    .file-type-badge.log {
      background: #9e6a03;
    }
    
    ::-webkit-scrollbar {
      width: 0.75rem;
      height: 0.75rem;
    }
    
    ::-webkit-scrollbar-track {
      background: #0d1117;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #30363d;
      border-radius: 0.375rem;
      border: 2px solid #0d1117;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #484f58;
    }
    
    /* Diff Viewer Styles */
    .diff-container {
      display: flex;
      gap: 0;
      margin: 1rem 0;
      border: 1px solid #30363d;
      border-radius: 0.375rem;
      overflow: hidden;
      background: #161b22;
    }
    
    .diff-panel {
      flex: 1;
      min-width: 0;
    }
    
    .diff-panel:first-child {
      border-right: 1px solid #30363d;
    }
    
    .diff-header {
      background: #21262d;
      padding: 0.5rem 0.75rem;
      font-weight: 600;
      font-size: 0.75rem;
      border-bottom: 1px solid #30363d;
      color: #8b949e;
      text-transform: uppercase;
    }
    
    .diff-header.expected {
      color: #58a6ff;
    }
    
    .diff-header.got {
      color: #f85149;
    }
    
    .diff-content {
      padding: 0.75rem;
      overflow-x: auto;
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: 0.8125rem;
      line-height: 1.6;
      max-height: 37.5rem;
      overflow-y: auto;
    }
    
    .diff-line {
      display: block;
      padding: 0.125rem 0.25rem;
      white-space: pre-wrap;
      word-wrap: break-word;
      cursor: help;
      position: relative;
    }
    
    .diff-line:hover {
      filter: brightness(1.2);
    }
    
    .diff-line.added {
      background: rgba(46, 160, 67, 0.15);
      color: #7ee787;
    }
    
    .diff-line.removed {
      background: rgba(248, 81, 73, 0.15);
      color: #ff7b72;
    }
    
    .diff-line.moved {
      background: rgba(187, 128, 9, 0.15);
      color: #f2cc60;
      border-left: 3px solid #d29922;
      padding-left: 0.5rem;
    }
    
    .diff-line.moved-dest {
      background: rgba(139, 148, 158, 0.1);
      color: #8b949e;
      border-left: 3px solid #6e7681;
      padding-left: 0.5rem;
    }
    
    .diff-line.unchanged {
      color: #c9d1d9;
    }
    
    /* Sidebar Resizer */
    .sidebar-resizer {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 20rem;
      width: 4px;
      background: transparent;
      cursor: col-resize;
      z-index: 1000;
      transition: background 0.2s ease;
    }
    
    .sidebar-resizer:hover,
    .sidebar-resizer.resizing {
      background: #58a6ff;
    }
  `;
}

/**
 * Get shared JavaScript code
 */
function getSharedScripts() {
  return `
    // Preserve sidebar scroll position
    window.addEventListener('DOMContentLoaded', () => {
      const sidebar = document.querySelector('.sidebar');
      const currentFile = new URLSearchParams(window.location.search).get('file');
      
      // Restore scroll position
      const savedScroll = sessionStorage.getItem('sidebarScroll');
      if (savedScroll) {
        sidebar.scrollTop = parseInt(savedScroll, 10);
      }
      
      // Highlight active link
      if (currentFile) {
        const links = sidebar.querySelectorAll('a');
        links.forEach(link => {
          const href = new URL(link.href);
          const linkFile = href.searchParams.get('file');
          if (linkFile === currentFile) {
            link.classList.add('active');
            // Scroll active link into view if needed
            if (!savedScroll) {
              link.scrollIntoView({ block: 'center', behavior: 'instant' });
            }
          }
        });
      }
      
      // Save scroll position before navigation
      sidebar.addEventListener('scroll', () => {
        sessionStorage.setItem('sidebarScroll', sidebar.scrollTop);
      });
      
      // Save scroll position when clicking links
      const links = sidebar.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', () => {
          sessionStorage.setItem('sidebarScroll', sidebar.scrollTop);
        });
      });
      
      // Sidebar resizer functionality
      const resizer = document.querySelector('.sidebar-resizer');
      const content = document.querySelector('.content');
      let isResizing = false;
      
      // Restore saved width
      const savedWidth = localStorage.getItem('sidebarWidth');
      if (savedWidth) {
        const width = parseFloat(savedWidth);
        sidebar.style.width = width + 'rem';
        resizer.style.left = width + 'rem';
        content.style.marginLeft = width + 'rem';
      }
      
      resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        resizer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      });
      
      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const newWidth = e.clientX;
        const minWidth = 200; // minimum 200px
        const maxWidth = 600; // maximum 600px
        
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          // Convert to rem (assuming 16px base)
          const widthInRem = newWidth / 16;
          sidebar.style.width = widthInRem + 'rem';
          resizer.style.left = widthInRem + 'rem';
          content.style.marginLeft = widthInRem + 'rem';
          
          // Save to localStorage
          localStorage.setItem('sidebarWidth', widthInRem);
        }
      });
      
      document.addEventListener('mouseup', () => {
        if (isResizing) {
          isResizing = false;
          resizer.classList.remove('resizing');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
        }
      });
      
      // Apply syntax highlighting to all code blocks
      hljs.highlightAll();
      
      // Transform Expected/Got sections into diff views
      transformExpectedGotSections();
    });
    
    // Transform Expected/Got sections into diff views
    function transformExpectedGotSections() {
      const content = document.querySelector('.content-inner');
      if (!content) return;
      
      // Find all strong tags with "Expected:" or "Got:"
      const allElements = content.querySelectorAll('strong');
      const expectedGotPairs = [];
      let currentPair = null;
      
      allElements.forEach(strongTag => {
        const text = strongTag.textContent.trim();
        
        if (text === 'Expected:') {
          // Find the parent list item or container
          const listItem = strongTag.closest('li') || strongTag.parentElement;
          currentPair = { expected: listItem, got: null };
        } else if (text === 'Got:' && currentPair) {
          // Find the parent list item or container
          const listItem = strongTag.closest('li') || strongTag.parentElement;
          currentPair.got = listItem;
          expectedGotPairs.push(currentPair);
          currentPair = null;
        }
      });
      
      // Transform each pair into a diff view
      expectedGotPairs.forEach(pair => {
        const expectedCode = extractCodeContent(pair.expected);
        const gotCode = extractCodeContent(pair.got);
        
        if (expectedCode !== null && gotCode !== null) {
          const diffContainer = createDiffView(expectedCode, gotCode);
          
          // Find the parent container (usually ul)
          const parent = pair.expected.parentElement;
          
          // Insert diff container before the Expected item
          parent.insertBefore(diffContainer, pair.expected);
          
          // Hide original items
          pair.expected.style.display = 'none';
          pair.got.style.display = 'none';
        }
      });
    }
    
    // Extract code content from a list item
    function extractCodeContent(listItem) {
      // Try to find a code block
      const codeBlock = listItem.querySelector('pre code') || listItem.querySelector('code');
      if (codeBlock) {
        return codeBlock.textContent.trim();
      }
      
      // If no code block, try to get text after the "Expected:" or "Got:" label
      const text = listItem.textContent;
      const match = text.match(/(?:Expected:|Got:)\\s*([\\s\\S]*)/);
      if (match && match[1]) {
        return match[1].trim();
      }
      
      return null;
    }
    
    // Create a diff view comparing expected and got
    function createDiffView(expected, got) {
      const container = document.createElement('div');
      container.className = 'diff-container';
      
      // Create Expected panel
      const expectedPanel = document.createElement('div');
      expectedPanel.className = 'diff-panel';
      
      const expectedHeader = document.createElement('div');
      expectedHeader.className = 'diff-header expected';
      expectedHeader.textContent = 'Expected';
      
      const expectedContent = document.createElement('div');
      expectedContent.className = 'diff-content';
      
      // Create Got panel
      const gotPanel = document.createElement('div');
      gotPanel.className = 'diff-panel';
      
      const gotHeader = document.createElement('div');
      gotHeader.className = 'diff-header got';
      gotHeader.textContent = 'Got';
      
      const gotContent = document.createElement('div');
      gotContent.className = 'diff-content';
      
      // Try to parse as JSON for smarter diff
      let isJson = false;
      let expectedObj, gotObj;
      try {
        expectedObj = JSON.parse(expected);
        gotObj = JSON.parse(got);
        isJson = true;
      } catch (e) {
        // Not valid JSON, fall back to line diff
      }
      
      if (isJson) {
        // JSON-aware diff: DON'T re-normalize, use original formatting
        // Just use the smart diff algorithm with original text
        renderSmartDiff(expected, got, expectedContent, gotContent, true);
      } else {
        // Regular line-by-line diff with move detection
        renderSmartDiff(expected, got, expectedContent, gotContent, false);
      }
      
      expectedPanel.appendChild(expectedHeader);
      expectedPanel.appendChild(expectedContent);
      
      gotPanel.appendChild(gotHeader);
      gotPanel.appendChild(gotContent);
      
      container.appendChild(expectedPanel);
      container.appendChild(gotPanel);
      
      return container;
    }

    // Apply JSON syntax highlighting to a line
    function colorizeJsonLine(line) {
      // Parse JSON tokens and apply syntax highlighting
      // Match different token types in order of priority
      const tokens = [];
      let lastIndex = 0;
      
      // Regex to match: strings, numbers, booleans, null, or structural characters
      const tokenRegex = /"(?:[^"\\\\\\\\]|\\\\\\\\.)*"|\\\\b(?:true|false|null)\\\\b|\\\\b-?\\\\d+(?:\\\\.\\\\d+)?(?:[eE][+-]?\\\\d+)?\\\\b|[{}\\\\[\\\\]:,]|\\\\s+|./g;
      
      let match;
      while ((match = tokenRegex.exec(line)) !== null) {
        const token = match[0];
        let coloredToken;
        
        if (token.startsWith('"')) {
          // String (including property names)
          coloredToken = '<span style="color: #a5d6ff;">' + token + '</span>';
        } else if (/^-?\\\\d/.test(token)) {
          // Number
          coloredToken = '<span style="color: #79c0ff;">' + token + '</span>';
        } else if (token === 'true' || token === 'false') {
          // Boolean
          coloredToken = '<span style="color: #ff7b72;">' + token + '</span>';
        } else if (token === 'null') {
          // Null
          coloredToken = '<span style="color: #ff7b72;">' + token + '</span>';
        } else if (/^[{}\\\\[\\\\]:,]$/.test(token)) {
          // Structural characters
          coloredToken = '<span style="color: #c9d1d9;">' + token + '</span>';
        } else {
          // Whitespace and other characters (preserve as-is)
          coloredToken = token;
        }
        
        tokens.push(coloredToken);
      }
      
      return tokens.join('');
    }

    // Render smart diff with moved line detection
    function renderSmartDiff(expected, got, expectedContent, gotContent, isJson) {
      const expectedLines = expected.split('\\\\n');
      const gotLines = got.split('\\\\n');
      
      // Build maps for moved line detection (using trimmed content as key)
      // Store both the normalized content and the original line numbers
      const expectedLineMap = new Map(); // key -> [{lineNum, originalLine}]
      const gotLineMap = new Map(); // key -> [{lineNum, originalLine}]
      
      expectedLines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed && trimmed !== '{' && trimmed !== '}' && trimmed !== '[' && trimmed !== ']') {
          // Remove trailing comma for comparison
          const normalized = trimmed.replace(/,$/,  '');
          if (!expectedLineMap.has(normalized)) {
            expectedLineMap.set(normalized, []);
          }
          expectedLineMap.get(normalized).push({ lineNum: idx + 1, originalLine: line });
        }
      });
      
      gotLines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed && trimmed !== '{' && trimmed !== '}' && trimmed !== '[' && trimmed !== ']') {
          // Remove trailing comma for comparison
          const normalized = trimmed.replace(/,$/, '');
          if (!gotLineMap.has(normalized)) {
            gotLineMap.set(normalized, []);
          }
          gotLineMap.get(normalized).push({ lineNum: idx + 1, originalLine: line });
        }
      });
      
      // Use jsdiff to compute the diff
      const diff = Diff.diffLines(expected, got);
      
      // Track current line numbers as we render
      let expectedLineNum = 0;
      let gotLineNum = 0;
      
      // Render diff with moved line detection and smart tooltips
      diff.forEach(part => {
        const lines = part.value.split('\\\\n').filter((line, idx, arr) => {
          return idx < arr.length - 1 || line !== '';
        });
        
        if (part.added) {
          // Lines added in 'got' - check if they were moved
          lines.forEach(line => {
            gotLineNum++;
            const trimmed = line.trim();
            const normalized = trimmed.replace(/,$/, '');
            const isMoved = normalized && 
                           normalized !== '{' && normalized !== '}' && 
                           normalized !== '[' && normalized !== ']' &&
                           expectedLineMap.has(normalized);
            
            const lineElement = document.createElement('div');
            lineElement.className = 'diff-line ' + (isMoved ? 'moved-dest' : 'added');
            
            // Generate smart tooltip
            if (isMoved) {
              const expectedEntries = expectedLineMap.get(normalized);
              if (expectedEntries && expectedEntries.length > 0) {
                const fromLine = expectedEntries[0].lineNum;
                lineElement.title = 'Reordered: Expected line ' + fromLine + ' -> Got line ' + gotLineNum;
              } else {
                lineElement.title = 'Reordered: This line appears in a different position in Expected';
              }
            } else {
              lineElement.title = 'Added at line ' + gotLineNum + ': This line only exists in Got (not in Expected)';
            }
            
            // Apply JSON syntax highlighting if needed
            if (isJson) {
              lineElement.innerHTML = colorizeJsonLine(line);
            } else {
              lineElement.textContent = line;
            }
            gotContent.appendChild(lineElement);
          });
        } else if (part.removed) {
          // Lines removed from 'expected' - check if they were moved
          lines.forEach(line => {
            expectedLineNum++;
            const trimmed = line.trim();
            const normalized = trimmed.replace(/,$/, '');
            const isMoved = normalized && 
                           normalized !== '{' && normalized !== '}' && 
                           normalized !== '[' && normalized !== ']' &&
                           gotLineMap.has(normalized);
            
            const lineElement = document.createElement('div');
            lineElement.className = 'diff-line ' + (isMoved ? 'moved' : 'removed');
            
            // Generate smart tooltip
            if (isMoved) {
              const gotEntries = gotLineMap.get(normalized);
              if (gotEntries && gotEntries.length > 0) {
                const toLine = gotEntries[0].lineNum;
                lineElement.title = 'Reordered: Expected line ' + expectedLineNum + ' -> Got line ' + toLine;
              } else {
                lineElement.title = 'Reordered: This line appears in a different position in Got';
              }
            } else {
              lineElement.title = 'Removed from line ' + expectedLineNum + ': This line only exists in Expected (not in Got)';
            }
            
            // Apply JSON syntax highlighting if needed
            if (isJson) {
              lineElement.innerHTML = colorizeJsonLine(line);
            } else {
              lineElement.textContent = line;
            }
            expectedContent.appendChild(lineElement);
          });
        } else {
          // Unchanged lines
          lines.forEach(line => {
            expectedLineNum++;
            gotLineNum++;
            
            const expLine = document.createElement('div');
            expLine.className = 'diff-line unchanged';
            expLine.title = 'Line ' + expectedLineNum + ': Identical in both Expected and Got';
            if (isJson) {
              expLine.innerHTML = colorizeJsonLine(line);
            } else {
              expLine.textContent = line;
            }
            expectedContent.appendChild(expLine);
            
            const gotLine = document.createElement('div');
            gotLine.className = 'diff-line unchanged';
            gotLine.title = 'Line ' + gotLineNum + ': Identical in both Expected and Got';
            if (isJson) {
              gotLine.innerHTML = colorizeJsonLine(line);
            } else {
              gotLine.textContent = line;
            }
            gotContent.appendChild(gotLine);
          });
        }
      });
    }
  `;
}

/**
 * Generate full HTML page
 * @param {string} title - Page title
 * @param {string} content - Main content HTML
 * @param {string} fileList - Sidebar HTML
 * @param {string} pageTitle - Browser page title (defaults to title)
 */
function generateHTML(title, content, fileList, pageTitle = null) {
  if (!pageTitle) pageTitle = title;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/json.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.1.0/diff.min.js"></script>
  <style>
    ${getSharedStyles()}
  </style>
  <script>
    ${getSharedScripts()}
  </script>
</head>
<body>
  ${fileList}
  <div class="sidebar-resizer"></div>
  <div class="content">
    <div class="content-inner">
      ${content}
    </div>
  </div>
</body>
</html>`;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Content parsing
  parseMarkdown,
  escapeHtml,
  formatJson,
  formatLog,
  
  // File utilities
  getFileIcon,
  getFileTypeBadge,
  
  // File discovery
  discoverDocFiles,
  categorizeFiles,
  
  // HTML generation
  generateFileListHTML,
  generateHTML,
  getSharedStyles,
  getSharedScripts
};
