function toggleInternships(e) {
  e.preventDefault();

  const submenu = document.getElementById("internshipSubmenu");
  if (!submenu) return;

  // toggle show/hide
  const isOpen = submenu.classList.toggle("open");

  // optional: rotate chevron
  const toggle = e.currentTarget;
  const chev = toggle.querySelector(".chevron");
  if (chev) chev.textContent = isOpen ? "▴" : "▾";
}

// expose to inline onclick
window.toggleInternships = toggleInternships;
