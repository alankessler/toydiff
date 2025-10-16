# List Comparer

A web-based tool for comparing two lists with intelligent matching algorithms. Runs entirely in your browser - no installation required!

🔗 **[Try it live](https://alankessler.github.io/toydiff/)**

## Features

- **Multiple Input Methods:**
  - Paste text directly into text areas
  - Drag and drop files
  - Click to browse and select files
  - Supports: .txt, .xlsx, .docx

- **Intelligent File Parsing:**
  - Automatically extracts text from various file formats
  - Excel: Processes all sheets and cells
  - Word: Extracts all text content
  - Text: One item per line

- **Powerful Matching Algorithms:**
  - **Exact Match:** Find perfect matches between lists
  - **Soundex:** Phonetic matching for similar-sounding items (e.g., "Smith" matches "Smyth")
  - **Levenshtein:** Fuzzy matching based on edit distance with adjustable threshold (50-100%)

- **Visual Diff Highlighting:**
  - Character-by-character differences highlighted in yellow
  - Shows exact pairs of matched items with visual arrows (⟷)
  - Color-coded results for easy scanning
  - Similarity percentage for fuzzy matches

- **Privacy-Focused:**
  - 100% client-side processing
  - Files never leave your computer
  - No server uploads or data collection
  - Works offline after first load

## Quick Start

### Option 1: Use Online (Recommended)

Simply visit: **https://alankessler.github.io/toydiff/**

No installation, no setup, just open and use!

### Option 2: Run Locally

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. That's it - no build process or dependencies needed!

## Usage

### 1. Loading Your Lists

**Paste Text:**
- Type or paste items directly into either text area
- One item per line
- Empty lines are automatically ignored

**Upload Files:**
- Drag and drop a file onto the drop zone
- OR click the drop zone to browse and select a file
- Supported formats: `.txt`, `.xlsx`, `.docx`

### 2. Choose Matching Algorithm

**Exact Match:**
- Finds only perfect matches
- Case sensitivity is optional (toggle "Ignore Case")
- Best for: Comparing identical lists

**Soundex (Phonetic):**
- Matches items that sound similar
- Great for finding name variations
- Example: "Smith" ⟷ "Smyth", "Jon" ⟷ "John"
- Best for: Names, words with common misspellings

**Levenshtein (Similarity):**
- Matches items based on edit distance
- Adjustable similarity threshold (50-100%)
- Shows similarity percentage for each match
- Example: "color" ⟷ "colour" (83% similar)
- Best for: Finding near-matches, typos, variations

### 3. Compare and View Results

Click **"Compare Lists"** to see:

- **Summary Cards:**
  - Number of matches found
  - Items only in List 1
  - Items only in List 2
  - Total items processed

- **Matches Tab:**
  - Paired items from both lists
  - Visual diff highlighting (yellow background)
  - Similarity percentage (for Levenshtein)

- **Only in List 1/2 Tabs:**
  - Items unique to each list
  - Easy to identify what's missing

## Examples

### Exact Matching

```
List 1: Apple, Banana, Cherry
List 2: Banana, Cherry, Date

Results:
✓ Matches: Banana, Cherry
• Only in List 1: Apple
• Only in List 2: Date
```

### Fuzzy Matching - Soundex

```
List 1: Smith, Jon, Robert
List 2: Smyth, John, Bob

Results with Soundex:
✓ Fuzzy Matches (differences highlighted):
  Smith ⟷ Smyth
  Jon ⟷ John

• Only in List 1: Robert
• Only in List 2: Bob
```

### Fuzzy Matching - Levenshtein (80% threshold)

```
List 1: color, favorite, organize
List 2: colour, favrite, organise

Results with Levenshtein:
✓ Fuzzy Matches (with similarity):
  color ⟷ colour (83.3%)
  favorite ⟷ favrite (87.5%)
  organize ⟷ organise (87.5%)
```

## File Format Support

| Format | Extension | What Gets Extracted |
|--------|-----------|-------------------|
| Text | `.txt` | One item per line |
| Excel | `.xlsx` | All non-empty cells from all sheets |
| Word | `.docx` | All paragraphs and text content |

## Deploying Your Own Instance

### GitHub Pages (Free & Easy)

1. **Fork or clone this repository**
2. **Create a new GitHub repository**
3. **Upload these files:**
   - `index.html`
   - `style.css`
   - `app.js`
   - `file-parser.js`
   - `fuzzy-matcher.js`

4. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save

5. **Access your app** at: `https://[username].github.io/[repo-name]/`

See `GITHUB_PAGES.md` for detailed deployment instructions.

## Technical Details

### Technologies

- **Pure HTML/CSS/JavaScript** - No frameworks or build tools
- **SheetJS (xlsx.js)** - Excel file parsing
- **Mammoth.js** - Word document parsing
- **Custom Algorithms** - Soundex and Levenshtein implementations

### Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

Requires JavaScript to be enabled.

### Performance

- Handles lists with thousands of items
- Fuzzy matching is optimized for speed
- Large files (Excel/Word) are processed efficiently
- All processing is non-blocking (UI stays responsive)

## Privacy & Security

- ✅ **No server uploads** - Everything runs in your browser
- ✅ **No data collection** - No analytics or tracking
- ✅ **No external APIs** - All libraries loaded from CDN on first visit
- ✅ **Offline capable** - Works without internet after first load

Your files and data never leave your computer!

## Contributing

Contributions welcome! Feel free to:
- Report bugs via GitHub Issues
- Suggest new features
- Submit pull requests
- Share your use cases

## License

MIT License - Feel free to use for personal or commercial projects.

## Support

For issues or questions:
- Check the `examples/` folder for sample files
- Read `GITHUB_PAGES.md` for deployment help
- Open an issue on GitHub

---

A modern, privacy-focused list comparison tool that runs entirely in your browser.
