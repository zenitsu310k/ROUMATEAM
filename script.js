let items = [];
let joueurs = [];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let angle = 0;
let vitesse = 0;

// ---- ROUE ----

function dessinerRoue() {
let total = items.length;
ctx.clearRect(0, 0, 450, 450);

if (total === 0) {
ctx.fillStyle = "white";
ctx.font = "16px Arial";
ctx.textAlign = "center";
ctx.fillText("Ajoute des noms pour voir la roue", 225, 225);
document.getElementById("compteurRoue").textContent =
"Éléments dans la roue : 0";
return;
}

let arc = (2 * Math.PI) / total;

for (let i = 0; i < total; i++) {
ctx.beginPath();
ctx.fillStyle = i % 2 === 0 ? "#ff0099" : "#6a00ff";
ctx.moveTo(225, 225);
ctx.arc(225, 225, 200, angle + i * arc, angle + (i + 1) * arc);
ctx.lineTo(225, 225);
ctx.fill();

ctx.save();
ctx.translate(225, 225);
ctx.rotate(angle + i * arc + arc / 2);
ctx.fillStyle = "white";
ctx.font = "14px Arial";
ctx.textAlign = "right";
ctx.fillText(items[i], 190, 5);
ctx.restore();
}

document.getElementById("compteurRoue").textContent =
"Éléments dans la roue : " + items.length;
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

items.forEach((item, index) => {
let li = document.createElement("li");
li.textContent = item + " ";

let btn = document.createElement("button");
btn.textContent = "❌";
btn.onclick = () => supprimerItem(index);

li.appendChild(btn);
liste.appendChild(li);
});
}

function supprimerItem(index) {
items.splice(index, 1);
afficherListe();
dessinerRoue();
}

function resetRoue() {
items = [];
afficherListe();
dessinerRoue();
document.getElementById("resultat").textContent = "---";
}

function spinWheel() {
if (items.length === 0) return;

vitesse = Math.random() * 0.4 + 0.3;
let ralentissement = 0.995;

let interval = setInterval(() => {
angle += vitesse;
vitesse *= ralentissement;
dessinerRoue();

if (vitesse < 0.002) {
clearInterval(interval);
let total = items.length;
let arc = (2 * Math.PI) / total;
let index = Math.floor(
(total - (angle % (2 * Math.PI)) / arc) % total
);
document.getElementById("resultat").textContent =
"🎯 Choisi : " + items[index];
}
}, 30);
}

function pleinEcran() {
canvas.requestFullscreen();
}

// ---- TOURNOI ----

function inscrireTournoi() {
let pseudo = document.getElementById("pseudoTournoi").value;

if (pseudo !== "") {
joueurs.push(pseudo);
afficherInscrits();
document.getElementById("pseudoTournoi").value = "";
document.getElementById("compteurTournoi").textContent =
"Joueurs inscrits : " + joueurs.length;
}
}

function afficherInscrits() {
let liste = document.getElementById("inscrits");
liste.innerHTML = "";

joueurs.forEach((joueur, index) => {
let li = document.createElement("li");
li.textContent = joueur + " ";

let btn = document.createElement("button");
btn.textContent = "❌";
btn.onclick = () => supprimerJoueur(index);

li.appendChild(btn);
liste.appendChild(li);
});
}

function supprimerJoueur(index) {
joueurs.splice(index, 1);
afficherInscrits();
document.getElementById("compteurTournoi").textContent =
"Joueurs inscrits : " + joueurs.length;
}

function melanger(array) {
for (let i = array.length - 1; i > 0; i--) {
let j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
return array;
}

function creerEquipes() {
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

// ---- CHRONO ----
let timer;
let secondes = 0;

function startTimer() {
clearInterval(timer);
timer = setInterval(() => {
secondes++;
let m = String(Math.floor(secondes / 60)).padStart(2, "0");
let s = String(secondes % 60).padStart(2, "0");
document.getElementById("minutes").textContent = m;
document.getElementById("secondes").textContent = s;
}, 1000);
}

function stopTimer() {
clearInterval(timer);
}

function resetTimer() {
clearInterval(timer);
secondes = 0;
document.getElementById("minutes").textContent = "00";
document.getElementById("secondes").textContent = "00";
}

// ---- SCORES ----
let score1 = 0;
let score2 = 0;

function ajouterPoint(equipe) {
if (equipe === 1) {
score1++;
document.getElementById("score1").textContent = score1;
} else {
score2++;
document.getElementById("score2").textContent = score2;
}
}

function resetScores() {
score1 = 0;
score2 = 0;
document.getElementById("score1").textContent = 0;
document.getElementById("score2").textContent = 0;
}

dessinerRoue();

function afficherPage(idPage) {
// Cacher toutes les pages
document.querySelectorAll(".page").forEach(page => {
page.classList.remove("active");
});

// Afficher uniquement la page demandée
document.getElementById(idPage).classList.add("active");
}

// Afficher l'accueil par défaut au chargement
afficherPage("accueil");



