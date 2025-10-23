import { DOMRefs } from "./DOM.js";
const dom = new DOMRefs();

export class UI {
    constructor(dom) {
        this.dom = dom;
    }

    openModal() {
        this.dom.modal.classList.remove('none');
    }

    closeModal(e) {
        e?.preventDefault?.();
        this.dom.modal.classList.add('none');
    }

    clearForm() {
        const { title, author, year, pages, status } = this.dom.fields;
        title.value = '';
        author.value = '';
        year.value = '';
        pages.value = '';
        status.checked = false;
    }

    toggleEmptyMessage(books) {
        this.dom.message.style.display = books.length ? 'none' : 'block';
    }

    setButtonState(isEditing) {
        const addBtn = this.dom.btns.add;
        if (isEditing) {
            addBtn.textContent = 'Save changes';
            addBtn.classList.add('saving');
        } else {
            addBtn.textContent = 'Add new book';
            addBtn.classList.remove('saving');
        }
    }


    renderBook(book, handlers) {
        const card = document.createElement('div');
        card.classList.add('book');
        if (book.status) card.classList.add('read');
        card.dataset.id = book.id;

        const title = document.createElement('span');
        title.textContent = `Title: ${book.title}`;

        const author = document.createElement('span');
        author.textContent = `Author: ${book.author}`;

        const year = document.createElement('span');
        year.textContent = `Release year: ${book.year}`;

        const pages = document.createElement('span');
        pages.textContent = `Pages: ${book.pages}`;

        const statusLabel = document.createElement('label');
        statusLabel.classList.add('status-block');

        const statusInput = document.createElement('input');
        statusInput.type = 'checkbox';
        statusInput.checked = book.status;

        const statusText = document.createElement('span');
        statusText.textContent = book.status ? 'Read' : 'Not read';

        statusInput.addEventListener('change', () => {
            handlers.onToggleStatus(book.id, statusInput.checked);
            statusText.textContent = statusInput.checked ? 'Read' : 'Not read';
            card.classList.toggle('read');
        });

        statusLabel.append(statusInput, statusText);

        const btns = document.createElement('div');
        btns.classList.add('buttons');

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit', 'btn');
        editBtn.type = 'button';
        editBtn.textContent = '⚙️';
        editBtn.addEventListener('click', () => handlers.onEdit(book.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete', 'btn');
        deleteBtn.type = 'button';
        deleteBtn.textContent = 'Х';
        deleteBtn.addEventListener('click', () => handlers.onDelete(book.id));

        btns.append(editBtn, deleteBtn);
        card.append(title, author, year, pages, statusLabel, btns);

        this.dom.library.append(card);
    }

    renderAll(books, handlers) {
        this.dom.library.innerHTML = '';
        books.forEach(book => this.renderBook(book, handlers));
    }
}
