let budgets = JSON.parse(localStorage.getItem("budgets")) || []
let categories = JSON.parse(localStorage.getItem("categories")) || []
let spendings = JSON.parse(localStorage.getItem("spendings")) || []

function saveBudget() {
    const month = document.querySelector("#month").value
    const budget = document.querySelector("#budget").value
    const errorBox1 = document.querySelector("#errorBox1")
    const errorBox2 = document.querySelector("#errorBox2")

    errorBox1.textContent = ""
    errorBox2.textContent = ""

    if (month == "") {
        errorBox1.innerHTML = `<p style="color: red;" align="center">Vui lòng nhập tháng</p>`
        return
    }

    if (budget == "" || isNaN(budget)) {
        errorBox2.innerHTML = `<p style="color: red;" align="center">Vui lòng nhập số tiền</p>`
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
    const confirmLog = confirm("Bạn có chắc muốn đăng xuất?")
    if (confirmLog) window.location.href = "login.html"
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

function saveEditedCategory() {
    const newName = document.getElementById('editCategoryName').value.trim()
    const newLimit = document.getElementById('editCategoryLimit').value.trim()

    if (newName !== "" && !isNaN(newLimit)) {
        const category = categories.find(c => c.id == editCategoryId)
        if (category) {
            category.name = newName
            category.limit = parseInt(newLimit)
            localStorage.setItem('categories', JSON.stringify(categories))
            renderCategories()
        }
    }

    document.getElementById('overlay').style.display = 'none'
    document.getElementById('editCategoryForm').style.display = 'none'
    editCategoryId = null
}

function cancelEditCategory() {
    document.getElementById('overlay').style.display = 'none'
    document.getElementById('editCategoryForm').style.display = 'none'
    editCategoryId = null
}

document.getElementById('saveEditBtn').addEventListener('click', saveEditedCategory)
document.getElementById('cancelEditBtn').addEventListener('click', cancelEditCategory)

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

let currentPage = 1
const itemsPerPage = 3  // Hiển thị 3 mục mỗi trang

function renderSpendings() {
    const historyList = document.querySelector(".history")
    const searchValue = document.getElementById("searchInput").value.trim().toLowerCase()
    const sortValue = document.getElementById("sortSelect").value

    let filteredSpendings = spendings.filter(spending =>
        spending.category.toLowerCase().includes(searchValue)
    )

    if (sortValue === "increase") {
        filteredSpendings.sort((a, b) => a.amount - b.amount)
    } else if (sortValue === "decrease") {
        filteredSpendings.sort((a, b) => b.amount - a.amount)
    }

    const totalItems = filteredSpendings.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    if (currentPage > totalPages) currentPage = totalPages || 1
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    const paginatedSpendings = filteredSpendings.slice(start, end)

    historyList.innerHTML = ""

    paginatedSpendings.forEach(spending => {
        const li = document.createElement("li")
        li.innerHTML = `
            ${spending.category} - ${spending.note}: ${spending.amount.toLocaleString()} VND
            <button style="border: none; color: red;" onclick="deleteSpending('${spending.id}')">Xóa</button>
        `
        li.style.display = "flex"
        li.style.justifyContent = "space-between"
        li.style.alignItems = "center"
        li.style.borderBottom = "1px solid gray"
        historyList.appendChild(li)
    })

    renderPagination(totalPages)
}

function renderPagination(totalPages) {
    const pagination = document.querySelector(".pagination")
    pagination.innerHTML = ""

    // Nút Previous
    const prevItem = document.createElement("li")
    prevItem.className = `page-item ${currentPage === 1 ? "disabled" : ""}`
    prevItem.innerHTML = `<a class="page-link" href="#">Previous</a>`
    prevItem.addEventListener("click", (e) => {
        e.preventDefault()
        if (currentPage > 1) {
            currentPage--
            renderSpendings()
        }
    })
    pagination.appendChild(prevItem)

    // Các số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li")
        pageItem.className = `page-item ${currentPage === i ? "active" : ""}`
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`
        pageItem.addEventListener("click", (e) => {
            e.preventDefault()
            currentPage = i
            renderSpendings()
        })
        pagination.appendChild(pageItem)
    }

    // Nút Next
    const nextItem = document.createElement("li")
    nextItem.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`
    nextItem.innerHTML = `<a class="page-link" href="#">Next</a>`
    nextItem.addEventListener("click", (e) => {
        e.preventDefault()
        if (currentPage < totalPages) {
            currentPage++
            renderSpendings()
        }
    })
    pagination.appendChild(nextItem)
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault()
    currentPage = 1 // Quay về trang 1 khi tìm kiếm
    renderSpendings()
})

document.getElementById("sortSelect").addEventListener("change", function () {
    renderSpendings()
})

function renderPagination(totalPages) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    // Nút Previous
    const prevItem = document.createElement("li");
    prevItem.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevItem.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevItem.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderSpendings();
        }
    });
    pagination.appendChild(prevItem);

    // Các số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${currentPage === i ? "active" : ""}`;
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageItem.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            renderSpendings();
        });
        pagination.appendChild(pageItem);
    }

    // Nút Next
    const nextItem = document.createElement("li");
    nextItem.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    nextItem.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextItem.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderSpendings();
        }
    });
    pagination.appendChild(nextItem);
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    currentPage = 1;  // Quay về trang 1 khi tìm kiếm
    renderSpendings();
});


function deleteSpending(spendingId) {
    if (confirm("Bạn muốn xóa chi tiêu này?")) {
        spendings = spendings.filter(s => s.id != spendingId)
        localStorage.setItem("spendings", JSON.stringify(spendings))
        renderSpendings()
    }
}

document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault()
    renderSpendings()
})

document.getElementById("sortSelect").addEventListener("change", function () {
    renderSpendings()
})

renderSpendings()
