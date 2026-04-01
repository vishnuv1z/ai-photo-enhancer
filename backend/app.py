import os
import cv2
from flask import Flask, request, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return "Backend is running"


# ─────────────────────────────────────────────
# SIMPLE & CLEAN ENHANCEMENT
# ─────────────────────────────────────────────
def enhance_image_quality(input_path, output_path):
    img = cv2.imread(input_path, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid image")

    # 1. High-quality upscale
    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_LANCZOS4)

    # 2. Very light sharpening (preserves texture)
    blur = cv2.GaussianBlur(img, (0, 0), 1.0)
    img = cv2.addWeighted(img, 1.05, blur, -0.05, 0)

    # 3. Slight contrast boost (safe)
    img = cv2.convertScaleAbs(img, alpha=1.03, beta=2)

    # 4. Save with high quality
    ext = os.path.splitext(output_path)[1].lower()
    if ext == ".png":
        cv2.imwrite(output_path, img, [cv2.IMWRITE_PNG_COMPRESSION, 1])
    else:
        cv2.imwrite(output_path, img, [cv2.IMWRITE_JPEG_QUALITY, 98])


# ─────────────────────────────────────────────
# API ROUTE
# ─────────────────────────────────────────────
@app.route("/enhance", methods=["POST"])
def enhance():
    if "image" not in request.files:
        return {"error": "No image uploaded"}, 400

    file = request.files["image"]
    filename = file.filename or "upload.jpg"

    input_path = os.path.join(UPLOAD_FOLDER, filename)
    output_path = os.path.join(OUTPUT_FOLDER, filename)

    file.save(input_path)

    try:
        enhance_image_quality(input_path, output_path)
    except Exception as e:
        return {"error": str(e)}, 500

    ext = os.path.splitext(filename)[1].lower()
    mimetype = "image/png" if ext == ".png" else "image/jpeg"

    return send_file(output_path, mimetype=mimetype)


if __name__ == "__main__":
    app.run(debug=True)