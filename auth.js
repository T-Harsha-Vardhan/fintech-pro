const USERS_STORAGE_KEY = "fintrack_users";
const CURRENT_USER_KEY = "current_user";

const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

function registerUser(event) {
  event.preventDefault();

  const name = document.querySelector(".register-name").value.trim();
  const email = document.querySelector(".register-email").value.trim();
  const password = document.querySelector(".register-password").value;
  const confirmPassword = document.querySelector(".confirm-password").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];

  const existingUser = users.find((user) => {
    return user.email === email;
  });

  if (existingUser) {
    alert("Email already registered.");
    return;
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
  };

  users.push(newUser);

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  alert("Registration Successful!");

  window.location.href = "index.html";
}

function loginUser(event) {
  event.preventDefault();

  const email = document.querySelector(".login-email").value.trim();
  const password = document.querySelector(".login-password").value;

  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];

  const currentUser = users.find((user) => {
    return user.email === email && user.password === password;
  });

  if (!currentUser) {
    alert("Invalid email or password.");
    return;
  }

  localStorage.setItem(CURRENT_USER_KEY, currentUser.id);

  window.location.href = "dashboard.html";
}

if (registerForm) {
  registerForm.addEventListener("submit", registerUser);
}

if (loginForm) {
  loginForm.addEventListener("submit", loginUser);
}
