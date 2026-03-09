from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
from clip_model import classify_flower


app = Flask(__name__)
CORS(app, resources={r"/classify": {"origins": "http://localhost:5173"}})
THRESHOLD = 0.85

@app.route('/classify', methods=['POST'])
def classify():
    try:

        data = request.get_json()
        image_data = data['image']
        image_base64 = image_data.split(",")[1]

        img_bytes = base64.b64decode(image_base64)

        file_path = "user_drawing.png"
        with open(file_path, "wb") as f:
            f.write(img_bytes)

        label, confidence = classify_flower(file_path)

        if label == "flower" and confidence >= THRESHOLD:
            return jsonify({"label": label, "confidence": confidence})
        else:
            # Reject low-confidence flower or non-flower
            return jsonify({"label": "not a flower", "confidence": confidence})
    
    except Exception as e:
        print("Error in /classify:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)