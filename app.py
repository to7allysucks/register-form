import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    print(f"Полученные данные: {data}")

    if not username or not email or not password:
        return jsonify({"error": "Заполните все поля!"}), 400

    hashed_password = generate_password_hash(password)
    print(hashed_password)

    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()

        cursor.execute('INSERT INTO users (username,email, password) VALUES (?, ?, ?)', (username, email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"message": f"Успешная регистрация!"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "Пользователь с таким username или email уже зарегистрирован"}), 400

    except Exception as e:
        return f"Произошла непредвиденная ошибка - {e}"

if __name__ == '__main__':
    app.run(debug=True, port=5000)