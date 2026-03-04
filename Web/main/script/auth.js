function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

/* 会員登録 */
function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("入力してください");
    return;
  }

  let users = getUsers();

  if (users.find(u => u.username === username)) {
    alert("このユーザー名は既に存在します");
    return;
  }

  users.push({ username, password });
  saveUsers(users);

  alert("登録成功！");
  window.location.href = "login.html";
}

/* ログイン */
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const users = getUsers();

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    alert("ユーザー名またはパスワードが違います");
    return;
  }

  localStorage.setItem("currentUser", username);

  alert("ログイン成功！");
  window.location.href = "index.html";
}

/* ログアウト */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}