
let budgets = JSON.parse(localStorage.getItem("budgets")) || [];

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
    };


    budgets.push(newBudget);


    localStorage.setItem("budgets", JSON.stringify(budgets));

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
        return;
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
    };

    categories.push(newCategory)
    localStorage.setItem("categories", JSON.stringify(categories))

    nameInput.value = ""
    limitInput.value = ""

    renderCategoryList();
    alert("Thêm danh mục thành công!")
}


let monthlyCategories = JSON.parse(localStorage.getItem("monthlyCategories")) || []


function getCurrentMonth() {
    const month = document.getElementById("month").value
    if (!month) {
        alert("vui lòng chọn tháng")
        throw new Error("No month selected")
    }
    return month
}


function saveMonthlyCategories() {
    localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategories))
}


function renderCategories() {
    const month = getCurrentMonth()
    const categoryList = document.querySelector(".category-list")
    categoryList.innerHTML = ""

    const monthData = monthlyCategories.find(m => m.month === month)
    if (!monthData) return

    monthData.categories.forEach(category => {
        const li = document.createElement("li")
        li.innerHTML = `
            <span>${category.name} - Giới hạn: ${category.budget.toLocaleString()} VND</span>
            <span class="actions">
                <button style="border: none; color: red;" onclick="editCategory('${category.id}')">Sửa</button>
                <button style="border: none; color: red;" onclick="deleteCategory('${category.id}')">Xóa</button>
            </span>
        `
        categoryList.appendChild(li)
    })
}


function addCategory() {
    const month = getCurrentMonth()
    const nameInput = document.getElementById("categoryName")
    const budgetInput = document.getElementById("categoryLimit")

    const name = nameInput.value.trim()
    const budget = parseInt(budgetInput.value.trim())

    if (!name || isNaN(budget)) {
        alert("vui lòng nhập tên và giới hạn hợp lệ")
        return
    }

    let monthData = monthlyCategories.find(m => m.month === month)


    if (!monthData) {
        monthData = {
            id: Date.now(),
            month: month,
            categories: [],
            amount: 0
        };
        monthlyCategories.push(monthData);
    }

    const newCategory = {
        id: Date.now(),
        name,
        budget
    };

    monthData.categories.push(newCategory)

    saveMonthlyCategories()
    renderCategories()

    nameInput.value = ""
    budgetInput.value = ""
}


function editCategory(categoryId) {
    const month = getCurrentMonth()
    const monthData = monthlyCategories.find(m => m.month === month)
    if (!monthData) return

    const category = monthData.categories.find(c => c.id == categoryId)
    if (!category) return

    const newName = prompt("nhập tên danh mục mới:", category.name)
    const newBudget = prompt("nhập giới hạn mới (VND):", category.budget)

    if (newName !== null && newBudget !== null && newName.trim() !== "" && !isNaN(newBudget)) {
        category.name = newName.trim()
        category.budget = parseInt(newBudget)
        saveMonthlyCategories()
        renderCategories()
    }
}


function deleteCategory(categoryId) {
    const month = getCurrentMonth()
    const monthData = monthlyCategories.find(m => m.month === month)
    if (!monthData) return

    if (confirm("bạn muốn xóa danh mục này?")) {
        monthData.categories = monthData.categories.filter(c => c.id != categoryId)
        saveMonthlyCategories()
        renderCategories()
    }
}


document.getElementById("addCategoryBtn").addEventListener("click", addCategory)


document.getElementById("month").addEventListener("change", renderCategories)


if (document.getElementById("month").value) {
    renderCategories()
}
