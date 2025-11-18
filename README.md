# 🚖 NexaRide Frontend

Modern frontend for the **NexaRide Taxi Service** built with **React, TypeScript, Redux Toolkit, TailwindCSS, Socket.IO**, and **Geoapify Maps**.

---

## 🚀 Overview

The NexaRide frontend provides a smooth and modern user experience for booking rides, tracking drivers, managing wallets, and handling ride‑related interactions.

This project focuses on:

* Fast and responsive UI
* Clean state management using Redux Toolkit
* Real‑time communication with Socket.IO
* Map & routing features using Geoapify APIs
* Modular and maintainable code structure

---

## 📁 Project Structure (Simplified)

```
src/
  api/             → Axios instances & API calls
  components/      → Reusable UI components
  pages/           → App pages (Home, Login, Ride, Wallet...)
  routes/          → App routing configuration
  utils/           → Helper functions
  App.tsx          → Root component
  main.tsx         → Entry point
```

---

## 🧩 Key Features

* 🔐 **Google Login + JWT Auth**
* 📍 **Location search & address autocomplete** (Geoapify)
* 🗺️ **Route drawing + distance/time calculation**
* 🔄 **Real‑time ride status updates** (Socket.IO)
* 🚕 **Driver search, ride assignment, ride progress UI**
* 💳 **Wallet system + Stripe payments**
* ⚡ **Optimized state management using Redux Toolkit**
* 🎨 **TailwindCSS for modern UI**

---

## 🛠️ Tech Stack

* **React 18 + TypeScript**
* **Redux Toolkit**
* **React Router DOM**
* **Socket.IO Client**
* **Geoapify Maps API**
* **TailwindCSS + ShadCN UI**
* **Vite** (build tool)

---

## ▶️ Running the Project

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Add environment variables

Create a `.env` file:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GEOAPI_KEY=your_geoapi_key

VITE_BACKEND_URL=your_backend_url
```

### 3️⃣ Start the dev server

```
npm run dev
```

The app runs at:

```
http://localhost:5173
```

---

## 📦 Build for Production

```
npm run build
```

Output will be generated in the `dist/` folder.

---

## 📌 Notes

* Make sure the backend (NexaRide server) is running for all real‑time and API features.
* Geoapify APIs require a valid API key.

