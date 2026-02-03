function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
  
    let user = users.find(u => u.email === email && u.password === password);
  
    if (!user) {
      alert("Invalid login");
      return;
    }
  
    if (user.role === "student") {
      window.location.href = "student.html";
    } else if (user.role === "company") {
      window.location.href = "company.html";
    } else {
      window.location.href = "admin.html";
    }
  }
  