// ================== NAVIGATION DES PAGES ==================

function afficherPage(idPage) {
document.querySelectorAll(".page").forEach(page => {
page.classList.remove("active");
});
document.getElementById(idPage).classList.add("active");
}

// Afficher l'accueil par défaut au chargement
afficherPage("accueil");

// ================== VARIABLES GLOBALES ==================

let items = [];      // Pour la roue
let joueurs = [];    // Pour le tournoi

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let angle = 0;
let vitesse = 0;
let indexGagnant = -1; // Pour l’effet néon sur la part gagnante

// 🔊 SON DE LA ROUE
const sonRoue = new Audio(
"https://www.soundjay.com/casino/sounds/roulette-spin-01.mp3"
);
sonRoue.loop = true;

// ================== ROUE DE HASARD ==================

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
let centreX = 225;
let centreY = 225;
let rayon = 200;

// Ombre globale de la roue
ctx.shadowColor = "rgba(255, 0, 153, 0.5)";
ctx.shadowBlur = 15;

for (let i = 0; i < total; i++) {

let gradient = ctx.createRadialGradient(
centreX, centreY, 50,
centreX, centreY, rayon
);

// ---- EFFET NÉON SUR LA PART GAGNANTE ----
if (i === indexGagnant) {
gradient.addColorStop(0, "#00ffff");
gradient.addColorStop(1, "#00aaff");
ctx.shadowColor = "rgba(0, 255, 255, 0.9)";
ctx.shadowBlur = 25;
} else {
if (i % 2 === 0) {
gradient.addColorStop(0, "#ff33aa");
gradient.addColorStop(1, "#ff0099");
} else {
gradient.addColorStop(0, "#8a00ff");
gradient.addColorStop(1, "#6a00ff");
}
ctx.shadowColor = "rgba(255, 0, 153, 0.5)";
ctx.shadowBlur = 15;
}

ctx.beginPath();
ctx.moveTo(centreX, centreY);
ctx.fillStyle = gradient;
ctx.arc(
centreX,
centreY,
rayon,
angle + i * arc,
angle + (i + 1) * arc
);
ctx.lineTo(centreX, centreY);
ctx.fill();

// Bordures entre les parts
ctx.strokeStyle = "white";
ctx.lineWidth = 2;
ctx.stroke();

// Texte des items
ctx.save();
ctx.translate(centreX, centreY);
ctx.rotate(angle + i * arc + arc / 2);
ctx.fillStyle = "white";
ctx.font = "bold 14px Arial";
ctx.textAlign = "right";
ctx.fillText(items[i], rayon - 20, 5);
ctx.restore();
}

// Cercle central (style tournoi)
ctx.beginPath();
ctx.fillStyle = "#111";
ctx.arc(centreX, centreY, 35, 0, 2 * Math.PI);
ctx.fill();

ctx.beginPath();
ctx.strokeStyle = "#ff0099";
ctx.lineWidth = 4;
ctx.arc(centreX, centreY, 35, 0, 2 * Math.PI);
ctx.stroke();

document.getElementById("compteurRoue").textContent =
"Éléments dans la roue : " + items.length;
}

// ---------- AJOUTER / SUPPRIMER DES ÉLÉMENTS ----------

function ajouterItem() {
let valeur = document.getElementById("inputItem").value;
if (valeur !== "") {
items.push(valeur);
afficherListe();
document.getElementById("inputItem").value = "";
indexGagnant = -1;
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
indexGagnant = -1;
afficherListe();
dessinerRoue();
}

function resetRoue() {
items = [];
indexGagnant = -1;
afficherListe();
dessinerRoue();
document.getElementById("resultat").textContent = "---";
}

// ---------- LANCER LA ROUE (SON + NÉON FINAL) ----------

function spinWheel() {
if (items.length === 0) return;

indexGagnant = -1;
vitesse = Math.random() * 0.35 + 0.25; // vitesse de départ plus basse
let ralentissement = 0.997; // ralentit plus vite

// Lancer le son
sonRoue.currentTime = 0;
sonRoue.play();

let interval = setInterval(() => {
angle += vitesse;
vitesse *= ralentissement;
dessinerRoue();

if (vitesse < 0.004) {
clearInterval(interval);

// Arrêter le son
sonRoue.pause();

let total = items.length;
let arc = (2 * Math.PI) / total;

// Calcul de l’index gagnant
indexGagnant = Math.floor(
(total - (angle % (2 * Math.PI)) / arc) % total
);

// Redessiner pour montrer l’effet néon
dessinerRoue();

document.getElementById("resultat").textContent =
"🎯 Choisi : " + items[indexGagnant];
}
}, 25);
}

function pleinEcran() {
canvas.requestFullscreen();
}

// ================== TOURNOI ==================

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

// ================== CHRONOMÈTRE ==================

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

// ================== SCORES ==================

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

// Dessiner la roue au chargement
dessinerRoue();

