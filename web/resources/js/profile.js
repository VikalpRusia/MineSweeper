$('#profileButton').addClass('active disabledbtn');

/*active button class onclick*/
$('nav a').click(function (e) {
    e.preventDefault();
    $('nav a').removeClass('active');
    $(this).addClass('active');
    if (this.id === 'password') {
        $('.password').removeClass('noshow');
        $('.rightbox').children().not('.password').addClass('noshow');
    } else if (this.id === 'profile') {
        $('.profile').removeClass('noshow');
        $('.rightbox').children().not('.profile').addClass('noshow');
    }
});

/* Data start*/
$newAvtar = $('#avatarImg').get(0);
$displayAvtar = $('#displayAvtar');
$('#avtarBtn').click(() => {
    if ($newAvtar.files && $newAvtar.files[0]) {
        uploadAvtar($newAvtar.files[0]).then(
            (resp) => {
                if (responseValid(resp)) {
                    $displayAvtar.on('load', () => {
                        URL.revokeObjectURL($displayAvtar.prop('src'));
                    });
                    $displayAvtar.prop('src', URL.createObjectURL($newAvtar.files[0]))
                }
            })
    } else {
        alert("Cannot upload null file !");
    }
});
$('#usernameBtn').click(() =>
    updateData("change-username", $('#username').val()).then(
        (resp) => responseValid(resp)));
$('#fullNameBtn').click(() =>
    updateData("change-full-name", $('#fullName').val()).then(
        (resp) => responseValid(resp)));
$('#emailBtn').click(() =>
    updateData("change-email", $('#email').val()).then(
        (resp) => responseValid(resp)));

$('#verify-mail').click(async () => {
    return await fetch("profile/send-mail", {
        method: "GET",
    });
});
/* Data end*/

/* Password start*/
$changePassword = $('#changePassword');
$retypePass = $('#retypePass');
$newPass = $('#newPass');
$reportError = $('#report-error');
$changePassword.prop('disabled', true);
$retypePass.keyup(() => {
    matchPassword();
});
$newPass.keyup(() => {
    console.log()
    if ($retypePass.val() === '') {
        return;
    }
    matchPassword();
});
$changePassword.click(() => {
    updatePassword($('#currentPass').val(), $('#newPass').val()).then((resp) => {
        console.log(resp);
        if (resp.isPasswordChanged === true) {
            alert("Password changed successfully !");
            $reportError.html("");
        } else if (resp.isPasswordChanged === false) {
            $reportError.html("Invalid current password !");
        } else {
            alert("You are not logged in !")
        }
    }).catch(err => {
        alert(err);
        console.log(err);
    });
});

function matchPassword() {
    if ($retypePass.val() === $newPass.val()) {
        $reportError.html("")
        $changePassword.prop('disabled', false);
    } else {
        $reportError.html("Re-typed password don't match typed password.")
        $changePassword.prop('disabled', true);
    }
}

async function updatePassword(currentPassword, newPassword) {
    return await fetch("profile/update-password", {
        method: "POST",
        headers: {
            "charset": "UTF-8",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            currentPass: currentPassword,
            newPass: newPassword
        })
    })
        .then(data => data.json());
}

async function updateData(relativeURL, data) {
    return await fetch("profile/" + relativeURL, {
        method: "POST",
        headers: {
            "charset": "UTF-8",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            data: data
        })
    })
        .then(data => data.json())
        .catch(err => {
            alert(err);
            console.log(err);
        });
}

async function uploadAvtar(img) {
    let formData = new FormData();
    formData.append("img", img);
    return await fetch("profile/upload-avtar", {
        method: "POST",
        body: formData
    })
        .then(data => data.json())
        .catch(err => {
            alert(err);
            console.log(err);
        });
}

function responseValid(resp) {
    if (resp.isDataChanged === true) {
        alert("Success !")
        return true;
    } else if (resp.isDataChanged === false) {
        alert("Invalid Request !")
    } else {
        console.log("No logged in !");
        window.location.href = contextPath;
    }
    return false;
}

/* Password end*/