function validate(event) {
    event.preventDefault()

    const email = document.querySelector("#email").value
    const pass = document.querySelector("#pass").value
    const confirmPass = document.querySelector("#confirmPass").value
    const error = document.querySelector("#error")

    error.textContent = ''

    if (email === '') {
        error.innerHTML = `<p style="color: red; text-align: center;">email không được để trống</p>`
        return false
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
        error.innerHTML = `<p style="color: red; text-align: center;">email không hợp lệ</p>`
        return false
    }

    if (pass === '') {
        error.innerHTML = `<p style="color: red; text-align: center;">mật khẩu không được để trống</p>`
        return false
    }

    if (confirmPass === '') {
        error.innerHTML = `<p style="color: red; text-align: center;">xác nhận mật khẩu không được để trống</p>`
        return false
    }

    if (pass.length < 6) {
        error.innerHTML = `<p id="error" style="color: red; text-align: center;">mật khẩu tối thiểu 6 ký tự</p>`
        return false
    }

    if (pass !== confirmPass) {
        error.innerHTML = `<p style="color: red; text-align: center;">mật khẩu không khớp</p>`
        return false
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(user => user.email === email)) {
        error.innerHTML = `<p style="color: red; text-align: center;">email đã tồn tại</p>`
        return false;
    }

    users.push({ email, password: pass });
    localStorage.setItem("users", JSON.stringify(users));

    alert(`đăng ký thành công`)
    window.location.href = `login.html`
    return true

}



