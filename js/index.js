let budgets = JSON.parse(localStorage.getItem("budgets")) || []

function saveBudget() {
    const month = document.querySelector("#month").value
    const budget = document.querySelector("#budget").value
    const errorBox1 = document.querySelector("#errorBox1")
    const errorBox2 = document.querySelector("#errorBox2")

    errorBox1.textContent = ``
    errorBox2.textContent = ``

    if (month == "") {
        errorBox1.innerHTML = `<p style="display: block; color: red;" align="center">vui lòng nhập tháng</p>`
        return
    }

    if (budget == "" || isNaN(budget)) {
        errorBox2.innerHTML = `<p style="display: block; color: red;" align="center">vui lòng nhập số tiền</p>`
        return
    }

    const newBudget = {
        month: month,
        budget: Number(budget)
    }

    budgets.push(newBudget)
    localStorage.setItem("budgets", JSON.stringify(budgets))

    alert(`Đã lưu ngân sách tháng ${month}: ${Number(budget).toLocaleString()} VND`)

    document.querySelector("#budget").value = ""
    document.querySelector("#month").value = ""
}

function confirmLogOut() {
    const confirmLog = confirm("bạn có chắc muốn đăng xuất")

    if (confirmLog) {
        window.location.href = `login.html`
    }
}

let categories = JSON.parse(localStorage.getItem("categories")) || []

function addCategory() {
    const month = document.querySelector("#month").value
    const nameInput = document.querySelector("#categoryName")
    const limitInput = document.querySelector("#categoryLimit")

    const name = nameInput.value.trim()
    const limit = limitInput.value.trim()

    if (month === "") {
        alert("Vui lòng chọn tháng trước khi thêm danh mục!")
        return
    }
    if (name === "" || limit === "") {
        alert("Vui lòng nhập đầy đủ thông tin danh mục!")
        return
    }
    if (isNaN(limit) || Number(limit) <= 0) {
        alert("Giới hạn phải là số dương!")
        return
    }

    const newCategory = {
        id: Date.now(),
        month: month,
        name: name,
        limit: Number(limit)
    }

    categories.push(newCategory)
    localStorage.setItem("categories", JSON.stringify(categories))

    nameInput.value = ""
    limitInput.value = ""

    renderCategories()

}

function renderCategories() {
    const month = document.querySelector("#month").value
    const categoryList = document.querySelector(".category-list")
    const categorySelect = document.querySelector("#categorySelect")
    categoryList.innerHTML = ""
    categorySelect.innerHTML = '<option value="">Tiền chi tiêu</option>'

    const monthData = categories.filter(c => c.month === month)
    if (monthData.length === 0) return

    monthData.forEach(category => {
        const li = document.createElement("li")
        li.innerHTML = `
            <span>${category.name} - Giới hạn: ${category.limit.toLocaleString()} VND</span>
            <span class="actions">
                <button style="border: none; color: red;" onclick="editCategory('${category.id}')">Sửa</button>
                <button style="border: none; color: red;" onclick="deleteCategory('${category.id}')">Xóa</button>
            </span>
        `
        categoryList.appendChild(li)

        const option = document.createElement("option")
        option.value = category.name
        option.textContent = category.name
        categorySelect.appendChild(option)
    })
}

let editCategoryId = null

function editCategory(categoryId) {
    const category = categories.find(c => c.id == categoryId)
    if (!category) return
    editCategoryId = categoryId
    document.getElementById('overlay').style.display = 'block'
    document.getElementById("editCategoryForm").style.display = "block"
    document.getElementById("editCategoryName").value = category.name
    document.getElementById("editCategoryLimit").value = category.limit
}

document.getElementById('cancelEditBtn').onclick = function () {
    document.getElementById('overlay').style.display = 'none'
    document.getElementById('editCategoryForm').style.display = 'none'
}

document.getElementById('saveEditBtn').onclick = function () {
    document.getElementById('overlay').style.display = 'none'
    document.getElementById('editCategoryForm').style.display = 'none'
}

function saveEditedCategory(categoryId) {
    const newName = document.getElementById('editCategoryName').value.trim()
    const newLimit = document.getElementById('editCategoryLimit').value.trim()

    if (newName !== "" && !isNaN(newLimit)) {
        const category = categories.find(c => c.id == categoryId)
        if (category) {
            category.name = newName
            category.limit = parseInt(newLimit)
            localStorage.setItem('categories', JSON.stringify(categories))
            renderCategories()
        }
    }

    document.getElementById('overlay').style.display = 'none'
    document.getElementById('editCategoryForm').style.display = 'none'
}

document.getElementById("saveEditBtn").addEventListener("click", function () {
    const newName = document.getElementById("editCategoryName").value.trim()
    const newLimit = document.getElementById("editCategoryLimit").value.trim()
    if (newName === "" || newLimit === "") {
        alert("Vui lòng nhập đủ thông tin!")
        return
    }
    if (isNaN(newLimit) || Number(newLimit) <= 0) {
        alert("Giới hạn phải là số dương!")
        return
    }
    const category = categories.find(c => c.id == editCategoryId)
    if (!category) return
    category.name = newName
    category.limit = Number(newLimit)
    localStorage.setItem("categories", JSON.stringify(categories))
    renderCategories()
    document.getElementById("editCategoryForm").style.display = "none"
    editCategoryId = null
})

document.getElementById("cancelEditBtn").addEventListener("click", function () {
    document.getElementById("editCategoryForm").style.display = "none"
    editCategoryId = null
})


function deleteCategory(categoryId) {
    if (confirm("Bạn muốn xóa danh mục này?")) {
        categories = categories.filter(c => c.id != categoryId)
        localStorage.setItem("categories", JSON.stringify(categories))
        renderCategories()
    }
}

document.getElementById("addCategoryBtn").addEventListener("click", addCategory)

document.getElementById("month").addEventListener("change", renderCategories)

renderCategories()

let spendings = JSON.parse(localStorage.getItem("spendings")) || []

function addSpending() {
    const spendingAmount = document.querySelector("#spendingAmount").value
    const categorySelect = document.querySelector("#categorySelect").value
    const spendingNote = document.querySelector("#spendingNote").value

    if (categorySelect === "") {
        alert("Vui lòng chọn danh mục chi tiêu!")
        return
    }

    if (spendingAmount === "" || isNaN(spendingAmount)) {
        alert("Vui lòng nhập số tiền hợp lệ!")
        return
    }

    const newSpending = {
        id: Date.now(),
        amount: Number(spendingAmount),
        category: categorySelect,
        note: spendingNote
    }

    spendings.push(newSpending)
    localStorage.setItem("spendings", JSON.stringify(spendings))


    document.querySelector("#spendingAmount").value = ""
    document.querySelector("#spendingNote").value = ""

    renderSpendings()
}



function renderSpendings() {
    const historyList = document.querySelector(".history")
    historyList.innerHTML = ""

    spendings.forEach(spending => {
        const li = document.createElement("li")
        li.innerHTML = `
            ${spending.category} - ${spending.note}: ${spending.amount.toLocaleString()} VND
            <button style="border: none; color: red;" onclick="deleteSpending('${spending.id}')">Xóa</button>
        `
        historyList.appendChild(li)
    })
}

function deleteSpending(spendingId) {
    if (confirm("Bạn muốn xóa chi tiêu này?")) {
        spendings = spendings.filter(s => s.id != spendingId)
        localStorage.setItem("spendings", JSON.stringify(spendings))
        renderSpendings()
    }
}

document.getElementById("addCategoryBtn").addEventListener("click", addCategory)
document.getElementById("month").addEventListener("change", renderCategories)
document.getElementById("addCategoryBtn").addEventListener("click", renderCategories)
renderCategories()
renderSpendings()
