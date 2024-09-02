$(document).ready(function() {
    // Obsługa logowania
    $('#login-form').on('submit', function(event) {
        event.preventDefault(); // Zatrzymanie domyślnego działania formularza
        const email = $('#email').val(); // Pobranie wartości pola email
        const password = $('#password').val(); // Pobranie wartości pola hasła

        // Wysłanie żądania AJAX do skryptu login.php
        $.ajax({
            url: 'login.php',
            method: 'POST',
            data: { email: email, password: password }, // Przesłanie danych logowania
            success: function(response) {
                const result = JSON.parse(response); // Przetwarzanie odpowiedzi jako JSON
                if (result.success) {
                    $('#login-container').hide(); // Ukrycie formularza logowania
                    $('#main-container').show(); // Wyświetlenie głównego kontenera
                    
                    // Wyświetlenie odpowiedniego komunikatu powitalnego w zależności od roli
                    if (result.role === 'admin') {
                        $('#welcome-message').text(`Welcome, ${result.email}! (Admin)`);
                    } else {
                        $('#welcome-message').text(`Welcome, ${result.email}! (User)`);
                    }
                    loadContacts(); // Załadowanie kontaktów
                } else {
                    alert(result.message); // Wyświetlenie błędu logowania
                }
            }
        });
    });

    // Obsługa wylogowania
    $('#signout_button').click(function() {
        // Wysłanie żądania AJAX do skryptu logout.php
        $.ajax({
            url: 'logout.php',
            method: 'POST',
            success: function() {
                $('#main-container').hide(); // Ukrycie głównego kontenera
                $('#login-container').show(); // Wyświetlenie formularza logowania
            }
        });
    });

    // Funkcja do ładowania kontaktów
    function loadContacts() {
        $.ajax({
            url: 'get_contacts.php',
            method: 'GET',
            success: function(response) {
                const result = JSON.parse(response); // Przetwarzanie odpowiedzi jako JSON
                if (result.success) {
                    contacts.length = 0; // Wyczyść istniejącą listę kontaktów
                    result.contacts.forEach(contact => contacts.push(contact)); // Dodanie kontaktów do listy
                    renderContacts(); // Renderowanie kontaktów w interfejsie
                    updateCalendarEvents(); // Aktualizacja wydarzeń w kalendarzu
                } else {
                    alert(result.message); // Wyświetlenie błędu ładowania kontaktów
                }
            }
        });
    }

    // Renderowanie kontaktów do interfejsu użytkownika
    const contacts = [];

    function renderContacts() {
        $('#contacts-list').empty(); // Wyczyść listę kontaktów
        contacts.forEach((contact, index) => {
            $('#contacts-list').append(`
                <li>
                    <div>
                        <p><strong>Name:</strong> ${contact.name}</p>
                        <p><strong>Email:</strong> ${contact.email}</p>
                        <p><strong>Company:</strong> ${contact.company}</p>
                        <p><strong>Phone:</strong> ${contact.phone}</p>
                        <p><strong>Notes:</strong> ${contact.notes}</p>
                        <p><strong>Reminder:</strong> ${contact.reminderDate} ${contact.reminderTime}</p>
                    </div>
                    <div>
                        <button class="edit-button" data-index="${index}">Edit</button> <!-- Przycisk do edytowania -->
                        <button class="delete-button" data-index="${index}">Delete</button> <!-- Przycisk do usunięcia -->
                    </div>
                </li>
            `);
        });
    }

    // Obsługa dodawania nowego kontaktu
    $('#contact-form').on('submit', function(event) {
        event.preventDefault(); // Zatrzymanie domyślnego działania formularza

        // Utworzenie nowego obiektu kontaktu
        const newContact = {
            name: $('#name').val(),
            email: $('#contact-email').val(),
            company: $('#company').val(),
            phone: $('#phone').val(),
            notes: $('#notes').val(),
            reminderDate: $('#reminder-date').val(),
            reminderTime: $('#reminder-time').val()
        };

        // Wysłanie żądania AJAX do skryptu manage_contacts.php w celu zapisania kontaktu
        $.ajax({
            url: 'manage_contacts.php',
            method: 'POST',
            data: newContact, // Przekazanie danych kontaktu
            success: function(response) {
                const result = JSON.parse(response); // Przetwarzanie odpowiedzi jako JSON
                if (result.success) {
                    contacts.push(newContact); // Dodanie nowego kontaktu do listy
                    renderContacts(); // Renderowanie zaktualizowanej listy kontaktów
                    $('#contact-form')[0].reset(); // Resetowanie formularza
                    updateCalendarEvents(); // Aktualizacja wydarzeń w kalendarzu
                } else {
                    alert('Failed to save contact: ' + result.message); // Wyświetlenie błędu zapisu kontaktu
                }
            }
        });
    });

    // Obsługa usuwania kontaktu
    $('#contacts-list').on('click', '.delete-button', function() {
        const index = $(this).data('index'); // Pobranie indeksu kontaktu
        contacts.splice(index, 1); // Usunięcie kontaktu z listy
        renderContacts(); // Renderowanie zaktualizowanej listy kontaktów
        updateCalendarEvents(); // Aktualizacja wydarzeń w kalendarzu
    });

    // Obsługa edytowania kontaktu
    $('#contacts-list').on('click', '.edit-button', function() {
        const index = $(this).data('index'); // Pobranie indeksu kontaktu
        const contact = contacts[index]; // Pobranie kontaktu z listy
        
        // Wypełnienie formularza danymi kontaktu do edycji
        $('#name').val(contact.name);
        $('#contact-email').val(contact.email);
        $('#company').val(contact.company);
        $('#phone').val(contact.phone);
        $('#notes').val(contact.notes);
        $('#reminder-date').val(contact.reminderDate);
        $('#reminder-time').val(contact.reminderTime);

        contacts.splice(index, 1); // Usunięcie starego kontaktu z listy
        renderContacts(); // Renderowanie zaktualizowanej listy kontaktów
        updateCalendarEvents(); // Aktualizacja wydarzeń w kalendarzu
    });

    // Ustawienia dla dropdownu z godzinami
    const times = [];
    for (let i = 8; i <= 17; i++) {
        times.push(`${i}:00`, `${i}:30`); // Dodanie godzin w formacie pełnej godziny i pół godziny
    }

    // Wypełnienie dropdownu godzinami
    times.forEach(time => {
        $('#reminder-time').append(`<option value="${time}">${time}</option>`);
    });

    // Inicjalizacja kalendarza
    $('#calendar').fullCalendar({
        events: contacts.map(contact => ({
            title: `${contact.name} - ${contact.reminderTime}`, // Ustawienie tytułu wydarzenia
            start: contact.reminderDate // Ustawienie daty rozpoczęcia wydarzenia
        })),
        dayClick: function(date, jsEvent, view) {
            const selectedDate = date.format('YYYY-MM-DD'); // Formatowanie wybranej daty
            const today = moment().format('YYYY-MM-DD'); // Pobranie dzisiejszej daty

            if (selectedDate < today) {
                alert('Cannot select a past date.'); // Zapobieganie wyborowi przeszłej daty
            } else {
                $('#reminder-date').val(selectedDate); // Ustawienie wybranej daty w polu formularza
            }
        },
        validRange: {
            start: moment().format('YYYY-MM-DD') // Zapobiega wyborowi dat przeszłych
        }
    });

    // Funkcja do aktualizacji wydarzeń w kalendarzu
    function updateCalendarEvents() {
        $('#calendar').fullCalendar('removeEvents'); // Usunięcie wszystkich wydarzeń
        $('#calendar').fullCalendar('addEventSource', contacts.map(contact => ({
            title: `${contact.name} - ${contact.reminderTime}`, // Ustawienie tytułu wydarzenia
            start: contact.reminderDate // Ustawienie daty rozpoczęcia wydarzenia
        })));
    }
});

$.ajax({
    url: 'get_contacts.php', // Pobieranie kontaktów z serwera
    method: 'GET',
    dataType: 'json',
    success: function(response) {
        if (response.success) {
            $('#calendar').fullCalendar({
                events: response.contacts.map(contact => ({
                    title: `${contact.name} - ${contact.reminderTime}`, // Ustawienie tytułu wydarzenia
                    start: contact.reminderDate, // Ustawienie daty rozpoczęcia wydarzenia
                    description: contact.notes // Dodaj opis do wydarzeń
                })),
                eventRender: function(event, element) {
                    element.attr('title', event.description); // Dodaje opis jako dymek narzędzia
                }
            });
        } else {
            alert('Failed to load events: ' + response.message); // Wyświetlenie błędu ładowania wydarzeń
        }
    },
    error: function() {
        alert('An error occurred while fetching events.'); // Wyświetlenie błędu w przypadku niepowodzenia żądania AJAX
    }
});
