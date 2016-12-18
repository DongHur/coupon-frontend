function submitForm() {
    var form = document.getElementById('signup-form');
    var data = {};
    if (form.firstName.value) data.firstName = form.firstName.value;
    if (form.lastName.value) data.lastName = form.lastName.value;
    if (form.classYear.value) data.classYear = form.classYear.value;
    if (form.email.value) data.email = form.email.value;

    if (!form.phone.value)
        return error(form.phone);
    data.phone = form.phone.value;
    data.phoneProvider = form.phoneProvider.value;

    console.log(data);
}

function error(target) {
    target.style.border = '3px solid #F00';
}

function clearError(target) {
    target.style.border = '1px solid #888';
}
