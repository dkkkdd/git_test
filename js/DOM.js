export class DOMRefs {
    constructor() {
        this.modal = document.querySelector('.modal-window');
        this.library = document.querySelector('.library');
        this.form = document.querySelector('form');
        this.fields = {
            title: document.querySelector('.title'),
            author: document.querySelector('.author'),
            year: document.querySelector('.year'),
            pages: document.querySelector('.pages'),
            status: document.querySelector('.status')
        };
        this.btns = {
            add: document.querySelector('.add'),
            openModal: document.querySelector('.open-modal'),
            closeModal: document.querySelector('.close-modal')
        };
        this.message = document.querySelector('.message');
    }
}