const fs = require("fs");

/* todo import
 * (after git pull)
 * ?? use current deck.json as deck.starter.json (only used by newcomers) ??
 * delete & .git-ignore deck.json
 * command `merge-into-deck.js [deck.json]` (user can use starter or own, used before deck.json):
 *   copy deck.json into backup/deck-[timestamp].json
 *   overwrite deck.json[media_files/notes] with corresponding json files
 * (now, do CrowdAnki import from disk)
 */

async function sortMediaFiles(deckFile, writeDeck = readDeck) {
  const deck = JSON.parse(await fs.readFileSync(deckFile, "utf-8"));
  deck.media_files.sort();
  fs.writeFileSync(writeDeck, JSON.stringify(deck, null, 2), {
    encoding: "utf-8",
  });
}

async function sortNotes(readDeck, writeDeck = readDeck) {
  const deck = JSON.parse(await fs.readFileSync(readDeck, "utf-8"));
  deck.notes.sort((a, b) => a.guid.localeCompare(b.guid));
  fs.writeFileSync(writeDeck, JSON.stringify(deck, null, 2), {
    encoding: "utf-8",
  });
}

const MEDIA_FILES_FILE = "./deck-media-files.json";
const NOTES_FILE = "./deck-notes.json";

/**
 * This should be run after you exported the deck from CrowdAnki. It will extract media and notes from your export.
 *
 * We will not commit the deck.json itself because meta data should be user-specific. Instead, for the import
 *  we re-assamble the deck.json based on things that we actually want to share in an extra step.
 *
 * You can now run git commit & push  🤓 Please check the diff before you commit.
 * You will see if you missed importing from remote before you exported.
 */
async function afterExport(exportFolderName) {
  // `$ node -e 'require("./import-export-helper.js").afterExport("A._Allgemeinwissen__Heimat_Flora_\&_Fauna")'`
  if (!fs.existsSync(exportFolderName)) {
    console.error(
      `Expected directory to read your CrowdAnki export from - but this does not exist: `
    );
    return 1;
  }

  const deck = JSON.parse(
    await fs.readFileSync(`${exportFolderName}/deck.json`, "utf-8")
  );

  deck.media_files.sort();
  fs.writeFileSync(
    MEDIA_FILES_FILE,
    JSON.stringify(deck.media_files, null, 2),
    {
      encoding: "utf-8",
    }
  );

  deck.notes.sort((a, b) => a.guid.localeCompare(b.guid));
  fs.writeFileSync(NOTES_FILE, JSON.stringify(deck.notes, null, 2), {
    encoding: "utf-8",
  });

  const exportedMedia = `${exportFolderName}/media`;
  for await (const maybeImage of await fs.opendirSync(exportedMedia)) {
    // NB: fs.cpSync comes with node v16+
    if (!maybeImage.isFile) continue;
    fs.copyFileSync(
      `${exportedMedia}/${maybeImage.name}`,
      `./media/${maybeImage.name}`
    );
  }
}

module.exports = { sortMediaFiles, sortNotes, afterExport };
