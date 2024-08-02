$(document).ready(function() {
    // Function to check if a number is prime (unchanged)
    function isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;

        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    }

    // Function to calculate modular multiplicative inverse
    function modInverse(a, m) {
        a = ((a % m) + m) % m;
        for (let x = 1n; x < m; x++) {
            if ((BigInt(a) * x) % BigInt(m) === 1n) {
                return x;
            }
        }
        return 1n;
    }

    // Function to perform RSA encryption (unchanged)
    function rsaEncrypt(message, n, e) {
        return message.split('').map(function(char) {
            if (char.match(/[a-zA-Z]/)) {
                var code = char.charCodeAt(0);
                var base = (code >= 65 && code <= 90) ? 65 : 97;
                var index = code - base;
                var encryptedIndex = BigInt(index) ** BigInt(e) % BigInt(n);
                return encryptedIndex.toString();
            }
            return char;
        }).join(' ');
    }

    // Function to perform RSA decryption (unchanged)
    function rsaDecrypt(message, n, d) {
        return message.split(' ').map(function(num) {
            if (num.match(/^\d+$/)) {
                var decryptedIndex = BigInt(num) ** BigInt(d) % BigInt(n);
                var index = Number(decryptedIndex);
                return String.fromCharCode(index + 65);
            }
            return num;
        }).join('');
    }

    // Toggle switch handler (unchanged)
    $('#modeToggle').on('change', function() {
        let isEncrypting = !this.checked;
        updateUI(isEncrypting);
    });

    // UpdateUI function (unchanged)
    function updateUI(isEncrypting) {
        // ... (keep existing implementation)
    }

    $('#rsaForm').on('submit', function(e) {
        e.preventDefault();

        var isEncrypting = !$('#modeToggle').prop('checked');
        var message = $('#message').val();
        var n, e, d;

        $('#pError, #qError').text('');

        if (isEncrypting) {
            var p = BigInt($('#p').val());
            var q = BigInt($('#q').val());
            e = BigInt($('#e').val());
        
            let isPPrime = isPrime(Number(p));
            let isQPrime = isPrime(Number(q));
        
            let hasError = false;
        
            if (!isPPrime) {
                $('#pError').text('Please enter a valid prime number for p.');
                hasError = true;
            }
            if (!isQPrime) {
                $('#qError').text('Please enter a valid prime number for q.');
                hasError = true;
            }
        
            if (hasError) {
                return;
            }
        
            n = p * q;
            var phi = (p - 1n) * (q - 1n);
            d = modInverse(e, phi);
        } else {
            n = BigInt($('#p').val());
            e = BigInt($('#e').val());
        }

        var result = isEncrypting ? rsaEncrypt(message, n, e) : rsaDecrypt(message, n, e);

        $('#result').html(`
            <p><strong>Original message:</strong> ${message}</p>
            <p><strong>${isEncrypting ? 'Encrypted' : 'Decrypted'} message:</strong> ${result}</p>
            <p><strong>Public Key (n, e):</strong> ${n}, ${e}</p>
            ${isEncrypting ? `<p><strong>Private Key (n, d):</strong> ${n}, ${d}</p>` : ''}
        `);
    });

    // Reset button handler (unchanged)
    $('#resetButton').on('click', function() {
        // ... (keep existing implementation)
    });

    updateUI(true);
});