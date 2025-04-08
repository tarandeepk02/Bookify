# Online Book Store

An Online Book Store where users can browse books, add them to their cart, and place orders. Admins can manage books and track sales. The application supports role-based permissions for users and admins, and logs all purchases in MongoDB.

## Features

### Authentication:
- **Admin**: Can add, edit, and remove books, view users, view orders, update profile, update password
- **Member**: Can view books, add them to the cart, and place orders, order logs
- **Guest**: Can only view books, place order, can not see order logs.

### Authorization:
- Role-based permissions for different users (Admin, Member, Guest).

### Accountability:
- Logs book purchases and stores them in MongoDB for tracking.

### RESTful APIs:
- CRUD operations for books and orders.
- External API integration to fetch book data from Google Books API.

### Backend Database:
- MongoDB collections for:
  - **Users**: Stores user data (Admin, Member, Guest).
  - **Books**: Stores book details.
  - **Orders**: Stores order information.
  - **Sessions**: Stores purchase logs for accountability.

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **External API**: Google Books API (for fetching book data)

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (locally installed or using a cloud service like MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tarandeepk02/Bookify.git
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure MongoDB: Update database credentials in models/config/config.js
   ```
   (() => {
    const config = {}
    config.SERVER = ''
    config.USERNAME = ''
    config.PASSOWRD = ''
    config.DATABASE = ''
    module.exports = config`
    })()
   ```
4. Run the application:
  ```
  npm start
  ```
5. Access the application in your browser at http://localhost:3000
