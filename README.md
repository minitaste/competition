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

---

🎉 **Your project is now set up! Happy coding!** 🚀

