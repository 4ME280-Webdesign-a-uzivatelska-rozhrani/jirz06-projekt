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
      <button onclick="deletePet(${i})">🗑️ Smazat mazlíčka</button>
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
          ${pet.vetVisits.map((v, j) => `
            <div class="activity">
              ${v.date} ${v.time} – ${v.by}
              ${v.by === currentUser ? `<button onclick="removeVetVisit(${i}, ${j})">❌</button>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
      <div>
        <strong>Aktivity:</strong>
        ${pet.activities?.map((a, j) => `
          <div class="activity">
            ${a.type} – ${a.time} – ${a.by}
            ${a.by === currentUser ? `<button onclick="removeActivity(${i}, ${j})">❌</button>` : ""}
          </div>
        `).join("") || "<div>Žádné aktivity</div>"}
      </div>`;
    petsContainer.appendChild(card);
  });
}

function renderCheckbox(pet, petIndex, type, time) {
  const existing = pet.activities?.find(
    a => a.type === type && a.time === time && a.by === currentUser
  );
  return `
    <label>
      <input type="checkbox" ${existing ? "checked" : ""}
        onchange="toggleActivity(${petIndex}, '${type}', '${time}')">
      ${time}
    </label>
  `;
}

function toggleActivity(petIndex, type, time) {
  const pet = data.pets[petIndex];
  pet.activities = pet.activities || [];
  const index = pet.activities.findIndex(a => a.type === type && a.time === time && a.by === currentUser);
  if (index > -1) {
    pet.activities.splice(index, 1);
  } else {
    pet.activities.push({ type, time, by: currentUser });
  }
  saveData().then(renderPets);
}

function removeActivity(petIndex, activityIndex) {
  const pet = data.pets[petIndex];
  if (pet.activities && pet.activities[activityIndex]) {
    if (pet.activities[activityIndex].by === currentUser) {
      pet.activities.splice(activityIndex, 1);
      saveData().then(renderPets);
    } else {
      alert("Můžeš smazat jen své vlastní aktivity.");
    }
  }
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

function removeVetVisit(petIndex, visitIndex) {
  const pet = data.pets[petIndex];
  if (pet.vetVisits && pet.vetVisits[visitIndex]) {
    if (pet.vetVisits[visitIndex].by === currentUser) {
      pet.vetVisits.splice(visitIndex, 1);
      saveData().then(renderPets);
    } else {
      alert("Můžeš smazat jen své vlastní záznamy.");
    }
  }
}

function addPet() {
  const name = document.getElementById("petNameInput").value.trim();
  if (!name) return;
  data.pets.push({ name, activities: [], vetVisits: [] });
  document.getElementById("petNameInput").value = "";
  saveData().then(renderPets);
}

function deletePet(petIndex) {
  if (confirm("Opravdu chcete smazat tohoto mazlíčka?")) {
    data.pets.splice(petIndex, 1);
    saveData().then(renderPets);
  }
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
