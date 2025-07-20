# 🧠 NeuroTwin: Brain Digital Twin Platform

<div align="center">

**🔮 Advanced EEG Analysis & Neural Simulation Platform 🧬**

[![Next.js](https://img.shields.io/badge/frontend-Next.js%2015-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/language-Python%203.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/library-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

</div>

## 🚀 What is NeuroTwin?

NeuroTwin is a cutting-edge platform that creates personalized **Digital Brain Twins** from EEG data, enabling medical professionals to:

- 📊 Analyze EEG patterns for neurological conditions
- 💊 Simulate medication responses before prescription
- 🔮 Predict surgical outcomes with high accuracy
- 🧠 Visualize brain activity patterns in 3D
- 🤖 Leverage AI for automated clinical insights

> **Note:** NeuroTwin is a next-generation neural modeling platform that transforms how clinicians interact with patient brain data.

## ✨ Key Features

<div align="center">

| 🔍 **EEG Analysis** | 🧪 **Treatment Simulation** | 🧠 **Brain Visualization** | 🤖 **AI Assistant** |
|:------------------:|:---------------------------:|:--------------------------:|:------------------:|
| Epilepsy detection | Medication response        | 3D neural mapping          | Clinical insights  |
| Seizure risk       | Surgical outcomes          | Temporal activity tracking | Report generation  |
| Cognitive patterns | Side effect prediction     | Regional abnormality view  | Diagnostic support |

</div>

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with SSR & App Router
- **React 19** - Component-based UI library
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Accessible component library
- **Electron** - Desktop application support (optional)

### Backend
- **FastAPI** - High-performance Python API framework
- **Supabase** - Database & authentication
- **PyTorch** - Neural network models
- **MNE** - EEG/MEG data processing
- **Groq API** - LLM integration for clinical insights

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Supabase account
- Groq API key

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/NeuroTwin.git
cd NeuroTwin
```

### 2️⃣ Backend Setup

NeuroTwin has two backend services: a FastAPI server and a Flask server. Both need to be running for full functionality.

#### FastAPI Backend

```bash
# Create and activate virtual environment
cd server
python -m venv venv

# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see template below)
# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Flask Backend

```bash
# With the same virtual environment active
cd server

# Start the Flask server
python app.py
# This will run on port 5000 by default
```

**Backend `.env` Template:**
```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
GROQ_API_KEY=your-groq-api-key
SECRET_KEY=your-jwt-secret-key
ALGORITHM=HS256
```

### 3️⃣ Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

**Client `.env.local` Template:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4️⃣ Access the Application
- Web App: [http://localhost:3000](http://localhost:3000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🧪 Key Modules

### 🔍 EEG Analysis
Upload and process EEG data to create personalized brain models and detect neurological conditions.

### 🧠 Brain Viewer
Interactive 3D visualization of brain activity patterns, allowing temporal exploration and abnormality detection.

### 💊 Medication Simulation
Simulate the effects of medications on brain activity with personalized Digital Twin models.

### 🔪 Surgical Simulation
Predict outcomes of different surgical approaches for neurological conditions.

### 📊 Patient Records
Manage patient data, EEG recordings, and analysis results in a secure dashboard.

## 💻 Development Commands

### Backend
```bash
# Run tests
pytest

# Generate OpenAPI schema
python -c "import main; print(main.app.openapi())" > openapi.json

# Create migration
python -m alembic revision --autogenerate -m "migration message"

# Apply migration
python -m alembic upgrade head
```

### Frontend
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Electron app (desktop)
npm run electron-dev

# Build Electron app
npm run electron-build
```

## 🌍 Deployment

### Backend Deployment
```bash
# Using Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend Deployment
```bash
# Build Next.js app
npm run build

# Deploy to Vercel
vercel
```

## 📱 Desktop Application

NeuroTwin can also run as a desktop application using Electron:

```bash
# Run Electron dev mode
npm run electron-dev

# Package for distribution
npm run electron-build
```

## 🔒 Security Notes

- All EEG data is processed locally before storage
- End-to-end encryption for patient records
- Role-based access control for clinical teams
- Compliance with healthcare data regulations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin amazing-feature`)
5. Open a Pull Request


## 👥 Team

- **Harshal** - *Developer* - [GitHub](https://github.com/yourusername)
- **Ghruank** - *Developer* - [GitHub](https://github.com/Ghruank)
- **Prathamesh** - *Developer* - [GitHub](https://github.com/PMS61)
- **Yadnesh** - *Developer* - [GitHub](https://github.com/YoLynx)

---

<div align="center">
  <p>
    <strong>NeuroTwin: Transforming Neurological Care with Digital Brain Twins</strong>
  </p>
  <p>
    Made with ❤️ by the NeuroTwin Team
  </p>
</div>
