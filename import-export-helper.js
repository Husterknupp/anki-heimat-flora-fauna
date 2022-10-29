const fs = require("fs");

const MEDIA_FILES_FILE = "./deck/media-files.json";
const NOTES_FILE = "./deck/notes.json";
const DECK_FILE = "./deck/deck.json";
const MEDIA_DIR = "./deck/media";

function readFileAsJson(fileName) {
  return JSON.parse(fs.readFileSync(fileName, "utf-8"));
}

function writeJsonToFile(fileName, content) {
  fs.writeFileSync(fileName, JSON.stringify(content, null, 2), {
    encoding: "utf-8",
  });
}

function sanityCheckNoteModels(deck) {
  const note_models = deck.note_models.map(
    (note_model) => note_model.crowdanki_uuid
  );

  const problem = deck.notes
    .map((note) => note.note_model_uuid)
    .find((id) => !note_models.includes(id));

  if (problem) {
    console.warn(
      `[WARNING] One of the notes' note_model ID does not exist in your deck meta data. Look at ID '${problem}' in ${NOTES_FILE} .`
    );
  }
}

/**
 * Run this after you git pull'ed the latest updates.
 *
 * Based on a CrowdAnki export directory, this will merge notes and media_files with that directory's deck meta data.
 * (The resulting deck.json will be .gitignore'd.)
 *
 * You can now run CrowdAnki import from disk functionality.
 */
async function beforeImport(exportDirName) {
  const deckTemplate = readFileAsJson(`${exportDirName}/deck.json`);
  deckTemplate.media_files = readFileAsJson(MEDIA_FILES_FILE);
  deckTemplate.notes = readFileAsJson(NOTES_FILE);

  sanityCheckNoteModels(deckTemplate);
  writeJsonToFile(DECK_FILE, deckTemplate);
}

async function copyMedia(from, to) {
  let count = 0;
  for await (const maybeImage of await fs.opendirSync(from)) {
    // NB: fs.cpSync comes with node v16+
    if (!maybeImage.isFile) continue;
    fs.copyFileSync(`${from}/${maybeImage.name}`, `${to}/${maybeImage.name}`);
    count++;
  }
  return count;
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
function afterExport(exportDirName) {
  const { media_files, notes } = readFileAsJson(`${exportDirName}/deck.json`);

  media_files.sort();
  writeJsonToFile(MEDIA_FILES_FILE, media_files);

  notes.sort((a, b) => a.guid.localeCompare(b.guid));
  writeJsonToFile(NOTES_FILE, notes);

  copyMedia(`${exportDirName}/media`, MEDIA_DIR).then((count) => {
    console.log(`Wrote json files and copied ${count} images`);
  });
}

function verifyExists(directory) {
  if (!fs.existsSync(directory)) {
    throw Error(`Directory does not exist: ${directory}`);
  }
}

function run() {
  const exportDirName = process.argv[3];
  if (exportDirName) {
    verifyExists(exportDirName);
  } else {
    console.error(
      'Usage: $ npm run [after-export|before-import] -- "./Heimat_Flora_&_Fauna"\n'
    );
    throw Error("Missing export directory argument");
  }

  // todo remember commit history (at which commit did the command run the last time?)
  // In case I accidentally pulled already, I can reset to that state
  // and git is able to show a merge conflict
  // -> this is probably more effective as a git-hook that runs after every git-pull
  // todo print out helper for next step: before-import: Which directory to import | after-export: no. of files moved or something
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
  run();
  console.log("Done.");
} catch (e) {
  console.error(e);
}
