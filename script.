const binId = "68380d588a456b7966a6d16b";
const apiKey = "$2a$10$qNV2tGipYXuFW3167xxgveC1QFEU7D.1fB.aARUKWmvB2htsyVee6";

let data = { pets: [] };
let currentUser = "";

const petsContainer = document.getElementById("pets");
const dashboard = document.querySelector(".dashboard");
const currentUserSpan = document.getElementById("currentUser");

function login() {
  const name = document.getElementById("userNameInput").value.trim();
  if (!name) return;
  currentUser = name;
  currentUserSpan.textContent = name;
  document.querySelector(".login").style.display = "none";
  dashboard.style.display = "block";
  loadData();
}

function renderPets() {
  petsContainer.innerHTML = "";
  data.pets.forEach((pet, i) => {
    const card = document.createElement("div");
    card.className = "pet-card";
    card.innerHTML = `
      <h2>${pet.name}</h2>
      <div>
        <strong>Procházka:</strong>
        ${["Ráno", "Odpoledne", "Večer"].map(time =>
          renderCheckbox(pet, i, "walk", time)).join("")}
      </div>
      <div>
        <strong>Krmení:</strong>
        ${["Ráno", "Odpoledne", "Večer"].map(time =>
          renderCheckbox(pet, i, "feed", time)).join("")}
      </div>
      <div>
        <strong>Veterinář:</strong><br>
        <input type="date" id="date-${i}">
        <input type="time" id="time-${i}">
        <button onclick="addVetVisit(${i})">Naplánovat</button>
        <div>
          ${pet.vetVisits.map(v => `
            <div class="activity">${v.date} ${v.time} – ${v.by}</div>
          `).join("")}
        </div>
      </div>`;
    petsContainer.appendChild(card);
  });
}

function renderCheckbox(pet, petIndex, type, time) {
  const existing = pet.activities?.find(
    a => a.type === type && a.time === time
  );
  return `
    <label>
      <input type="checkbox" ${existing?.by === currentUser ? "checked" : ""}
        onchange="toggleActivity(${petIndex}, '${type}', '${time}')">
      ${time}
    </label>
  `;
}

function toggleActivity(petIndex, type, time) {
  const pet = data.pets[petIndex];
  pet.activities = pet.activities || [];
  const index = pet.activities.findIndex(a => a.type === type && a.time === time);
  if (index > -1 && pet.activities[index].by === currentUser) {
    pet.activities.splice(index, 1);
  } else {
    pet.activities.push({ type, time, by: currentUser });
  }
  saveData().then(renderPets);
}

function addVetVisit(petIndex) {
  const date = document.getElementById(`date-${petIndex}`).value;
  const time = document.getElementById(`time-${petIndex}`).value;
  if (!date || !time) return;
  const pet = data.pets[petIndex];
  pet.vetVisits = pet.vetVisits || [];
  pet.vetVisits.push({ date, time, by: currentUser });
  saveData().then(renderPets);
}

function addPet() {
  const name = document.getElementById("petNameInput").value.trim();
  if (!name) return;
  data.pets.push({ name, activities: [], vetVisits: [] });
  document.getElementById("petNameInput").value = "";
  saveData().then(renderPets);
}

async function loadData() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    headers: { "X-Master-Key": apiKey }
  });
  const json = await res.json();
  data = json.record || { pets: [] };
  renderPets();
}

async function saveData() {
  await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey
    },
    body: JSON.stringify(data)
  });
}
