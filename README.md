# CHINJUKU — Mission Control Developer Portfolio

พอร์ตโฟลิโอส่วนตัวของ Chinjuku ในธีม **Cosmic Cyberpunk HUD / Mission Control** เป็น Single Page Application ที่เน้นภาพ motion ที่นุ่มนวลและ responsive ทั้ง mobile และ desktop

---

## Sections & Pages

**หน้าแรก (`/`)** เรียงเป็น section บนหน้าเดียว และ Navbar จะ highlight section ที่กำลังดูอยู่
- **Hero:** landing พร้อม force-field background (p5.js) และ HUD telemetry
- **About:** ข้อมูลโปรไฟล์และรูปพร้อม parallax เบา ๆ
- **Skills:** tech radar / กริดทักษะ
- **Currently Building:** โปรเจกต์ที่กำลังทำ พร้อม preview ที่ค่อย ๆ เปลี่ยนภาพ
- **Experience:** timeline การทำงาน
- **Code Activities:** GitHub contributions telemetry พร้อม cache 1 ชั่วโมงใน `localStorage` และปุ่ม sync เอง
- **Contact:** ช่องทางติดต่อ

**`/projects`** รายการโปรเจกต์ทั้งหมด พร้อม filter และ Lens Flare Spotlight Mask ตอน scroll

**`/projects/:slug`** หน้า case study ของแต่ละโปรเจกต์: gallery (desktop และ phone), overview, my role, highlights, stack และลิงก์ Next project

**`/personality`** หน้า "The Curious Creator" ที่มีแผง Day to day แบบ interactive

---

## Tech Stack

- **Core:** React 19, TypeScript (strict), Vite 7
- **Routing:** React Router 7 พร้อม scroll restoration และ scroll-spy
- **Styling:** Tailwind CSS 3 (`darkMode: "class"`) พร้อม design tokens ในธีม space / nebula / starlight และ light/dark/system
- **Animation:** GSAP 3 + ScrollTrigger, p5.js (canvas), three.js / React Three Fiber สำหรับ 3D บางส่วน
- **Icons:** lucide-react

---

## Getting Started

ต้องมี Node.js 18 ขึ้นไป (แนะนำ 20+) และ npm

```bash
npm install
npm run dev        # เปิดที่ http://localhost:5173
```

คำสั่งอื่นที่ใช้บ่อย:

```bash
npm run build      # tsc -b && vite build
npm run preview    # ดู production build ก่อน deploy
npm run lint       # ESLint
npm run test       # Vitest
```

---

## Editing Content

ข้อมูลทั้งหมดอยู่ใน `src/constants/` ไม่ต้องแก้ component เพื่อเปลี่ยนเนื้อหา

| ไฟล์ | เก็บอะไร |
| --- | --- |
| `hero.ts` | ข้อความและ telemetry ของหน้าแรก |
| `about.ts` | โปรไฟล์และรูป |
| `skills.tsx` | ทักษะและ radar |
| `experiences.ts` | ประวัติการทำงาน |
| `projects.ts` | โปรเจกต์ทั้งหมด รวม `gallery` ของแต่ละโปรเจกต์ |
| `currentlyBuilding.ts` | โปรเจกต์ที่กำลังทำ |
| `codeActivities.ts` | ค่าตั้งต้นของ GitHub telemetry |
| `personality.ts` | เนื้อหาหน้า `/personality` |
| `contact.ts` | ช่องทางติดต่อ |

**เพิ่มโปรเจกต์ใหม่:** เพิ่ม object ใน `all_projects` ใน `projects.ts` กำหนด `slug` ไม่ซ้ำ จากนั้นวางรูปไว้ที่ `public/projects/<slug>/` และเพิ่ม `gallery`

**จำนวนรูปต่อโปรเจกต์:** desktop 5–8 รูป, phone 2–4 รูป และรวมไม่เกินประมาณ 10 รูป รูปที่ไม่ได้ถ่ายจากอุปกรณ์นั้นจริงไม่ควรใส่ในกรอบของอุปกรณ์นั้น

---

## Project Structure

```text
src/
├── components/
│   ├── Hero.tsx, About.tsx, Skills.tsx, CurrentlyBuilding.tsx,
│   │   Experience.tsx, CodeActivities.tsx, Contact.tsx, Projects.tsx
│   │                         # section shells (เป็นเจ้าของ GSAP timeline และ data)
│   ├── hero/, skills/, experience/, code-activities/, currently-building/,
│   │   all-projects/, personality/, stats/, motion/
│   │                         # sub-components ของแต่ละ section (มี index.ts barrel)
│   └── common/               # Navbar, RepoModal, ScrollToTop
├── constants/                # เนื้อหาทั้งหมด (ดู Editing Content)
├── pages/                    # Home, AllProjects, ProjectDetail, Personality
├── hooks/                    # useActiveSection, useNavClick
├── context/                  # ThemeContext (light | dark | system)
├── utils/
├── App.tsx                   # routes และ GSAP plugin registration
└── main.tsx

public/projects/<slug>/       # รูปของแต่ละโปรเจกต์
vercel.json                   # SPA rewrite สำหรับ Vercel
tailwind.config.js            # design tokens และ palette
```

---

## Deploy

โปรเจกต์นี้เป็น SPA ผลลัพธ์จาก `npm run build` อยู่ที่ `dist/`

**Vercel (แนะนำ):** `vercel.json` มี rewrite `/* → /index.html` ไว้แล้ว ทำให้ refresh ที่ `/projects` หรือ `/personality` ไม่เกิด 404

- วิธีที่ 1: เชื่อม repository ใน Vercel Dashboard แล้ว push ขึ้น `main` ระบบจะ deploy ให้อัตโนมัติ การตั้งค่า: Framework `Vite`, Build `npm run build`, Output `dist`
- วิธีที่ 2: ใช้ Vercel CLI
  ```bash
  npm install -g vercel
  vercel login
  vercel --prod
  ```

ถ้า deploy ที่อื่น ต้องตั้งค่า rewrite ให้ทุก path ส่งกลับไปที่ `index.html` ด้วย

---

## License

Personal portfolio by [Chinjuku](https://github.com/Chinjuku). ใช้เป็นแรงบันดาลใจได้ แต่ขอให้ไม่คัดลอกเนื้อหาส่วนตัวไปใช้เป็นของตัวเอง
