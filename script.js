let items = [];
let joueurs = [];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let angle = 0;
let vitesse = 0;
let enRotation = false;

// Son de la roue
const sonRoue = new Audio("https://www.soundjay.com/button/sounds/button-3.mp3");

// ---------- ROUE ----------

function dessinerRoue() {
let total = items.length;

ctx.clearRect(0, 0, 400, 400);

if (total === 0) {
ctx.fillStyle = "white";
ctx.font = "16px Arial";
ctx.textAlign = "center";
ctx.fillText("Ajoute des noms pour voir la roue", 200, 200);
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
ctx.font = "14px Arial";
ctx.textAlign = "right";
ctx.fillText(items[i], 170, 5);
ctx.restore();
}

mettreAJourCompteur();
}

function mettreAJourCompteur() {
document.getElementById("compteurRoue").textContent =
"Éléments dans la roue : " + items.length;
}

// Ajouter un élément
function ajouterItem() {
let valeur = document.getElementById("inputItem").value;
if (valeur !== "") {
items.push(valeur);
afficherListe();
document.getElementById("inputItem").value = "";
dessinerRoue();
}
}

// Supprimer un élément
function supprimerItem(index) {
items.splice(index, 1);
afficherListe();
dessinerRoue();
}

// Afficher liste avec boutons supprimer
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

// Réinitialiser la roue
function resetRoue() {
items = [];
afficherListe();
dessinerRoue();
document.getElementById("resultat").textContent = "---";
}

// Lancer la roue (plus fluide)
function spinWheel() {
if (items.length === 0) {
document.getElementById("resultat").textContent = "Ajoute des noms !";
return;
}

enRotation = true;
vitesse = Math.random() * 0.3 + 0.2;
sonRoue.play();

let ralentissement = 0.995;

let interval = setInterval(() => {
angle += vitesse;
vitesse *= ralentissement;
dessinerRoue();

if (vitesse < 0.002) {
clearInterval(interval);
enRotation = false;
sonRoue.pause();

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

// ---------- TOURNOI AMÉLIORÉ ----------

function inscrireTournoi() {
let pseudo = document.getElementById("pseudoTournoi").value;

if (pseudo !== "") {
joueurs.push(pseudo);
afficherInscrits();
document.getElementById("pseudoTournoi").value = "";
mettreAJourCompteurTournoi();
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
mettreAJourCompteurTournoi();
}

function mettreAJourCompteurTournoi() {
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

// Dessiner la roue au chargement
dessinerRoue();
