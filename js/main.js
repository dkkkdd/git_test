import { DOMRefs } from "./DOM.js";
import { UI } from "./UI.js";
import { Book, Library, Validator } from "./logic.js";

const dom = new DOMRefs();
const ui = new UI(dom);
const validator = new Validator(dom);
const myLibrary = new Library(ui);



// ===== MAIN =====


dom.btns.add.addEventListener('click', (e) => {
    e.preventDefault();

    if (!validator.validate()) return;

    if (myLibrary.currentEditId) {
        myLibrary.saveChanges();
        return;
    }

    const { title, author, year, pages, status } = dom.fields;
    const book = new Book(
        crypto.randomUUID(),
        title.value,
        author.value,
        year.value,
        pages.value,
        status.checked
    );

    myLibrary.add(book);
    ui.clearForm();
    dom.modal.classList.add('none');
});


dom.btns.closeModal.addEventListener('click', (e) => {
    e.preventDefault();
    myLibrary.exitEditMode();
});

dom.btns.openModal.addEventListener('click', () => ui.openModal());
