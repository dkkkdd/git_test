class GetDOM{
    constructor(){
        this.library = document.querySelector('.library');
        this.addBtn = document.querySelector('.add');
        this.title = document.querySelector('.title');
        this.author = document.querySelector('.author');
        this.year = document.querySelector('.year');
        this.pages = document.querySelector('.pages');
        this.statusBook = document.querySelector('.status');
        this.masagge = document.querySelector('.masagge');
    }


    clearForm(){
        this.title.value = '';
        this.author.value = '';
        this.year.value = '';
        this.pages.value = '';
        this.statusBook.checked = false;
    }

    validation() {
        const fields = [
            { input: this.title, min: 1, max: 50, message: 'Поле обязательно для заполнения' },
            { input: this.author, min: 1, max: 50, message: 'Поле обязательно для заполнения' },
            { input: this.year, min: 1, max: 2025, message: 'Год должен быть от 1 до 2025' },
            { input: this.pages, min: 5, max: 5000, message: 'Количество страниц должно быть от 5 до 5000' },
        ];

        let valid = true;

        fields.forEach(({ input, min, max, message }) => {
            const errorSpan = input.nextElementSibling;
            const value = input.value.trim();
            if (!value) {
                this.#setError(input, errorSpan, 'Поле обязательно для заполнения');
                valid = false;
                return;
            }
            if (input.type === 'number') {
                const num = Number(value);
                if (num < min || num > max) {
                    this.#setError(input, errorSpan, message);
                    valid = false;
                    return;
                }
            }

            this.#clearError(input, errorSpan);
        });

        return valid;
    }

    #setError(input, span, msg) {
        input.classList.add('error');
        if (span) span.textContent = msg;
    }

    #clearError(input, span) {
        input.classList.remove('error');
        if (span) span.textContent = '';
    }

    isBookInLibrary() {
        if (myLibrary.books.length === 0) {
            this.masagge.style.display = 'block';
        } else {
            this.masagge.style.display = 'none';
        }
    }

}


const dom = new GetDOM();

class Book{
    constructor(id, title, author, year, pages, status){
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.pages = pages;
        this._status = status;
    }

    get status() {
        return this._status;
    }

    set status(newStatus) {
        this._status = newStatus;
    }


}

class Library{
    constructor(){
        this.books = this.loadFromStorage();
    }

    addBook(book){
        this.books.push(book);
        this.renderOne(book);
        dom.isBookInLibrary();
        this.saveToStorage()
    }

    removeBook(id){
        this.books = this.books.filter(book => book.id !== id);
        const card = dom.library.querySelector(`[data-id="${id}"]`);
        if (card) card.remove(); 
        dom.isBookInLibrary()
        this.saveToStorage()
    }

    saveToStorage() {
        localStorage.setItem('library', JSON.stringify(this.books));
    }

    loadFromStorage() {
        const data = localStorage.getItem('library');
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch {
            console.error('Ошибка при чтении данных из localStorage');
            return [];
        }
    }

    getbookStatus(book){
        return book.status ? 'read' : 'not read';
    }


    renderOne(book) {
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

        const status = document.createElement('input');
        status.type = 'checkbox';
        status.checked = book.status;

        const statusText = document.createElement('span');
        statusText.textContent = book.status ? 'Read' : 'Not read';

        status.addEventListener('change', () => {
            book.status = status.checked;
            statusText.textContent = book.status ? 'Read' : 'Not read';
            card.classList.toggle('read');
            this.saveToStorage();
        });

        statusLabel.append(status, statusText);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete', 'btn');
        deleteBtn.textContent = 'Х';

        card.append(title, author, year, pages, statusLabel, deleteBtn);

        dom.library.append(card);
    }

    
    renderAll() {
        dom.library.innerHTML = '';
        this.books.forEach(book => this.renderOne(book));
    }
}

const myLibrary = new Library();
myLibrary.renderAll();
dom.isBookInLibrary();


dom.addBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const book = new Book(crypto.randomUUID(), dom.title.value, dom.author.value, dom.year.value, dom.pages.value, dom.statusBook.checked);
    if(dom.validation()){
        myLibrary.addBook(book);
        dom.clearForm();
    }
})

dom.library.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const id = e.target.closest('.book').dataset.id;
    myLibrary.removeBook(id);
  }
});

window.addEventListener('load', () => {
    dom.isBookInLibrary()
})