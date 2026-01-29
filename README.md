# 🎹 Keyboard Survivor: Tentacle Siege

**Keyboard Survivor** est un jeu de survie/action en 3D développé avec **Three.js**. La particularité ? Votre terrain de jeu est votre propre clavier. Déplacez-vous sur les touches, tapez des mots pour lancer des sorts et survivez aux vagues d'insectes avant l'arrivée du Boss final : la Tentacule.

---

## 🚀 Fonctionnalités

* **Système de Sorts par Mots-Clés** : Tapez des mots spécifiques (ex: `fire`, `heal`, `circle`) pour déclencher des pouvoirs magiques.
* **Mouvements Dynamiques** : Le joueur et les ennemis sautent de touche en touche avec un effet de *Squash & Stretch* (déformation élastique) pour un rendu organique.
* **Pathfinding A*** : Les ennemis utilisent l'algorithme A* pour calculer le chemin le plus court sur la grille de votre clavier afin de vous traquer.
* **Boss Fight** : Un boss géant (Yameter) apparaît après 30 secondes avec une interface dédiée et une barre de vie stylisée en bois sombre et doré.
* **Feedback Visuel** : Secousses de caméra (*Screen Shake*), vignettes de dégâts rouges à l'écran et barres de vie dynamiques.

---

## 🎮 Commandes

| Action | Commande |
| :--- | :--- |
| **Déplacement** | Appuyez sur n'importe quelle touche de votre clavier physique pour vous y rendre. |
| **Lancer un Sort** | Tapez le mot complet au clavier (ex: `F` + `I` + `R` + `E`). |
| **Effacer un mot** | `Backspace` (Retour arrière). |
| **Sort de Zone** | Tapez le mot `CIRCLE`. |
| **Soin** | Tapez le mot `HEAL`. |

---

## 🛠️ Architecture Technique

Le projet suit une structure orientée objet pour faciliter la maintenance :
...
...
...

---

## 📦 Installation & Lancement

1.  **Cloner le projet** :
    ```bash
    git clone [https://github.com/votre-username/keyboard-survivor.git](https://github.com/votre-username/keyboard-survivor.git)
    ```
2.  **Installer les dépendances** :
    ```bash
    npm install
    ```
3.  **Lancer le jeu** :
    ```bash
    npm run dev
    ```

---

## 📐 Système de Coordonnées

Le jeu utilise un système de mapping entre une grille logique et le monde 3D :
* **Grille Logique** : Les touches sont espacées de 1 unité (0, 1, 2...).
* **Monde 3D** : Un multiplicateur `spacing` de **3.2** est appliqué pour correspondre à la taille des modèles 3D du clavier.
* **Collisions** : Calculées sur l'axe X et l'axe Z (représenté par `y` dans la logique 2D).

---

## 📝 Sorts Implémentés

* 🔥 **FIRE** : Lance un projectile vers l'ennemi le plus proche.
* ☢️ **NUKE** : Sort de débug infligeant 10 000 points de dégâts.
* 💚 **HEAL** : Restaure 30 HP au héros.
* ⭕ **CIRCLE** : Crée une zone de flammes protectrice autour du joueur.

---

**Développé avec Passion et Three.js 🚀**
