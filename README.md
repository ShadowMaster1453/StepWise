# StepWise -- Fresh Footwear E-Commerce Platform

StepWise is a modern full-stack web application designed to serve as an
online shoe store. Users can browse products, view details, and interact
with the early foundations of a full shopping experience. This project
is developed for **CP317A -- Software Engineering**, Group XVIII.

## 🛠️ Tech Stack

-   **Next.js 14** (App Router)
-   **React**
-   **TailwindCSS**
-   **Prisma ORM**
-   **NeonDB (PostgreSQL)**
-   **NextAuth.js**
-   **TypeScript**

## 📌 Project Overview

This repository contains the initial implementation of the Fresh
Footwear platform. The goal is to build a clean, scalable, cloud-hosted
e-commerce system that will grow over multiple sprints.

### Features implemented so far:

-   Home page layout
-   Product catalogue page structure
-   Product detail page structure
-   Auth setup with NextAuth
-   Initial Prisma schema + database connection
-   Basic admin dashboard layout
-   Core UI components (navigation, product cards, layout)

## 📂 Folder Structure

    StepWise/
    │── app/
    │   ├── api/            # API routes (auth, users, products)
    │   ├── admin/          # Admin dashboard sections
    │   ├── product/        # Product detail pages
    │   ├── components/     # Reusable UI components
    │   └── page.tsx        # Home page
    │
    │── prisma/
    │   └── schema.prisma   # Database schema (Neon/Postgres)
    │
    │── public/
    │   └── images/         # Assets
    │
    │── utils/              # DB connection + auth helpers
    │── package.json
    │── README.md

## ⚙️ Getting Started

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

    DATABASE_URL="your-neon-postgres-url"
    NEXTAUTH_SECRET="your-secret"
    NEXTAUTH_URL="http://localhost:3000"

### 4. Push database schema

``` bash
npx prisma generate
npx prisma db push
```

### 5. Run the dev server

``` bash
npm run dev
```

Open http://localhost:3000

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

The primary objective for Sprint 01 was to establish the core project
infrastructure: - Base Next.js routing - UI foundations - Initial
database + Prisma schema - Authentication setup - Admin dashboard
scaffolding

## 📈 Roadmap

-   Sprint 02: Cart + checkout structure
-   Sprint 03: Stripe integration + order history
-   Sprint 04: Admin CRUD + reporting
-   Sprint 05: Deployment + final polish
