# Competition

## Description
**Competition** is a platform where users can create, and manage **3x3 basketball tournaments**. The platform offers various features to make organizing tournaments easier, including:

- **News Section:** The homepage displays basketball news parsed from the official **FBU** website.
- **Tournament Management:** Users can create and view tournaments, and each tournament has its own dedicated page.
- **Team Registration:** Registered users can add teams to tournaments.
- **Player Management:** Players can be added to teams from a list of registered users.
- **Match Statistics:** Teams can record match statistics.
- **Player Statistics:** Individual player performance can be tracked for each match.
- **User Profile:** Displays all teams a user has participated in, with options to edit team details.

# 📌 Project Setup Guide

## 🚀 Installation

### 🖥️ Backend Setup

1. **Download & Install Python**
   - [Download Python 3.13.2](https://www.python.org/downloads/release/python-3132/)

2. **Install Dependencies**
   ```sh
   pip install -r requirements.txt
   ```

3. **Apply Migrations**
   ```sh
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Run Development Server**
   ```sh
   python manage.py runserver
   ```

---

### 🎨 Frontend Setup

1. **Install npm** (if not installed):  
   [Download Node.js](https://nodejs.org/)

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Start Development Server**
   ```sh
   npm run dev
   ```

4. **Configure Environment Variables**
   - Create a `.env` file in the `frontend` directory.
   - Add the following line:
     ```sh
     VITE_API_URL="http://127.0.0.1:8000/"
     ```


## Technologies Used



- **Backend:** Django, Django REST Framework (DRF)

- **Frontend:** React, Vite

- **Authentication:** JWT (JSON Web Token)

- **Other Tools:** dotenv, Django CORS Headers

---
  
  🎉 **Your project is now set up! Happy coding!** 🚀

