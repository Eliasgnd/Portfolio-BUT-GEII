# Portfolio BUT GEII ESE

Site statique pour le portfolio BUT GEII ESE.

## Lancer en local

Depuis `C:\Users\Utilisateur\Desktop\Portfolio` :

```powershell
python -m http.server 4174 --directory site
```

Puis ouvrir :

```text
http://127.0.0.1:4174
```

## Structure

- `index.html` : contenu du portfolio, projets détaillés et matrice des apprentissages critiques.
- `styles.css` : direction visuelle sobre, layout responsive, composants.
- `assets/` : captures, icônes et preuves visuelles utilisées dans le site.
- `assets/evidence/` : images classées par projet (`fpga`, `kart`, `interfacegps`, `stage`).

Le site ne dépend pas de JavaScript pour l'affichage : les ancres, les fiches projets et le responsive fonctionnent en HTML/CSS.

## Suite à compléter

- Ajouter si possible des photos réelles de la machine de découpe ou du montage Raspberry/STM32.
- Ajouter des photos de montage FPGA/Raspberry Pi si disponibles.
- Ajouter des liens directs vers les documents ou commits qui servent de preuves.
