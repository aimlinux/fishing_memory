// // ===============================
// // ユーザー管理
// // ===============================
// // ===============================
// // ユーザー管理
// // ===============================
// function getUsers() {
//   return JSON.parse(localStorage.getItem("users")) || [];
// }

// function saveUsers(users) {
//   localStorage.setItem("users", JSON.stringify(users));
// }

// // ===============================
// // 会員登録
// // ===============================
// function register() {
//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;

//   if (!username || !password) {
//     alert("入力してください");
//     return;
//   }

//   let users = getUsers();

//   if (users.find(u => u.username === username)) {
//     alert("このユーザー名は既に存在します");
//     return;
//   }

//   users.push({ username, password });
//   saveUsers(users);

//   // ★ 登録と同時にログイン状態にする
//   localStorage.setItem("currentUser", username);

//   alert("登録＆ログイン成功！");
//   window.location.href = "../index.html";
// }

// // ===============================
// // ログイン
// // ===============================
// function login() {
//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;

//   const users = getUsers();

//   const user = users.find(
//     u => u.username === username && u.password === password
//   );

//   if (!user) {
//     alert("ユーザー名またはパスワードが違います");
//     return;
//   }

//   localStorage.setItem("currentUser", username);

//   alert("ログイン成功！");
//   window.location.href = "../index.html";
// }

// // ===============================
// // ログアウト
// // ===============================
// function logout() {
//   localStorage.removeItem("currentUser");
//   window.location.href = "../index.html";
// }

// // ===============================
// // ナビ更新（★これが重要）
// // ===============================
// function updateNavbar() {
//   const nav = document.getElementById("navButtons");
//   if (!nav) return;

//   const user = localStorage.getItem("currentUser");

//   if (user) {
//     nav.innerHTML = `
//       <span class="user-name">👤 ${user}</span>
//       <button class="outline-btn" onclick="logout()">ログアウト</button>
//     `;
//   } else {
//     nav.innerHTML = `
//       <a href="../html/login.html">
//         <button class="outline-btn">ログイン</button>
//       </a>
//       <a href="../html/register.html">
//         <button class="primary-btn small">会員登録</button>
//       </a>
//     `;
//   }
// }