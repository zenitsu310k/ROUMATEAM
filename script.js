let items = [];
let joueurs = [];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
let angle = 0;
let spinning = false;

// ---------- ROUE DE HASARD ----------

function dessinerRoue() {
let total = items.length;
if (total === 0) {
ctx.clearRect(0, 0, 400, 400);
ctx.fillStyle = "white";
ctx.fillText("Ajoute des noms", 150, 200);
return;
}

let arc = (2 * Math.PI) / total;

for (let i = 0; i < total; i++) {
ctx.beginPath();
ctx.fillStyle = i % 2 === 0 ? "#ff0099" : "#6a00ff";
ctx.moveTo(200, 200);
ctx.arc(200, 200, 180, angle + i * arc, angle + (i + 1) * arc);
ctx.lineTo(200, 200);
ctx.fill();

ctx.save();
ctx.translate(200, 200);
ctx.rotate(angle + i * arc + arc / 2);
ctx.fillStyle = "white";
ctx.fillText(items[i], 100, 0);
ctx.restore();
}
}

function ajouterItem() {
let valeur = document.getElementById("inputItem").value;
if (valeur !== "") {
items.push(valeur);
afficherListe();
document.getElementById("inputItem").value = "";
dessinerRoue();
}
}

function afficherListe() {
let liste = document.getElementById("liste");
liste.innerHTML = "";
items.forEach(item => {
let li = document.createElement("li");
li.textContent = item;
liste.appendChild(li);
});
}

function spinWheel() {
if (items.length === 0) {
document.getElementById("resultat").textContent = "Ajoute des noms !";
return;
}

spinning = true;
let rotations = 0;
let interval = setInterval(() => {
angle += 0.2;
dessinerRoue();
rotations++;

if (rotations > 60) {
clearInterval(interval);
spinning = false;
let index = Math.floor((items.length - (angle / (2 * Math.PI)) * items.length) % items.length);
document.getElementById("resultat").textContent = "🎯 Choisi : " + items[index];
}
}, 50);
}

// ---------- TOURNOI ----------

function inscrireTournoi() {
let pseudo = document.getElementById("pseudoTournoi").value;

if (pseudo !== "") {
joueurs.push(pseudo);
afficherInscrits();
document.getElementById("pseudoTournoi").value = "";
}
}

function afficherInscrits() {
let liste = document.getElementById("inscrits");
liste.innerHTML = "";

joueurs.forEach(joueur => {
let li = document.createElement("li");
li.textContent = joueur;
liste.appendChild(li);
});
}

function melanger(array) {
for (let i = array.length - 1; i > 0; i--) {
let j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
return array;
}

function creerEquipes() {
if (joueurs.length === 0) return;

let mode = parseInt(document.getElementById("mode").value);
let joueursMelanges = melanger([...joueurs]);
let equipesDiv = document.getElementById("equipes");
equipesDiv.innerHTML = "";

let equipeNum = 1;

for (let i = 0; i < joueursMelanges.length; i += mode) {
let equipe = joueursMelanges.slice(i, i + mode);
let p = document.createElement("p");
p.textContent = `Équipe ${equipeNum} : ` + equipe.join(" + ");
equipesDiv.appendChild(p);
equipeNum++;
}
}
