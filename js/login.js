function login(event) {
    event.preventDefault()

    const email = document.querySelector("#email").value
    const pass = document.querySelector("#pass").value
    const error = document.querySelector("#error")

    error.textContent = ``

    if (email === '') {
        error.innerHTML = `<p style="color: red; text-align: center;">email không được để trống</p>`
        return false
    }

    if (pass === '') {
        error.innerHTML = `<p style="color: red; text-align: center;">mật khẩu không được để trống</p>`
        return false
    }

    const users = JSON.parse(localStorage.getItem("users")) || []
    const user = users.find(u => u.email === email)

    if (!user){
        error.innerHTML = `<p style="color: red; text-align: center;">email không tồn tại</p>`
        return false
    }

    if (user.password !== pass){
        error.innerHTML = `<p style="color: red; text-align: center;">mật khẩu không đúng</p>`
        return false
    }

    alert(`đăng nhập thành công`)
    window.location.href = `index.html`


}