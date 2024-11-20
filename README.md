---
# **Project Documentation**

## **Backend Documentation**

### **Introduction:**
This section provides a comprehensive overview of the backend structure, listing all endpoints and services, along with the technologies used in the backend architecture.
---

### **Technologies Used:**

- **Backend Framework**: Django, Django Rest Framework
- **Database**: PostgreSQL
- **Authentication**: JWT Authentication
- **Deployment**: Nginx, Docker, Gunicorn

---

### **1. User and Balance Management Endpoints**

| Endpoint                      | Method | Description                                                                                                    | Returns                                     | Permission Class  | Payload (Request/Response)                                                                                                                                                                                                                      |
| ----------------------------- | ------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/signup/`                | POST   | Registers a new user with details such as first name, last name, phone number, etc.                            | User object with a success message.         | `AllowAny`        | **Request**: `{ "first_name": "John", "last_name": "Doe", "phoneNumber": "1234567890", "dob": "YYYY-MM-DD", "email": "example@example.com", "password": "password123" }`<br> **Response**: `{ "id": "shortuuid123", "first_name": "John", ...}` |
| `/api/balance/`               | GET    | Retrieves the current user's balance. Requires authentication and access token.                                | Balance object (user, balance, lastEdited). | `IsAuthenticated` | **Response**: `{ "user": { "id": "shortuuid123", ... }, "balance": "500.00", "lastEdited": "2024-10-17T10:45:23.591Z" }`<br> **Access Token**: Required                                                                                         |
| `/api/balance/`               | PUT    | Updates the current user's balance. Requires authentication and access token.                                  | Updated balance object.                     | `IsAuthenticated` | **Request**: `{ "balance": 500.00 }`<br> **Response**: `{ "user": { "id": "shortuuid123", ... }, "balance": "500.00", ...}`<br> **Access Token**: Required                                                                                      |
| `/api/users/<str:pk>/update/` | PUT    | Updates the profile information of a specific user based on user ID. Requires authentication and access token. | Updated user profile object.                | `IsAuthenticated` | **Request**: `{ "first_name": "John", "last_name": "Doe", "dob": "YYYY-MM-DD", "email": "newemail@example.com" }`<br> **Response**: `{ "id": "shortuuid123", "first_name": "John", ...}`<br> **Access Token**: Required                         |

---

### **2. Transaction Management Endpoints**

| Endpoint             | Method | Description                                                                                              | Returns                                                             | Permission Class  | Payload (Request/Response)                                                                                                                                                                                                                                               |
| -------------------- | ------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/api/transactions/` | POST   | Creates a new transaction (either deposit or withdrawal). Requires authentication and access token.      | Created transaction object.                                         | `IsAuthenticated` | **Request**: `{ "amount": 100.00, "transaction_type": "deposit" }`<br> **Response**: `{ "id": "uuid1234", "user": { "id": "shortuuid123", ... }, "date": "2024-10-17T10:45:23.591Z", "amount": "100.00", "transaction_type": "deposit" }`<br> **Access Token**: Required |
| `/api/transactions/` | GET    | Retrieves a list of all transactions made by the current user. Requires authentication and access token. | List of transaction objects (user, date, amount, transaction type). | `IsAuthenticated` | **Response**: `[ { "id": "uuid1234", "user": { "id": "shortuuid123", ... }, "date": "2024-10-17T10:45:23.591Z", "amount": "100.00", "transaction_type": "deposit" }, ... ]`<br> **Access Token**: Required                                                               |

---

### **Response Examples**

1. **User Signup Success Response**:

   ```json
   {
     "id": "shortuuid123",
     "first_name": "John",
     "last_name": "Doe",
     "phoneNumber": "1234567890",
     "dob": "1990-01-01",
     "email": "example@example.com",
     "username": "1234567890",
     "is_active": true,
     "is_admin": false
   }
   ```

2. **Balance GET Success Response**:

   ```json
   {
     "user": {
       "id": "shortuuid123",
       "first_name": "John",
       "last_name": "Doe",
       "phoneNumber": "1234567890"
     },
     "balance": "500.00",
     "lastEdited": "2024-10-17T10:45:23.591Z"
   }
   ```

3. **Transaction POST Success Response**:
   ```json
   {
     "id": "uuid1234",
     "user": {
       "id": "shortuuid123",
       "first_name": "John",
       "last_name": "Doe"
     },
     "date": "2024-10-17T10:45:23.591Z",
     "amount": "100.00",
     "transaction_type": "deposit"
   }
   ```

---

---

## **Frontend Documentation**

### **Introduction:**

This section outlines the frontend structure of the application, describing each page, its components, and functionality. The screenshots can be added where indicated to provide a visual guide.

---

### **1. Home Page**

#### **Description:**

The Home Page is the landing page of the application. It provides an overview of the services offered and displays key features.

#### **Key Features:**

- Displays a welcome message and key application features.
- Contains navigation to other sections like "Services" and "Login."

#### **Components:**

- **Navbar**: Navigation links to other sections.
- **Hero Section**: Highlights the platform's main features.
- **Footer**: Contains social media links and contact info.

#### **Screenshot:**

_(Insert screenshot here)_

---

### **2. Login Page**

#### **Description:**

The Login Page allows users to sign in using their credentials.

#### **Key Features:**

- Fields for username and password.
- 'Login' button to authenticate users.
- 'Forgot Password' link for recovery.

#### **Components:**

- **Login Form**: Form for handling login requests.
- **Error Alerts**: Displays error messages if authentication fails.

#### **Screenshot:**

_(Insert screenshot here)_

---

### **3. Dashboard**

#### **Description:**

The Dashboard provides a summary of user activities and links to various services.

#### **Key Features:**

- Overview of recent user activities and service requests.
- Links to service request forms.

#### **Components:**

- **Sidebar**: Navigation between services and profile settings.
- **Overview Section**: Displays recent activities and user metrics.

#### **Screenshot:**

_(Insert screenshot here)_

---

### **4. Request Service Page**

#### **Description:**

The Request Service Page allows users to submit requests for services such as Dark Fibre and Domain Registration.

#### **Key Features:**

- Form inputs for service type, duration, etc.
- Submit button for sending the request.

#### **Components:**

- **Service Request Form**: Collects input data for the service request.
- **Submission Confirmation**: Feedback after form submission.

#### **Screenshot:**

_(Insert screenshot here)_

---

### **5. Admin Dashboard**

#### **Description:**

The Admin Dashboard displays all service requests and allows admins to manage them (Approve/Reject).

#### **Key Features:**

- View pending, approved, and rejected requests.
- Approve or reject requests with a click.

#### **Components:**

- **Request List**: Displays service requests with actions.
- **Details Section**: Detailed view of each service request.

#### **Screenshot:**

_(Insert screenshot here)_

---

### **6. Profile Update Page**

#### **Description:**

The Profile Update Page allows users to modify their personal information.

#### **Key Features:**

- Form fields for updating profile details.
- Save or discard changes.

#### **Components:**

- **Profile Form**: Editable form for user profile data.
- **Submit Button**: Saves updated information.

#### **Screenshot:**

_(Insert screenshot here)_

---

### **7. Contact Us Page**

#### **Description:**

The Contact Us Page lets users send messages or queries to the support team.

#### **Key Features:**

- Fields for message title, body, email, and phone number.
- Submit button to send the message.

#### **Components:**

- **Contact Form**: Form to collect user input for the query.
- **Success Alert**: Feedback after message submission.

#### **Screenshot:**

_(Insert screenshot here)_

---

### **8. Error Page (404/500)**

#### **Description:**

The Error Page is displayed when a user navigates to an incorrect or unavailable route.

#### **Key Features:**

- Friendly error message.
- Link to navigate back to the Home Page.

#### **Components:**

- **Error Message**: Clear description of the error.
- **Back Button**: Link to return to the Home Page.

#### **Screenshot:**

_(Insert screenshot here)_

---
