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
    target.insertBefore(div, target.firstChild.nextSibling);
}

function populate(target, coupons) {
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

        var button = document.createElement('button');
        button.setAttribute('class', 'coupon-button button');
        button.setAttribute('type', 'button');
        if (target === unapproved) {
            button.onclick = function (x,y) {
                return function() {approveCoupon(x,y)}
            }(c,div);
            button.innerHTML = 'Approve';
        } else if (target === active) {
            button.onclick = function (x) {return function() {sendTexts(x)}}(c._id);
            button.innerHTML = 'Send texts';
        }

        div.appendChild(info);
        div.appendChild(button);
        if (coupons.length === 1)
            target.insertBefore(div, target.firstChild.nextSibling)
        else
            target.appendChild(div);
    }
}

function approveCoupon(coupon, couponDiv) {
    fetch('/admin/manage/unapproved', {
        headers: {
            'x-access-token': localStorage.token,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({id: coupon._id})
    }).then(function(res) {
        if (!res.ok) throw new Error('There was an error approving the coupon');
        couponDiv.parentNode.removeChild(couponDiv);
        populate(active, [coupon]);
    }).catch(function(err) {
        addError(unapproved, err);
    });
}

function sendTexts(id) {
    if (localStorage.sentTexts && localStorage.sentTexts.indexOf(id) !== -1) {
        var c = confirm("You've already sent texts for this coupon. Send again?");
        if (!c) return;
    }
    fetch('/admin/manage/active', {
        headers: {
            'x-access-token': localStorage.token,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({id: id})
    }).then(function(res) {
        if (!res.ok) throw new Error('There was an error sending the texts');
        return res.json();
    }).then(function(info) {
        showModal(info);
        if (!localStorage.sentTexts) localStorage.sentTexts = id;
        else if (!c) localStorage.sentTexts += ' ' + id;
    }).catch(function (err) {
        addError(active, err)
    });
}

function showModal(info) {
    document.getElementById('js-success').style.display = 'block';
    var div = document.getElementById('js-info');
    while (div.hasChildNodes()) div.removeChild(div.lastChild);

    var acceptedTitle = document.createElement('h3');
    acceptedTitle.innerHTML = 'Texts were sent to the following addresses';
    var acceptedInfo = document.createElement('p');
    if (info.accepted && info.accepted.length)
        acceptedInfo.innerHTML = info.accepted.join('</br>');
    else
        acceptedInfo.innerHTML = 'Texts were sent to no addresses';
    div.appendChild(acceptedTitle);
    div.appendChild(acceptedInfo);
        
    var rejectedTitle = document.createElement('h3');
    rejectedTitle.innerHTML = 'The following addresses rejected the texts';
    var rejectedInfo = document.createElement('p');
    if (info.rejected && info.rejected.length)
        rejectedInfo.innerHTML = info.accepted.join('</br>');
    else
        rejectedInfo.innerHTML = 'No addresses rejeced the texts';
    div.appendChild(rejectedTitle);
    div.appendChild(rejectedInfo);
}


function formatDate(date) {
    var d = new Date(date);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();

    return month + '/' + day + '/' + year;
}
