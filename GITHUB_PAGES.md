# List Comparer - GitHub Pages Deployment Guide

## Overview

List Comparer is a web-based tool for comparing two lists with intelligent matching algorithms. It runs entirely in your browser - no server required!

## Features

- **Multiple Input Methods**: Paste text directly or drag and drop files (.txt, .xlsx, .docx)
- **Smart Matching Algorithms**:
  - Exact Match: Find perfect matches between lists
  - Soundex: Phonetic matching for similar-sounding items
  - Levenshtein: Fuzzy matching based on edit distance
- **Visual Diff Highlighting**: See character-by-character differences in fuzzy matches
- **File Format Support**: Text files, Excel spreadsheets, Word documents
- **Client-Side Processing**: All processing happens in your browser - files never leave your machine
- **Cross-Platform**: Works on any device with a modern web browser

## Quick Start

### Option 1: Use the Live Demo (Recommended)

Once deployed to GitHub Pages, you can access the app at:
```
https://[your-username].github.io/[repository-name]/
```

### Option 2: Run Locally

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. No installation or build process required!

## Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., "list-comparer")
4. Make it public or private (both work with GitHub Pages)
5. Click "Create repository"

### Step 2: Upload Files

Upload these files to your repository:
- `index.html`
- `style.css`
- `app.js`
- `file-parser.js`
- `fuzzy-matcher.js`
- `GITHUB_PAGES.md` (this file)

You can do this via:
- **Web interface**: Click "Upload files" on your repository page
- **Git command line**:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/[your-username]/[repository-name].git
  git push -u origin main
  ```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Under "Branch", select "main" and folder "/ (root)"
6. Click "Save"
7. Wait 1-2 minutes for deployment

### Step 4: Access Your App

Your app will be available at:
```
https://[your-username].github.io/[repository-name]/
```

GitHub will show you the exact URL in the Pages settings.

## Usage Guide

### Comparing Lists

1. **Enter Your Data**:
   - Paste text directly into the text areas (one item per line)
   - OR drag and drop a file (.txt, .xlsx, .docx)
   - OR click the drop zone to select a file

2. **Choose Matching Algorithm**:
   - **Exact Match**: Only matches identical items (case-insensitive by default)
   - **Soundex**: Matches items that sound similar (e.g., "Smith" matches "Smyth")
   - **Levenshtein**: Matches similar items based on edit distance (adjustable threshold)

3. **Configure Options**:
   - Toggle "Ignore Case" to control case sensitivity
   - For Levenshtein, adjust the similarity threshold (50-100%)

4. **Click "Compare Lists"**:
   - Results appear below with tabs for:
     - **Matches**: Items found in both lists (with diff highlighting)
     - **Only in List 1**: Items unique to the first list
     - **Only in List 2**: Items unique to the second list

### File Format Notes

#### Text Files (.txt)
- One item per line
- Empty lines are ignored
- UTF-8 encoding recommended

#### Excel Files (.xlsx)
- All sheets are processed
- All non-empty cells are included
- Duplicates within the file are removed automatically

#### Word Documents (.docx)
- Extracts all text content
- One item per paragraph/line
- Formatting is ignored

## Technical Details

### Technologies Used

- **Pure HTML5/CSS3/JavaScript** - No frameworks or build process
- **SheetJS (xlsx.js)** - Excel file parsing
- **Mammoth.js** - Word document parsing
- **Custom Algorithms** - Soundex and Levenshtein implementations

### Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript to be enabled.

### Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Server Uploads**: Files never leave your computer
- **No Data Collection**: No analytics or tracking
- **No External APIs**: Everything runs locally

### Performance

- Handles lists with thousands of items
- Fuzzy matching is optimized for speed
- Large files (Excel/Word) are processed efficiently

## Customization

### Styling

Edit `style.css` to customize:
- Colors (change the gradient values)
- Fonts (modify font-family)
- Layout (adjust grid templates)

### Matching Algorithms

Edit `fuzzy-matcher.js` to:
- Add custom matching algorithms
- Modify Soundex/Levenshtein implementations
- Adjust diff highlighting logic

### File Support

Edit `file-parser.js` to:
- Add support for additional file formats
- Customize how files are parsed
- Add data validation

## Troubleshooting

### GitHub Pages not updating

- Clear your browser cache
- Wait a few minutes (deployment can take 5-10 minutes)
- Check the Actions tab in your repository for build status

### Files not uploading

- Files must be in the repository root
- Check that filenames match exactly (case-sensitive)
- Ensure all 5 files are uploaded

### App not loading

- Check browser console for errors (F12)
- Verify all files are uploaded
- Try accessing the page in incognito/private mode

### Drag and drop not working

- Ensure you're using a modern browser
- Try clicking the drop zone to select files instead
- Check that your browser allows file access

## Support

For issues, questions, or suggestions:
1. Check the troubleshooting section above
2. Verify your files match the provided versions
3. Open an issue on the GitHub repository

## License

Feel free to use, modify, and distribute this code for personal or commercial projects.

## Credits

Created as a portable, web-based alternative to desktop list comparison tools.

---

**Note**: This application requires no installation, no dependencies, and no server. It's a completely standalone web app that can be hosted anywhere or run from a local file system.
