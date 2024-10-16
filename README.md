---

# **Project Documentation**

## **Backend Documentation**

### **Introduction:**
This section provides a comprehensive overview of the backend structure, listing all endpoints and services, along with the technologies used in the backend architecture.

### **Technologies Used:**
- **Backend Framework**: Django, Django Rest Framework
- **Database**: PostgreSQL
- **Authentication**: JWT Authentication
- **Deployment**: Nginx, Docker, Gunicorn

---

### **1. User Authentication Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register/` | POST | Register a new user. Accepts username, email, password. |
| `/api/login/` | POST | Logs in a user and provides a JWT token. |
| `/api/logout/` | POST | Logs out the current user and invalidates the token. |
| `/api/profile/` | GET | Retrieves the logged-in user's profile details. Requires authentication. |
| `/api/profile/update/` | PUT | Updates the logged-in user's profile information. |
---

### **4. Error Handling and Status Codes**

| Status Code | Meaning |
|-------------|---------|
| `200 OK` | Request was successful. |
| `201 Created` | Resource was successfully created. |
| `400 Bad Request` | Invalid data provided in the request. |
| `401 Unauthorized` | Authentication failed or missing token. |
| `403 Forbidden` | User does not have permission to perform this action. |
| `404 Not Found` | The requested resource does not exist. |
| `500 Internal Server Error` | A server error occurred while processing the request. |

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
*(Insert screenshot here)*

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
*(Insert screenshot here)*

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
*(Insert screenshot here)*

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
*(Insert screenshot here)*

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
*(Insert screenshot here)*

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
*(Insert screenshot here)*

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
*(Insert screenshot here)*

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
*(Insert screenshot here)*

---
