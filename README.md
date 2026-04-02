# AI Photo Enhancer

A full-stack web application that enhances image quality using optimized image processing techniques. The app allows users to upload images, apply enhancement, and visually compare results in real-time.

---

## 🚀 Features

* Upload images via drag & drop or file picker
* Image enhancement with high-quality upscaling
* Before vs After comparison slider
* Download enhanced image
* Modern dark-themed UI with smooth animations

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Framer Motion (animations)
* Axios

### Backend

* Flask (Python)
* OpenCV (image processing)

---

## 🧠 How It Works

* Images are uploaded from the frontend to a Flask backend
* The backend applies:

  * High-quality Lanczos upscaling
  * Subtle sharpening (unsharp masking)
  * Light contrast adjustment
* The processed image is returned and displayed in the UI

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-photo-enhancer.git
cd ai-photo-enhancer
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📌 Notes

* This project uses classical image processing techniques (OpenCV), not deep learning models
* Enhancement is optimized to preserve texture and color accuracy
* Upload and output images are not stored in the repository

---

## 🎯 Future Improvements

* AI-based enhancement (ESRGAN / GFPGAN)
* Cloud deployment (Render / Vercel)
* Batch image processing

---

## 📄 License

This project is for educational and portfolio purposes.
