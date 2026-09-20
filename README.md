# 🚀 CHINJUKU — Mission Control Developer Portfolio

A responsive, high-performance developer portfolio featuring a **Cosmic Cyberpunk HUD / Mission Control** aesthetic. Built with React 19, TypeScript, Vite, TailwindCSS, GSAP, and p5.js.

---

## 🛠️ Tech Stack & Architecture

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) with a unified Cosmic Design System (Cyber Cyan, Nebula Purple, Space Black, Glassmorphic HUD)
- **Animations:** [GSAP 3](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/) (Lens Flare Spotlight Mask scroll interaction)
- **Canvas / Creative Coding:** [p5.js](https://p5js.org/) (Interactive particle aura & force field effects)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing & State:** [React Router 7](https://reactrouter.com/) with instant SPA scroll restoration & active section scroll-spy
- **Data Integration:** Live GitHub Contributions Telemetry (`Chinjuku`) with 1-hour `localStorage` caching and manual sync

---

## 📦 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (v9+) or `yarn`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Chinjuku/chinjuku-portfolio.git
cd chinjuku-portfolio

# Install dependencies
npm install
```

### 2. Development Server
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Production Build & Verification
Compile TypeScript and bundle production assets with Vite:
```bash
npm run build
```
Preview the production build locally before deploying:
```bash
npm run preview
```

### 4. Code Quality & Linting
Run ESLint across the codebase:
```bash
npm run lint
```

---

## 🚢 How to Deploy (วิธีการ Deploy แบบละเอียด)

โครงการนี้เป็น **Single Page Application (SPA)** ผลลัพธ์จากการ build จะอยู่ที่โฟลเดอร์ `dist/` สามารถนำไป deploy บนคลาวด์แพลตฟอร์มต่างๆ ได้ง่ายและมีประสิทธิภาพสูง โดยมีขั้นตอนดังนี้:

---

### วิธีที่ 1: Deploy บน Vercel (แนะนำ - ใช้เวลาน้อยที่สุด)

โปรเจกต์นี้ได้รับการตั้งค่าพร้อมไฟล์ `vercel.json` สำหรับจัดการ SPA Rewrite (`/* -> /index.html`) เรียบร้อยแล้ว เพื่อป้องกันปัญหา **HTTP 404** เมื่อผู้ใช้กด Refresh ขณะอยู่ที่หน้า `/projects`

#### Option A: Deploy ผ่าน Vercel CLI (ทำผ่าน Terminal)

1. **ติดตั้ง Vercel CLI ทั่วโลก (หากยังไม่มี):**
   ```bash
   npm install -g vercel
   ```

2. **เข้าสู่ระบบ Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy ขึ้น Staging / Preview:**
   ```bash
   vercel
   ```
   *(กด Enter เพื่อตอบรับค่า Default ทั้งหมด)*

4. **Deploy ขึ้น Production ทันที:**
   ```bash
   vercel --prod
   ```
   ระบบจะทำการ build และส่งมอบ URL Production ให้ทันที (เช่น `https://chinjuku-portfolio.vercel.app`)

---

#### Option B: Deploy อัตโนมัติผ่าน GitHub + Vercel Dashboard (CI/CD)

แนะนำวิธีนี้สำหรับการพัฒนาต่อเนื่อง เมื่อ `git push` ขึ้น GitHub ทาง Vercel จะ build และ deploy ให้โดยอัตโนมัติ:

1. นำโค้ดขึ้น GitHub Repository:
   ```bash
   git add .
   git commit -m "feat: ready for production deployment"
   git push origin main
   ```
2. เข้าไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
3. กดปุ่ม **"Add New..."** $\rightarrow$ เลือก **"Project"**
4. เลือก Repository `chinjuku-portfolio` แล้วกด **"Import"**
5. ตรวจสอบการตั้งค่า **Project Configuration**:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (หรือ `tsc -b && vite build`)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. กดปุ่ม **"Deploy"**
7. รอประมาณ 30-45 วินาที เว็บไซต์จะพร้อมใช้งานทั่วโลกผ่าน Global Edge Network

> [!NOTE]
> ไฟล์ `vercel.json` ในโปรเจกต์มีเนื้อหาดังนี้:
> ```json
> {
>   "rewrites": [
>     { "source": "/(.*)", "destination": "/index.html" }
>   ]
> }
> ```
> การตั้งค่านี้สำคัญมากสำหรับ SPA เพราะเมื่อผู้ใช้เข้าผ่าน URL ตรงเช่น `https://domain.com/projects` ตัว Vercel Edge Server จะส่ง `index.html` ให้ React Router ทำงานต่อโดยไม่เกิด 404

---

### วิธีที่ 2: Deploy บน Netlify

1. เข้าไปที่ [Netlify Dashboard](https://app.netlify.com/)
2. กด **"Add new site"** $\rightarrow$ **"Import an existing project"** $\rightarrow$ เชื่อมต่อ GitHub
3. กำหนดค่า Build Settings:
   - **Base directory:** (เว้นว่างไว้)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **การรองรับ SPA Routes บน Netlify:**
   สร้างไฟล์ชื่อ `public/_redirects` โดยมีข้อความ:
   ```text
   /*    /index.html   200
   ```
5. กด **"Deploy Site"**

---

### วิธีที่ 3: Deploy บน Docker / Self-Hosted Nginx Server

หากต้องการนำไปรันบน VPS, Cloud VM (DigitalOcean, AWS EC2, GCP) หรือใช้ Nginx Reverse Proxy:

1. สั่ง Build Production Bundle บนเครื่องเซิร์ฟเวอร์:
   ```bash
   npm install
   npm run build
   ```
2. คัดลอกโฟลเดอร์ `dist/` ไปไว้ที่ `/var/www/chinjuku-portfolio`
3. ตั้งค่า Nginx Server Block (`/etc/nginx/sites-available/portfolio`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       root /var/www/chinjuku-portfolio;
       index index.html;

       # รองรับ SPA Routing ป้องกันปัญหา 404
       location / {
           try_files $uri $uri/ /index.html;
       }

       # เปิดใช้งาน Gzip Compression เพื่อโหลดเร็วขึ้น
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

       # Cache Static Assets ยาวนานเพื่อความเร็วสูงสุด
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|pdf)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```
4. ทดสอบและ Restart Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 📁 Directory Structure

```text
chinjuku-portfolio/
├── .vercel/                  # Vercel Project Metadata
├── public/                   # Static assets
│   ├── favicon.ico
│   └── resume.pdf            # Downloadable/Preview Resume
├── src/
│   ├── assets/               # Local images & background art
│   ├── components/           # Reusable UI & Section Components
│   │   ├── About.tsx         # Mission / Profile About section
│   │   ├── CodeActivities.tsx# GitHub Telemetry & Heat Map Activity Log
│   │   ├── Contact.tsx       # Contact terminal & Letter clip slide animation
│   │   ├── Experience.tsx    # Career Timeline / Trajectory HUD
│   │   ├── ForceFieldBackground.tsx # Interactive p5 canvas force field
│   │   ├── Hero.tsx          # Hero landing with HUD telemetry
│   │   ├── Navbar.tsx        # Floating Glassmorphic Capsule Navbar (max-w-6xl)
│   │   ├── ProfileAura.tsx   # Concentric glowing aura particle field
│   │   ├── Projects.tsx      # Featured projects showcase
│   │   ├── ScrollToTop.tsx   # SPA Instant Scroll & ScrollTrigger refresh
│   │   └── Skills.tsx        # Tech Radar / Grid of proficiencies
│   ├── context/
│   │   └── ThemeContext.tsx  # Dark / Light theme token context
│   ├── data/
│   │   └── projects.ts       # Central projects catalog & metadata
│   ├── hooks/
│   │   ├── useActiveSection.ts # IntersectionObserver scroll spy
│   │   └── useNavClick.ts    # Smooth in-page and route navigation hook
│   ├── pages/
│   │   ├── Home.tsx          # Single-page mission landing
│   │   └── AllProjects.tsx   # Lens Flare Spotlight Mask + Project Archive
│   ├── App.tsx               # Root routes & GSAP plugin registration
│   ├── index.css             # Tailwind directives & cosmic theme tokens
│   └── main.tsx              # Application entry point
├── vercel.json               # Vercel SPA rewrite configuration
├── tailwind.config.js        # Design tokens & color system
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler options
└── package.json              # Version 1.2.0 metadata & scripts
```

---

## ⚡ Verification Checklist Before Deploy

- [x] รัน `npm run build` ผ่านโดยไม่มี TypeScript errors (`exit code 0`)
- [x] ตรวจสอบไฟล์ `vercel.json` สำหรับจัดการ SPA Rewrite (`/index.html`)
- [x] ตรวจสอบการทำงานของ Light/Dark Mode ทุก Section
- [x] ตรวจสอบการทำงานของหน้า `/projects` Spotlight Mask scroll effect
- [x] ตรวจสอบ Cache ระบบ GitHub Contributions Telemetry (`localStorage` 1-hour TTL)

---

## 📄 License & Credits

Developed with ❤️ by [Chinjuku](https://github.com/Chinjuku).  
Personal Portfolio Website & Interactive Mission Control.
