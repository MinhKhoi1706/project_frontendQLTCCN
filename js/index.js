function saveBudget() {
    const month = document.querySelector("#month").value
    const budget = document.querySelector("#budget").value

    if (month == "") {
        alert("vui lòng nhập tháng")
        return
    }

    if (budget == "" || isNaN(budget)) {
        alert("vui lòng nhập ngân sách hợp lệ")
        return
    }

    alert(`ngân sách tháng ${month} là ${Number(budget).toLocaleString()}VND`)
}