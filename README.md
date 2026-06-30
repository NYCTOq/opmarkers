# OP Tayfa Hizmet

**OP Tayfa Hizmet** is a custom Owlbear Rodeo extension designed for tabletop RPG games, especially D&D and One Piece inspired campaigns.

It provides simple tools for tracking character conditions, aura areas, and dice rolls directly inside Owlbear Rodeo.

## Features

### Condition Markers

Add visual condition icons above selected tokens.

Current condition markers include:

* Concentration
* Bless
* Rage
* Poisoned
* Prone
* Haki
* Busoshoku Haki
* Advantage
* Disadvantage

Each marker uses a custom PNG icon and can be added or removed from a token with a simple dropdown menu.

### Aura Markers

Add circular aura areas around selected tokens.

Available aura sizes:

* 5 ft
* 10 ft
* 15 ft
* 20 ft
* 30 ft
* 60 ft

Auras are attached to the selected token and move with it.

### Dice Roller

The extension includes a built-in dice roller with support for:

* d4
* d6
* d8
* d10
* d12
* d20
* d100

You can stack multiple dice groups before rolling.

Example:

```text
2d6 + 3d12 + 5
```

The dice roller also supports repeat rolls for cases like rolling multiple attacks separately.

Example:

```text
1d20 + 5 repeated 2 times
```

Results are shown separately instead of being combined.

### Roll History

The extension keeps the last 10 dice results in the panel history.

## How to Use

1. Open Owlbear Rodeo.
2. Add the extension using the manifest URL.
3. Select a token on the scene.
4. Open the extension panel.
5. Add condition markers, aura markers, or use the dice roller.

## Manifest URL

Use this URL to install the extension in Owlbear Rodeo:

```text
https://nyctoq.github.io/opmarkers/manifest.json
```

## Project Structure

```text
public/
  manifest.json
  icons/
    Advantage.png
    Bless.png
    Busoshoku Haki.png
    Concentration.png
    Disadvantage.png
    Haki.png
    Poisoned.png
    Prone.png
    Rage.png

src/
  main.js
  style.css
```

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

## Deployment

This project is deployed with GitHub Pages using GitHub Actions.

After making changes, push them to the `main` branch:

```bash
git add .
git commit -m "Update extension"
git push
```

GitHub Actions will automatically build and deploy the extension.

## Notes

This extension was originally created for a private One Piece themed D&D campaign, but it can be used or modified for any Owlbear Rodeo tabletop game.

Feel free to fork, customize, and use it in your own games.
