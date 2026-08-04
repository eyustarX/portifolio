const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

const navLinkItems = document.querySelectorAll(".nav-links a");

navLinkItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

const typingText = document.querySelector(".typing-text");
const words = ["Software Engineer", "Problem Solver", "Web Developer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 500;
  }

  setTimeout(type, typeSpeed);
}

type();

const faders = document.querySelectorAll(".fade-section");

const appearOptions = {
  threshold: 0.2,
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});

const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.classList.remove("active-link");
    if (anchor.getAttribute("href") === `#${current}`) {
      anchor.classList.add("active-link");
    }
  });
});

// --- Load profile data (name, bio, experience) from the backend API ---

// Read ?id=2 from the URL, e.g. index.html?id=2 — defaults to 1 if not provided
const urlParams = new URLSearchParams(window.location.search);
const profileId = urlParams.get("id") || 1;

async function loadProfile() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/profiles/${profileId}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const profile = await response.json();

    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-bio").textContent = profile.bio;
    document.getElementById("profile-experience").innerHTML =
      `<p>${profile.experience}</p>`;

    // Carry the current profile id forward into the Edit Profile link
    const editLink = document.querySelector(".nav-edit-link");
    if (editLink) editLink.href = `edit.html?id=${profileId}`;
  } catch (err) {
    console.error("Could not load profile:", err);
  }
}

loadProfile();
