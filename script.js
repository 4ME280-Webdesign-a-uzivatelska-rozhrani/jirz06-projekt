const petsContainer = document.getElementById("pets");
const binId = "68379ebf8960c979a5a26a7c"; // <-- Změň na svůj BIN ID z JSONBin
const apiKey = "$2a$10$qNV2tGipYXuFW3167xxgveC1QFEU7D.1fB.aARUKWmvB2htsyVee6";
// <-- Změň na svůj tajný klíč

let data = { pets: [] };

// Načti data z JSONBin
async function loadData() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    headers: { "X-Master-Key": apiKey }
  });
  const json = await res.json();
  data = json.record;
  renderPets();
}

// Ulož data do JSONBin
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

// Přidat mazlíčka
function addPet() {
  const name = document.getElementById("petNameInput").value.trim();
  if (!name) return;
  data.pets.push({ name, activities: [] });
  document.getElementById("petNameInput").value = "";
  saveData().then(renderPets);
}

// Přidat aktivitu pro mazlíčka
function addActivity(petIndex, inputId) {
  const input = document.getElementById(inputId);
  const activity = input.value.trim();
  if (!activity) return;
  data.pets[petIndex].activities.push({ name: activity, assignedTo: null });
  input.value = "";
  saveData().then(renderPets);
}

// Zapsat se na aktivitu
function assignActivity(petIndex, activityIndex) {
  const who = prompt("Zadej své jméno pro zapsání:");
  if (!who) return;
  data.pets[petIndex].activities[activityIndex].assignedTo = who;
  saveData().then(renderPets);
}

// Vykreslit mazlíčky a aktivity
function renderPets() {
  petsContainer.innerHTML = "";
  data.pets.forEach((pet, i) => {
    const card = document.createElement("div");
    card.className = "pet-card";
    card.innerHTML = `<h2>${pet.name}</h2>
      <input type="text" id="activity-${i}" placeholder="Nová aktivita" />
      <button onclick="addActivity(${i}, 'activity-${i}')">Přidat</button>
      <div>
        ${pet.activities.map((act, j) => `
          <div class="activity">
            <strong>${act.name}</strong><br/>
            ${act.assignedTo ? `Zapsal se: <em>${act.assignedTo}</em>` :
              `<button onclick="assignActivity(${i}, ${j})">Zapsat se</button>`}
          </div>`).join("")}
      </div>`;
    petsContainer.appendChild(card);
  });
}

// Načtení při startu
loadData();
