/**
 * Fuzzy Matcher - Implements various string matching algorithms
 */

class FuzzyMatcher {
    /**
     * Soundex algorithm - Phonetic matching
     * Converts names to a code representing their phonetic sound
     */
    static soundex(str) {
        if (!str || str.length === 0) return null;

        // Convert to uppercase and remove non-alphabetic characters
        const cleaned = str.toUpperCase().replace(/[^A-Z]/g, '');
        if (cleaned.length === 0) return null;

        // Soundex mapping
        const mapping = {
            'B': '1', 'F': '1', 'P': '1', 'V': '1',
            'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
            'D': '3', 'T': '3',
            'L': '4',
            'M': '5', 'N': '5',
            'R': '6'
        };

        // Keep the first letter
        let soundexCode = cleaned[0];
        let prevCode = mapping[cleaned[0]] || '0';

        // Process remaining letters
        for (let i = 1; i < cleaned.length && soundexCode.length < 4; i++) {
            const char = cleaned[i];
            const code = mapping[char];

            if (code && code !== prevCode) {
                soundexCode += code;
                prevCode = code;
            } else if (!code) {
                prevCode = '0';
            }
        }

        // Pad with zeros to make it 4 characters
        return soundexCode.padEnd(4, '0');
    }

    /**
     * Levenshtein distance - Edit distance between two strings
     * Returns the minimum number of single-character edits required
     */
    static levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;

        // Create a 2D array for dynamic programming
        const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

        // Initialize base cases
        for (let i = 0; i <= len1; i++) dp[i][0] = i;
        for (let j = 0; j <= len2; j++) dp[0][j] = j;

        // Fill the matrix
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,      // deletion
                        dp[i][j - 1] + 1,      // insertion
                        dp[i - 1][j - 1] + 1   // substitution
                    );
                }
            }
        }

        return dp[len1][len2];
    }

    /**
     * Calculate similarity percentage based on Levenshtein distance
     */
    static levenshteinSimilarity(str1, str2) {
        const maxLen = Math.max(str1.length, str2.length);
        if (maxLen === 0) return 100;

        const distance = this.levenshteinDistance(str1, str2);
        return ((maxLen - distance) / maxLen) * 100;
    }

    /**
     * Damerau-Levenshtein distance - Edit distance with transpositions
     * Includes swapping adjacent characters as a single operation
     */
    static damerauLevenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;

        // Handle edge cases
        if (len1 === 0) return len2;
        if (len2 === 0) return len1;

        // Create distance matrix with extra row/column for transpositions
        const maxDist = len1 + len2;
        const H = new Map();
        const da = [];

        // Initialize matrix
        for (let i = 0; i <= len1 + 1; i++) {
            da[i] = [];
            da[i][0] = maxDist;
        }
        for (let j = 0; j <= len2 + 1; j++) {
            da[0][j] = maxDist;
        }
        da[0][0] = maxDist;

        for (let i = 1; i <= len1 + 1; i++) {
            da[i][1] = i - 1;
        }
        for (let j = 1; j <= len2 + 1; j++) {
            da[1][j] = j - 1;
        }

        for (let i = 2; i <= len1 + 1; i++) {
            let DB = 1;
            for (let j = 2; j <= len2 + 1; j++) {
                const k = H.get(str2[j - 2]) || 1;
                const l = DB;

                let cost = 1;
                if (str1[i - 2] === str2[j - 2]) {
                    cost = 0;
                    DB = j;
                }

                da[i][j] = Math.min(
                    da[i - 1][j] + 1,                                           // deletion
                    da[i][j - 1] + 1,                                           // insertion
                    da[i - 1][j - 1] + cost,                                    // substitution
                    da[k - 1][l - 1] + (i - k - 2) + 1 + (j - l - 2)          // transposition
                );
            }

            H.set(str1[i - 2], i);
        }

        return da[len1 + 1][len2 + 1];
    }

    /**
     * Calculate similarity percentage based on Damerau-Levenshtein distance
     */
    static damerauLevenshteinSimilarity(str1, str2) {
        const maxLen = Math.max(str1.length, str2.length);
        if (maxLen === 0) return 100;

        const distance = this.damerauLevenshteinDistance(str1, str2);
        return ((maxLen - distance) / maxLen) * 100;
    }

    /**
     * Jaro similarity - String similarity based on matching characters
     */
    static jaroSimilarity(str1, str2) {
        if (str1 === str2) return 100;
        if (str1.length === 0 || str2.length === 0) return 0;

        const matchWindow = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
        const str1Matches = new Array(str1.length).fill(false);
        const str2Matches = new Array(str2.length).fill(false);

        let matches = 0;
        let transpositions = 0;

        // Find matches
        for (let i = 0; i < str1.length; i++) {
            const start = Math.max(0, i - matchWindow);
            const end = Math.min(i + matchWindow + 1, str2.length);

            for (let j = start; j < end; j++) {
                if (str2Matches[j] || str1[i] !== str2[j]) continue;
                str1Matches[i] = true;
                str2Matches[j] = true;
                matches++;
                break;
            }
        }

        if (matches === 0) return 0;

        // Find transpositions
        let k = 0;
        for (let i = 0; i < str1.length; i++) {
            if (!str1Matches[i]) continue;
            while (!str2Matches[k]) k++;
            if (str1[i] !== str2[k]) transpositions++;
            k++;
        }

        const jaro = (
            matches / str1.length +
            matches / str2.length +
            (matches - transpositions / 2) / matches
        ) / 3;

        return jaro * 100;
    }

    /**
     * Jaro-Winkler similarity - Enhanced Jaro with prefix bonus
     * Gives higher scores to strings with common prefixes
     */
    static jaroWinklerSimilarity(str1, str2) {
        const jaroSim = this.jaroSimilarity(str1, str2);

        // Find common prefix (up to 4 characters)
        let prefixLen = 0;
        const maxPrefix = Math.min(4, Math.min(str1.length, str2.length));

        for (let i = 0; i < maxPrefix; i++) {
            if (str1[i] === str2[i]) {
                prefixLen++;
            } else {
                break;
            }
        }

        // Jaro-Winkler formula: jaro + (prefixLen * p * (1 - jaro))
        // where p = 0.1 (scaling factor)
        const p = 0.1;
        const jaroWinkler = jaroSim + (prefixLen * p * (1 - jaroSim / 100));

        return Math.min(jaroWinkler * 100, 100);
    }

    /**
     * Token Sort Ratio - Handles different word orders
     * Sorts words alphabetically before comparing
     */
    static tokenSortRatio(str1, str2) {
        // Tokenize and sort
        const tokens1 = str1.toLowerCase().trim().split(/\s+/).sort().join(' ');
        const tokens2 = str2.toLowerCase().trim().split(/\s+/).sort().join(' ');

        // Use Levenshtein similarity on sorted tokens
        return this.levenshteinSimilarity(tokens1, tokens2);
    }

    /**
     * Character-by-character diff highlighting
     * Returns HTML with differences highlighted
     */
    static highlightDiff(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;

        // Find the longest common subsequence alignment
        const dp = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // Backtrack to find alignment
        let i = len1, j = len2;
        const aligned1 = [], aligned2 = [];

        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
                aligned1.unshift({ char: str1[i - 1], match: true });
                aligned2.unshift({ char: str2[j - 1], match: true });
                i--; j--;
            } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
                aligned1.unshift({ char: '', match: false });
                aligned2.unshift({ char: str2[j - 1], match: false });
                j--;
            } else {
                aligned1.unshift({ char: str1[i - 1], match: false });
                aligned2.unshift({ char: '', match: false });
                i--;
            }
        }

        // Build HTML with highlighting
        const buildHtml = (aligned) => {
            let html = '';
            let inDiff = false;

            for (const item of aligned) {
                if (!item.match && item.char !== '') {
                    if (!inDiff) {
                        html += '<span class="diff-highlight">';
                        inDiff = true;
                    }
                    html += this.escapeHtml(item.char);
                } else {
                    if (inDiff) {
                        html += '</span>';
                        inDiff = false;
                    }
                    if (item.char !== '') {
                        html += this.escapeHtml(item.char);
                    }
                }
            }

            if (inDiff) html += '</span>';
            return html;
        };

        return {
            str1: buildHtml(aligned1),
            str2: buildHtml(aligned2)
        };
    }

    /**
     * Simple diff - highlights character differences
     * More performant for similar strings
     */
    static simpleDiff(str1, str2) {
        let html1 = '', html2 = '';
        const maxLen = Math.max(str1.length, str2.length);

        for (let i = 0; i < maxLen; i++) {
            const c1 = str1[i] || '';
            const c2 = str2[i] || '';

            if (c1 === c2) {
                html1 += this.escapeHtml(c1);
                html2 += this.escapeHtml(c2);
            } else {
                if (c1) html1 += `<span class="diff-highlight">${this.escapeHtml(c1)}</span>`;
                if (c2) html2 += `<span class="diff-highlight">${this.escapeHtml(c2)}</span>`;
            }
        }

        return { str1: html1, str2: html2 };
    }

    /**
     * Escape HTML special characters
     */
    static escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Match two lists using the specified algorithm
     */
    static matchLists(list1, list2, options = {}) {
        const {
            matchType = 'exact',
            ignoreCase = true,
            threshold = 80
        } = options;

        const matches = [];
        const unmatched1 = new Set(list1.map((_, i) => i));
        const unmatched2 = new Set(list2.map((_, i) => i));

        // Helper to normalize strings
        const normalize = (str) => ignoreCase ? str.toLowerCase().trim() : str.trim();

        // Exact matching
        if (matchType === 'exact') {
            for (let i = 0; i < list1.length; i++) {
                const item1 = normalize(list1[i]);
                for (let j = 0; j < list2.length; j++) {
                    if (unmatched2.has(j)) {
                        const item2 = normalize(list2[j]);
                        if (item1 === item2) {
                            const diff = this.highlightDiff(list1[i], list2[j]);
                            matches.push({
                                item1: list1[i],
                                item2: list2[j],
                                index1: i,
                                index2: j,
                                matchType: 'exact',
                                diff: diff
                            });
                            unmatched1.delete(i);
                            unmatched2.delete(j);
                            break;
                        }
                    }
                }
            }
        }
        // Soundex matching
        else if (matchType === 'soundex') {
            const soundexMap2 = new Map();
            for (let j = 0; j < list2.length; j++) {
                if (unmatched2.has(j)) {
                    const code = this.soundex(list2[j]);
                    if (code) {
                        if (!soundexMap2.has(code)) {
                            soundexMap2.set(code, []);
                        }
                        soundexMap2.get(code).push(j);
                    }
                }
            }

            for (let i = 0; i < list1.length; i++) {
                if (unmatched1.has(i)) {
                    const code1 = this.soundex(list1[i]);
                    if (code1 && soundexMap2.has(code1)) {
                        const candidates = soundexMap2.get(code1);
                        if (candidates.length > 0) {
                            const j = candidates.shift();
                            const diff = this.highlightDiff(list1[i], list2[j]);
                            matches.push({
                                item1: list1[i],
                                item2: list2[j],
                                index1: i,
                                index2: j,
                                matchType: 'soundex',
                                diff: diff
                            });
                            unmatched1.delete(i);
                            unmatched2.delete(j);
                        }
                    }
                }
            }
        }
        // Levenshtein matching
        else if (matchType === 'levenshtein') {
            const matched = new Set();

            for (let i = 0; i < list1.length; i++) {
                if (unmatched1.has(i)) {
                    let bestMatch = -1;
                    let bestSimilarity = 0;

                    const item1 = normalize(list1[i]);

                    for (let j = 0; j < list2.length; j++) {
                        if (unmatched2.has(j) && !matched.has(j)) {
                            const item2 = normalize(list2[j]);
                            const similarity = this.levenshteinSimilarity(item1, item2);

                            if (similarity >= threshold && similarity > bestSimilarity) {
                                bestSimilarity = similarity;
                                bestMatch = j;
                            }
                        }
                    }

                    if (bestMatch !== -1) {
                        const diff = this.highlightDiff(list1[i], list2[bestMatch]);
                        matches.push({
                            item1: list1[i],
                            item2: list2[bestMatch],
                            index1: i,
                            index2: bestMatch,
                            matchType: 'levenshtein',
                            similarity: bestSimilarity,
                            diff: diff
                        });
                        unmatched1.delete(i);
                        unmatched2.delete(bestMatch);
                        matched.add(bestMatch);
                    }
                }
            }
        }
        // Damerau-Levenshtein matching
        else if (matchType === 'damerau-levenshtein') {
            const matched = new Set();

            for (let i = 0; i < list1.length; i++) {
                if (unmatched1.has(i)) {
                    let bestMatch = -1;
                    let bestSimilarity = 0;

                    const item1 = normalize(list1[i]);

                    for (let j = 0; j < list2.length; j++) {
                        if (unmatched2.has(j) && !matched.has(j)) {
                            const item2 = normalize(list2[j]);
                            const similarity = this.damerauLevenshteinSimilarity(item1, item2);

                            if (similarity >= threshold && similarity > bestSimilarity) {
                                bestSimilarity = similarity;
                                bestMatch = j;
                            }
                        }
                    }

                    if (bestMatch !== -1) {
                        const diff = this.highlightDiff(list1[i], list2[bestMatch]);
                        matches.push({
                            item1: list1[i],
                            item2: list2[bestMatch],
                            index1: i,
                            index2: bestMatch,
                            matchType: 'damerau-levenshtein',
                            similarity: bestSimilarity,
                            diff: diff
                        });
                        unmatched1.delete(i);
                        unmatched2.delete(bestMatch);
                        matched.add(bestMatch);
                    }
                }
            }
        }
        // Jaro-Winkler matching
        else if (matchType === 'jaro-winkler') {
            const matched = new Set();

            for (let i = 0; i < list1.length; i++) {
                if (unmatched1.has(i)) {
                    let bestMatch = -1;
                    let bestSimilarity = 0;

                    const item1 = normalize(list1[i]);

                    for (let j = 0; j < list2.length; j++) {
                        if (unmatched2.has(j) && !matched.has(j)) {
                            const item2 = normalize(list2[j]);
                            const similarity = this.jaroWinklerSimilarity(item1, item2);

                            if (similarity >= threshold && similarity > bestSimilarity) {
                                bestSimilarity = similarity;
                                bestMatch = j;
                            }
                        }
                    }

                    if (bestMatch !== -1) {
                        const diff = this.highlightDiff(list1[i], list2[bestMatch]);
                        matches.push({
                            item1: list1[i],
                            item2: list2[bestMatch],
                            index1: i,
                            index2: bestMatch,
                            matchType: 'jaro-winkler',
                            similarity: bestSimilarity,
                            diff: diff
                        });
                        unmatched1.delete(i);
                        unmatched2.delete(bestMatch);
                        matched.add(bestMatch);
                    }
                }
            }
        }
        // Token Sort Ratio matching
        else if (matchType === 'token-sort') {
            const matched = new Set();

            for (let i = 0; i < list1.length; i++) {
                if (unmatched1.has(i)) {
                    let bestMatch = -1;
                    let bestSimilarity = 0;

                    // Don't normalize for token-sort, it handles its own tokenization
                    const item1 = list1[i].trim();

                    for (let j = 0; j < list2.length; j++) {
                        if (unmatched2.has(j) && !matched.has(j)) {
                            const item2 = list2[j].trim();
                            const similarity = this.tokenSortRatio(item1, item2);

                            if (similarity >= threshold && similarity > bestSimilarity) {
                                bestSimilarity = similarity;
                                bestMatch = j;
                            }
                        }
                    }

                    if (bestMatch !== -1) {
                        const diff = this.highlightDiff(list1[i], list2[bestMatch]);
                        matches.push({
                            item1: list1[i],
                            item2: list2[bestMatch],
                            index1: i,
                            index2: bestMatch,
                            matchType: 'token-sort',
                            similarity: bestSimilarity,
                            diff: diff
                        });
                        unmatched1.delete(i);
                        unmatched2.delete(bestMatch);
                        matched.add(bestMatch);
                    }
                }
            }
        }

        return {
            matches,
            onlyInList1: Array.from(unmatched1).map(i => list1[i]),
            onlyInList2: Array.from(unmatched2).map(i => list2[i])
        };
    }
}
