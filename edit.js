const form = document.getElementById("edit-profile-form");
const statusEl = document.getElementById("edit-status");

const nameInput = document.getElementById("edit-name");
const bioInput = document.getElementById("edit-bio");
const experienceInput = document.getElementById("edit-experience");

// Read ?id=2 from the URL, e.g. edit.html?id=2 — defaults to 1 if not provided
const urlParams = new URLSearchParams(window.location.search);
const profileId = urlParams.get("id") || 1;

// --- Load the current profile so the form starts pre-filled ---
async function loadProfileIntoForm() {
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

    nameInput.value = profile.name;
    bioInput.value = profile.bio;
    experienceInput.value = profile.experience;
  } catch (err) {
    console.error("Could not load profile:", err);
    statusEl.textContent = "Could not load current profile data.";
  }
}

loadProfileIntoForm();

// --- Handle form submission (the actual UPDATE) ---
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop the browser's default full-page-reload form submission

  const updatedProfile = {
    name: nameInput.value,
    bio: bioInput.value,
    experience: experienceInput.value,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/api/profiles/${profileId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      },
    );

    if (!response.ok) throw new Error("Update failed");

    // Don't trust local form values — re-fetch the saved record from the
    // database itself so the UI reflects exactly what was persisted
    await loadProfileIntoForm();

    statusEl.textContent = "Saved! Redirecting...";
    setTimeout(() => {
      window.location.href = `index.html?id=${profileId}`;
    }, 800);
  } catch (err) {
    console.error("Could not update profile:", err);
    statusEl.textContent = "Something went wrong while saving.";
  }
});
