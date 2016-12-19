var modal = document.getElementById('success');
var form = document.getElementById('signup-form');
// close modal if click outside
window.onclick = function(event) {
    if (event.target === modal) modal.style.display = 'none';
}

function submitForm() {
    var data = {};
    var errorMessage = '';
    if (form.firstName.value) data.firstName = form.firstName.value;
    if (form.lastName.value) data.lastName = form.lastName.value;
    if (form.classYear.value) data.classYear = form.classYear.value;
    if (form.email.value && !validateEmail()) {
        errorMessage += 'Email address is invalid.';
    }
    data.email = form.email.value;

    var phone = validatePhone();
    if (!phone) {
        error(form.phone);
        if (errorMessage) errorMessage += '</br>';
        errorMessage += 'Please enter valid phone number.';
    }
    if (form.phoneProvider.value === 'null') {
        error(form.phoneProvider);
        if (errorMessage) errorMessage += '</br>';
        errorMessage += 'Please select phone provider.';
    }
    if (errorMessage) return displayError(errorMessage);
    data.phone = phone;
    data.phoneProvider = form.phoneProvider.value;

    fetch('/', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(submitSuccess)
    .catch(submitError);
}

function error(target) {
    target.style.border = '3px solid #F00';
}

function clearError(target) {
    if (target === 'message')
        document.getElementById('error-message').style.visibility = 'hidden';
    target.style.border = '1px solid #888';
}

// validates and returns the sanitized string
function validatePhone() {
    var phone = form.phone.value;
    var sanitized = '';
    for (var i = 0; i < phone.length; i++) {
        if (!isNaN(phone[i]) && phone[i] !== ' ')
            sanitized += phone[i];
    }
    if (sanitized.length !== 10) {
        error(document.getElementById('signup-form').phone);
        return '';
    }
    return sanitized;
}

// returns true iff valid
function validateEmail() {
    var emailInput = form.email;
    if (!emailInput.value) return true;
    // http://emailregex.com/
    var isValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value);
    if (!isValid) error(emailInput);
    return isValid;
}

// add field if 'Other' provider
function validateProvider() {
    clearError(form.phoneProvider);
    if (form.phoneProvider.value === 'other') {
        if (form['other-provider'].style.display === 'none') {
            form['other-provider'].style.display = 'inline-block';
            return false;
        }
        else {
            if (!form['other-provider'].value) {
                error(form['other-provider']);
                return false;
            } else return true;
        }
    }
    else {
        form['other-provider'].style.display = 'none';
        if (form.phoneProvider.value === 'null') {
            error(form.phoneProvider);
            return false;
        }
        return true;
    }
}

function clearForm() {
    form.reset();
    clearError(form.email);
    clearError(form.phone);
    clearError(form.phoneProvider);
    clearError('message');
}

function submitSuccess(res) {
    if (!res.ok) return submitError(res);
    clearForm();
    modal.style.display = 'block';
}

function submitError(res) {
    if (res.status === 400)
        return res.text().then(function(message) {displayError(message)});
    return displayError('There was a problem submitting your form. Please try again later.');
}

function displayError(message) {
    var errorDiv = document.getElementById('error-message');
    errorDiv.innerHTML = message;
    errorDiv.style.visibility = 'visible';
}
