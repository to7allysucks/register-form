import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    print(f"Полученные данные: {data}")

    return jsonify({
        "status": "success",
        "message": "Данные получены."
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)