# MyFinStat  
**Financial Clarity, One Stat at a Time**
MyFinStat is a personal finance tracker API designed to help users manage their income, expenses, and budgets efficiently. With powerful tools for transaction tracking and insightful reports, it simplifies financial management for everyone.

## Table of Contents  
- [Features](#features)  
- [Installation](#installation)  
- [Usage](#usage)  
- [API Endpoints](#api-endpoints)  
- [Technologies Used](#technologies-used)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [License](#license)

## Features  

### 1. **User Authentication**  
- Secure user registration and login system.  
- Passwords are hashed using industry-standard encryption (e.g., bcrypt) for enhanced security.  

### 2. **Transaction Management**  
- Add, edit, and delete financial transactions such as income or expenses.  
- Categorize transactions into customizable categories (e.g., food, rent, entertainment).  
- Attach metadata like transaction date, amount, and description.  
- Create recurring transactions

### 3. **Financial Reporting**  
- Generate real-time financial summaries, including:  
  - Total income, expenses, and savings.  
  - Balance overview.  
- Support for time-based filtering (e.g., daily, weekly, monthly reports).  

### 4. **Secure and Reliable API**  
- RESTful API designed for scalability and performance.
- Input validation to ensure data integrity.

### 5. **Mobile-Friendly and Future-Ready**
- Lightweight backend architecture that can easily integrate with mobile or web frontends.

### 6. **Error Handling and Logging**
- Comprehensive error handling with meaningful error messages.
- Server-side logging for debugging and monitoring.

### 7. **Open for Expansion**
- Modular architecture allows for seamless addition of new features like spending alerts, transactions filtering, or third-party API integration (e.g., currency conversion).

## Installation  

Follow these steps to set up and run the **MyFinStat API** on your local machine.

### Prerequisites  
Ensure you have the following installed:  
- [Node.js](https://nodejs.org/) (v12.x or higher)  
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)  
- [Redis](https://redis.io/)  

### Steps  

#### 1. **Clone the Repository**  
Clone the repository from GitHub to your local machine:  
```bash
git clone https://github.com/StarCodes2/MyFinStat-API.git
cd MyFinStat-API
```
#### 2. **Install Dependencies**
Install all required Node.js dependencies by running:
```bash
npm install
```
#### 3. **Start MongoDB and Redis services**
Ensure both MongoDB and Redis services are running on your machine:
- Start MongoDB:
```bash
mongod
```
- Start Redis:
```bash
redis-server
```

#### 4. **Run the Application**
Start the application using the development script:
```bash
npm run start-server
```
or
```bash
npm run dev ./app.js
```
This will launch the API server with nodemon for live-reloading and babel-node for ES6+ support.

#### 5. **Verify the API**
Once the server is running, open your browser or Postman and access the API at:
```bash
http://localhost:5000
```

#### Additional Scripts
- **Run Linting**
Check the code for any linting errors using ESLint:
```bash
npm run lint
```
- **Start the Worker**
Run the worker process for handling background tasks:
```bash
npm run start-worker
```
- **Run Tests**
Ensure all features are working correctly by running the test suite:
```bash
npm test
```

## Usage  

The **MyFinStat API** provides multiple endpoints to help users manage their personal finances. Below are the details for testing and using the API using `curl` or Postman.

---

### Base URL
http://localhost:5000

---

### Endpoints  

#### General  

1. **API Info**  
   - **Endpoint**: `/`  
   - **Method**: GET  
   - **Description**: Provides basic information about the API and available endpoints.  
   - **Example**:  
     ```bash
     curl -X GET http://localhost:5000/
     ```  

2. **API Status**  
   - **Endpoint**: `/status`  
   - **Method**: GET  
   - **Description**: Checks the status of Redis and MongoDB connections.  
   - **Example**:  
     ```bash
     curl -X GET http://localhost:5000/status
     ```  

---

### Authentication  

3. **Sign Up**  
   - **Endpoint**: `/signup`  
   - **Method**: POST  
   - **Description**: Registers a new user.  
   - **Request Body**:  
     ```json
     {
       "email": "user@example.com",
       "password": "securepassword"
     }
     ```  
   - **Example (curl)**:  
     ```bash
     curl -X POST http://localhost:5000/signup \
       -H "Content-Type: application/json" \
       -d '{"email":"user@example.com","password":"securepassword"}'
     ```  
   - **Example (Postman)**:  
     - Method: POST  
     - URL: `http://localhost:5000/signup`  
     - Body:  
       ```json
       {
         "email": "user@example.com",
         "password": "securepassword"
       }
       ```  

4. **Login**  
   - **Endpoint**: `/connect`  
   - **Method**: GET  
   - **Description**: Authenticates the user and provides a session token.  

5. **Logout**  
   - **Endpoint**: `/disconnect`  
   - **Method**: GET  
   - **Description**: Logs out the current user.  

6. **Get Current User**  
   - **Endpoint**: `/me`  
   - **Method**: GET  
   - **Description**: Retrieves the details of the currently authenticated user.  

---

### Categories  

7. **Create Category**  
   - **Endpoint**: `/category`  
   - **Method**: POST  
   - **Description**: Creates a new transaction category.  
   - **Request Body**:  
     ```json
     {
       "name": "Groceries"
     }
     ```  
   - **Example**:  
     ```bash
     curl -X POST http://localhost:5000/category \
       -H "Content-Type: application/json" \
       -H "auth-token: Basic YOUR-TOKEN" \
       -d '{"name":"Groceries"}'
     ```  

8. **Get All Categories**  
   - **Endpoint**: `/category`  
   - **Method**: GET  
   - **Description**: Retrieves all categories.  
   - **Example**:  
     ```bash
     curl -X GET http://localhost:5000/category \
     -H "auth-token: Basic YOUR-TOKEN"
     ```  

9. **Update Category**  
   - **Endpoint**: `/category/:cateId`  
   - **Method**: PUT  
   - **Description**: Updates a category by ID.  
   - **Request Body**:  
     ```json
     {
       "name": "New Category Name"
     }
     ```  
   - **Example**:  
     ```bash
     curl -X PUT http://localhost:5000/category/<cateId> \
       -H "Content-Type: application/json" \
       -H "auth-token: Basic YOUR-TOKEN" \
       -d '{"name":"New Category Name"}'
     ```  

10. **Delete Category**  
    - **Endpoint**: `/category/:cateId`  
    - **Method**: DELETE  
    - **Description**: Deletes a category by ID.  
    - **Example**:  
      ```bash
      curl -X DELETE http://localhost:5000/category/<cateId> \
      -H "auth-token: Basic YOUR-TOKEN"
      ```  

---

### Transactions  

11. **Create Transaction**  
    - **Endpoint**: `/transaction`  
    - **Method**: POST  
    - **Description**: Creates a new transaction.  
    - **Request Body**:  
      ```json
      {
        "amount": 120,
        "type": "income, expense, or savings",
        "category": "rent",
        "repeat": "daily, weekly, monthly, or yearly"
      }
      ```  
    - **Example**:  
      ```bash
      curl -X POST http://localhost:5000/transaction \
        -H "Content-Type: application/json" \
        -H "auth-token: Basic YOUR-TOKEN" \
        -d '{"category":"Groceries","amount":120,"repeat":"weekly","type":"expense"}'
      ```  

12. **Get All Transactions**  
    - **Endpoint**: `/transaction`  
    - **Method**: GET  
    - **Description**: Retrieves all transactions.  
    - **Example**:  
      ```bash
      curl -X GET http://localhost:5000/transaction?page=1 \
      -H "auth-token: Basic YOUR-TOKEN"
      ```  

13. **Update Transaction**  
    - **Endpoint**: `/transaction/:tranId`  
    - **Method**: PUT  
    - **Description**: Updates a transaction by ID.  
    - **Request Body**:  
      ```json
      {
        "amount": 120,
        "type": "income, expense, or savings",
        "category": "rent",
        "repeat": "daily, weekly, monthly, or yearly"
      }
      ```  
    - **Example**:  
      ```bash
      curl -X PUT http://localhost:5000/transaction/<tranId> \
        -H "Content-Type: application/json" \
        -H "auth-token: Basic YOUR-TOKEN" \
        -d '{"amount":120}'
      ```  

14. **Delete Transaction**  
    - **Endpoint**: `/transaction/:tranId`  
    - **Method**: DELETE  
    - **Description**: Deletes a transaction by ID.  
    - **Example**:  
      ```bash
      curl -X DELETE http://localhost:5000/transaction/<tranId> \
      -H "auth-token: Basic YOUR-TOKEN"
      ```  

---

### Reports  

15. **Generate Report**  
    - **Endpoint**: `/report`  
    - **Method**: GET  
    - **Description**: Generates a general financial report.  
    - **Example**:  
      ```bash
      curl -X GET http://localhost:5000/report \
      -H "auth-token: Basic YOUR-TOKEN"
      ```

16. **Generate Time-Based Report**  
    - **Endpoint**: `/report/:period`
    - **Method**: GET
    - **Description**: Generates a report for a specific period. Valid periods include:  
      - `daily`
      - `weekly`
      - `monthly`
      - `quarterly`
      - `yearly`
    - **Example**:
      ```bash
      curl -X GET http://localhost:5000/report/monthly
      ```  

---

This **Usage** section covers all the endpoints and their functionality, ensuring that you can efficiently test and interact with the **MyFinStat API**.

---

## Technologies Used  

The **MyFinStat API** leverages the following technologies and tools:  

- **Node.js**: Server-side JavaScript runtime.  
- **Express.js**: Web application framework for building RESTful APIs.  
- **MongoDB**: NoSQL database for data storage.  
- **Redis**: In-memory database used for caching and session management.  
- **Bull**: Redis-based queue library for handling background jobs and worker processes.  
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.  
- **Babel**: Transpiler to ensure compatibility with modern JavaScript features.  
- **ESLint**: Linting utility to enforce code quality and consistency.  
- **Mocha/Chai**: Testing framework and assertion library for API and functional tests.  

---

## Project Structure  

The project is organized as follows:  

```plaintext
MyFinStat-API/
├── controllers/              # Handles business logic
│   ├── AuthController.js     # Authentication-related logic
│   ├── ReportController.js   # Report generation
│   ├── UserController.js     # User-related actions
│   ├── CateController.js     # Category management
│   └── TranController.js     # Transaction management
│
├── models/                   # Database models
│   ├── User.js               # User schema
│   ├── Category.js           # Category schema
│   └── Transaction.js        # Transaction schema
│
├── route/                    # API routes
│   └── index.js              # Main routing file
│
├── test/                     # Unit and integration tests
│
├── utils/                    # Utility functions and helpers
│   ├── db.js                 # Database connection
│   ├── redis.js              # Redis connection
│   ├── Validation.js         # Validation utilities
│   ├── ReportTools.js        # Helper tools for report generation
│   └── worker.js             # Background job processor
│
├── babel.config.js           # Babel configuration file
├── README.md                 # Project documentation
```

---

## Contributing  

Contributions are welcome, and they are greatly appreciated! To contribute to **MyFinStat**, please follow these steps:  

1. **Fork the Repository**  
   - Go to the [MyFinStat GitHub repository](https://github.com/StarCodes2/MyFinStat-API) and click the "Fork" button.  

2. **Clone Your Fork**  
   - Clone your forked repository to your local machine:  
     ```bash
     git clone https://github.com/YourUsername/MyFinStat-API.git
     ```  

3. **Create a New Branch**  
   - Create a branch for your changes:  
     ```bash
     git checkout -b feature/your-feature-name
     ```  

4. **Make Changes**  
   - Implement your feature or fix the bug.  
   - Ensure you adhere to the coding standards and practices used in the project.  

5. **Run Tests**  
   - Run the tests to make sure everything works correctly:  
     ```bash
     npm test
     ```  

6. **Commit Your Changes**  
   - Write a clear and descriptive commit message:  
     ```bash
     git add .
     git commit -m "Add your descriptive commit message here"
     ```  

7. **Push Your Changes**  
   - Push your changes to your forked repository:  
     ```bash
     git push origin feature/your-feature-name
     ```  

8. **Submit a Pull Request**  
   - Go to the original repository on GitHub and open a pull request.  
   - Provide a clear description of the changes you’ve made and the purpose of the pull request.  

---

## License  

This project is licensed under the **ISC License**.  

**ISC License**:  

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.  

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

## Author  

**Ezekiel Ogunewu**  
- Software Engineer, Graphic Designer, and Game Developer  
- [GitHub Profile](https://github.com/StarCodes2)  
- [LinkedIn Profile](https://www.linkedin.com/in/ezekiel-ogunewu)  
- [X Profile](https://x.com)  

For inquiries or collaboration opportunities, feel free to reach out!
