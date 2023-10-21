/** Clear all message success and error messages */
function clearAllMessage() {
    var successAlertDiv = document.getElementById('successMsgDiv');
    var errorAlertDiv = document.getElementById('errorMsgDiv');
    errorAlertDiv.style.display = 'none';
    successAlertDiv.style.display = 'none';
}
/**  Clear only error messages */
function clearErrorMessage() {
    var errorAlertDiv = document.getElementById('errorMsgDiv');
    errorAlertDiv.style.display = 'none';
}
/** Clear only Success messages */
function clearSuccessMessage() {
    var successAlertDiv = document.getElementById('successMsgDiv');
    successAlertDiv.style.display = 'none';
}
/**
 * Show the response message in dynamic ul=> list
 * @param {any} msgType
 * @param {any} messages
 * @returns
 */
function showMessage(msgType, messages) {
    var successAlertDiv = document.getElementById('successMsgDiv');
    var errorAlertDiv = document.getElementById('errorMsgDiv');
    var successUlElement = document.getElementById('successMessages');
    var errorUlElement = document.getElementById('errorMessages');

    if (msgType === 'success') {
        // Display success message
        while (successUlElement.firstChild) {
            successUlElement.removeChild(successUlElement.firstChild);
        }

        if (Array.isArray(messages)) {
            if (messages.length > 0) {
                messages.forEach(function (message) {
                    var liElement = document.createElement('li');
                    liElement.textContent = message;
                    successUlElement.appendChild(liElement);
                });
                successAlertDiv.style.display = 'block';
            } else {
                successAlertDiv.style.display = 'none';
            }

            // Hide error message
            while (errorUlElement.firstChild) {
                errorUlElement.removeChild(errorUlElement.firstChild);
            }
            errorAlertDiv.style.display = 'none';
        } else if (typeof messages === 'string') {
            var liElement = document.createElement('li');
            liElement.textContent = messages;
            successUlElement.appendChild(liElement);
            successAlertDiv.style.display = 'block';

            // Hide error message
            while (errorUlElement.firstChild) {
                errorUlElement.removeChild(errorUlElement.firstChild);
            }
            errorAlertDiv.style.display = 'none';
        } else {
            console.error('Invalid message type:', msgType);
            return;
        }
    } else if (msgType === 'error') {
        // Display error message
        while (errorUlElement.firstChild) {
            errorUlElement.removeChild(errorUlElement.firstChild);
        }

        if (Array.isArray(messages)) {
            if (messages.length > 0) {
                messages.forEach(function (message) {
                    var liElement = document.createElement('li');
                    liElement.textContent = message;
                    errorUlElement.appendChild(liElement);
                });
                errorAlertDiv.style.display = 'block';
            } else {
                errorAlertDiv.style.display = 'none';
            }

            // Hide success message
            while (successUlElement.firstChild) {
                successUlElement.removeChild(successUlElement.firstChild);
            }
            successAlertDiv.style.display = 'none';
        } else if (typeof messages === 'string') {
            var liElement = document.createElement('li');
            liElement.textContent = messages;
            errorUlElement.appendChild(liElement);
            errorAlertDiv.style.display = 'block';

            // Hide success message
            while (successUlElement.firstChild) {
                successUlElement.removeChild(successUlElement.firstChild);
            }
            successAlertDiv.style.display = 'none';
        } else {
            console.error('Invalid message type:', msgType);
            return;
        }
    } else {
        console.error('Invalid message type:', msgType);
        return;
    }
}

/**
 * Send alert to the alert box/message box
 * @param {any} alertType
 * @param {any} msg
 * @param {any} autoDismissDelay
 */
function sendAlert(alertType, msg, autoDismissDelay = 15000) {
    console.log('send alert called.');

    // Define icons for different alert types
    const icons = {
        'success': '<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>',
        'danger': '<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Error:"><use xlink:href="#exclamation-triangle-fill"/></svg>',
        'warning': '<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>',
        'info': '<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>',
    };

    var alertElement = '<div class="alert alert-' + alertType + ' d-flex align-items-center alert-dismissible fade show" role="alert">' +
        icons[alertType] + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>';

    const $alertElement = $(alertElement);
    $('#errorContainer').append($alertElement);

    // Auto-dismiss the alert after the specified delay (in milliseconds)
    if (autoDismissDelay) {
        setTimeout(function () {
            $alertElement.alert('close');
        }, autoDismissDelay);
    }
}