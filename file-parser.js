/**
 * File Parser - Handles parsing of various file formats
 * Supports: .txt, .xlsx, .docx
 */

class FileParser {
    /**
     * Parse a file and extract list items
     * @param {File} file - The file to parse
     * @returns {Promise<string[]>} Array of list items
     */
    static async parse(file) {
        const extension = file.name.split('.').pop().toLowerCase();

        switch (extension) {
            case 'txt':
                return await this.parseTxt(file);
            case 'xlsx':
            case 'xls':
                return await this.parseXlsx(file);
            case 'docx':
                return await this.parseDocx(file);
            default:
                throw new Error(`Unsupported file type: ${extension}`);
        }
    }

    /**
     * Parse text file
     */
    static async parseTxt(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(line => line.length > 0);
                resolve(lines);
            };

            reader.onerror = () => reject(new Error('Failed to read text file'));
            reader.readAsText(file);
        });
    }

    /**
     * Parse Excel file (.xlsx)
     * Uses SheetJS library
     */
    static async parseXlsx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Get all items from all sheets
                    const allItems = [];

                    for (const sheetName of workbook.SheetNames) {
                        const worksheet = workbook.Sheets[sheetName];
                        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

                        // Collect all non-empty cells
                        for (let row = range.s.r; row <= range.e.r; row++) {
                            for (let col = range.s.c; col <= range.e.c; col++) {
                                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                                const cell = worksheet[cellAddress];

                                if (cell && cell.v !== undefined && cell.v !== null) {
                                    const value = String(cell.v).trim();
                                    if (value.length > 0) {
                                        allItems.push(value);
                                    }
                                }
                            }
                        }
                    }

                    // Remove duplicates while preserving order
                    const uniqueItems = [...new Set(allItems)];
                    resolve(uniqueItems);

                } catch (error) {
                    reject(new Error(`Failed to parse Excel file: ${error.message}`));
                }
            };

            reader.onerror = () => reject(new Error('Failed to read Excel file'));
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Parse Word document (.docx)
     * Uses Mammoth.js library
     */
    static async parseDocx(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.extractRawText({ arrayBuffer });

                    // Extract text and split into lines
                    const text = result.value;
                    const lines = text.split(/\r?\n/)
                        .map(line => line.trim())
                        .filter(line => line.length > 0);

                    resolve(lines);

                } catch (error) {
                    reject(new Error(`Failed to parse Word document: ${error.message}`));
                }
            };

            reader.onerror = () => reject(new Error('Failed to read Word document'));
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Validate file type
     */
    static isSupported(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        return ['txt', 'xlsx', 'xls', 'docx'].includes(extension);
    }

    /**
     * Get file type description
     */
    static getFileTypeDescription(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const descriptions = {
            'txt': 'Text File',
            'xlsx': 'Excel Spreadsheet',
            'xls': 'Excel Spreadsheet',
            'docx': 'Word Document'
        };
        return descriptions[extension] || 'Unknown';
    }
}
