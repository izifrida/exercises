// When we click on Edit in table th form mode will set it to editing book id
let editingBookId;

// If pressed "edit" we will fecth book by it's id, and fill in the form
function onEditClick(event) {
    const bookId = event.target.dataset.editId;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => onGetBookResponse(xhr, bookId);
    xhr.open('GET', '/books/' + bookId, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}

function onGetBookResponse(xhr, bookId) {
    try {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            // Fill in form
            if (xhr.status == 200) {
                const book = JSON.parse(xhr.responseText);

                // Change form header
                const header = document.getElementsByTagName('h4')[0];
                header.textContent = 'Edit Book'

                const form = document.forms.bookForm;
                form.elements.title.value = book.title;
                form.elements.author.value = book.author;
                form.elements.category.value = book.category;

                editingBookId = bookId;
                form.scrollIntoView();
            }
            else
                window.alert('There was a problem with this request.');
        }
    }
    catch (e) {
        window.alert('Exception caught: ' + e.description);
    }
}

// SubmitForm
// Depending on form mode ('ADD' or 'EDIT') we wil create new or update 
function onFormSubmit() {
    if (editingBookId) {
        updateBook(editingBookId)
    } else {
        createNewBook();
    }

}

// Create new book
function createNewBook() {
    const form = document.forms.bookForm;

    const data_to_send = {
        title: form.elements.title.value,
        author: form.elements.author.value,
        category: form.elements.category.value
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => onCreateResponse(xhr);
    xhr.open('POST', '/books', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data_to_send));
}

function onCreateResponse(xhr) {
    try {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            // Add new row
            if (xhr.status == 200) {
                const book = JSON.parse(xhr.responseText);

                const table = document.getElementsByTagName('table')[0];

                const newRow = document.createElement('tr');
                newRow.setAttribute('id', book._id)
                newRow.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td> 
                    <td>${book.category}</td> 
                    <td>
                        <a href='#' onclick="onEditClick(event)" data-edit-id="${book._id}">Edit</a>
                    </td> 
                    <td>
                        <a href='#' onclick="deleteBook(event)" data-delete-id="${book._id}">Delete</a>
                    </td> 
                `

                table.appendChild(newRow);
                document.forms.bookForm.reset()
            }
            else
                window.alert('There was a problem with this request.');
        }
    }
    catch (e) {
        window.alert('Exception caught: ' + e.description);
    }
}

// Delete book
function deleteBook(event) {
    // We saved book id in data- attribute "data-delete-id
    const bookId = event.target.dataset.deleteId;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => onDeleteResponse(xhr, bookId);
    xhr.open('DELETE', '/books/' + bookId, true);
    xhr.send(null);
}

function onDeleteResponse(xhr, bookId) {
    try {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            // Remove row from table
            if (xhr.status == 200) {
                const row = document.getElementById(bookId);
                row.parentElement.removeChild(row);
            }
            else
                window.alert('There was a problem with this request.');
        }
    }
    catch (e) {
        window.alert('Exception caught: ' + e.description);
    }
}

// Update book
function updateBook(bookId) {
    const form = document.forms.bookForm;

    const data_to_send = {
        title: form.elements.title.value,
        author: form.elements.author.value,
        category: form.elements.category.value
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => onUpdateResponse(xhr, bookId, data_to_send);
    xhr.open('PUT', '/books/' + bookId, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data_to_send));
}

function onUpdateResponse(xhr, bookId, updatedBook) {
    try {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            // Update row with book in table
            if (xhr.status == 200) {
                const row = document.getElementById(bookId);
                row.children[0].textContent = updatedBook.title;
                row.children[1].textContent = updatedBook.author;
                row.children[2].textContent = updatedBook.category;

                // Change form header
                const header = document.getElementsByTagName('h4')[0];
                header.textContent = 'Add Book'

                editingBookId = null;

                document.forms.bookForm.reset()
            }
            else
                window.alert('There was a problem with this request.');
        }
    }
    catch (e) {
        window.alert('Exception caught: ' + e.description);
    }
}