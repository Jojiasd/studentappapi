const API = "/api/students";

async function load() {
  const res = await fetch(API);
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
}

async function addStudent() {
  const name = document.getElementById("name").value;
  const post = document.getElementById("post").value;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, post })
  });

  document.getElementById("name").value = "";
  document.getElementById("post").value = "";

  load();
}

load();
