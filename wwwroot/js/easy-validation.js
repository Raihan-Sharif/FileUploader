
/**
 * Validate input mobile number as Bangladeshi mobile number.
 * @param {any} input
 * @returns void
 */
function validateBangladeshiMobile(input) {
    // Define a regular expression pattern for Bangladeshi mobile numbers
    var bangladeshiMobilePattern = /^(?:\+88|01)?\d{11}$/;

    var inputValue = input.value;

    if (bangladeshiMobilePattern.test(inputValue)) {
        // Mobile number is in the valid format
        return {
            isValid: true,
            message: 'This is a valid mobile number.'
        };
    } else {
        // Mobile number is not in the valid format
        return {
            isValid: false,
            message: 'Please enter a valid Bangladeshi mobile number.'
        };
    }
}

/**
 * Validate input email as valid email address.
 * @param {any} input
 * @returns void
 */
function validateEmail(input) {
    // Define a regular expression pattern for a valid email address
    var emailPattern = /^[a-zA-Z0-9._-]+@@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    var inputValue = input.value;

    if (emailPattern.test(inputValue)) {
        // Email is in the valid format
        return {
            isValid: true,
            message: 'This is a valid email address.'
        };
    } else {
        // Email is not in the valid format
        return {
            isValid: false,
            message: 'Please enter a valid email address.'
        };
    }
}