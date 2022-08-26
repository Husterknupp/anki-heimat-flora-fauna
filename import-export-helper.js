const fs = require("fs");

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
 * Run this after you exported the deck from CrowdAnki. It will extract media and notes from your export.
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

/**
 * Run this after you git pull'ed the latest updates.
 *
 * Based on a CrowdAnki export dir, this will merge notes and media_files with your deck meta data.
 * (Resulting deck.json will be .gitignore'd.)
 *
 * You can now run CrowdAnki import from disk functionality.
 */
async function beforeImport(exportFolderName) {
  // $ node -e 'require("./import-export-helper.js").beforeImport("A._Allgemeinwissen__Heimat_Flora_\&_Fauna")'
  const deckTemplate = JSON.parse(
    await fs.readFileSync(`${exportFolderName}/deck.json`, "utf-8")
  );
  deckTemplate.media_files = JSON.parse(
    await fs.readFileSync(MEDIA_FILES_FILE, "utf-8")
  );
  deckTemplate.notes = JSON.parse(await fs.readFileSync(NOTES_FILE, "utf-8"));
  fs.writeFileSync("./deck.json", JSON.stringify(deckTemplate, null, 2), {
    encoding: "utf-8",
  });
}

module.exports = { sortMediaFiles, sortNotes, afterExport, beforeImport };
