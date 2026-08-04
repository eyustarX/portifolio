const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop the browser's default full-page-reload form submission

  const newMessage = {
    name: document.getElementById("contact-name").value,
    email: document.getElementById("contact-email").value,
    message: document.getElementById("contact-message").value,
  };

  try {
    const response = await fetch("http://localhost:3000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });

    if (!response.ok) throw new Error("Failed to send message");

    contactStatus.textContent = "Message sent! Thanks for reaching out.";
    contactForm.reset();
  } catch (err) {
    console.error("Could not send message:", err);
    contactStatus.textContent = "Something went wrong. Please try again.";
  }
});
