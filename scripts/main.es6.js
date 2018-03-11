"use strict";
class StickyNotesApp {
  constructor() {}
  saveNote() {
    if (this.noteMessageInput.value) {
      var key = Date.now().toString();
      localStorage.setItem(key, this.noteMessageInput.value);
      this.displayNote(key, this.noteMessageInput.value);
      StickyNotesApp.resetMaterialTextfield(this.noteMessageInput);
      this.toggleButton();
    }
  }
  static resetMaterialTextfield(element) {
    element.value = "";
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
    element.blur();
  }
  displayNote(key, message) {
    var note = document.getElementById(key);
    // If no element with the given key exists we create a new note.
    if (!note) {
      note = document.createElement("sticky-note");
      note.id = key;
      this.notesContainer.insertBefore(
        note,
        this.notesSectionTitle.nextSibling
      );
    }
    // If the message is null we delete the note.
    if (!message) {
      return note.deleteNote();
    }
    note.setMessage(message);
  }
  toggleButton() {
    if (this.noteMessageInput.value) {
      this.addNoteButton.removeAttribute("disabled");
    } else {
      this.addNoteButton.setAttribute("disabled", "true");
    }
  }
}

// Shortcuts to DOM Elements.
this.notesContainer = document.getElementById("notes-container");
this.noteMessageInput = document.getElementById("message");
this.addNoteButton = document.getElementById("save");
this.notesSectionTitle = document.getElementById("notes-section-title");

// Saves notes on button click.
this.addNoteButton.addEventListener("click", () => this.saveNote());

// Toggle for the button.
this.noteMessageInput.addEventListener("keyup", () => this.toggleButton());

// Loads all the notes.
for (var key in localStorage) {
  this.displayNote(key, localStorage[key]);
}

// Listen for updates to notes from other windows.
window.addEventListener("storage", e => {
  this.displayNote(e.key, e.newValue);
});

// On load start the app.
window.addEventListener("load", () => new StickyNotesApp());

// A Sticky Note custom element that extends HTMLElement.
var StickyNote = Object.create(HTMLElement.prototype);

class StickyNote extends HTMLElement {
  createdCallback() {
    StickyNote.CLASSES.forEach(
      function(klass) {
        this.classList.add(klass);
      }.bind(this)
    );
    this.innerHTML = StickyNote.TEMPLATE;
    this.messageElement = this.querySelector(".message");
    this.dateElement = this.querySelector(".date");
    this.deleteButton = this.querySelector(".delete");
    this.deleteButton.addEventListener("click", this.deleteNote.bind(this));
  }

  attributeChangedCallback(attributeName) {
    // We display/update the created date message if the id changes.
    if (attributeName == "id") {
      if (this.id) {
        var date = new Date(parseInt(this.id));
      } else {
        var date = new Date();
      }
      var month = StickyNote.MONTHS[date.getMonth()];
      this.dateElement.textContent =
        "Created on " + month + " " + date.getDate();
    }
  }

  setMessage(message) {
    this.messageElement.textContent = message;
    // Replace all line breaks by <br>.
    this.messageElement.innerHTML = this.messageElement.innerHTML.replace(
      /\n/g,
      "<br>"
    );
  }
  deleteNote() {
    localStorage.removeItem(this.id);
    this.parentNode.removeChild(this);
  }
}

// Initial content of the element.
StickyNote.TEMPLATE =
  '<div class="message"></div>' +
  '<div class="date"></div>' +
  '<button class="delete mdl-button mdl-js-button mdl-js-ripple-effect">' +
  "Delete" +
  "</button>";

// StickyNote elements top level style classes.
StickyNote.CLASSES = [
  "mdl-cell--4-col-desktop",
  "mdl-card__supporting-text",
  "mdl-cell--12-col",
  "mdl-shadow--2dp",
  "mdl-cell--4-col-tablet",
  "mdl-card",
  "mdl-cell",
  "sticky-note"
];

// List of shortened month names.
StickyNote.MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

// Fires when an attribute of the element is added/deleted/modified.
// StickyNote.attributeChangedCallback = function(attributeName) {};

// Sets the message of the note.
// StickyNote.setMessage = function(message) {};

// Deletes the note by removing the element from the DOM and the data from localStorage.
// StickyNote.deleteNote = function() {};

document.registerElement("sticky-note", StickyNote);
