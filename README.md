# StepWise -- Fresh Footwear E-Commerce Platform

StepWise is a locally hosted full-stack web application designed as an
online shoe store.\
Users can browse products, view details, and interact with the early
foundations of a shopping experience.\
This project is developed for **CP317A -- Software Engineering**, Group
XVIII.

------------------------------------------------------------------------

# 🛠️ Tech Stack

### **Frontend**

-   Next.js 14 (App Router)\
-   React\
-   TailwindCSS\
-   Prisma ORM (SQLite)\
-   NextAuth.js\
-   TypeScript

### **Admin Backend**

-   Python\
-   Flask\
-   MySQL\
-   Jinja2 HTML templates\
-   Manual SQL imports

------------------------------------------------------------------------

# 📌 Project Overview

The project uses a **hybrid architecture**:

### **1. Next.js Frontend**

-   Uses **SQLite** (`/prisma/dev.db`)
-   Managed through **Prisma ORM**
-   Handles:
    -   Home page
    -   Catalogue browsing
    -   Product details
    -   Authentication

### **2. Flask Admin Dashboard**

-   Uses **MySQL**
-   Requires importing **12 database tables** from `/database/`
-   Handles:
    -   Admin product/user management
    -   Checkout backend verification
    -   Full database control

The two systems work together but use different database engines.

------------------------------------------------------------------------

# 📂 Folder Structure

    StepWise/
    │── app/
    │   ├── api/
    │   ├── admin/
    │   ├── product/
    │   ├── components/
    │   └── page.tsx
    │
    │── prisma/
    │   ├── schema.prisma
    │   └── dev.db
    │
    │── database/
    │   ├── *.sql
    │   └── README.txt
    │
    │── admin/
    │   ├── admin_app.py
    │   ├── db.py
    │   └── templates/
    │       ├── *.html
    │
    │── public/
    │── utils/
    │── package.json
    │── README.md

------------------------------------------------------------------------

# ⚙️ Setting Up the Next.js Frontend (SQLite + Prisma)

### **1. Clone the repo**

``` bash
git clone https://github.com/ShadowMaster1453/StepWise.git
cd StepWise
```

### **2. Install dependencies**

``` bash
npm install
```

### **3. Create a `.env` file**

    DATABASE_URL="file:./prisma/dev.db"
    NEXTAUTH_SECRET="mysecret"
    NEXTAUTH_URL="http://localhost:3000"

### **4. Initialize the database**

``` bash
npx prisma generate
npx prisma db push
```

### **5. Run the development server**

``` bash
npm run dev
```

Visit the frontend:\
👉 http://localhost:3000

------------------------------------------------------------------------

# 🛡️ Setting Up the Flask Admin Dashboard (MySQL)

### **1. Open MySQL Workbench**

Make sure your MySQL server is running.

### **2. Create a schema**

For example:

    fresh_footwear

### **3. Import all 12 tables**

Use the files in:

    /database/

In MySQL Workbench: - **Server → Data Import**, or\
- **File → Run SQL Script**

### **4. Update `admin/db.py` with YOUR credentials**

``` python
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="YOUR_PASSWORD",
    database="fresh_footwear"
)
```

### **5. Make sure all template files exist**

Located in:

    /admin/templates/

### **6. Run the admin dashboard**

``` bash
python admin_app.py
```

The terminal will show something like:

     * Running on http://127.0.0.1:5000

Open this in Chrome.

### **7. Login credentials**

-   Username: **admin**
-   Password: **123456**

------------------------------------------------------------------------

# 🧩 System Interaction

### **Frontend**

Uses SQLite to render pages and handle local logic.

### **Backend**

Uses MySQL for: - Product storage\
- User data\
- Checkout functionality

confirmed checkout **writes into MySQL**.

------------------------------------------------------------------------

# 🔒 Environment Variables Summary

  Variable            Used By   Description
  ------------------- --------- --------------------
  `DATABASE_URL`      Next.js   SQLite path
  `NEXTAUTH_SECRET`   Next.js   Session encryption
  `NEXTAUTH_URL`      Next.js   Base URL

MySQL credentials stay inside `admin/db.py`.

------------------------------------------------------------------------

# 👥 Group XVIII

  Member               Role
  -------------------- ----------------------
  **Nadeem Almalki**   Product Owner
  Daniel Cao           Full Stack Developer
  Hani Imran           Full Stack Developer
  Jimmy Lin            Cloud Developer
  Jake Lloyd           Front-End Developer
  Evan Morris          Cloud Developer

