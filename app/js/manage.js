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
    }).then(function(coupons) {
        populate(unapproved, coupons);
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
    }).then(function(coupons) {
        populate(active, coupons);
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

function populate(target, coupons, button) {
    for (var i = 0; i < coupons.length; i++) {
        var c = coupons[i];
        var div = document.createElement('div');
        div.setAttribute('class', 'coupon');

        var info = document.createElement('div');
        info.setAttribute('class', 'coupon-info')
        
        var title = document.createElement('div');
        title.setAttribute('class', 'coupon-name');
        title.innerHTML = c.companyName + ': ' + c.name;
        info.appendChild(title);
        var url = document.createElement('a');
        url.setAttribute('class', 'coupon-url');
        url.innerHTML = c.url;
        url.href = c.url;
        url.setAttribute('target', '_blank');
        info.appendChild(url);
        var life = document.createElement('div');
        life.setAttribute('class', 'coupon-dates');
        life.innerHTML = formatDate(c.startDate) + ' -';
        if (c.endDate)
            life.innerHTML += ' ' + formatDate(c.endDate);
        info.appendChild(life);


        div.appendChild(info);
        target.appendChild(div);
    }
}

function formatDate(date) {
    var d = new Date(date);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();

    return month + '/' + day + '/' + year;
}
