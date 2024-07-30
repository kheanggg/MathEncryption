$(document).ready(function() {
    // Function to check if a number is prime
    function isPrime(num) {
        if (num <= 1) return false; // 0 and 1 are not prime numbers
        if (num <= 3) return true;  // 2 and 3 are prime numbers
        if (num % 2 === 0 || num % 3 === 0) return false; // Check for multiples of 2 and 3

        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false; // Check for prime factors
        }
        return true;
    }

    // Function to perform RSA encryption
    function rsaEncrypt(message, n, e) {
        return message.split('').map(function(char) {
            if (char.match(/[a-zA-Z]/)) {
                var code = char.charCodeAt(0);
                var base = (code >= 65 && code <= 90) ? 65 : 97;
                var index = code - base;
                var encryptedIndex = Math.pow(index, e) % n;
                return String.fromCharCode(encryptedIndex + base);
            }
            return char;
        }).join('');
    }

    // Function to perform RSA decryption
    function rsaDecrypt(message, n, e) {
        return message.split('').map(function(char) {
            if (char.match(/[a-zA-Z]/)) {
                var code = char.charCodeAt(0);
                var base = (code >= 65 && code <= 90) ? 65 : 97;
                var index = code - base;
                var decryptedIndex = Math.pow(index, e) % n;
                return String.fromCharCode(decryptedIndex + base);
            }
            return char;
        }).join('');
    }

    // Toggle switch handler
    $('#modeToggle').on('change', function() {
        let isEncrypting = !this.checked;
        updateUI(isEncrypting);
    });

    function updateUI(isEncrypting) {
        // Update button text
        $('#processButton').text(isEncrypting ? 'Encrypt' : 'Decrypt');

        // Update input fields
        if (isEncrypting) {
            $('label[for="p"]').text('Enter prime number p:').show();
            $('label[for="q"]').text('Enter prime number q:').show();
            $('label[for="e"]').text('Enter encryption key (e):');
            $('#p, #q').show().prop('required', true);
            $('#pError, #qError').text(''); // Clear error messages
        } else {
            $('label[for="p"]').text('Enter n (p * q):');
            $('label[for="q"]').hide();
            $('label[for="e"]').text('Enter decryption key (d):');
            $('#q').hide().prop('required', false);
        }

        // Update message label
        $('label[for="message"]').text(isEncrypting ? 'Enter your message:' : 'Enter encrypted message:');

        // Clear inputs and result
        $('#p, #q, #e, #message').val('');
        $('#result').empty();
    }

    $('#rsaForm').on('submit', function(e) {
        e.preventDefault();

        var isEncrypting = !$('#modeToggle').prop('checked');
        var message = $('#message').val();
        var n, e;

        // Clear previous error messages
        $('#pError, #qError').text('');

        if (isEncrypting) {
            var p = parseInt($('#p').val());
            var q = parseInt($('#q').val());
            e = parseInt($('#e').val());
        
            // Check if p and q are prime
            let isPPrime = isPrime(p);
            let isQPrime = isPrime(q);
        
            // Clear previous error messages
            $('#pError, #qError').text('');
        
            let hasError = false; // Flag to track if there are errors
        
            if (!isPPrime) {
                $('#pError').text('Please enter a valid prime number for p.');
                hasError = true; // Set flag if there's an error
            }
            if (!isQPrime) {
                $('#qError').text('Please enter a valid prime number for q.');
                hasError = true; // Set flag if there's an error
            }
        
            if (hasError) {
                return; // Exit if there were any errors
            }
        
            n = p * q;
        } else {
            n = parseInt($('#p').val()); // Using 'p' input for 'n' in decryption mode
            e = parseInt($('#e').val()); // 'e' input is used for 'd' in decryption mode
        }

        var result = isEncrypting ? rsaEncrypt(message, n, e) : rsaDecrypt(message, n, e);

        $('#result').html(`
            <p><strong>Original message:</strong> ${message}</p>
            <p><strong>${isEncrypting ? 'Encrypted' : 'Decrypted'} message:</strong> ${result}</p>
            <p><strong>${isEncrypting ? 'Public' : 'Private'} Key (n, ${isEncrypting ? 'e' : 'd'}):</strong> ${n}, ${e}</p>
        `);
    });

    $('#resetButton').on('click', function() {
        $('#p, #q, #e, #message').val('');
        $('#result').empty();
        $('#pError, #qError').text(''); // Clear error messages
    });

    // Initial UI setup
    updateUI(true);
});
