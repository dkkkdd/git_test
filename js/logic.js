import { DOMRefs } from "./DOM.js";
import { UI } from "./UI.js";

const dom = new DOMRefs();
const ui = new UI(dom);

export class Book {
    constructor(id, title, author, year, pages, status) {
        Object.assign(this, { id, title, author, year, pages, status });
    }
}

export class Library {
    constructor(ui) {
        this.ui = ui;
        this.books = this.load();
        this.currentEditId = null;

        this.ui.renderAll(this.books, this.handlers());
        this.ui.toggleEmptyMessage(this.books);
    }

    handlers() {
        return {
            onEdit: (id) => this.edit(id),
            onDelete: (id) => this.remove(id),
            onToggleStatus: (id, status) => this.toggleStatus(id, status)
        };
    }

    add(book) {
        this.books.push(book);
        this.saveAndRender();
    }

    remove(id) {
        this.books = this.books.filter(b => b.id !== id);
        this.saveAndRender();
    }

    edit(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;

        this.currentEditId = id;
        const { title, author, year, pages, status } = this.ui.dom.fields;
        title.value = book.title;
        author.value = book.author;
        year.value = book.year;
        pages.value = book.pages;
        status.checked = book.status;

        this.ui.openModal();
        this.ui.setButtonState(true);
    }

    toggleStatus(id, newStatus) {
        const book = this.books.find(b => b.id === id);
        if (book) {
            book.status = newStatus;
            this.save();
        }
    }

    saveChanges() {
        if (!this.currentEditId) return;
        const { title, author, year, pages, status } = this.ui.dom.fields;
        const book = this.books.find(b => b.id === this.currentEditId);
        if (!book) return;

        Object.assign(book, {
            title: title.value,
            author: author.value,
            year: year.value,
            pages: pages.value,
            status: status.checked
        });

        this.exitEditMode();
        this.saveAndRender();
    }

    exitEditMode() {
        this.currentEditId = null;
        this.ui.setButtonState(false);
        this.ui.clearForm();
        this.ui.closeModal(new Event('fake'));
    }

    saveAndRender() {
        this.save();
        this.ui.renderAll(this.books, this.handlers());
        this.ui.toggleEmptyMessage(this.books);
    }

    save() {
        localStorage.setItem('library', JSON.stringify(this.books));
    }

    load() {
        try {
            return JSON.parse(localStorage.getItem('library')) || [];
        } catch {
            return [];
        }
    }
}

export class Validator {
    constructor(dom) {
        this.dom = dom;
    }

    validate() {
        const { title, author, year, pages } = this.dom.fields;
        const fields = [
            { input: title, min: 1, max: 50, msg: 'Поле обязательно для заполнения' },
            { input: author, min: 1, max: 50, msg: 'Поле обязательно для заполнения' },
            { input: year, min: 1, max: 2025, msg: 'Год должен быть от 1 до 2025' },
            { input: pages, min: 5, max: 5000, msg: 'Количество страниц должно быть от 5 до 5000' }
        ];

        let valid = true;

        fields.forEach(({ input, min, max, msg }) => {
            const value = input.value.trim();
            const errorSpan = input.nextElementSibling;

            if (!value) {
                this.setError(input, errorSpan, 'Поле обязательно для заполнения');
                valid = false;
                return;
            }

            if (input.type === 'number') {
                const num = Number(value);
                if (num < min || num > max) {
                    this.setError(input, errorSpan, msg);
                    valid = false;
                    return;
                }
            }

            this.clearError(input, errorSpan);
        });

        return valid;
    }

    setError(input, span, msg) {
        input.classList.add('error');
        if (span) span.textContent = msg;
    }

    clearError(input, span) {
        input.classList.remove('error');
        if (span) span.textContent = '';
    }
}