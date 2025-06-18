# BookChest

A simple and elegant bookmark management application built with Laravel and React. BookChest helps users organize their favorite websites with categories, archive old bookmarks, and access them anywhere.

## Features

-   **Categorize Bookmarks** - Users can create categories to organize bookmarks efficiently
-   **Easy to Add** - Quickly add and save bookmarks with title, URL, and description
-   **Archive Option** - Archive bookmarks instead of deleting them completely
-   **Secure Access** - Bookmarks are private and only accessible with user accounts
-   **Dark/Light Mode** - Toggle between dark and light themes
-   **Responsive Design** - Works great on desktop and mobile devices
-   **Search & Filter** - Find bookmarks quickly with search and category filters
-   **Multiple Views** - Switch between grid and list views for bookmarks

## Tech Stack

-   **Backend**: Laravel (PHP)
-   **Frontend**: React with TypeScript
-   **Database**: MySQL
-   **Full-Stack Framework**: Inertia.js (connects Laravel & React)
-   **Styling**: Tailwind CSS + shadcn/ui components
-   **Build Tool**: Vite
-   **Animations**: Framer Motion

## Prerequisites

Before running this project, ensure the following are installed:

-   **PHP 8.2** or higher
-   **Composer** (Dependency manager for PHP)
-   **Laragon 6.0** (Local development environment - note: v8.0+ is not free)
-   **Node.js v22** or higher
-   **MySQL** database
-   **npm** or **yarn**

## Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/SSKiyan25/bookmarker.git
    cd bookmarker
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Configure the database**

    Edit the `.env` file and set MySQL database credentials:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=bookmarker
    DB_USERNAME=root
    DB_PASSWORD=
    ```

6. **Run database migrations**

    ```bash
    php artisan migrate
    ```

7. **Build frontend assets**
    ```bash
    npm run build
    ```

## Development Status

**Note**: This application is currently in development and has not yet been deployed to production. It runs locally for development and testing purposes using Laragon.

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

If issues are encountered or questions arise, please create an issue in the GitHub repository.

---

**Happy Bookmarking!**
