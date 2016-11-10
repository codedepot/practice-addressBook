# practice-addressBook
a basic address book developed using AngularJS and Firebase

It is a one page applicaiton made for practice and demo purposes only and can be viewed at:

https://addressbook-340d9.firebaseapp.com/

It is hosted on google's servers

The address book lets users create an account by registering. Once created they can log in to use the features. It uses AngularJS to show a one page application and firebase to have a real time database with user authentication.

They can create and manage their contacts using the buttons available in the contact tab. A dialog will open for the user to enter the information:

![ScreenShot](img/add-contact-filled.JPG?raw=true)

If the user misses a required field, the form will show an error

![ScreenShot](img/add-contact-error.JPG?raw=true)

The contacts can then be viewed and managed from the contacts screen. Each contact has an edit icon which can be used to bring up the dialog again, with the information prefilled in the modal and saved once the user clicks on save. The contacts list also functions with the search button on the top right. Once text is entered, the list is filtered to show the matched content:

![ScreenShot](img/search-function-jpg.JPG?raw=true)


This application also has the functionality that allows users to see a map of their contacts and themselves marked with pins. This is using the google api and the information provided by the user. The zooms the map to the closest view that shows all markers:

![ScreenShot](img/map-view.jpg?raw=true)

This application also has a thread section. This is a thread that is shared by all users who use this application. Threads can be created by any user and they can also reply to the threads. The posts are updated automatically so if one user posts something and the other user is in the thread view, their view also updates automatically. Because of this, the thread functionality can be used as a chat feature

![ScreenShot](img/thread-view-2.JPG?raw=true)
