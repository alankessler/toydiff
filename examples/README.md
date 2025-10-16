# Example Files

This directory contains sample files to test the List Comparer application.

## Files

### Exact Matching Examples
- **list1.txt** - Simple text list of fruits
- **list2.txt** - Another text list with some overlapping fruits

### Fuzzy Matching Examples
- **fuzzy_names1.txt** & **fuzzy_names2.txt** - Name variations with typos/alternate spellings
- **fuzzy_words1.txt** & **fuzzy_words2.txt** - American vs British English spellings

## Testing the Application

### Basic Exact Matching

1. Run the application:
   ```bash
   python3 ../list_comparer.py
   ```

2. Load the example files:
   - Click "Load File" in List 1 frame and select `list1.txt`
   - Click "Load File" in List 2 frame and select `list2.txt`

3. Click "Compare Lists" to see the results

**Expected Results:**
- **In Both Lists:** Banana, Cherry, Fig, Grape
- **Only in List 1:** Apple, Date, Elderberry
- **Only in List 2:** Honeydew, Kiwi, Lemon

### Testing Fuzzy Matching with Names

1. Load `fuzzy_names1.txt` and `fuzzy_names2.txt`

2. Enable "Enable Fuzzy Matching" checkbox

3. **With Soundex (Phonetic Matching):**
   - Expected matches (differences highlighted in yellow):
     - Smith ⟷ Smyth
     - Jon ⟷ John
     - Catherine ⟷ Katherine
     - Michael ⟷ Micheal
     - Jennifer ⟷ Jenifer
     - Christopher ⟷ Cristopher
   - Robert/Bob will NOT match (different phonetics)

4. **With Levenshtein (Edit Distance = 2):**
   - Expected matches:
     - Smith ⟷ Smyth (distance = 1)
     - Jon ⟷ John (distance = 1)
     - Michael ⟷ Micheal (distance = 2)
     - Jennifer ⟷ Jenifer (distance = 1)
     - Christopher ⟷ Cristopher (distance = 1)
   - Catherine/Katherine may not match (distance = 2)
   - Robert/Bob will NOT match (distance = 5)

### Testing Fuzzy Matching with British/American Spellings

1. Load `fuzzy_words1.txt` and `fuzzy_words2.txt`

2. Enable "Enable Fuzzy Matching" with Levenshtein (distance = 2)

3. **Expected Results:**
   All words should match with differences highlighted:
   - color ⟷ colour
   - favorite ⟷ favourite
   - organize ⟷ organise
   - realize ⟷ realise
   - analyze ⟷ analyse

## Understanding the Highlighted Differences

When fuzzy matching is enabled, the results will show:
- **Purple text**: Matched items
- **Yellow highlight**: Character differences between matches
- **⟷**: Arrow indicating the matched pair
- Differences are highlighted in both strings so you can see exactly what changed
