# CpE PRMSU Landing Page

> From circuits to code, we build the next generation of computer engineers.

A single-page landing site for **Computer Engineering at PRMSU** (College of Engineering · PRMSU Iba, Zambales). It introduces the program, shows student life, and points visitors to courses, organizations, projects, and contact details — all on one scrolling page.

**Live preview:** https://id-preview--f65e913a-f472-493c-b13d-aeb99fea8cea.lovable.app
**Repository:** https://github.com/nicedodge901-star/CpE-Landing-Page

---

## What's on the page

| Section | What it shows |
| --- | --- |
| **Hero** | Program title with an animated gold shimmer, the tagline, and calls to action |
| **Topic marquee** | Endless strip: Embedded Systems · Networking · Software · IoT · Digital Design · AI & Data |
| **Life at CpE** | 3D carousel of event and lab photos with captions and a lightbox |
| **About** | What Computer Engineering covers and where it leads |
| **Courses** | The curriculum laid out by year |
| **Organizations** | ICpEP-PRMSU Chapter, student council, and clubs |
| **Projects** | Robotics, IoT, and AI builds by students |
| **Location** | Where to find the department, with an embedded map |
| **News & Announcements** | Currently shows a "You're up to date!" card with a small confetti burst |
| **Contact** | Email and department details |
| **Footer** | Credits and quick links |

Top navigation also carries an **Announcements** button (jumps straight to the news card) and a **GitHub** button (opens this repository).

## Highlights

- **Scroll-driven animation** — sections fade and rise into view, the hero parallax drifts, and a gold progress bar tracks the page.
- **Confetti on the news card** — a small burst of gold, blue, and navy flakes rains behind "You're up to date!" whenever the card scrolls into view, then clears away.
- **3D gallery carousel** — slides tilt in perspective, with arrows, dot navigation, and a click-to-open lightbox.
- **Adaptive header** — transparent over the hero, then solid navy with a blur once you scroll.
- **Responsive and accessible** — a hamburger menu on phones, focus outlines on keyboard navigation, and every animation steps aside when the device has reduced motion turned on.

## Tech

Plain, dependency-light front end:

- **HTML5** — semantic sections and landmarks
- **Tailwind CSS v4** — utilities compiled into `style.css`, plus hand-written keyframes
- **Vanilla JavaScript** — no framework, no bundler needed to view the site
- **Lenis** — smooth scrolling, loaded from a CDN

## Getting started

Just open the page in a browser:

```bash
open index.html          # macOS
start index.html         # Windows
```

Or serve the folder (recommended, so every asset and photo loads correctly):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project layout

```
.
├── index.html      # all page content
├── style.css       # compiled Tailwind utilities + custom animations
├── script.js       # carousel, scroll effects, menu, confetti
└── images/         # hero, gallery, and event photos
```

## Editing notes

- **Photos** live in `images/`; the gallery and hero reference them by filename.
- **News & Announcements** is intentionally empty right now. Add a dated headline as a list item in that section when there is something to announce.
- **Testimonials** — one is real; the others still need a quote, name, and year from students.

## Built by

Jerry S. Serillano II · Miguel Ice Francois Lagarto · Kris Laurence Cortez · Jesthur Jasper Medina · Peter John Mayor

---

Part of the BS Computer Engineering program at PRMSU, Iba, Zambales.
