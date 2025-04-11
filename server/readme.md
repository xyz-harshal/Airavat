# FastAPI Server Project Template Starters

This guide covers setting up the FastAPI backend, managing dependencies, and running the server in different environments.

---

## 🚀 Prerequisites

Ensure you have the following installed:

- **Python** (>=3.8)
- **PostgreSQL** (if using PostgreSQL as your database)
- **pip** (Python package manager)
- **virtualenv** (for isolated dependencies)

---

## 🛠️ Environment Setup

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/xyz-harshal/fastapi_server.git
cd fastapi_server
```

### 2️⃣ **Create and Activate Virtual Environment**

```sh
python3 -m venv .venv
```

- **Linux/macOS:**
  ```sh
  source .venv/bin/activate
  ```
- **Windows (CMD):**
  ```sh
  .venv\Scripts\activate
  ```

### 3️⃣ **Install Dependencies**

```sh
pip install -r requirements.txt
```

### 4️⃣ **Set Up Environment Variables**

Create a `.env` file in the root directory with the following variables:

```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
GROQ_API_KEY=your-groq-api-key
SECRET_KEY=your-secret-key
ALGORITHM=HS256
```

> ⚠️ **IMPORTANT**: Never commit your `.env` file to version control. Add it to your `.gitignore` file.

---

## 🎯 Running the Backend Server

### **Run the FastAPI Development Server**

```sh
uvicorn main:app --reload
```

> `--reload` enables auto-restart on code changes.

---

## 🔥 API Documentation

Once the server is running, visit:

- &#x20;[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Redoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🛠️ Additional Commands

### **Freeze Dependencies (Update `requirements.txt`)**

```sh
pip freeze > requirements.txt
```

### **Deactivate Virtual Environment**

```sh
deactivate
```

---

## 🎯 Deployment Notes

For production, set environment variables directly in the OS:

```sh
export SECRET_KEY="your-secret-key"
export DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature-branch`)
5. Open a Pull Request 🚀

---

## ✨ Author

Maintained by [xyz\_sync](https://xyz-sync.vercel.app/) 🚀
