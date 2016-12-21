var unapproved = document.getElementById('js-unapproved-coupons');
var active = document.getElementById('js-active-coupons');

fetchUnapproved();
fetchActive();

function fetchUnapproved() {
    fetch('/admin/manage/unapproved', {
        headers:{'x-access-token': localStorage.token}
    }).then(function(res) {
        if (!res.ok) throw new Error('Could not fetch coupons.');
        return res.json();
    }).then(function(res) {
        console.log(res);
    }).catch(function(err) {
        addError(unapproved, err);
    });
}

function fetchActive() {
    fetch('/admin/manage/active', {
        headers:{'x-access-token': localStorage.token}
    }).then(function(res) {
        if (!res.ok) throw new Error('Could not fetch coupons.');
        return res.json();
    }).then(function(res) {
        console.log(res);
    }).catch(function(err) {
        addError(active, err);
    });
}

function addError(target, err) {
    var div = document.createElement('h3');
    div.setAttribute('class', 'error center');
    div.innerHTML = err.message;
    target.appendChild(div);
}
