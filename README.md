# Heimat Flora & Fauna (Anki deck)

Highly opinionated list of interesting flowers and animals. Images mostly coming from Wikipedia. Format: https://github.com/Stvad/CrowdAnki

## Export from Anki

- ❗️ first import from remote before you run the export (otherwise notes will get lost)
- in Anki, open "File > Export" ![](screenshot-export.png)
- as destination dir, select this project directory
- then, the exported content will live in a directory named like the deck is named in your Anki
- however the format doesn't yet meet the git repo's format, so run this script before commiting

```sh
$ npm run after-export -- "./Heimat_Flora_&_Fauna"
```

## Import from Disk

CrowdAnki expects notes and media_files in a certain format, which includes your personal deck meta data (like learning steps).
While CrowdAnki will maintain your learning progress (even when a card receives an update), this script will help to update only the cards, not meta data.

- pull the latest changes of the `main` branch
- export your personal deck to merge it with new updates
  - use CrowdAnki (see screenshot above)
  - copy it into `anki-heimat-flora-fauna`
- run the merge script, which creates an updated deck.json in `deck-latest`


```sh
$ npm run before-import -- "./<your-deck-folder>"
```

- after the script did run, in Anki open "File > CrowdAnki: Import from disk"
- chose `deck-latest` and leave the
- you may leave the default settings (don't tick the fields under "Einfach" to get the updated cards) ![](screenshot-import.png)
