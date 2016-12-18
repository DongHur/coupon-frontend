function submitForm() {
    var form = document.getElementById('signup-form');
    var data = {};
    var exit = false;
    if (form.firstName.value) data.firstName = form.firstName.value;
    if (form.lastName.value) data.lastName = form.lastName.value;
    if (form.classYear.value) data.classYear = form.classYear.value;
    if (form.email.value && validateEmail()) data.email = form.email.value;

    var phone = validatePhone();
    if (!phone) {
        error(form.phone);
        exit = true;
    }
    if (form.phoneProvider.value === 'null') {
        error(form.phoneProvider);
        exit = true;
    }
    if (exit) return;
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
    target.style.border = '1px solid #888';
}

// validates and returns the sanitized string
function validatePhone() {
    var phone = document.getElementById('signup-form').phone.value;
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
    var emailInput = document.getElementById('signup-form').email;
    if (!emailInput.value) return true;
    // http://emailregex.com/
    var isValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value);
    if (!isValid) error(emailInput);
    return isValid;
}

function submitSuccess(res) {
    console.log('success!');
    res.json().then(function(body) {
        console.log(body)
    });
}

function submitError(res) {
    console.log('error!');
}
