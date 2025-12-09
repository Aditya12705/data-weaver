# The Data Weaver: Coding vs. Clouds 🌦️

Does rain make you code more? Or does sunshine distract you? 
**The Data Weaver** is a fun dashboard that correlates your **GitHub contribution history** with **historical weather data** to find hidden patterns in your productivity.

## 🚀 Features

- **Data Mashup**: Visualization of GitHub commits overlayed with rainfall/temperature.
- **Insights Engine**: heuristic analysis to tell if you are a "Stormy Coder" or "Sunny Scripter".
- **Global Reach**: Check correlation for different tech hubs (Bangalore, SF, London, Tokyo).
- **Dual Modes**: 
  - **Live Data**: Fetch real stats for ANY public GitHub user.
  - **Mock Mode**: Experience generated patterns instantly for demonstration.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: TailwindCSS (with glassmorphism effects)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Data Sources**:
  - GitHub REST API (`/users/{username}/events`)
  - Open-Meteo Historical Weather API (Free, no key required)

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aditya12705/data-weaver
   cd data-weaver
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📸 Screenshots

<img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/5cf004f6-7ed5-48fe-ac02-40a748220855" />

<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/92dee7cb-0b6f-4f16-9c11-ee6e49364c7b" />



## 🧠 How it Works

The app fetches daily commit counts (via `PushEvent` analysis) and aligns them with daily weather metrics (Rain Sum, Max Temp) for the selected location. It then calculates a correlation score and displays it on an interactive Composed Chart.

---
Built for **AI For Bharat** Week 3 Challenge.
