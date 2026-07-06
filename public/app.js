const form = document.getElementById("shortenForm");
const urlInput = document.getElementById("urlInput");
const result = document.getElementById("result");
const shortUrlSpan = document.getElementById("shortUrl");
const copyBtn = document.getElementById("copyBtn");
const errorDiv = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();
  result.classList.add("hidden");

  const url = urlInput.value.trim();
  if (!url) return;

  try {
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error || "Something went wrong");
      return;
    }

    shortUrlSpan.textContent = data.shortUrl;
    result.classList.remove("hidden");
    urlInput.value = "";
  } catch {
    showError("Could not connect to server.");
  }
});

copyBtn.addEventListener("click", () => {
  const text = shortUrlSpan.textContent;
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.querySelector(".icon-copy").style.display = "none";
    copyBtn.querySelector(".icon-check").style.display = "inline";
    setTimeout(() => {
      copyBtn.querySelector(".icon-copy").style.display = "inline";
      copyBtn.querySelector(".icon-check").style.display = "none";
    }, 1500);
  });
});

function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove("hidden");
}

function hideError() {
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}
