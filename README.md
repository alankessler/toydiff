# List Comparer

A macOS application for comparing two lists with support for multiple file formats and fuzzy matching.

## Features

- **Multiple Input Methods:**
  - Paste text directly into frames
  - Load files via file dialog
  - Supports: .txt, .xlsx, .docx, .jpg, .png

- **Intelligent File Parsing:**
  - Automatically extracts lists from various file formats
  - Handles Excel sheets and columns
  - Extracts text from Word documents (paragraphs and tables)
  - OCR support for images (requires Tesseract)
  - Prompts user when ambiguity is detected

- **Comparison Options:**
  - Exact matching
  - Fuzzy matching with Soundex algorithm
  - Fuzzy matching with Levenshtein distance

- **Clear Visual Results:**
  - Color-coded differences (red/blue/green)
  - Shows items unique to each list
  - Shows items common to both lists
  - **NEW:** Fuzzy matches display with character differences highlighted in yellow
  - Shows exact pairs of matched items with visual diff highlighting

## Installation

### Prerequisites

1. Python 3.8 or higher
2. Tesseract OCR (for image support)

```bash
# Install Tesseract on macOS
brew install tesseract
```

### Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run the application directly:

```bash
python list_comparer.py
```

### Building a Portable .app

To create a **portable** standalone macOS application:

```bash
# Build the portable .app (includes all dependencies)
./build_app.sh

# The app will be created in: dist/List Comparer.app
# This app is fully portable and can run on any Mac!
```

**Features of the portable build:**
- ✅ Bundles Python runtime and all dependencies
- ✅ No Python installation required on target Mac
- ✅ No pip packages required
- ✅ Works on macOS 10.13+ (High Sierra and newer)
- ⚠️ Tesseract must be installed separately for OCR (optional feature)

### Creating a DMG for Distribution

To package the app for easy distribution:

```bash
# First build the app
./build_app.sh

# Then create a DMG
./create_dmg.sh

# The DMG will be created in: dist/ListComparer-v1.0.0.dmg
```

Users can then:
1. Download the DMG
2. Mount it (double-click)
3. Drag "List Comparer.app" to Applications folder
4. Done!

## Usage

1. **Loading Lists:**
   - Type or paste items directly into either frame (one item per line)
   - Click "Load File" to open a file dialog
   - Supported formats: .txt, .xlsx, .docx, .jpg, .png

2. **Handling Ambiguity:**
   - If a file contains multiple data sources (e.g., multiple Excel sheets or columns), you'll be prompted to choose which one to use

3. **Fuzzy Matching:**
   - Enable "Enable Fuzzy Matching" checkbox
   - Choose between Soundex (phonetic matching) or Levenshtein (edit distance)
   - For Levenshtein, set the maximum allowed distance (1-10)
   - Matched pairs will be displayed with character differences highlighted in yellow

4. **Comparing:**
   - Click "Compare Lists" to see results
   - Results show:
     - Total counts
     - **Fuzzy Matched Pairs** (with highlighted differences in yellow)
     - Items only in List 1 (red)
     - Items only in List 2 (blue)
     - Items in both lists (green, exact matches only)

## Examples

### Exact Matching
```
List 1: Apple, Banana, Cherry
List 2: Banana, Cherry, Date

Results:
- Only in List 1: Apple
- Only in List 2: Date
- In both: Banana, Cherry
```

### Fuzzy Matching (Soundex)
```
List 1: Smith, Jon, Robert
List 2: Smyth, John, Bob

With Soundex enabled:
Fuzzy Matched Pairs (differences highlighted):
  Smith ⟷ Smyth    (y highlighted)
  Jon ⟷ John      (h highlighted)

Only in List 1: Robert
Only in List 2: Bob
```

### Fuzzy Matching (Levenshtein, distance=2)
```
List 1: color, favorite, organize
List 2: colour, favrite, organise

With Levenshtein (distance=2):
Fuzzy Matched Pairs (differences highlighted):
  color ⟷ colour        (u highlighted)
  favorite ⟷ favrite    (o highlighted)
  organize ⟷ organise   (s highlighted)

Note: Yellow highlighting shows the exact character differences
```

## File Format Support

### Text Files (.txt)
- One item per line
- Empty lines are ignored

### Excel Files (.xlsx)
- If multiple sheets or columns contain data, you'll be prompted to choose
- Extracts all non-empty cells from the selected column

### Word Documents (.docx)
- Extracts from paragraphs or tables
- If both exist, you'll be prompted to choose

### Images (.jpg, .png)
- Uses OCR (Tesseract) to extract text
- One item per line in the extracted text
- Requires Tesseract to be installed

## Troubleshooting

### OCR not working
- Ensure Tesseract is installed: `brew install tesseract`
- Check Tesseract is in PATH: `which tesseract`

### Dependencies not found
- Run: `pip install -r requirements.txt`

### App won't build
- Ensure py2app is installed: `pip install py2app`
- Clean old builds: `rm -rf build dist`
- Try again: `./build_app.sh`

## License

MIT License
