# 🗂️ DALILI PROJECT STRUCTURE (Updated)

## ⚠️ NEW REORGANIZED STRUCTURE

### 📁 PROJECT ROOT (Main App Directory)
```
D:\devlopment\DALILI PROJECT\
```
**What's here:** Complete Next.js application with all source code

### 📋 PLANNING & DOCUMENTATION
```
D:\devlopment\DALILI PROJECT\brainstroming\
```
**What's here:** All planning docs, database scripts, AI instructions (NOT UPLOADED TO GITHUB)

## 📋 DIRECTORY BREAKDOWN

```
D:\devlopment\DALILI PROJECT\                    ← PROJECT ROOT (Main App)
├── 📁 brainstroming/                           ← 🚫 Planning docs (gitignored)
│   ├── 📄 DATABASE_SCHEMA.md                   ← Database documentation  
│   ├── 📄 database-setup.sql                   ← Database setup scripts
│   ├── 📄 SETUP_COMPLETE_SUMMARY.md            ← Setup instructions
│   ├── 📄 AI_INSTRUCTIONS_PROTOCOL.md          ← AI guidance documents
│   ├── 📄 POWERSHELL_SYNTAX_REMINDER.md        ← PowerShell syntax guide
│   └── 📄 All other planning docs...           ← Project planning materials
│
├── 📁 src/app/                                 ← Next.js App Router
│   ├── 📄 page.tsx                             ← Main landing page
│   ├── 📄 layout.tsx                           ← Root layout
│   ├── 📄 globals.css                          ← Global styles
│   ├── 📁 ar/                                  ← Arabic version
│   ├── 📁 en/                                  ← English version
│   └── 📁 fr/                                  ← French version
│
├── 📁 pages/                                   ← Next.js Pages Router
│   ├── 📄 admin.js                             ← Admin panel
│   ├── 📄 index.js                             ← Home page
│   ├── 📄 businesses.js                        ← Business listings
│   ├── 📄 simple-test.js                       ← Test page (working)
│   ├── 📄 home-no-db.js                        ← UI test (working)
│   └── 📄 debug-supabase.js                    ← Connection diagnostics
│
├── 📁 lib/                                     ← Utilities
│   └── 📄 supabase.js                          ← Database functions
│
├── 📁 components/                              ← React components
├── 📁 public/                                  ← Static assets
├── 📁 styles/                                  ← Styling
├── 📁 docs/                                    ← Documentation
├── 📁 node_modules/                            ← Dependencies
├── 📄 package.json                             ← Dependencies & scripts
├── 📄 .env.local                               ← Environment variables
├── 📄 .gitignore                               ← Git exclusions
├── 📄 tailwind.config.js                       ← Tailwind configuration
├── 📄 next.config.js                           ← Next.js configuration
└── 📄 README.md                                ← Project documentation
```

## 🎯 COMMAND REFERENCES

### PowerShell Commands (Windows)
```powershell
# Navigate to PROJECT ROOT (Main App)
cd "D:\devlopment\DALILI PROJECT"

# Start development server
npm run dev

# Combined (PowerShell syntax)
cd "D:\devlopment\DALILI PROJECT"; npm run dev
```

### Git/Terminal Commands
```bash
# Navigate to PROJECT ROOT
cd "D:/devlopment/DALILI PROJECT"

# Combined (Unix syntax - DON'T USE IN POWERSHELL)
cd "D:/devlopment/DALILI PROJECT" && npm run dev
```

## 📝 FILE PATH REFERENCES

### When editing app files:
- ✅ `pages/admin.js`
- ✅ `lib/supabase.js`
- ✅ `src/app/page.tsx`
- ✅ `tailwind.config.js`

### When editing planning docs:
- ✅ `brainstroming/DATABASE_SCHEMA.md`
- ✅ `brainstroming/database-setup.sql`
- ✅ `brainstroming/AI_INSTRUCTIONS_PROTOCOL.md`

## 🔧 DEVELOPMENT WORKFLOW

1. **Navigate to PROJECT ROOT**: `cd "D:\devlopment\DALILI PROJECT"`
2. **Run commands**: `npm run dev`, `npm install`, etc.
3. **Edit app files**: All in root directory structure
4. **Edit planning docs**: In `brainstroming/` folder (not uploaded to GitHub)

## 🌐 URL REFERENCES

- **Admin Panel**: `http://localhost:3000/admin`
- **Landing Page**: `http://localhost:3000`
- **Business Listings**: `http://localhost:3000/businesses`
- **Test Pages**: 
  - `http://localhost:3000/simple-test` (✅ Works)
  - `http://localhost:3000/home-no-db` (✅ Works)
  - `http://localhost:3000/debug-supabase` (Connection test)

## 🔑 ACCESS CREDENTIALS

- **Admin Password**: `dalili2024`
- **Supabase**: Settings in `lib/supabase.js`

## 🚫 GITIGNORE STATUS

**NOT UPLOADED TO GITHUB:**
- `brainstroming/` folder (all planning docs)
- `.env.local` (environment variables)
- `node_modules/` (dependencies)
- `.next/` (build files)

---

**⚠️ REMEMBER**: 
- Main app is now in PROJECT ROOT
- Planning docs in `brainstroming/` (private)
- Use proper PowerShell syntax (no `&&`) 