Installation
Backend:
Download Python 
https://www.python.org/downloads/release/python-3132/
install packeges(all in requirements.txt)
python manage.py makemigrations
python manage.py migrate 
python manage.py runserver
Frontend:
install npm
npm install
npm run dev
Create .env in frontenv directory and add this line
VITE_API_URL = "http://127.0.0.1:8000/"

