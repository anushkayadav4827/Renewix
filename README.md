# Renewix 🌿
### AI-Powered Circular Hardware Diagnostic & Repairability Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Renewix%20Platform-103D29?style=for-the-badge&logo=firebase)](https://renewix-8a159.web.app)
[![Firebase Hosted](https://img.shields.io/badge/Firebase-Hosting%20Active-FFCA28?style=for-the-badge&logo=firebase)](https://renewix-8a159.web.app)
[![Groq AI](https://img.shields.io/badge/Groq-Ultra--Fast%20Vision%20%26%20LLM-F55036?style=for-the-badge&logo=fastapi)](https://groq.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## 📖 Executive Summary

Modern consumers discard repairable electronics at an unprecedented scale, generating over **50 million metric tons of e-waste** globally every year. Consumers often choose replacement over repair due to:
1. **Opaque repair costs** and fear of repair-shop price gouging.
2. **Diagnostic uncertainty** — not knowing whether an issue is an inexpensive ribbon cable or an irreparable motherboard failure.
3. **Lack of financial clarity** — inability to compare the true annual cost of repairing an older device versus financing a replacement.

**Renewix** solves this crisis by delivering an enterprise-grade, circular-economy web platform that acts as an unbiased diagnostic referee. Combining Groq-powered multimodal computer vision (`qwen/qwen3.8-27b`), deterministic engineering math, Groq-powered multi-agent financial arbitration (`openai/gpt-oss-120b`), live marketplace price cross-verification (Flipkart & Amazon India), and a verified local repair network, Renewix empowers users to make data-backed, sustainable decisions before buying new hardware.

---

## 🛠️ Complete Feature Walkthrough & Implementation Details

### 1. 🎨 Editorial Landing Page & Value Proposition
* **Organic Forest & Warm Cream Palette**: Editorial aesthetic (`#103D29` deep forest green, `#FDF8F3` warm cream, `#E28E5C` sunset peach) optimized for high readability, premium finish, and reduced cognitive load.
* **Refurbished Device Showcase Carousel**: Visual presentation of curated refurbished electronics, real-time price comparisons, and seasonal buying predictions.
* **Interactive Value Props**: Clear breakdown of Renewix's core mission: Save Money, Divert E-waste, and Extend Device Life.
* **Problem vs. Solution Interactive Ribbon**: Visual contrast between the dilemma of broken devices and data-backed repair recommendations.

### 2. 📱 Step 1: Universal Multi-Category Device Selection (`/device`)
* **18+ Hardware & Home Appliance Categories**:
  * **Personal Tech**: Smartphones, Laptops, Tablets, Smartwatches, Power Banks, Headphones / Earphones.
  * **Home Appliances**: Washing Machines, Refrigerators, Air Conditioners, Microwave Ovens, Mixer / Blenders, Electric Kettles, Vacuum Cleaners, Water Purifiers (RO).
  * **Entertainment & Computing**: Televisions, Bluetooth Speakers, Gaming Consoles, Desktop PCs, Wi-Fi Routers, Printers, Digital Cameras, and Other Custom Electronics.
* **Dynamic Search & Sub-category Filter Tabs**: Instant real-time filtering across "All Devices", "Personal Tech", "Home Appliances", and "Entertainment".
* **Single-line Adaptive Card Grid**: Compact card layouts with responsive icons and direct one-click intake routing.

### 3. 📷 Step 2: Intelligent Hardware Intake & Vision Engine (`/intake`)
* **Dual-Mode Intake Workflow**:
  * **Multimodal AI Vision Auto-Detection**: Upload or capture a photo of the device settings ("About Phone", system spec screen, or rear serial sticker). The system extracts brand, model, purchase timing, and launch retail pricing in ~1.5s.
  * **Manual Specification Overrides**: Interactive form fields for Brand, Model, Purchase Month/Year, Original Purchase Price (INR), Warranty Status, Prior Repair History, and Daily Usage Intensity.
* **Visual Defect Classifier with Rate-Limit Resilience**:
  * When users upload photos of broken hardware (e.g. cracked front glass, bleeding OLED matrices, vertical colored lines), the engine isolates the physical damage instead of hallucinating false device specs.
  * Captures damage descriptions (e.g., *"Vertical display lines with panel impact fracture"*) and seamlessly forwards them to Step 3.

### 4. 🔬 Step 3: Symptom Description & Media Glitch Inspector (`/problem`)
* **Media Glitch & Glitch-Video Inspection**:
  * Accepts photo uploads or video clips (`.mp4`, `.mov`, `.webm`).
  * In-browser video frame extraction captures visual motion glitches (flickering display lines, bootloops, backlight tearing).
* **Domain-Adaptive Symptom Selector**:
  * Dynamic multi-select symptom tags tailored to the selected device (e.g., *"Drum not spinning"*, *"Blowing warm air"*, *"Vertical green lines"*, *"One side silent"*).
* **Critical Safety Interceptor**:
  * Scans user input for catastrophic safety hazards: thermal runaway, battery pouch swelling/bulging, sparking, smoke, or burning chemical odors.
  * Instantly diverts the user to a dedicated **Safety Protocol Screen (`/safety-warning`)** with emergency isolation steps and fire hazard mitigation advice.

### 5. 🩺 Step 4: Interactive Adaptive Clinical Interview (`/interview`)
* **Symptom-Domain-Specific Question Tree**:
  * Completely eliminates generic questions. Follow-up diagnostic questions are strictly driven by the active failure domain:
    * **Display Matrix**: Micro-laser COF flex bonding test, boot logo GPU isolation, digitizer deadzone matrix test.
    * **Electrochemical Battery**: Voltage sag under peak load, sudden shutdown thresholds, chassis wobble / pouch lift check.
    * **Charging Assembly**: CC pin wiggle angles, thermal arcing near connector, pocket lint obstruction.
    * **Liquid Ingress**: Galvanic oxidation speed profiler (tap water vs acidic coffee/soda), optical camera cavity seal test.
    * **Audio & Codec**: Built-in voice coil vs DAC routing isolation, acoustic chamber gasket resonance.
    * **Optics & Camera**: Voice coil OIS motor vibration, discrete sensor zoom-tier switching.
    * **Home Appliances**: Thermal overload cycle cutout, mechanical drum bearing wear vs belt slip.
* **Live Diagnostic Telemetry HUD**:
  * Real-time **Diagnostic Confidence Index** calculated dynamically as questions are answered.
  * **Dynamic 3-Layer Fault Probability Distribution**: Telemetry bars adaptively calculate failure probabilities based on the active domain (e.g., *Lithium-Ion Chemical Cell* vs. *BMS Protection Board* vs. *PMIC Regulator* for power issues; *Outer Glass* vs. *AMOLED Matrix* vs. *Display Driver* for screen issues).
  * Collapsible response history drawer allowing users to review and revise earlier answers.

### 6. 📊 Step 5: Clinical Diagnosis & Repairability Assessment (`/result`)
* **Structured 4-Stage Diagnostic Clinical Report**:
  * **Observed Symptoms**: Concrete physical and functional anomalies identified.
  * **Likely Mechanical Cause**: Underlying engineering root cause (e.g., fractured ITO traces, chemical electrolyte depletion, worn carbon brushes).
  * **Recommended Fix**: Prescribed repair action and component tier (e.g., OEM-grade sub-assembly replacement).
  * **Clinical Survival Outlook**: Projected functional lifespan restoration post-repair and risks of postponing service.
* **Deterministic 5-Pillar Repairability Ring (0–100 Score)**:
  * Calculated by a pure mathematical TypeScript engine across 5 engineering pillars:
    1. **Parts Availability Score (25%)**: OEM component supply chain accessibility (Good = 100, Medium = 60, Poor = 20).
    2. **Modular Repair Complexity (20%)**: Skill barrier and specialized tooling required (Low = 100, Medium = 60, High = 20).
    3. **Component-to-Device Cost Ratio (25%)**: Financial viability of the component relative to new replacement value.
    4. **Device Age & Depreciation (15%)**: Age curve calibration based on device category lifespan expectations.
    5. **Expected Usability & Lifespan (15%)**: Projected reliable years of service post-repair.
  * Interactive metric cards with progress bars and educational tooltip explanations.

### 7. ⚖️ Step 6: AI Multi-Agent Financial Verdict (`/verdict`)
* **Groq LLM Staged Debate (`openai/gpt-oss-120b`)**:
  * **Repair Agent**: Evaluates immediate cash conservation, data preservation, component longevity, and environmental savings.
  * **Replace Agent**: Counters with manufacturer warranty benefits, battery cycle resets, trade-in exchange bonuses, and modern tech enhancements.
* **Deterministic Cost-Per-Year Arbitration**:
  * Mathematical model compares:
    $$\text{Repair Cost Per Year} = \frac{\text{Estimated Repair Cost}}{\text{Expected Remaining Usability Years}}$$
    $$\text{Replace Cost Per Year} = \frac{\text{Replacement Market Price}}{\text{Expected Lifespan of New Device (typically 4–5 yrs)}}$$
  * An automated referee selects the definitive winner (**REPAIR**, **REPLACE**, or **NEUTRAL**) based strictly on total financial cost-efficiency, ensuring the LLM never hallucinates contradictory pricing.

### 8. 🏷️ Step 7: Live Marketplace Deals & Price Radar (`/replacement-deals`)
* **Multi-Platform Price Comparison**:
  * Real-time replacement prices calculated dynamically from the user's specific device category and purchase price.
  * Proportional discounts across **Amazon India**, **Flipkart**, **Croma Showrooms**, **Reliance Digital**, and Brand Stores.
  * Verified coupons (e.g., `FLIPTECH500`, `AMZNSAVE1000`) with one-click clipboard copying.
* **Dynamic 6-Month Historical Price Trend Chart**:
  * Interactive SVG spline area graph tracking 6-month price movement.
  * Flags **"Artificially Inflated Pre-Sale Hikes (Fake MRP)"**, **"Diwali Sale Historical Floors"**, and **"Current Price Deal Ratings"**.
* **Price Drop Alert Radar**:
  * Set a target price threshold in INR; simulated alert notifications trigger via email/SMS.
* **Upcoming Mega Tech Sales Radar**:
  * Countdown tracker for upcoming Indian e-commerce events (Republic Day Sale, Prime Days, Big Billion Days, Croma Exchange Fairs) with predicted percentage savings.
* **Circularity & Environmental Impact Calculator**:
  * Quantifies exact ecological savings: Grams of toxic e-waste diverted, kilograms of CO₂ emissions prevented, and liters of freshwater saved.

### 9. 📍 Step 8: Verified Local Repair Provider Network (`/providers`)
* **City Selector with Persistent Session Memory**:
  * Instant multi-city switcher across **Bengaluru**, **Mumbai**, **Delhi**, **Hyderabad**, **Chennai**, **Pune**, and **Kolkata**.
  * User city selection is permanently stored in `sessionStorage` and never reverts unexpectedly.
* **Real-Time GPS Location Detection**:
  * Browser geolocation integration pulls verified local repair workshops in proximity.
* **Provider Badges & Service Filters**:
  * Filter by **Authorized Brand Partner**, **Express Same-Day Repair**, or **Doorstep Pick & Drop Technician**.
  * View ratings, customer review counts, physical addresses, operating hours, and direct call links.
* **In-App Appointment Booking Modal**:
  * Select preferred service date and time slot (e.g., `11:00 AM - 01:00 PM`).
  * Generates an instant, verifiable digital service token (e.g., `BK2L-74921`) with confirmation details.

### 10. 🗂️ User Dashboard & Diagnostic History (`/dashboard`)
* **Amazon Cognito Authentication**:
  * Secure user sign-up, sign-in, and password reset flows with JWT tokens.
* **Persistent Diagnosis History**:
  * Every completed triage session is stored in Amazon DynamoDB.
  * Review past repairability scores, verdicts, and repair cost ranges at any time.

---

## 🏗️ System Architecture & Cloud Infrastructure

Renewix is engineered as a cloud-native, serverless, single-table architecture deployed via **AWS CDK v2**:

```
                              ┌─────────────────────────────────────────┐
                              │      CloudFront CDN + S3 Bucket         │
                              │        React 18 + Vite SPA              │
                              └────────────────────┬────────────────────┘
                                                   │ HTTPS
                                                   ▼
                              ┌─────────────────────────────────────────┐
                              │    Amazon API Gateway (HTTP API)        │
                              │       Cognito JWT Authorizer            │
                              └────────────────────┬────────────────────┘
                                                   │
          ┌────────────────────────────────────────┼────────────────────────────────────────┐
          ▼                                        ▼                                        ▼
┌──────────────────┐                     ┌──────────────────┐                     ┌──────────────────┐
│  Device & Rule   │                     │  Diagnosis &     │                     │  Local Provider  │
│  Microservices   │                     │  Analysis Engine │                     │  Microservice    │
│  (AWS Lambda)    │                     │  (AWS Lambda)    │                     │  (AWS Lambda)    │
└─────────┬────────┘                     └─────────┬────────┘                     └─────────┬────────┘
          │                                        │                                        │
          │                                        ├──────────────────┐                     │
          ▼                                        ▼                  ▼                     ▼
┌──────────────────┐                     ┌──────────────────┐ ┌───────────────┐   ┌──────────────────┐
│ Amazon DynamoDB  │                     │     Groq API     │ │    SerpApi    │   │  Google Places   │
│  (Single-Table)  │                     │ (gpt-oss-120b)   │ │  (Live Price) │   │     Text API     │
└──────────────────┘                     └──────────────────┘ └───────────────┘   └──────────────────┘
```

### AWS Cloud Infrastructure Details
| AWS Service | Purpose | Architecture Pattern |
|---|---|---|
| **AWS CloudFront + S3** | Global CDN & Static Asset Hosting | HTTPS, Brotli compression, Single Page App rewrites |
| **Amazon Cognito** | Authentication & Identity | User Pool with JWT authorizer integration |
| **API Gateway HTTP API** | REST API Routing | Low-latency HTTP API v2 with CORS and JWT claims |
| **AWS Lambda** | Serverless Compute | 9 isolated TypeScript functions (Node.js 20, esbuild bundle) |
| **Amazon DynamoDB** | Persistent Storage | Single-Table Design, PAY_PER_REQUEST billing, GSI1 index |
| **AWS Secrets Manager** | Secure Secrets Vault | Secure storage of SerpApi and Google Places credentials |

---

## 🗄️ Database Access Patterns (DynamoDB Single-Table)

All entity relationships, rules, history, and caches reside in a single high-performance DynamoDB table:

| Entity | PK | SK | GSI1PK | GSI1SK | Description |
|---|---|---|---|---|---|
| **Device Metadata** | `DEVICE#{deviceId}` | `METADATA` | — | — | Device category specs and common symptoms |
| **Diagnostic Rule** | `DEVICE#{deviceId}` | `RULE#{ruleId}` | — | — | Clinical triage rules and base questions |
| **Repair Data** | `DEVICE#{deviceId}` | `REPAIRDATA#{issueId}` | — | — | Benchmarked part costs, labor, and complexity |
| **User Session** | `USER#{userId}` | `SESSION#{sessionId}` | — | — | In-progress or completed diagnosis session |
| **Repair History** | `USER#{userId}` | `HISTORY#{sessionId}` | `DEVICE#{deviceId}` | `TIMESTAMP#{iso}` | Completed historical records |
| **Provider** | `PROVIDER#{providerId}` | `METADATA` | `CITY#{city}` | `NAME#{name}` | Verified local repair workshops |
| **Price Cache** | `PRICECACHE#{brand_model}` | `METADATA` | — | — | 7-day TTL SerpApi Google Shopping cache |

---

## 🔌 API Specifications & Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/devices` | Public | List all 18+ supported electronic device categories |
| `GET` | `/devices/{deviceId}` | Public | Retrieve full metadata and common symptoms for a device |
| `POST` | `/diagnosis/start` | JWT | Initiate a session, run danger checks, match rule, return base questions |
| `POST` | `/diagnosis/analyze` | JWT | Submit interview answers, compute score, run Groq debate, return verdict |
| `GET` | `/diagnosis/{sessionId}` | JWT | Retrieve existing diagnosis session state |
| `POST` | `/repair-history` | JWT | Save a completed session into the user's permanent history |
| `GET` | `/repair-history` | JWT | List all past repair history records for the authenticated user |
| `GET` | `/providers` | Public | Query verified repair shops by `deviceId` and `city` query params |
| `POST` | `/uploads` | JWT | Generate a pre-signed S3 URL for glitch media attachments |

---

## 💻 Local Setup & Development Guide

### Prerequisites
* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher
* **Groq API Key**: Obtainable from [console.groq.com](https://console.groq.com)
* **Google Gemini API Key**: Optional, for client-side multimodal vision auto-detection

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anushkayadav4827/Renewix.git
cd Renewix

# Install root, frontend, and backend dependencies
npm install
```

### 2. Configure Environment Variables

**Root `.env` / `backend/.env`**:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL_ID=openai/gpt-oss-120b

# Optional external integrations
SERPAPI_KEY=your_serpapi_key
GOOGLE_PLACE_API=your_google_places_key
AWS_REGION=us-east-1
```

**Frontend `.env` (`frontend/.env`)**:
```env
VITE_API_URL=http://localhost:3001
VITE_COGNITO_USER_POOL_ID=us-east-1_localmock
VITE_COGNITO_CLIENT_ID=localmockclientid
VITE_COGNITO_REGION=us-east-1
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Local Dev Server (Complete Full-Stack Simulation)
We provide an integrated in-memory DynamoDB simulation pre-seeded with all devices, rules, repair data, and repair providers:

```bash
# Terminal 1: Launch Backend Mock DevServer (Port 3001)
cd backend
npx tsx src/scripts/devServer.ts

# Terminal 2: Launch Frontend Vite App (Port 5173)
cd frontend
npm run dev
```

Navigate to `http://localhost:5173` to interact with the live platform.

### 4. Running Unit Tests
The deterministic mathematical scoring and arbitration engines include a comprehensive automated test suite:

```bash
npm run test:unit --workspace=backend
```

**Test Results Summary**:
* `✔ [partsAvailabilityScore]` (GOOD=100, MEDIUM=60, POOR=20)
* `✔ [repairComplexityScore]` (LOW=100, MEDIUM=60, HIGH=20)
* `✔ [costRatioScore]` (clamps to 0 when repair exceeds replacement value)
* `✔ [deviceAgeFactor]` (calibrated lifespan curves)
* `✔ [computeRepairabilityScore]` (Design worked examples)
* `✔ [computeRepairVsReplace]` (Arbitration cost-per-year calculations)
* **22 tests passed, 0 failed.**

---

## 🤝 Contributing

We welcome pull requests for additional device categories, enhanced diagnostic rules, and local provider directory submissions:
1. Fork the Project repository.
2. Create your Feature Branch (`git checkout -b feature/NewDeviceCategory`).
3. Commit your Changes (`git commit -m 'Add Smart Microwave diagnostic rules'`).
4. Push to the Branch (`git push origin feature/NewDeviceCategory`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Engineered with 🌿 for a cleaner planet and smarter consumer hardware decisions.*
