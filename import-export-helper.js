const fs = require("fs");

const MEDIA_FILES_FILE = "./deck/media-files.json";
const NOTES_FILE = "./deck/notes.json";
const DECK_FILE = "./deck/deck.json";

/**
 * Run this after you git pull'ed the latest updates.
 *
 * Based on a CrowdAnki export directory, this will merge notes and media_files with that directory's deck meta data.
 * (The resulting deck.json will be .gitignore'd.)
 *
 * You can now run CrowdAnki import from disk functionality.
 */
async function beforeImport(exportDirName) {
  const deckTemplate = JSON.parse(
    await fs.readFileSync(`${exportDirName}/deck.json`, "utf-8")
  );
  deckTemplate.media_files = JSON.parse(
    await fs.readFileSync(MEDIA_FILES_FILE, "utf-8")
  );
  deckTemplate.notes = JSON.parse(await fs.readFileSync(NOTES_FILE, "utf-8"));
  fs.writeFileSync(DECK_FILE, JSON.stringify(deckTemplate, null, 2), {
    encoding: "utf-8",
  });
}

/**
 * Run this after you exported the deck from CrowdAnki. It will extract media and notes from your export.
 *
 * We will not commit the deck.json itself because meta data is user-specific.
 * Instead, in an extra step, for the import we will re-assamble the deck.json.
 *
 * You can now run git commit & push  🤓 Please check the diff before you commit.
 * You will see if you missed importing from remote before you exported.
 */
async function afterExport(exportDirName) {
  const { media_files, notes } = JSON.parse(
    await fs.readFileSync(`${exportDirName}/deck.json`, "utf-8")
  );

  media_files.sort();
  fs.writeFileSync(MEDIA_FILES_FILE, JSON.stringify(media_files, null, 2), {
    encoding: "utf-8",
  });

  notes.sort((a, b) => a.guid.localeCompare(b.guid));
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), {
    encoding: "utf-8",
  });

  const exportedMedia = `${exportDirName}/media`;
  for await (const maybeImage of await fs.opendirSync(exportedMedia)) {
    // NB: fs.cpSync comes with node v16+
    if (!maybeImage.isFile) continue;
    fs.copyFileSync(
      `${exportedMedia}/${maybeImage.name}`,
      `./deck/media/${maybeImage.name}`
    );
  }
}

function verifyExists(directory) {
  if (!fs.existsSync(directory)) {
    throw Error(`Directory does not exist: ${directory}`);
  }
}

function runMethod() {
  const exportDirName = process.argv[3];
  if (exportDirName) {
    verifyExists(exportDirName);
  } else {
    console.error(
      'Usage: $ npm run [after-export|before-import] -- "./Heimat_Flora_&_Fauna"\n'
    );
    throw Error("Missing export directory argument");
  }

  const methodName = process.argv[2];
  switch (methodName) {
    case "beforeImport": {
      return beforeImport(exportDirName);
    }
    case "afterExport": {
      return afterExport(exportDirName);
    }
    default: {
      throw Error(
        `Expected a method name to execute. But ${methodName} does not exist.`
      );
    }
  }
}

try {
  runMethod();
  console.log("Done.");
} catch (e) {
  console.error(e);
}
