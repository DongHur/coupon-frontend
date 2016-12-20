var modal = document.getElementById('js-success');
var form = document.forms[0];

// generate dates for forms
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var dateFields = document.getElementsByClassName('js-date-input');
for (var i = 0; i < dateFields.length; i++) {
    // months
    var field = dateFields[i];
    var monthSelect = document.createElement('select');
    monthSelect.setAttribute('class', 'month-select');
    for (var j = 0; j < months.length; j++) {
        var month = document.createElement('option');
        month.value = j + 1;
        month.innerHTML = months[j];
        monthSelect.appendChild(month);
    }

    // days
    var daySelect = document.createElement('select');
    daySelect.setAttribute('class', 'day-select');

    // years
    var yearSelect = document.createElement('select');
    yearSelect.setAttribute('class', 'year-select');
    for (var j = new Date().getFullYear(), k = 0; k < 5; k++) {
        var year = document.createElement('option');
        year.value = j + k;
        year.innerHTML = year.value;
        yearSelect.appendChild(year);
    }

    field.appendChild(monthSelect);
    monthSelect.addEventListener('change', generateDaysSelect.bind(field));
    field.appendChild(daySelect);
    field.appendChild(yearSelect);
    yearSelect.addEventListener('change', generateDaysSelect.bind(field));
    generateDaysSelect.call(field);
}

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
        if (errorMessage) errorMessage += '</br>';
        errorMessage += 'Please enter valid phone number.';
    }
    if (!validateProvider()) {
        if (errorMessage) errorMessage += '</br>';
        errorMessage += 'Please select phone provider.';
    }
    if (errorMessage) return displayError(errorMessage);
    data.phone = phone;
    data.phoneProvider = form.phoneProvider.value;
    if (data.phoneProvider === 'other')
        data['other-provider'] = form['other-provider'].value;

    fetch('/', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(submitSuccess)
    .catch(submitError);
}

function submitLogin() {
    var errorMessage = '';
    if (!form.email.value) {
        error(form.email);
        errorMessage = 'Missing email.';
    }
    if (!form.password.value) {
        error(form.password);
        if (errorMessage) errorMessage += '</br>';
        errorMessage += 'Missing password.';
    }
    if (errorMessage) return displayError(errorMessage);
    var data = {
        email: form.email.value,
        password: form.password.value
    };

    fetch('/login', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(function(res) {
        return res.json();
    }).then(function(res) {
        localStorage.token = res.token;
        window.location = '/admin?token=' + res.token;
    }).catch(submitError);
}

function submitCouponForm() {
    var errorMessage = '';
    var data = {};
    if (!form.name.value) {
        errorMessage = 'Please enter coupon name.';
        error(form.name);
    }
    data.name = form.name.value;
    if (!form.url.value) {
        if (errorMessage) errorMessage += '<br/>';
        errorMessage += 'Please enter coupon url.';
        error(form.url);
    }
    data.url = form.url.value;
    var startDate = getDate(document.getElementsByName('startDate')[0]);
    if (!startDate) {
        if (errorMessage) errorMessage += '</br>'
        errorMessage += 'Please enter valid start date.'
        error(document.getElementsByName('startDate')[0]);
    }
    data.startDate = startDate;
    if (form.hasEndDate.checked) {
        var endDate = getDate(document.getElementsByName('endDate')[0]);
        if (!endDate) {
            if (errorMessage) errorMessage += '</br>'
            errorMessage += 'Please enter valid expiration date.'
            error(document.getElementsByName('endDate')[0]);
        }
        data.endDate = endDate;
    }

    if (errorMessage) return displayError(errorMessage);

    fetch('/coupon', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.token,
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
        return document.getElementById('js-error-message').style.visibility = 'hidden';
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
        error(form.phone);
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
    clearError('message');
    var divs = document.getElementsByClassName('hidden');
    for (var i = 0; i < divs.length; i++)
        divs[i].style.display = '';
}

function submitSuccess(res) {
    if (!res.ok) return submitError(res);
    modal.style.display = 'block';
    clearForm();
}

function submitError(res, message) {
    if (res.status === 400)
        return res.text().then(function(message) {displayError(message)});
    if (message)
        return displayError(message);
    return displayError('There was a problem submitting your form. Please try again later.');
}

function displayError(message) {
    var errorDiv = document.getElementById('js-error-message');
    errorDiv.innerHTML = message;
    errorDiv.style.visibility = 'visible';
}

function generateDaysSelect() {
    var children = this.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.className === 'month-select')
            var month = child.value;
        else if (child.className === 'year-select')
            var year = child.value;
        else if (child.className === 'day-select')
            var days = child;
    }
    if (!month || !year || !days) return;
    var numDays = new Date(year, month, 0).getDate();

    while (days.hasChildNodes()) days.removeChild(days.lastChild);
    for (var i = 0; i < numDays; i++) {
        var day = document.createElement('option');
        day.value = i + 1;
        day.innerHTML = day.value;
        days.appendChild(day);
    }
}

function getDate(target) {
    var children = target.childNodes;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.className === 'month-select')
            var month = child.value;
        else if (child.className === 'year-select')
            var year = child.value;
        else if (child.className === 'day-select')
            var day = child.value;
    }
    if (!month || !year || !day) return null;
    return new Date(year, month - 1, day);
}

function toggleEndDate() {
    var div = document.getElementsByName('endDate')[0];
    if (div.style.display !== 'inline-block')
        return div.style.display = 'inline-block';
    return div.style.display = '';
}
