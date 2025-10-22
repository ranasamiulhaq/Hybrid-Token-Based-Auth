# Hybrid Token Based Authentication

 The system is designed for modern Single Page Application (SPA) architecture, with a
React frontend and a Laravel backend communicating via a RESTful API.


## Project Overview

On the React side, it follows a standard secure pattern: a short-lived access token is managed in state, while the long-lived refresh token is stored in an HttpOnly cookie.

On the Laravel backend, I moved away from the conventional Sanctum session-based auth. Instead, I used a manual refresh token mechanism. This approach validates the token from the cookie directly against the personal_access_token database, keeping the API routes sessionless.


## Tech Stack

**Backend (API & Database):**
* **Framework:** Laravel (PHP)
* **Database:** (MySQL)

**Frontend (Client):**
* **Framework:** Vite + React
* **Styling:** Tailwind CSS (used via utility classes)
* **State Management:** Redux (via `react-redux`)
* **Routing:** `react-router-dom`
* **HTTP Client:** Axios (using a custom `useAxiosPrivate` hook for authenticated requests)

## Backend Setup (Laravel)

### 1. Installation

1. Clone the repository and navigate into the Laravel directory.
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy the example environment file and generate the application key:
   ```bash
		cp .env.example .env
		php artisan key:generate
   ```
4. Run the mirgrations:
   ```bash
		php artisan migrate
   ```

### 2. Run

1. Run the project by php command.
   ```bash
      php artisan serve
   ```

	 
## Frontend Setup (React):
The frontend is a React application typically served by a development server.

### 1. Installation

1. Navigate into the frontend project directory (e.g., cd frontend).
2. Install JavaScript dependencies:
   ```bash
   npm install
   ```

### 2. Run

1. Run the project by npm command.
   ```bash
      npm run dev
   ```


## For More Deatils : Read the document Database_Token_Approach.pdf 

