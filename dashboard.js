let sortColumn = null;
let sortDirection = "asc";

let users = [];
let filteredUsers = [];
let currentPage = 1;
const rowsPerPage = 5;
function deleteUser(index) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    filteredUsers = users;
    render();
}

// FETCH USERS
function loadUsers() {
    const savedUsers = localStorage.getItem("users");

    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        users = [
            {
                name: "Ali Khan",
                email: "ali@gmail.com",
                company: { name: "TechSoft" }
            },
            {
                name: "Sara Ahmed",
                email: "sara@gmail.com",
                company: { name: "CodeHub" }
            }
        ];
        localStorage.setItem("users", JSON.stringify(users));
    }

    filteredUsers = users;
    render();
}

// MAIN RENDER FUNCTION
function render() {
    renderTable();
    renderPagination();
    renderStats();
}

// RENDER TABLE
function renderTable() {
    const tableBody = document.getElementById("table-body");

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    let sortedUsers = [...filteredUsers];

    if (sortColumn) {
        sortedUsers.sort((a, b) => {
            let aValue;
            let bValue;

            if (sortColumn === "company") {
                aValue = a.company.name.toLowerCase();
                bValue = b.company.name.toLowerCase();
            } else {
                aValue = a[sortColumn].toLowerCase();
                bValue = b[sortColumn].toLowerCase();
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }

    const paginatedUsers = sortedUsers.slice(start, end);

    tableBody.innerHTML = "";

    paginatedUsers.forEach(user => {
        const row = document.createElement("tr");

      
      row.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.company.name}</td>
    <td><button onclick="deleteUser(${users.indexOf(user)})">Delete</button></td>
`;

        tableBody.appendChild(row);
    });
}

// RENDER PAGINATION
function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            currentPage = i;
            render();
        });

        pagination.appendChild(button);
    }
}

// RENDER STATS
function renderStats() {
    const totalUsersEl = document.getElementById("total-users");
    const uniqueCompaniesEl = document.getElementById("unique-companies");

    totalUsersEl.textContent = filteredUsers.length;

    const companies = new Set(
        filteredUsers.map(user => user.company.name)
    );

    uniqueCompaniesEl.textContent = companies.size;
}

// SEARCH
document.getElementById("search").addEventListener("input", function (e) {
    const value = e.target.value.toLowerCase();

    filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.company.name.toLowerCase().includes(value)
    );

    currentPage = 1; // reset to first page
    render();        // re-render table, stats, pagination
});

// SORTING
document.querySelectorAll("th").forEach(th => {
    th.addEventListener("click", () => {
        const column = th.getAttribute("data-column");

        if (sortColumn === column) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = column;
            sortDirection = "asc";
        }

        render();
    });
});
function addUser() {
    const name = document.getElementById("newName").value;
    const email = document.getElementById("newEmail").value;
    const company = document.getElementById("newCompany").value;

    if (!name || !email || !company) {
        alert("Please fill all fields");
        return;
    }

    const newUser = {
        name,
        email,
        company: { name: company }
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    currentPage = 1;
filteredUsers = users;
    
    render();

    document.getElementById("newName").value = "";
    document.getElementById("newEmail").value = "";
    document.getElementById("newCompany").value = "";
}

// INITIAL LOAD
loadUsers();
