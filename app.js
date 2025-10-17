/**
 * List Comparer - Main Application Logic
 */

// Application state
const state = {
    list1: [],
    list2: [],
    results: null
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set up file inputs
    setupFileInput('file1', 'dropzone1', 1);
    setupFileInput('file2', 'dropzone2', 2);

    // Set up text area listeners
    document.getElementById('list1').addEventListener('input', () => {
        updateStats(1);
        debouncedUpdateLiveScores();
    });
    document.getElementById('list2').addEventListener('input', () => {
        updateStats(2);
        debouncedUpdateLiveScores();
    });

    // Set up match type radio buttons
    document.querySelectorAll('input[name="match_type"]').forEach(radio => {
        radio.addEventListener('change', onMatchTypeChange);
    });

    // Set up threshold slider
    const thresholdSlider = document.getElementById('threshold');
    thresholdSlider.addEventListener('input', (e) => {
        document.getElementById('thresholdValue').textContent = e.target.value;
        debouncedUpdateLiveScores();
    });

    // Set up ignore case checkbox
    document.getElementById('ignoreCase').addEventListener('change', () => {
        debouncedUpdateLiveScores();
    });

    // Set up clickable score items
    document.querySelectorAll('.score-item').forEach(item => {
        item.addEventListener('click', () => {
            const algorithm = item.dataset.algorithm;
            const radio = document.querySelector(`input[name="match_type"][value="${algorithm}"]`);
            if (radio) {
                radio.checked = true;
                onMatchTypeChange({ target: radio });
            }
        });
    });

    // Initialize stats
    updateStats(1);
    updateStats(2);
}

/**
 * Set up file input and drag-and-drop
 */
function setupFileInput(fileInputId, dropzoneId, listNum) {
    const fileInput = document.getElementById(fileInputId);
    const dropzone = document.getElementById(dropzoneId);

    // Click to select file
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    // File selected via input
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0], listNum);
        }
    });

    // Drag and drop events
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');

        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0], listNum);
        }
    });
}

/**
 * Handle file upload
 */
async function handleFile(file, listNum) {
    const textarea = document.getElementById(`list${listNum}`);

    if (!FileParser.isSupported(file.name)) {
        showStatus('Unsupported file type. Please use .txt, .xlsx, or .docx files.', 'error');
        return;
    }

    showStatus(`Loading ${file.name}...`, 'comparing');

    try {
        const items = await FileParser.parse(file);
        textarea.value = items.join('\n');
        updateStats(listNum);
        showStatus(`Loaded ${items.length} items from ${file.name}`, 'success');

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
            const statusEl = document.getElementById('status');
            if (statusEl.textContent.includes('Loaded')) {
                statusEl.textContent = '';
                statusEl.className = 'status';
            }
        }, 3000);

    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
        console.error('File parsing error:', error);
    }
}

/**
 * Update list statistics
 */
function updateStats(listNum) {
    const textarea = document.getElementById(`list${listNum}`);
    const stats = document.getElementById(`stats${listNum}`);

    const lines = textarea.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    stats.textContent = `Items: ${lines.length}`;
}

/**
 * Handle match type change
 */
function onMatchTypeChange(e) {
    const thresholdControl = document.getElementById('thresholdControl');

    // Show threshold control for fuzzy matching algorithms
    const fuzzyAlgorithms = ['levenshtein', 'damerau-levenshtein', 'jaro-winkler', 'token-sort'];

    if (fuzzyAlgorithms.includes(e.target.value)) {
        thresholdControl.style.display = 'flex';
    } else {
        thresholdControl.style.display = 'none';
    }

    // Automatically re-compare with new algorithm
    debouncedUpdateLiveScores();
}

/**
 * Clear list
 */
function clearList(listNum) {
    document.getElementById(`list${listNum}`).value = '';
    updateStats(listNum);

    // Hide results if both lists are empty
    const list1 = document.getElementById('list1').value;
    const list2 = document.getElementById('list2').value;

    if (!list1 && !list2) {
        document.getElementById('results').style.display = 'none';
    }
}

/**
 * Show status message
 */
function showStatus(message, type = '') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
}

/**
 * Compare lists
 */
function compareLists() {
    // Get list data
    const list1Text = document.getElementById('list1').value;
    const list2Text = document.getElementById('list2').value;

    state.list1 = list1Text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    state.list2 = list2Text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // Validate
    if (state.list1.length === 0 && state.list2.length === 0) {
        showStatus('Both lists are empty!', 'error');
        return;
    }

    // Get options
    const matchType = document.querySelector('input[name="match_type"]:checked').value;
    const ignoreCase = document.getElementById('ignoreCase').checked;
    const threshold = parseInt(document.getElementById('threshold').value);

    // Show comparing status
    showStatus('Comparing lists...', 'comparing');
    document.getElementById('compareBtn').disabled = true;

    // Use setTimeout to allow UI to update
    setTimeout(() => {
        try {
            // Perform comparison
            state.results = FuzzyMatcher.matchLists(state.list1, state.list2, {
                matchType,
                ignoreCase,
                threshold
            });

            // Display results
            displayResults();
            showStatus('Comparison complete!', 'success');

            // Auto-hide success message
            setTimeout(() => {
                const statusEl = document.getElementById('status');
                if (statusEl.textContent === 'Comparison complete!') {
                    statusEl.textContent = '';
                    statusEl.className = 'status';
                }
            }, 3000);

        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
            console.error('Comparison error:', error);
        } finally {
            document.getElementById('compareBtn').disabled = false;
        }
    }, 100);
}

/**
 * Display results
 */
function displayResults() {
    const resultsDiv = document.getElementById('results');
    const summaryDiv = document.getElementById('resultsSummary');

    // Show results section
    resultsDiv.style.display = 'block';

    // Display summary
    summaryDiv.innerHTML = `
        <div class="summary-card">
            <h3>Matches Found</h3>
            <div class="number">${state.results.matches.length}</div>
        </div>
        <div class="summary-card">
            <h3>Only in List 1</h3>
            <div class="number">${state.results.onlyInList1.length}</div>
        </div>
        <div class="summary-card">
            <h3>Only in List 2</h3>
            <div class="number">${state.results.onlyInList2.length}</div>
        </div>
        <div class="summary-card">
            <h3>Total Items</h3>
            <div class="number">${state.list1.length + state.list2.length}</div>
        </div>
    `;

    // Display matches
    displayMatches();
    displayList1Only();
    displayList2Only();
}

/**
 * Display matches tab
 */
function displayMatches() {
    const matchesTab = document.getElementById('matchesTab');

    if (state.results.matches.length === 0) {
        matchesTab.innerHTML = '<div class="empty-message">No matches found</div>';
        return;
    }

    let html = '';

    for (const match of state.results.matches) {
        html += '<div class="result-item">';

        if (match.diff) {
            // Show diff highlighting for fuzzy matches
            html += `
                <div class="match-pair">
                    <div class="match-item">${match.diff.str1}</div>
                    <div class="match-arrow">⟷</div>
                    <div class="match-item">${match.diff.str2}</div>
                </div>
            `;

            if (match.similarity !== undefined) {
                html += `<div style="text-align: center; margin-top: 8px; color: #666; font-size: 0.9em;">
                    Similarity: ${match.similarity.toFixed(1)}%
                </div>`;
            }
        } else {
            // Exact match
            html += `
                <div class="match-pair">
                    <div class="match-item">${escapeHtml(match.item1)}</div>
                    <div class="match-arrow">⟷</div>
                    <div class="match-item">${escapeHtml(match.item2)}</div>
                </div>
            `;
        }

        html += '</div>';
    }

    matchesTab.innerHTML = html;
}

/**
 * Display items only in list 1
 */
function displayList1Only() {
    const tab = document.getElementById('list1onlyTab');

    if (state.results.onlyInList1.length === 0) {
        tab.innerHTML = '<div class="empty-message">No unique items in List 1</div>';
        return;
    }

    let html = '';
    for (const item of state.results.onlyInList1) {
        html += `<div class="result-item">
            <div class="simple-item">${escapeHtml(item)}</div>
        </div>`;
    }

    tab.innerHTML = html;
}

/**
 * Display items only in list 2
 */
function displayList2Only() {
    const tab = document.getElementById('list2onlyTab');

    if (state.results.onlyInList2.length === 0) {
        tab.innerHTML = '<div class="empty-message">No unique items in List 2</div>';
        return;
    }

    let html = '';
    for (const item of state.results.onlyInList2) {
        html += `<div class="result-item">
            <div class="simple-item">${escapeHtml(item)}</div>
        </div>`;
    }

    tab.innerHTML = html;
}

/**
 * Show a specific results tab
 */
function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    const tabId = tabName + 'Tab';
    document.getElementById(tabId).classList.add('active');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Debounce function to limit execution rate
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Debounced version of updateLiveScores
 */
const debouncedUpdateLiveScores = debounce(updateLiveScores, 500);

/**
 * Update live algorithm scores and perform automatic comparison
 */
function updateLiveScores() {
    const list1Text = document.getElementById('list1').value;
    const list2Text = document.getElementById('list2').value;

    state.list1 = list1Text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    state.list2 = list2Text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const liveScoresDiv = document.getElementById('liveScores');
    const resultsDiv = document.getElementById('results');

    // Hide if either list is empty
    if (state.list1.length === 0 || state.list2.length === 0) {
        liveScoresDiv.style.display = 'none';
        resultsDiv.style.display = 'none';
        return;
    }

    // Show the live scores panel
    liveScoresDiv.style.display = 'block';

    const ignoreCase = document.getElementById('ignoreCase').checked;
    const threshold = parseInt(document.getElementById('threshold').value);

    const algorithms = [
        { name: 'exact', label: 'Exact Match' },
        { name: 'soundex', label: 'Soundex 🔊' },
        { name: 'levenshtein', label: 'Levenshtein ✏️' },
        { name: 'damerau-levenshtein', label: 'Damerau-Levenshtein 🔄' },
        { name: 'jaro-winkler', label: 'Jaro-Winkler 👥' },
        { name: 'token-sort', label: 'Token Sort 🔤' }
    ];

    const scores = [];
    let bestScore = 0;
    let bestAlgorithm = null;

    // Calculate scores for each algorithm
    for (const algo of algorithms) {
        try {
            const result = FuzzyMatcher.matchLists(state.list1, state.list2, {
                matchType: algo.name,
                ignoreCase,
                threshold
            });

            const totalItems = Math.max(state.list1.length, state.list2.length);
            const matchCount = result.matches.length;
            const percentage = totalItems > 0 ? (matchCount / totalItems) * 100 : 0;

            scores.push({
                algorithm: algo.name,
                label: algo.label,
                percentage: percentage,
                matchCount: matchCount,
                totalItems: totalItems
            });

            if (percentage > bestScore) {
                bestScore = percentage;
                bestAlgorithm = algo.name;
            }
        } catch (error) {
            console.error(`Error calculating score for ${algo.name}:`, error);
        }
    }

    // Update score UI
    for (const score of scores) {
        const scoreItem = document.querySelector(`.score-item[data-algorithm="${score.algorithm}"]`);
        if (scoreItem) {
            const fillBar = scoreItem.querySelector('.score-fill');
            const valueText = scoreItem.querySelector('.score-value');

            fillBar.style.width = `${score.percentage}%`;
            valueText.textContent = `${score.percentage.toFixed(0)}% (${score.matchCount}/${score.totalItems})`;

            // Mark best algorithm
            if (score.algorithm === bestAlgorithm && bestScore > 0) {
                scoreItem.classList.add('best');
            } else {
                scoreItem.classList.remove('best');
            }
        }
    }

    // Automatically run comparison with selected algorithm
    const matchType = document.querySelector('input[name="match_type"]:checked').value;

    try {
        state.results = FuzzyMatcher.matchLists(state.list1, state.list2, {
            matchType,
            ignoreCase,
            threshold
        });

        // Display results automatically
        displayResults();
    } catch (error) {
        console.error('Comparison error:', error);
    }
}
