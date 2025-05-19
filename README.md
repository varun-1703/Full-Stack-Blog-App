# 🚀 Full-Stack Blogify - Create, Share, Inspire! 📝

![Blogify Showcase](https://via.placeholder.com/800x300.png?text=Blogify+Application+Showcase)

**Live Demo URL:**  (Coming Soon!)
**Loom Walkthrough:** (Coming Soon!)

---

## ✨ About The Project

**Blogify** is a dynamic full-stack web application that empowers users to create, manage, and share their thoughts and stories through blog posts. Built with modern technologies, it features a sleek user interface, robust user authentication, and a comprehensive API for content management.

This project was developed as a full-stack assessment, showcasing skills in both frontend and backend development, API design, database management, and cloud deployment.

---

## 🌟 Features

*   **User Authentication:**
    *   Secure user registration with email and password.
    *   User login and session management using token-based authentication.
*   **Blog Post Management (CRUD):**
    *   **Create:** Logged-in users can easily create new blog posts with a title and rich content.
    *   **Read:**
        *   Publicly accessible page listing all blog posts with pagination.
        *   Publicly accessible detailed view for each blog post.
    *   **Update:** Authors can edit their own published blog posts.
    *   **Delete:** Authors can delete their own blog posts.
*   **Responsive Design:** Enjoy a seamless experience on desktops, tablets, and mobile devices.
*   **Public & Private Content:**
    *   Published blogs are viewable by everyone.
    *   Blog creation and management are restricted to authenticated authors.
*   **RESTful API:** Well-structured backend API for all operations.

---

## 🛠️ Tech Stack

This project is built with a carefully selected stack of free-tier friendly and powerful technologies:

*   **Frontend:**
    *   **React (with Vite):** A JavaScript library for building user interfaces, powered by Vite for a fast development experience.
    *   **React Router:** For client-side routing and navigation.
    *   **Axios:** For making HTTP requests to the backend API.
    *   **CSS3:** For styling and responsive design.
*   **Backend:**
    *   **Django:** A high-level Python web framework for rapid development.
    *   **Django REST Framework (DRF):** A powerful toolkit for building Web APIs.
    *   **Token Authentication (DRF):** For securing API endpoints.
*   **Database:**
    *   **PostgreSQL:** A powerful, open-source object-relational database system.
*   **Version Control:**
    *   **Git & GitHub:** For source code management and collaboration.
*   **Deployment (Planned):**
    *   **Frontend:** Vercel (or similar like Netlify)
    *   **Backend & Database:** Render (or similar like Railway, PythonAnywhere)

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

*   **Node.js and npm:** (LTS version recommended) - [Download Node.js](https://nodejs.org/)
*   **Python:** (Version 3.8+ recommended) - [Download Python](https://www.python.org/)
*   **PostgreSQL:** (Ensure the server is running) - [Download PostgreSQL](https://www.postgresql.org/download/)
*   **Git:** For cloning the repository - [Download Git](https://git-scm.com/)

###  Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/fullstack-blog-app.git
    cd fullstack-blog-app
    ```

2.  **Backend Setup (`backend/` directory):**
    ```bash
    cd backend

    # Create and activate a Python virtual environment
    python -m venv venv
    # On Windows:
    # venv\Scripts\activate
    # On macOS/Linux:
    # source venv/bin/activate

    # Install backend dependencies
    pip install -r requirements.txt

    # Create a .env file in the 'backend' directory (copy from .env.example if provided, or create manually)
    # Add your PostgreSQL database credentials and a Django SECRET_KEY:
    # Example backend/.env:
    # DJANGO_SECRET_KEY='your_strong_random_secret_key'
    # DEBUG=True
    # DB_NAME=blog_app_db
    # DB_USER=blog_app_user
    # DB_PASSWORD=your_db_password
    # DB_HOST=localhost
    # DB_PORT=5432

    # Set up your PostgreSQL database:
    # 1. Ensure PostgreSQL server is running.
    # 2. Create a database (e.g., 'blog_app_db') and a user (e.g., 'blog_app_user') with privileges.
    #    (Refer to PostgreSQL documentation or the project's setup phase for commands)

    # Apply database migrations
    python manage.py makemigrations
    python manage.py migrate

    # Create a superuser (optional, for Django admin panel access)
    python manage.py createsuperuser

    # Run the backend development server (usually on http://127.0.0.1:8000)
    python manage.py runserver
    ```

3.  **Frontend Setup (`frontend/blog_ui/` directory):**
    *(Open a new terminal for this, or navigate from the project root)*
    ```bash
    cd frontend/blog_ui

    # Install frontend dependencies
    npm install

    # Create a .env file in the 'frontend/blog_ui' directory
    # Add the backend API URL:
    # Example frontend/blog_ui/.env:
    # VITE_API_BASE_URL=http://127.0.0.1:8000/api

    # Run the frontend development server (usually on http://localhost:5173)
    npm run dev
    ```

4.  **Access the Application:**
    *   Open your browser and navigate to `http://localhost:5173` (or the port your frontend server is running on).

---

## 📜 API Endpoints (Backend)

The backend provides the following key API endpoints under the `/api/` prefix:

*   **Authentication:**
    *   `POST /auth/register/`: User registration.
    *   `POST /auth/login/`: User login, returns auth token.
    *   `POST /auth/logout/`: User logout (requires token).
    *   `GET /auth/user/`: Get current logged-in user details (requires token).
*   **Blog Posts:**
    *   `GET /blogs/`: List all blog posts (public, paginated).
    *   `POST /blogs/`: Create a new blog post (requires token).
    *   `GET /blogs/{id}/`: Retrieve a single blog post (public).
    *   `PUT /blogs/{id}/`: Update a blog post (author only, requires token).
    *   `DELETE /blogs/{id}/`: Delete a blog post (author only, requires token).

---

## 🎨 UI Pages (Frontend)

*   `/signup`: User Registration Page.
*   `/login`: User Login Page.
*   `/`: Blog Listing Page (public, with pagination).
*   `/blogs/create`: Blog Creation Page (accessible only to logged-in users).
*   `/blogs/:id`: Blog Detail Page (public, shows full content).
*   `/blogs/:id/edit`: Blog Edit Page (only for blog authors).

---

## 🤝 Contributing

This project was created for assessment purposes. However, if you have suggestions or find bugs, feel free to open an issue!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is unlicensed and intended for demonstration purposes.

---

## 🙏 Acknowledgements

*   The frameworks and libraries that made this possible: React, Django, Django REST Framework, PostgreSQL.
*   Assessment providers for the opportunity.

---

**Happy Blogging!** 🎉