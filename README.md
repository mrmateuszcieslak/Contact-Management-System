Technical Documentation ‘Contact Management System’ 
1. Description of the application  
Contact Management System is a web-based application that allows users to add, 
editing, deleting and managing contacts, as well as displaying reminders for 
calendar events. 
2. File structure  
config.php - Application configuration file. 
contact.html - HTML page responsible for the user interface. 
contact.js - JavaScript script responsible for the frontend logic. 
styles.css - CSS file containing the styles for the user interface. 
get_contacts.php - PHP script that retrieves contact details from the database. 
login.php - PHP script handling user login. 
logout.php - PHP script handling logout of users. 
manage_contacts.php - PHP script for managing contacts (adding, 
editing, deleting). 3. 
3. Operation and functions of the application  
The application allows to: 
- Logging users in using their email address and password. 
- Managing contacts (adding, editing, deleting). 
- Viewing contacts in a structured list. 
- Setting reminders for important events related to contacts. 
- Viewing a calendar with scheduled events. 
Logging in 
- The login form available on the contact.html page allows the user to access the 
to the application after entering the correct credentials. After correct 
login, the user is redirected to the main contact management panel. 
contacts. 
Managing contacts
The user can add new contacts using the form available on the 
main page. Each contact consists of the following information: 
- First and last name 
- E-mail address 
- Company 
- Telephone number 
- Additional notes 
- Reminder date and time 
- Calendar 
- The system allows you to display reminders in a calendar that is generated using the 
using the FullCalendar library. 

