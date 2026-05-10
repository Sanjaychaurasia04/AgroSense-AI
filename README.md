<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=1b4332,2d6a4f,40916c,52b788&height=220&section=header&text=🌿%20AgroSense%20AI&fontSize=64&fontColor=ffffff&fontAlignY=40&desc=Intelligent%20Farming%20Powered%20by%20Deep%20Learning&descAlignY=62&descSize=20&animation=fadeIn" />

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Try%20It%20Now-2d6a4f?style=for-the-badge)](https://agro-sense-ai-smoky.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/⭐%20GitHub-Star%20This%20Repo-181717?style=for-the-badge&logo=github)](https://github.com/Sanjaychaurasia04/AgroSense-AI)
[![MIT License](https://img.shields.io/badge/License-MIT-a7f3d0?style=for-the-badge)](LICENSE)

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-Authentication-EB5424?style=flat-square&logo=auth0&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow%2FKeras-ResNet--50-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![HuggingFace](https://img.shields.io/badge/Hugging%20Face-Model%20API-FFD21E?style=flat-square&logo=huggingface&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)

<br/>

> **AgroSense AI** is an end-to-end precision agriculture platform that brings deep learning to every farmer's fingertips.
> Detect plant diseases from a leaf photo, get smart crop recommendations from soil data, check live weather,
> and chat with an AI farming assistant — all in one unified, mobile-ready web application.

<br/>

</div>

---

## 📋 Table of Contents

- [Why AgroSense AI?](#-why-agrosense-ai)
- [Live Demo](#-live-demo)
- [Features](#-features)
  - [Plant Disease Detection](#-1-plant-disease-detection)
  - [Crop Recommendation Engine](#-2-crop-recommendation-engine)
  - [Real-Time Weather Dashboard](#-3-real-time-weather-dashboard)
  - [AI Farming Chatbot](#-4-ai-farming-chatbot)
- [System Architecture](#️-system-architecture)
- [Deep Learning Model](#-deep-learning-model)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Backend & API Proxy](#-backend--api-proxy)
- [ML Model Deployment](#-ml-model-deployment-hugging-face)
- [Deployment Guide](#-deployment-guide)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌾 Why AgroSense AI?

> *India loses an estimated **₹50,000 crore** worth of crops every year to plant diseases and poor crop selection. Most farmers never receive a timely diagnosis.*

Farmers across rural India and the developing world face the same compounding challenges every season: diseases go undetected until yield is already lost, soil analysis requires expensive lab visits, and expert agronomists are out of reach. Existing digital tools demand technical literacy, reliable internet, or costly subscriptions.

**AgroSense AI was built to close every one of those gaps.**

| Without AgroSense AI | With AgroSense AI |
|---|---|
| Send leaf samples to a lab — wait days | Upload a photo — diagnosis in seconds |
| Guess which crop your soil supports | Enter soil data — get a data-driven recommendation |
| Juggle multiple apps for weather, crops, advice | One unified platform for everything |
| Pay consultation fees for agronomist guidance | Ask the AI chatbot anytime, completely free |
| Desktop-only tools farmers can't use in the field | Fully responsive — works on any phone |

---

## 🌐 Live Demo

**[→ agro-sense-ai-smoky.vercel.app](https://agro-sense-ai-smoky.vercel.app/)**

> **Note on first load:** The plant disease model runs on a free Hugging Face Space that sleeps when idle. The first inference after a period of inactivity may take 20–40 seconds to wake up. Subsequent requests are fast.

---

## ✨ Features

### 🦠 1. Plant Disease Detection

The flagship feature. Upload any leaf photo and a custom-trained **ResNet-50 convolutional neural network** classifies it across **38 disease categories** covering **14 crop species**.

**What you get back:**

| Field | Example |
|---|---|
| Disease name | `Tomato — Late Blight` |
| Confidence score | `94.7%` |
| Health status | `Diseased` / `Healthy` badge |
| Treatment advice | Specific fungicide, cultural, and irrigation recommendations |

**Supported crops:** Apple · Blueberry · Cherry · Corn · Grape · Orange · Peach · Bell Pepper · Potato · Raspberry · Soybean · Squash · Strawberry · Tomato

<details>
<summary><b>View all 38 disease classes</b></summary>

| # | Class | # | Class |
|---|---|---|---|
| 1 | Apple — Apple Scab | 20 | Bell Pepper — Healthy |
| 2 | Apple — Black Rot | 21 | Potato — Early Blight |
| 3 | Apple — Cedar Apple Rust | 22 | Potato — Late Blight |
| 4 | Apple — Healthy | 23 | Potato — Healthy |
| 5 | Blueberry — Healthy | 24 | Raspberry — Healthy |
| 6 | Cherry — Powdery Mildew | 25 | Soybean — Healthy |
| 7 | Cherry — Healthy | 26 | Squash — Powdery Mildew |
| 8 | Corn — Cercospora Leaf Spot | 27 | Strawberry — Leaf Scorch |
| 9 | Corn — Common Rust | 28 | Strawberry — Healthy |
| 10 | Corn — Northern Leaf Blight | 29 | Tomato — Bacterial Spot |
| 11 | Corn — Healthy | 30 | Tomato — Early Blight |
| 12 | Grape — Black Rot | 31 | Tomato — Late Blight |
| 13 | Grape — Esca (Black Measles) | 32 | Tomato — Leaf Mold |
| 14 | Grape — Leaf Blight | 33 | Tomato — Septoria Leaf Spot |
| 15 | Grape — Healthy | 34 | Tomato — Spider Mites |
| 16 | Orange — Haunglongbing | 35 | Tomato — Target Spot |
| 17 | Peach — Bacterial Spot | 36 | Tomato — Yellow Leaf Curl Virus |
| 18 | Peach — Healthy | 37 | Tomato — Mosaic Virus |
| 19 | Bell Pepper — Bacterial Spot | 38 | Tomato — Healthy |

</details>

---

### 🌾 2. Crop Recommendation Engine

Enter 7 soil and climate parameters and receive a data-driven recommendation for the crop most likely to thrive in your exact conditions.

**Input parameters:**

| Parameter | Unit | Why it matters |
|---|---|---|
| Nitrogen (N) | kg/ha | Drives vegetative and leaf growth |
| Phosphorus (P) | kg/ha | Root development, energy storage |
| Potassium (K) | kg/ha | Disease resistance, fruit quality |
| Temperature | °C | Germination window, growth rate |
| Humidity | % | Transpiration, fungal disease risk |
| pH Level | 0–14 | Nutrient availability, soil biology |
| Rainfall | mm | Water availability, irrigation need |

**Supported output crops:** Rice · Wheat · Maize · Chickpea · Kidney Beans · Pigeon Peas · Moth Beans · Mung Beans · Black Gram · Lentil · Pomegranate · Banana · Mango · Grapes · Watermelon · Muskmelon · Apple · Orange · Papaya · Coconut · Cotton · Jute · Coffee

---

### 🌤️ 3. Real-Time Weather Dashboard

Search any city worldwide and get live atmospheric conditions relevant to farm planning.

| Metric | Agricultural relevance |
|---|---|
| Temperature | Germination viability, frost risk |
| Humidity | Fungal disease outbreak probability |
| Wind speed & direction | Pesticide spray timing |
| Weather condition | Irrigation scheduling |
| Cloud cover | Solar exposure, photosynthesis |
| Visibility | General field operations |

---

### 🤖 4. AI Farming Chatbot

A conversational AI assistant embedded across the platform, purpose-built for agricultural queries — available 24/7 at no cost.

**Topics it handles:**

- Crop care — watering, pruning, growth stages
- Pest control — identification, organic vs. chemical options
- Fertilizers — NPK dosage, timing, deficiency symptoms
- Soil management — pH correction, composting, organic matter
- Seasonal planning — planting windows, harvest timing, crop rotation
- Platform guidance — routing users to the right AgroSense feature

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│              USER  (Any Device)                 │
│        Mobile  ·  Tablet  ·  Desktop            │
└──────────────────┬──────────────────────────────┘
                   │  HTTPS
┌──────────────────▼──────────────────────────────┐
│            VERCEL  (Global CDN)                 │
│  React 19 + Vite 7  —  Single-Page Application  │
│                                                 │
│  Pages: Home · DiseaseDetect · CropRec          │
│         Weather · About                         │
│  Components: Navbar · ChatBot · ImageUploader   │
│              ResultCard · WeatherCard           │
└──────────────────┬──────────────────────────────┘
                   │  All API calls routed via
                   │  Express backend proxy
┌──────────────────▼──────────────────────────────┐
│          NODE.JS / EXPRESS 5  (server.js)       │
│          MongoDB via Mongoose                   │
│          Auth0 Authentication                   │
│          API key proxy — keys never reach       │
│          the browser                            │
└────────────┬─────────────┬──────────────────────┘
             │             │                │
  ┌──────────▼──┐  ┌───────▼──────┐  ┌─────▼──────────┐
  │  HUGGING    │  │  OPENWEATHER │  │   LLM API      │
  │  FACE SPACE │  │  MAP API     │  │ (Chatbot)      │
  │  Flask +    │  │              │  │                │
  │  ResNet-50  │  │  Current     │  │  Agriculture-  │
  │  38 classes │  │  conditions  │  │  specialized   │
  │  87K images │  │  worldwide   │  │  assistant     │
  └─────────────┘  └──────────────┘  └────────────────┘
```

**ML Training Pipeline (separate, offline):**

```
Kaggle Notebook (NVIDIA P100 GPU)
  → New Plant Disease Dataset (87,000+ images, 38 classes)
  → Preprocessing + Augmentation
  → ResNet-50 Transfer Learning (Phase 1: frozen base)
  → Fine-tuning (Phase 2: unfrozen last N blocks, lr=1e-5)
  → Export → plant_disease_model.keras
  → Deploy → Hugging Face Spaces (Flask + Docker)
```

---

## 🧠 Deep Learning Model

### Why ResNet-50?

ResNet-50's **residual skip connections** solve the vanishing gradient problem that cripples standard deep networks. For plant disease detection specifically, the model must simultaneously learn low-level texture features (fine pigmentation, lesion boundaries) in early layers *and* high-level disease semantics in deep layers. Skip connections guarantee gradient flow to both, which is why ResNet-50 significantly outperforms shallower architectures on this fine-grained visual classification task.

### Dataset

| Property | Value |
|---|---|
| Name | New Plant Disease Dataset |
| Source | Kaggle |
| Total images | 87,000+ RGB leaf images |
| Classes | 38 (disease + healthy labels) |
| Crop species | 14 |
| Train / val split | 80% / 20% |
| Augmentation | Rotation · Horizontal flip · Zoom · Brightness shift |

### Training Pipeline

```
STEP 1 — Environment
  Platform : Kaggle Notebook · GPU : NVIDIA P100 (16 GB VRAM)
  Framework: TensorFlow 2.x + Keras

STEP 2 — Preprocessing
  • Resize all images to 224 × 224 px
  • Normalize pixel values: [0, 255] → [0.0, 1.0]
  • Augmentation via ImageDataGenerator:
      rotation_range=20 | zoom_range=0.2
      width/height_shift_range=0.2 | horizontal_flip=True

STEP 3 — Model Construction
  base = ResNet50(weights='imagenet', include_top=False)
  Head:  GlobalAveragePooling2D
      →  Dense(512, activation='relu')
      →  Dropout(0.5)
      →  Dense(38, activation='softmax')

STEP 4 — Two-Phase Training
  Phase 1 (Transfer Learning — base frozen)
    Optimizer : Adam(lr=1e-3)
    Loss      : Categorical Crossentropy
    Epochs    : ~10

  Phase 2 (Fine-Tuning — last N blocks unfrozen)
    Optimizer : Adam(lr=1e-5)
    Epochs    : until val_loss converges

STEP 5 — Export
  model.save('plant_disease_model.keras')
```

### Inference API

The trained model is served via a **Flask REST API** hosted on Hugging Face Spaces (Docker container, Gunicorn, port 7860).

**Request:**
```json
POST /predict
{ "image": "<base64-encoded-jpeg>" }
```

**Response:**
```json
{
  "disease": "Tomato___Late_blight",
  "confidence": 94.7,
  "treatment": "Apply copper-based fungicide immediately. Remove infected foliage..."
}
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Role |
|---|---|---|
| React | 19 | UI framework — components, state, hooks |
| Vite | 7 | Build tool, HMR dev server, env variables |
| Tailwind CSS | 3 | Utility-first responsive styling |
| Axios | 1.x | HTTP client |
| @gradio/client | 2.x | Hugging Face Space communication |
| Auth0 React SDK | 2.x | User authentication |

### Backend
| Technology | Version | Role |
|---|---|---|
| Node.js + Express | 5 | API proxy server, route protection |
| MongoDB + Mongoose | 9.x | User data, history persistence |
| Auth0 | — | Authentication provider |
| dotenv | — | Environment variable management |

### ML & Infrastructure
| Technology | Role |
|---|---|
| TensorFlow / Keras | Model training and inference |
| ResNet-50 | CNN backbone — 50-layer residual network |
| NumPy + Pillow | Array ops, image preprocessing |
| Flask + Gunicorn | Inference REST API server |
| Docker | Containerised deployment on Hugging Face |
| Kaggle (P100 GPU) | Model training environment |

### Hosting
| Service | Hosts |
|---|---|
| Vercel | React frontend · Global CDN · Auto CI/CD |
| Hugging Face Spaces | Flask API + `.keras` model (Docker) |

---

## 📂 Project Structure

```
AgroSense-AI/
│
├── 📁 backend/                              # Node.js + Express REST API
│   ├── 📁 config/
│   │   └── db.js                            # MongoDB Atlas connection (Mongoose)
│   │
│   ├── 📁 models/                           # Mongoose schemas → MongoDB collections
│   │   ├── Conversation.js                  # conversations collection
│   │   ├── CropRecommendation.js            # croprecommendations collection
│   │   ├── Detection.js                     # detections collection
│   │   └── User.js                          # users collection
│   │
│   ├── 📁 routes/                           # Express route handlers
│   │   ├── community.routes.js              # Community feature endpoints
│   │   ├── conversations.routes.js          # Chatbot conversation endpoints
│   │   ├── detections.js                    # Disease detection endpoints
│   │   ├── recommendations.js               # Crop recommendation endpoints
│   │   └── users.js                         # User auth & profile endpoints
│   │
│   ├── .env                                 # 🔒 Backend secrets (MONGODB_URI, etc.)
│   ├── package-lock.json
│   ├── package.json                         # Backend dependencies
│   ├── server.js                            # Express app entry point
│   └── vercel.json                          # Vercel backend deployment config
│
├── 📁 src/                                  # React 19 frontend (Vite SPA)
│   │
│   ├── 📁 assets/                           # Static images, SVGs, icons
│   │
│   ├── 📁 components/                       # Reusable UI components
│   │   ├── 📁 Auth/
│   │   │   └── PrivateRoute.jsx             # Protected route wrapper (Auth0)
│   │   │
│   │   ├── 📁 common/                       # Generic shared UI primitives
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Icon.jsx
│   │   │
│   │   ├── 📁 context/                      # React context providers
│   │   │   ├── AuthContext.jsx              # Auth0 user state context
│   │   │   └── LocationContext.jsx          # User location/weather context
│   │   │
│   │   ├── 📁 layout/                       # Page shell components
│   │   │   ├── Footer.jsx
│   │   │   ├── header.css
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx                   # Root layout wrapper
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   └── 📁 navigation/
│   │       ├── NavItems.jsx                 # Navigation link definitions
│   │       └── AuthSync.jsx                 # Syncs Auth0 user → MongoDB users
│   │
│   ├── 📁 pages/                            # Route-level page components
│   │   ├── 📁 Auth/
│   │   │   └── Authpage.jsx                 # Login / signup page
│   │   │
│   │   ├── 📁 Calender/
│   │   │   └── CropCalendar.jsx             # Crop planting calendar
│   │   │
│   │   ├── 📁 Chatbot/
│   │   │   └── Chatbot.jsx                  # AI farming chatbot page
│   │   │
│   │   ├── 📁 Community/
│   │   │   └── Community.jsx                # Farmer community forum
│   │   │
│   │   ├── 📁 CropAdvisory/
│   │   │   └── CropAdvisory.jsx             # Crop advisory dashboard
│   │   │
│   │   ├── 📁 Disease/
│   │   │   ├── DiagnosisResult.css
│   │   │   ├── DiagnosisResult.jsx          # Detection result display
│   │   │   ├── DiseaseDetection.css
│   │   │   ├── DiseaseDetection.jsx         # Plant disease detection page
│   │   │   └── UploadBox.jsx                # Leaf image drag-and-drop uploader
│   │   │
│   │   ├── 📁 Fertilizer/
│   │   │   ├── Fertilizer.css
│   │   │   └── Fertilizer.jsx               # Fertilizer recommendation page
│   │   │
│   │   ├── 📁 landing/
│   │   │   └── landing.jsx                  # Home / landing page
│   │   │
│   │   ├── 📁 Market/
│   │   │   ├── Market.css
│   │   │   └── Market.jsx                   # Crop market prices page
│   │   │
│   │   ├── 📁 Schemes/
│   │   │   └── Schemes.jsx                  # Government agricultural schemes
│   │   │
│   │   ├── 📁 Videos/
│   │   │   └── Videos.jsx                   # Farming tutorial videos
│   │   │
│   │   └── 📁 Weather/
│   │       └── Weather.jsx                  # Real-time weather dashboard
│   │
│   ├── 📁 styles/                           # Global style definitions
│   │   ├── global.css                       # App-wide base styles
│   │   └── theme.js                         # Design tokens / theme config
│   │
│   ├── 📁 utils/                            # Helpers and API wrappers
│   │   └── db.js                            # Axios client / API base config
│   │
│   ├── App.css                              # Root component styles
│   ├── App.jsx                              # Root component — React Router config
│   ├── index.css                            # Tailwind directives + resets
│   └── main.jsx                             # ReactDOM entry + Auth0Provider
│
├── .env                                     # 🔒 Frontend secrets — never commit
├── .gitignore
├── eslint.config.js                         # ESLint flat config
├── index.html                               # Vite HTML shell
├── package-lock.json
├── package.json                             # All dependencies + npm scripts
├── README.md
└── vite.config.js                           # Vite build + dev server config
```

---

## 🚀 Local Setup

### Prerequisites

| Requirement | Minimum version | Check with |
|---|---|---|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| Git | any | `git --version` |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Sanjaychaurasia04/AgroSense-AI.git
cd AgroSense-AI

# 2. Install all dependencies
npm install

# 3. Set up your environment variables
cp .env.example .env
#    Open .env and fill in all required keys (see next section)

# 4a. Start the frontend dev server
npm run dev
#     → http://localhost:5173

# 4b. Start the Express backend (separate terminal)
npm run start
#     → http://localhost:3000 (or your configured port)
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot module replacement |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint across the codebase |
| `npm run start` | Start Express backend server (`server.js`) |

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in every value. **Never commit `.env` to version control.**

```bash
cp .env.example .env
```

```env
# ── Disease Detection (Hugging Face Flask API) ──────────────────────────────
# Your Hugging Face Space URL
VITE_HF_API_ENDPOINT=https://your-username-your-space-name.hf.space

# Your HF Access Token → huggingface.co → Settings → Access Tokens
VITE_HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Weather Dashboard ────────────────────────────────────────────────────────
# Free tier key from openweathermap.org/api
VITE_WEATHER_API_KEY=your_openweathermap_key_here

# ── AI Chatbot ───────────────────────────────────────────────────────────────
# API key for your LLM provider (Google Gemini / OpenAI / Groq)
VITE_CHATBOT_API_KEY=your_llm_api_key_here

# ── Auth0 Authentication ─────────────────────────────────────────────────────
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_client_id

# ── MongoDB (used by Express backend) ────────────────────────────────────────
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/agrosense
```

> ⚠️ **Security note:** `VITE_` prefixed variables are bundled into the browser JS bundle and are visible in DevTools. Sensitive keys (LLM, database) should be called only from the Express backend (`server.js`), which acts as a secure proxy. Never call paid APIs directly from the frontend.

---

## 🖥️ Backend & API Proxy

The project includes an **Express 5 backend** (`server.js`) that serves two purposes:

1. **API key proxy** — forwards requests to Hugging Face, the weather API, and the LLM without exposing keys to the browser.
2. **User data persistence** — stores conversation history, disease detection logs, and user preferences in MongoDB via Mongoose, associated with Auth0 user accounts.

The Auth0 integration (`@auth0/auth0-react`) handles user sign-up, login, and session management. Protected routes verify JWT tokens issued by Auth0 before granting access to stored user data.

---

## 🤗 ML Model Deployment (Hugging Face)

### Create a Docker Space

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space) → SDK: **Docker**
2. Add these files to the Space repository:

**`requirements.txt`**
```
flask==3.0.0
tensorflow==2.15.0
pillow==10.2.0
numpy==1.26.4
gunicorn==21.2.0
```

**`Dockerfile`**
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "app:app"]
```

3. Upload `app.py` and `plant_disease_model.keras`
   *(use Git LFS if the `.keras` file exceeds 100 MB)*

4. Once built, your endpoint is:
   ```
   https://your-username-your-space-name.hf.space/predict
   ```

5. Set this as `VITE_HF_API_ENDPOINT` in your Vercel environment variables.

---

## 🌐 Deployment Guide

### Frontend → Vercel

```
1. Push to GitHub
   ↓
2. vercel.com/new → Import AgroSense-AI repo
   ↓
3. Add all VITE_ environment variables in Vercel dashboard
   ↓
4. Deploy → live in ~60 seconds ✅
```

Every `git push` to `main` automatically triggers a redeploy.

**Or via CLI:**
```bash
npm install -g vercel
vercel --prod
```

### Backend → Railway / Render

The Express `server.js` can be deployed to any Node.js host. Recommended options:

- **Railway** — `railway up` deploys automatically from GitHub
- **Render** — connect repo, set `npm run start` as the start command
- **Fly.io** — good for low-latency global deployments

Set `MONGODB_URI` and any server-side API keys as environment variables on your chosen host.

---

## 🗺️ Roadmap

### ✅ Completed
- Plant disease detection — ResNet-50 · 38 classes · Flask API on Hugging Face
- Crop recommendation engine — 7 soil/climate inputs · 22+ crops
- Real-time weather dashboard — live conditions for any location worldwide
- AI farming chatbot — LLM-powered agricultural assistant
- User authentication — Auth0 integration
- Data persistence — MongoDB + Mongoose backend
- Responsive UI — mobile, tablet, and desktop
- Production deployment — Vercel (frontend) + Hugging Face Spaces (ML API)

### 🔜 Planned
- **Multi-language support** — Hindi, Tamil, Telugu, Marathi for rural accessibility
- **Fertilizer recommender** — optimal NPK dosage based on crop + soil deficit
- **Pest identification** — extend image model to classify insect pests
- **Progressive Web App (PWA)** — offline capability with on-device model
- **Disease history tracker** — log and visualise detections per field over time
- **Yield forecasting** — predict harvest based on crop, soil, and climate data
- **Government scheme finder** — surface relevant Indian agricultural subsidies and MSP data
- **Voice input for chatbot** — hands-free queries for low-literacy users

---

## 🤝 Contributing

All contributions are welcome — bug fixes, new features, translations, or documentation improvements.

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/AgroSense-AI.git
cd AgroSense-AI

# 2. Create a clearly named branch
git checkout -b feature/hindi-language-support
# or
git checkout -b fix/hf-cold-start-handling

# 3. Make your changes and commit with a conventional message
git add .
git commit -m "feat: add Hindi translation strings via react-i18next"
# Prefixes: feat | fix | docs | style | refactor | test | chore

# 4. Push and open a Pull Request
git push origin feature/hindi-language-support
```

**Guidelines:**
- Check open issues before creating a new one
- Test changes locally before opening a PR
- Keep PRs focused — one feature or fix per PR
- For major changes, open an issue first to discuss the approach

---

## 📄 License

This project is released under the **MIT License** — use it, fork it, build on it.

```
MIT License — Copyright (c) 2024 Sanjay Chaurasia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

<div align="center">

**Built by [Sanjay Chaurasia](https://github.com/Sanjaychaurasia04)**
*Full-Stack Developer · ML Engineer · Building technology for social impact*

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-agro--sense--ai--smoky.vercel.app-2d6a4f?style=for-the-badge)](https://agro-sense-ai-smoky.vercel.app/)
[![GitHub Stars](https://img.shields.io/github/stars/Sanjaychaurasia04/AgroSense-AI?style=for-the-badge&logo=github)](https://github.com/Sanjaychaurasia04/AgroSense-AI)

<br/>

*If AgroSense AI helped you or inspired you — a ⭐ on GitHub means the world.*

<img src="https://capsule-render.vercel.app/api?type=waving&color=1b4332,2d6a4f,40916c,52b788&height=120&section=footer&animation=fadeIn" />

</div>
