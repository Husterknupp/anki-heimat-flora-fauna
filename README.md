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

Note: CrowdAnki will maintain learning progress also when a card receives an update

- pull the latest changes of the `main` branch
- CrowdAnki expects notes and media_files in a certain format that also has your deck meta data (for the meta data, you need a former CrowdAnki export to run this script)

```sh
$ npm run before-import -- "./Heimat_Flora_&_Fauna"
```

- after the script did run, in Anki open "File > CrowdAnki: Import from disk"
- chose this project directory
- you may leave the default settings ![](screenshot-import.png)
