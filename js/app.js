// Application State
let currentUser = null;
let records = [
  {
    id: 1,
    title: "Financial Report Q1",
    category: "Report",
    description: "Quarterly financial analysis",
    createdBy: "admin",
    date: "2025-06-15",
    status: "Active",
  },
  {
    id: 2,
    title: "Employee Contract - John Doe",
    category: "Contract",
    description: "Employment agreement",
    createdBy: "admin",
    date: "2025-06-10",
    status: "Active",
  },
  {
    id: 3,
    title: "Invoice #1001",
    category: "Invoice",
    description: "Client payment invoice",
    createdBy: "user",
    date: "2025-06-20",
    status: "Pending",
  },
];

let users = [
  {
    id: 1,
    username: "admin",
    email: "admin@company.com",
    role: "admin",
    status: "Active",
    lastLogin: "2025-07-02",
  },
  {
    id: 2,
    username: "user",
    email: "user@company.com",
    role: "user",
    status: "Active",
    lastLogin: "2025-07-01",
  },
  {
    id: 3,
    username: "john.doe",
    email: "john@company.com",
    role: "user",
    status: "Active",
    lastLogin: "2025-06-30",
  },
];

// Demo credentials
const credentials = {
  admin: { password: "admin123", role: "admin", email: "admin@company.com" },
  user: { password: "user123", role: "user", email: "user@company.com" },
};

// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  // Login functionality
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userType = document.getElementById("userType").value;
    const errorDiv = document.getElementById("loginError");

    errorDiv.textContent = "";

    if (
      credentials[username] &&
      credentials[username].password === password &&
      credentials[username].role === userType
    ) {
      currentUser = {
        username: username,
        role: userType,
        email: credentials[username].email,
      };

      showDashboard();
    } else {
      errorDiv.textContent = "Invalid credentials or user type mismatch";
    }
  });

  // Add record form
  document
    .getElementById("addRecordForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const newRecord = {
        id: records.length + 1,
        title: document.getElementById("recordTitle").value,
        category: document.getElementById("recordCategory").value,
        description: document.getElementById("recordDescription").value,
        createdBy: currentUser.username,
        date: new Date().toISOString().split("T")[0],
        status: "Active",
      };

      records.push(newRecord);
      loadRecords();
      updateDashboard();
      closeModal("addRecordModal");
      this.reset();
    });

  // Add user form
  document
    .getElementById("addUserForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      if (currentUser.role !== "admin") return;

      const newUser = {
        id: users.length + 1,
        username: document.getElementById("newUsername").value,
        email: document.getElementById("newUserEmail").value,
        role: document.getElementById("newUserRole").value,
        status: "Active",
        lastLogin: "Never",
      };

      users.push(newUser);
      loadUsers();
      updateDashboard();
      closeModal("addUserModal");
      this.reset();
    });

  // Profile form
  document
    .getElementById("profileForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      currentUser.email = document.getElementById("profileEmail").value;
      alert("Profile updated successfully!");
    });
});

// Dashboard functions
function showDashboard() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("dashboard").classList.add("active");

  // Update user info
  document.getElementById("userRole").textContent =
    currentUser.role === "admin" ? "Admin Dashboard" : "User Dashboard";
  document.getElementById(
    "welcomeUser"
  ).textContent = `Welcome, ${currentUser.username}!`;

  // Show/hide admin features
  if (currentUser.role === "admin") {
    document.getElementById("usersNavItem").classList.remove("hidden");
    document.getElementById("userStatsCard").style.display = "block";
  }

  // Load dashboard data
  updateDashboard();
  loadRecords();
  if (currentUser.role === "admin") {
    loadUsers();
  }
  loadProfile();
}

function logout() {
  currentUser = null;
  document.getElementById("dashboard").classList.remove("active");
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("loginForm").reset();

  // Reset to overview section
  showSection("overview");
}

function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => section.classList.remove("active"));

  // Remove active class from nav items
  const navItems = document.querySelectorAll(".sidebar-nav a");
  navItems.forEach((item) => item.classList.remove("active"));

  // Show selected section
  document.getElementById(sectionName + "Section").classList.add("active");

  // Add active class to clicked nav item
  event.target.classList.add("active");

  // Update page title
  const titles = {
    overview: "Dashboard Overview",
    records: "Records Management",
    users: "User Management",
    profile: "Profile Settings",
  };
  document.getElementById("pageTitle").textContent = titles[sectionName];
}

function updateDashboard() {
  const totalRecords = records.length;
  const myRecords = records.filter(
    (r) => r.createdBy === currentUser.username
  ).length;
  const totalUsers = users.length;
  const recentActivity = records.filter(
    (r) => new Date(r.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  document.getElementById("totalRecords").textContent = totalRecords;
  document.getElementById("myRecords").textContent = myRecords;
  document.getElementById("totalUsers").textContent = totalUsers;
  document.getElementById("recentActivity").textContent = recentActivity;

  // Load recent records table
  const recentRecords = records.slice(-5).reverse();
  const tbody = document.querySelector("#recentRecordsTable tbody");
  tbody.innerHTML = "";

  recentRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.title}</td>
            <td>${record.category}</td>
            <td>${record.createdBy}</td>
            <td>${record.date}</td>
            <td><span style="padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; background: ${
              record.status === "Active" ? "#d4edda" : "#fff3cd"
            }; color: ${record.status === "Active" ? "#155724" : "#856404"};">${
      record.status
    }</span></td>
        `;
    tbody.appendChild(row);
  });
}

function loadRecords() {
  const tbody = document.querySelector("#recordsTable tbody");
  tbody.innerHTML = "";

  const userRecords =
    currentUser.role === "admin"
      ? records
      : records.filter((r) => r.createdBy === currentUser.username);

  userRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.title}</td>
            <td>${record.category}</td>
            <td>${record.description}</td>
            <td>${record.createdBy}</td>
            <td>${record.date}</td>
            <td><span style="padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; background: ${
              record.status === "Active" ? "#d4edda" : "#fff3cd"
            }; color: ${record.status === "Active" ? "#155724" : "#856404"};">${
      record.status
    }</span></td>
            <td>
                <button class="btn btn-primary" onclick="editRecord(${
                  record.id
                })">Edit</button>
                ${
                  currentUser.role === "admin" ||
                  record.createdBy === currentUser.username
                    ? `<button class="btn btn-danger" onclick="deleteRecord(${record.id})">Delete</button>`
                    : ""
                }
            </td>
        `;
    tbody.appendChild(row);
  });
}

function loadUsers() {
  if (currentUser.role !== "admin") return;

  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span style="padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; background: ${
              user.role === "admin" ? "#f8d7da" : "#d1ecf1"
            }; color: ${user.role === "admin" ? "#721c24" : "#0c5460"};">${
      user.role
    }</span></td>
            <td><span style="padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; background: #d4edda; color: #155724;">${
              user.status
            }</span></td>
            <td>${user.lastLogin}</td>
            <td>
                <button class="btn btn-primary" onclick="editUser(${
                  user.id
                })">Edit</button>
                ${
                  user.username !== currentUser.username
                    ? `<button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>`
                    : ""
                }
            </td>
        `;
    tbody.appendChild(row);
  });
}

function loadProfile() {
  document.getElementById("profileUsername").value = currentUser.username;
  document.getElementById("profileEmail").value = currentUser.email;
  document.getElementById("profileRole").value = currentUser.role;
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Record management functions
function editRecord(id) {
  const record = records.find((r) => r.id === id);
  if (record) {
    const newTitle = prompt("Edit title:", record.title);
    if (newTitle && newTitle !== record.title) {
      record.title = newTitle;
      loadRecords();
      updateDashboard();
    }
  }
}

function deleteRecord(id) {
  if (confirm("Are you sure you want to delete this record?")) {
    records = records.filter((r) => r.id !== id);
    loadRecords();
    updateDashboard();
  }
}

// User management functions
function editUser(id) {
  if (currentUser.role !== "admin") return;

  const user = users.find((u) => u.id === id);
  if (user) {
    const newEmail = prompt("Edit email:", user.email);
    if (newEmail && newEmail !== user.email) {
      user.email = newEmail;
      loadUsers();
    }
  }
}

function deleteUser(id) {
  if (currentUser.role !== "admin") return;

  if (confirm("Are you sure you want to delete this user?")) {
    users = users.filter((u) => u.id !== id);
    loadUsers();
    updateDashboard();
  }
}

// Close modals when clicking outside
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
