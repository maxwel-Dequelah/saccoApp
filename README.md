
---

# Socco Mobile Application

## Overview

**Socco Mobile Application** is a mobile app designed for members of a Savings and Credit Cooperative Organization (Sacco). The app allows users to check their account balances, manage deposits, request loans, and view transaction histories, among other functionalities. The app is built using React Native for the frontend and integrates with a backend service to fetch and update data.

## Features

- **Account Balance**: Users can check their current Sacco account balance.
- **Deposits/Shares Capital**: Functionality for viewing and managing deposits (upcoming).
- **Loan Requests**: Users can request loans directly through the app (upcoming).
- **Loans Overview**: A section for managing and viewing active loans (upcoming).
- **Mini Statements**: Access to recent transactions and mini statements (upcoming).
- **Stop ATM**: Option to disable ATM services temporarily (upcoming).
- **User Authentication**: Login functionality for members (in progress).
- **Logout**: Securely log out from the app.

## Current Progress

### 1. **Dashboard Screen**

- Displays the user's account information (username and account number).
- Contains navigation cards for different app functionalities:
  - **Account Balance**
  - **Deposits/Shares Cap.**
  - **Loan Requests**
  - **Loans**
- Includes a **Logout** button.
- Background image and design elements for a visually appealing user interface.

```javascript
<Card
  icon="💰"
  title="Account Balance"
  onPress={() => navigation.navigate("AccountBalance")}
/>
```

### 2. **Account Balance Screen**

- Displays the user's current account balance, fetched from the backend using Axios.
- The balance is displayed in Ksh (Kenyan Shillings).
- Includes a **Back to Dashboard** button for easy navigation.
- Loading and error states are handled to ensure smooth user experience.

```javascript
const response = await axios.get("http://192.168.100.24:8000/api/balance/", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### 3. **AsyncStorage Integration**

- User authentication data (username, token) is stored in `AsyncStorage`.
- The app fetches the user's data from `AsyncStorage` to personalize the dashboard.

```javascript
const userData = await AsyncStorage.getItem("user");
const token = await AsyncStorage.getItem("access");
```

### 4. **Navigation**

- React Navigation is used to handle screen transitions, including navigating between the Dashboard and the Account Balance screen.

```javascript
const navigation = useNavigation();
```

### 5. **Logout Functionality**

- Users can securely log out of the app, which clears the `AsyncStorage` and redirects them to the login page.

```javascript
await AsyncStorage.clear();
navigation.navigate("Login");
```

## Upcoming Features

- **Deposits and Shares**: Display and manage user deposits and share capital.
- **Loan Requests**: Allow users to submit and track loan requests.
- **Mini Statements**: Provide detailed views of recent transactions.
- **Stop ATM Services**: Enable users to temporarily disable their ATM card.

## Technologies Used

- **React Native**: For building the mobile application interface.
- **Axios**: For making HTTP requests to the backend API.
- **AsyncStorage**: For storing user authentication data locally.
- **React Navigation**: For handling in-app navigation.

## How to Run

To run the app on your local environment, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/socco-mobile-app.git
   cd socco-mobile-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app on an Android or iOS emulator:
   ```bash
   npm run android   # For Android
   npm run ios       # For iOS
   ```

4. Ensure that your backend server is running, and update the base URL for the API if necessary in the code.

## API Endpoints

- **GET /api/balance/**: Fetches the current balance of the logged-in user.

## Future Enhancements

- Implement a user-friendly **loan management system**.
- Add **notifications** for updates on loan approvals, account changes, and upcoming payments.
- Implement **push notifications** to alert users of new account activity.
- Create an **offline mode** that caches data for viewing account balances and statements without internet access.

## License

This project is licensed under the MIT License.

## Contact

If you have any questions or issues, please contact the project owner at [email@example.com].

---

Feel free to adjust the links, email, or sections as necessary!
