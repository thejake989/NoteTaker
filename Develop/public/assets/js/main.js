const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the text area.
let activeNote = {};

// Get notes Function
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// Save notes Function.
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// Delete notes from db function.
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

// Show active notes, otherwise show the empty input fields.
const renderActiveNote = () => {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// pulls the note data, saves it to the db, and updates the page.
const handleNoteSave = function () {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = function (event) {
  event.stopPropagation();

  const note = $(this).parent(".list-group-item").data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Displays the active note.
const handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

// No input, hides the save button.
const handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Shows note headers.
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = [];

  // Returns Jquery object for li with given text and delete button.
  const create$li = (text, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);

    if (withDeleteButton) {
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      $li.append($delBtn);
    }
    return $li;
  };

  if (notes.length === 0) {
    noteListItems.push(create$li("No saved Notes", false));
  }

  notes.forEach((note) => {
    const $li = create$li(note.title).data(note);
    noteListItems.push($li);
  });

  $noteList.append(noteListItems);
};

// pulls notes from the db and populates themon the sidebar.
const getAndRenderNotes = () => {
  return getNotes().then(renderNoteList);
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Shows initial list of notes.
getAndRenderNotes();
