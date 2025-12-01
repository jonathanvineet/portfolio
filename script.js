// ----------------------------
// PARTICLES
// ----------------------------
const container = document.getElementById("particles");

for (let i = 0; i < 40; i++) {
  const p = document.createElement("div");
  p.className = "particle" + (Math.random() > 0.6 ? " red" : "");
  p.style.left = Math.random() * 100 + "%";
  p.style.top = Math.random() * 100 + "%";
  p.style.animationDuration = 6 + Math.random() * 6 + "s";
  container.appendChild(p);
}


// ----------------------------
// NAVBAR ACTIVE ON SCROLL
// ----------------------------
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav a");

function activateLink() {
  let index = sections.length;

  while(--index && window.scrollY + 120 < sections[index].offsetTop) {}

  navLinks.forEach((link) => link.classList.remove("active"));
  navLinks[index].classList.add("active");
}

document.querySelector(".page").addEventListener("scroll", activateLink);
activateLink();
