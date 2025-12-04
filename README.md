# StepWise -- Fresh Footwear E-Commerce Platform

StepWise is a locally hosted full-stack web application designed as an
online shoe store. Users can browse products, view details, and interact
with the early foundations of a shopping experience. This project is
developed for **CP317A -- Software Engineering**, Group XVIII.

## 🛠️ Tech Stack

-   **Next.js 14** (App Router)
-   **React**
-   **TailwindCSS**
-   **Prisma ORM** (local SQLite database)
-   **NextAuth.js**
-   **Python (Flask)** for the admin management tool
-   **TypeScript**

## 📌 Project Overview

This repository contains the first working prototype of the Fresh
Footwear platform. The project focuses on building maintainable, modular
architecture that evolves across sprints.

### Features implemented so far:

-   Home page layout
-   Product catalogue page (static structure)
-   Product detail page
-   Local database (SQLite)
-   Authentication setup with NextAuth
-   Admin management tool (Flask app)
-   UI component foundations (nav bar, product cards, footer)

## 📂 Folder Structure

    StepWise/
    │── app/
    │   ├── api/            # API routes (auth, users, products)
    │   ├── admin/          # Admin dashboard structure
    │   ├── product/        # Product detail pages
    │   ├── components/     # Reusable UI components
    │   └── page.tsx        # Home page
    │
    │── prisma/
    │   └── schema.prisma   # Local SQLite database schema
    │
    │── admin_app.py        # Flask-based admin backend
    │
    │── public/
    │   └── images/         # Assets
    │
    │── utils/              # DB + auth helper files
    │── package.json
    │── README.md

## ⚙️ Getting Started (Main Web App)

### 1. Clone the repo

``` bash
git clone https://github.com/ShadowMaster1453/StepWise.git
cd StepWise
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Create a `.env` file

    NEXTAUTH_SECRET="your-secret"
    NEXTAUTH_URL="http://localhost:3000"
    DATABASE_URL="file:./dev.db"

### 4. Push the database schema

``` bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

``` bash
npm run dev
```

Visit http://localhost:3000

# 🛡️ Running the Admin Dashboard (Python Flask App)

The project includes a separate admin backend interface used for
managing data locally.

### 1. Run the admin Flask app

``` bash
python admin_app.py
```

### 2. Visit the admin dashboard

Open the URL printed in the terminal, typically:

    http://127.0.0.1:5000

### 3. Log in using:

-   Username: **admin**
-   Password: **123456**
# StepWise -- Fresh Footwear E-Commerce Platform

StepWise is a locally hosted full-stack web application designed as an
online shoe store. Users can browse products, view details, and interact
with the early foundations of a shopping experience. This project is
developed for **CP317A -- Software Engineering**, Group XVIII.

## 🛠️ Tech Stack

-   **Next.js 14** (App Router)
-   **React**
-   **TailwindCSS**
-   **Prisma ORM** (local SQLite database)
-   **NextAuth.js**
-   **Python (Flask)** for the admin management tool
-   **TypeScript**

## 📌 Project Overview

This repository contains the first working prototype of the Fresh
Footwear platform. The project focuses on building maintainable, modular
architecture that evolves across sprints.

### Features implemented so far:

-   Home page layout
-   Product catalogue page (static structure)
-   Product detail page
-   Local database (SQLite)
-   Authentication setup with NextAuth
-   Admin management tool (Flask app)
-   UI component foundations (nav bar, product cards, footer)

## 📂 Folder Structure

    StepWise/
    │── app/
    │   ├── api/            # API routes (auth, users, products)
    │   ├── admin/          # Admin dashboard structure
    │   ├── product/        # Product detail pages
    │   ├── components/     # Reusable UI components
    │   └── page.tsx        # Home page
    │
    │── prisma/
    │   └── schema.prisma   # Local SQLite database schema
    │
    │── admin_app.py        # Flask-based admin backend
    │
    │── public/
    │   └── images/         # Assets
    │
    │── utils/              # DB + auth helper files
    │── package.json
    │── README.md

## ⚙️ Getting Started (Main Web App)

### 1. Clone the repo

``` bash
git clone https://github.com/ShadowMaster1453/StepWise.git
cd StepWise
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Create a `.env` file

    NEXTAUTH_SECRET="your-secret"
    NEXTAUTH_URL="http://localhost:3000"
    DATABASE_URL="file:./dev.db"

### 4. Push the database schema

``` bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

``` bash
npm run dev
```

Visit http://localhost:3000

# 🛡️ Running the Admin Dashboard (Python Flask App)

The project includes a separate admin backend interface used for
managing data locally.

### 1. Run the admin Flask app

``` bash
python admin_app.py
```

### 2. Visit the admin dashboard

Open the URL printed in the terminal, typically:

    http://127.0.0.1:5000

### 3. Log in using:

-   Username: **admin**
-   Password: **123456**


## 🔒 Environment Variables





  Variable          Purpose


  ----------------- ------------------------------


  DATABASE_URL      Connection string for NeonDB


  NEXTAUTH_SECRET   Encryption key for sessions


  NEXTAUTH_URL      Auth callback URL





## 👥 Team XVIII





  Member           Role


  ---------------- ----------------------


  Nadeem Almalki   Product Owner


  Daniel Cao       Full Stack Developer


  Hani Imran       Full Stack Developer


  Jimmy Lin        Cloud Developer


  Jake Lloyd       Front-End Developer


  Evan Morris      Cloud Developer
## 📍 Sprint 01 Scope

Established the core foundation of the application: - Base routing -
Authentication - Local database setup - Admin dashboard (Flask) -
Initial UI structure

## 📈 Roadmap

-   Sprint 02: Product filtering, cart logic
-   Sprint 03: Checkout flow + improved admin tools
-   Sprint 04: CRUD operations, statistics dashboard
-   Sprint 05: Final polish & presentation

## 📍 Sprint 01 Scope

Established the core foundation of the application: - Base routing -
Authentication - Local database setup - Admin dashboard (Flask) -
Initial UI structure

## 📈 Roadmap

-   Sprint 02: Product filtering, cart logic
-   Sprint 03: Checkout flow + improved admin tools
-   Sprint 04: CRUD operations, statistics dashboard
-   Sprint 05: Final polish & presentation
