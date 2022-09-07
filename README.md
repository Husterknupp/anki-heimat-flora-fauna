# Heimat Flora & Fauna (Anki deck)

Highly opinionated list of interesting flowers and animals. Images mostly coming from Wikipedia.

You will need the CrowdAnki Addon: https://github.com/Stvad/CrowdAnki

## Share New Notes/Cards on GitHub

- ❗️ first import the latest & greates (notes will get lost in git if you don't run the import first)
- in Anki, open "File > Export" ![](screenshot-export.png)
- as destination dir, select any directory (probably outside this project to not commit the export)
- then, the exported content will live in a directory with the same name that it has in your Anki
- however the format of the export doesn't meet the expected git repo's format yet, so run this script before commiting

```sh
$ npm run after-export -- "<your-deck-folder>"
```

- this has now updated the notes and media info of this project
- 👍 review and commit the changes and you're done

## Import Other People's Note/Card Updates

CrowdAnki expects notes and media_files in a certain format, which includes your personal deck meta data (like learning steps).
While CrowdAnki will maintain your learning progress (even when a card receives an update), this script will help to update only the cards, not meta data.

- pull the latest changes from GitHub (probably branch `main`)
- no need to run the export first - CrowdAnki will not remove any notes from your deck in Anki
- run the merge script 👇 , which creates an updated deck.json in the `deck/` directory

```sh
$ npm run before-import -- "<your-deck-folder>"  # can be an old export - the deck meta data is the only relevant part here
```

- after the script did run, in Anki open "File > CrowdAnki: Import from disk"
- chose the `deck/` directory
- you may leave the default settings (don't tick the fields under "Einfach" to get the updated cards) ![](screenshot-import.png)
- 👍 You're done
