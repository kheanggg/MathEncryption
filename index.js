// Wait for the document to be fully loaded
$(document).ready(function() {
    // Cache DOM elements for easier access
    const form = $('#caesarForm');         // The form element
    const inputText = $('#plaintext');      // Input field for plaintext
    const shift = $('#shift');              // Input field for shift value
    const processButton = $('#processButton'); // Button for processing encryption/decryption
    const resetButton = $('#resetButton');  // Button to reset the form
    const result = $('#result');            // Area to display results
    const modeToggle = $('#modeToggle');    // Toggle for encryption/decryption mode

    let isEncryptMode = true; // Track current mode (encrypt or decrypt)

    // Event listener for the mode toggle switch
    modeToggle.on('change', function() {
        isEncryptMode = !this.checked; // Toggle mode
        updateButtonText(); // Update button text
    });

    // Update button text based on current mode
    function updateButtonText() {
        processButton.text(isEncryptMode ? 'Encrypt' : 'Decrypt');
    }

    // Event listener for form submission
    form.on('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        const text = inputText.val(); // Get user input text
        const shiftValue = parseInt(shift.val(), 10); // Get and parse shift value

        // Encrypt or decrypt the text based on current mode
        const resultText = isEncryptMode 
            ? caesarCipher(text, shiftValue) 
            : caesarCipher(text, -shiftValue);

        // Display the result
        displayResult(isEncryptMode ? 'Encrypted' : 'Decrypted', text, resultText, isEncryptMode ? shiftValue : -shiftValue);
    });

    // Event listener for the reset button
    resetButton.on('click', function() {
        inputText.val(''); // Clear input text
        shift.val('');     // Clear shift value
        result.empty();    // Clear results display
    });

    // Perform Caesar Cipher encryption/decryption
    function caesarCipher(text, shift) {
        return text.split('').map(char => {
            let code = char.charCodeAt(0); // Get character code
            
            // Handle uppercase and lowercase letters, wrap around the alphabet
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
            } else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
            }
            return char; // Return non-letter characters unchanged
        }).join(''); // Join characters back into a string
    }

    // Display the result of the operation
    function displayResult(operation, input, output, shiftUsed) {
        result.html(`
            <div class="result-item">
                <span class="result-label">Input:</span>${input}
            </div>
            <div class="result-item">
                <span class="result-label">${operation}:</span>${output}
            </div>
            <div class="result-item">
                <span class="result-label">Shift used:</span>${Math.abs(shiftUsed)}
            </div>
        `);
    }

    // Initialize button text on page load
    updateButtonText();
});