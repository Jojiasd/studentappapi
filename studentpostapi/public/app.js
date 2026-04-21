const API = "/api/students";

async function load() {
  try {
    const res = await fetch(API);

    if (!res.ok) throw new Error("GET failed");

    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach(s => {
      list.innerHTML += `
        <div class="post">
          <b>${s.name}</b> → ${s.post}
        </div>
      `;
    });

  } catch (err) {
    console.error("Load error:", err);
  }
}


  
async function addStudent() {
  const name = document.getElementById("name").value.trim();
  const post = document.getElementById("post").value.trim();

  if (!name || !post) {
    alert("Please enter name and post");
    return;
  }

  try {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, post })
    });

    const text = await res.text(); // 👈 IMPORTANT DEBUG STEP
    console.log("RAW RESPONSE:", res.status, text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new Error(data.message || text || "Server error");
    }

    document.getElementById("name").value = "";
    document.getElementById("post").value = "";

    load();

  } catch (err) {
    console.error("POST ERROR:", err);
    alert("Failed to add student: " + err.message);
  }
}

load();
