# SPACE42 - Career Portal with Orion AI Assistant

## 🌌 Welcome to SPACE42

An immersive career portal featuring:
- **WebGL Galaxy Background** - Stays throughout your entire journey
- **Orion AI Assistant** - Your friendly HR guide
- **Full Auth System** - Login/Signup with role-based content
- **Role Selection** - HR, Candidate, or Employee experiences

---

## ✨ What's New

### 1. **SPACE42 Branding**
- Large, bold ombré logo (8rem font size)
- Gradient effect: white → gray → dark gray
- 3.5 second breathe-out intro animation

### 2. **Persistent Galaxy Background**
- Uses actual OGL-based Galaxy component
- Interactive stars with mouse repulsion
- Stays visible throughout entire website
- Smooth fade-in after SPACE42 intro

### 3. **Orion AI Introduction**
- Appears after SPACE42 intro
- Friendly greeting with pulsing avatar
- Introduces itself as HR AI agent for SPACE42
- Guides users to authentication

### 4. **Complete Auth Flow**
- **Login/Signup** - Clean, modern forms
- **Role Selection** - HR, Candidate, or Employee
- **Persistent state** - Remembers your login & role
- **Badge display** - Shows current role (click to change)

---

## 🎬 Complete User Journey

### First-Time Visitor:

```
1. SPACE42 Logo (3.5s breathe-out)
   ↓
2. Galaxy fades in (persists from now on)
   ↓
3. Orion Introduction
   "Hello! I'm Orion, your friendly HR AI agent..."
   ↓
4. Login/Signup Screen
   Choose: Login or Sign Up
   ↓
5. Role Selection
   Choose: HR, Candidate, or Employee
   ↓
6. Main Dashboard
   Personalized cards based on role
```

### Returning Visitor:

```
1. SPACE42 Logo (3.5s)
   ↓
2. Galaxy fades in
   ↓
3. Orion greeting
   ↓
4. Directly to Main Dashboard
   (remembers login & role)
```

---

## 🚀 Quick Start

### Step 1: Extract Files
Unzip to any folder

### Step 2: Open in Browser
Double-click **`index.html`**

### Step 3: Experience the Flow
1. Watch SPACE42 intro
2. Meet Orion
3. Login or Sign up
4. Select your role
5. Explore!

---

## 📁 Files Included

```
space42/
├── index.html          ← Main page with full flow
├── galaxy.js           ← WebGL Galaxy component
├── jobs.html           ← Job listings
├── status.html         ← Application tracking
├── onboarding.html     ← Employee onboarding
└── README.md          ← You are here
```

---

## 🎨 Galaxy Background Features

Based on the OGL (Ogle) WebGL library:

- ✨ **Advanced shaders** - GLSL fragment/vertex shaders
- 🌟 **Layered stars** - Multiple depth layers
- 💫 **Twinkling effect** - Realistic star shimmer
- 🖱️ **Mouse repulsion** - Stars avoid cursor
- 🌀 **Rotation** - Gentle galaxy spin
- 🎨 **Color control** - Hue shift, saturation, glow

### Settings:
```javascript
{
    mouseRepulsion: true,
    mouseInteraction: true,
    density: 1,
    glowIntensity: 0.3,
    saturation: 0,          // Grayscale stars
    hueShift: 140,          // Cyan/blue tint
    twinkleIntensity: 0.3,
    rotationSpeed: 0.1,
    repulsionStrength: 2,
    starSpeed: 0.5,
    speed: 1,
    transparent: false      // Solid black background
}
```

---

## 👤 Role-Based Experience

### HR / Recruiter:
- Manage Job Postings
- Review Applications
- Employee Onboarding Management

### Candidate:
- Explore & Apply for Roles
- Check Application Status

### Employee:
- Start Onboarding
- Internal Opportunities
- Team Resources

---

## 🎭 Animation Timeline

| Time | Event |
|------|-------|
| 0-3.5s | SPACE42 logo breathe-out animation |
| 3.5s | Galaxy background fades in |
| 5s | Orion introduction appears |
| User clicks "Let's Get Started" | → |
| Next | Login/Signup screen (if not logged in) |
| Next | Role selection (if no role saved) |
| Final | Main dashboard with role-based cards |

---

## 🔧 Customization

### Change SPACE42 Font Size:
```css
.logo-text {
    font-size: 8rem;  /* ← Change this */
}
```

### Change Orion Avatar:
```html
<div class="orion-avatar">🤖</div>  <!-- ← Change emoji -->
```

### Adjust Intro Duration:
```javascript
setTimeout(() => {
    // ...
}, 3500);  // ← Change milliseconds
```

### Modify Galaxy Colors:
In `index.html`, find:
```javascript
hueShift: 140,    // 0-360 color wheel
saturation: 0,    // 0-100 vividness
```

---

## 💾 Data Persistence

Uses `localStorage` to remember:
- ✅ `isLoggedIn` - Login state
- ✅ `userRole` - Selected role (HR/Candidate/Employee)

### To Reset:
Click the blue role badge in top-right corner, or:
```javascript
localStorage.clear();
location.reload();
```

---

## 🌐 Deploy Online

### GitHub Pages:
1. Create repository
2. Upload all files
3. Enable Pages
4. URL: `yourusername.github.io/space42`

### Netlify:
1. Go to netlify.com
2. Drag & drop folder
3. Instant deployment

---

## 🎯 Technical Details

### Galaxy Component:
- **WebGL** via OGL (lightweight 3D library)
- **GLSL shaders** for star rendering
- **Canvas-based** rendering
- **60 FPS** performance

### Technologies:
- Pure **HTML/CSS/JS** (no frameworks)
- **WebGL** for galaxy
- **localStorage** for persistence
- **CSS animations** for transitions

### Browser Support:
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Requires WebGL support

---

## 🐛 Troubleshooting

**Galaxy not showing?**
- Check browser console (F12)
- Ensure WebGL is supported
- Try Chrome/Firefox

**Stuck on intro?**
- Clear localStorage
- Hard refresh (Ctrl+Shift+R)

**Role badge not appearing?**
- Complete full flow (login → role selection)
- Check localStorage has both values set

---

## ✨ Key Features Implemented

✅ **SPACE42** large ombré logo  
✅ **Persistent Galaxy** background (stays throughout)  
✅ **Orion AI** introduction dialogue  
✅ **Login/Signup** authentication system  
✅ **Role selection** (HR/Candidate/Employee)  
✅ **Role-based** content  
✅ **Smooth transitions** between all screens  
✅ **State persistence** with localStorage  

---

## 📊 File Sizes

| File | Size |
|------|------|
| index.html | ~25KB |
| galaxy.js | ~18KB |
| Total | ~43KB (ultra lightweight!) |

---

## 💡 Pro Tips

1. **Galaxy is interactive** - Move your mouse to see stars repel
2. **Badge is clickable** - Change role or logout anytime
3. **Everything persists** - Galaxy stays on all pages
4. **Mobile responsive** - Works on all devices

---

## 🎨 Design Highlights

- **Ombré SPACE42 logo** - Bold gradient effect
- **Pulsing Orion avatar** - Friendly AI presence  
- **Glass morphism** - Modern UI aesthetics
- **Smooth animations** - Professional transitions
- **Consistent branding** - Space/tech theme throughout

---

**Welcome to SPACE42! Your career journey with Orion starts now.** 🚀✨

---

Made with ❤️ and stardust
