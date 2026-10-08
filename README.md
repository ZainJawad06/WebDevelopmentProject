# MediRemind - Medicine Reminder & Stock Tracker Web Application

> **Project Credit**: Prepared by AIML C1  
> **Live Deployed Demo**: [https://temporary-agile-oboe-rqlhc9l.vercel.app](https://temporary-agile-oboe-rqlhc9l.vercel.app)

---

## 1. Topic
**Medicine Reminder Web Application**: Patients often forget complex medication schedules, miss critical prescription timings, and lose track of remaining pill inventories. MediRemind provides a digital healthcare solution to record personalized prescriptions, track daily intake schedules, monitor pill stock levels in real time, and alert patients before medicines run out.

---

## 2. Features
- **Enter Specific Medicines**: Add custom prescription names, dosage instructions, scheduled intake times, initial stock quantities, and optional dietary notes.
- **Real-Time Stock Tracking**: Visual progress bars display remaining doses (`X/30 doses`) for each prescription with automatic stock decrement on intake and "+5 Refill" quick-restock actions.
- **Low-Stock Warning Alerts**: Prescriptions with $\le 5$ doses automatically display a prominent "Low Stock!" alert badge.
- **Multi-Section Views**:
  - **Overview Dashboard**: Quick glance at featured prescription cards, daily schedule, and registration form.
  - **Daily Intake Schedule**: Full-screen chronological schedule table with interactive status toggles and delete controls.
  - **Stock & Inventory Tracker**: Dedicated inventory view displaying pill levels, restock urgency, and refill shortcuts.
  - **Saved Prescriptions Library**: Complete archive of all registered patient medications.
- **Live Search & Category Filters**: Instant name search plus quick filter pills: *All Prescriptions*, *Pending*, *Taken*, and *Low Stock*.
- **Zero-Blocker Cloud Sync**: Real-time cloud persistence powered by Supabase, backed by an automatic `localStorage` offline fallback that ensures zero downtime and no blocker errors.
- **Neobrutalism Design Aesthetic**: High-contrast stark black borders (`2.5px`/`3px`), unblurred offset drop shadows (`4px 4px 0px #000`), vibrant pastel card themes, and tactile press-down click animations.

---

## 3. Working Solution (Step-by-Step)

```
[ Patient Inputs Medicine ]
            │
            ▼
[ Form Validation & Stock Setup ]
            │
            ├──► Saved to Local Storage (Instant UI Response)
            │
            └──► Synced to Supabase Cloud Database (PostgreSQL)
                        │
                        ▼
            [ Dashboard Updates in Real-Time ]
            ├── Pastel Prescription Card Rendered
            ├── Schedule Row Created with Time & Dosage
            └── Stock Progress Bar Initialized
                        │
                        ▼
            [ Patient Takes Dose ("Take Dose") ]
            ├── Status toggles to "Taken" (Green checkmark)
            ├── Stock level decrements by 1 dose
            ├── Progress bar shrinks in real time
            └── Low-stock warning triggers if stock <= 5
```

1. **Step 1 - Registering a Medicine**: The patient enters medicine name, dosage, schedule time, and starting pill quantity in the dark registration card and clicks **Register Medicine**.
2. **Step 2 - Dual State Persistence**: The application immediately stores the prescription in browser memory and `localStorage`, then sends an asynchronous `INSERT` query to the Supabase cloud database.
3. **Step 3 - Intake Action**: When taking medication, the patient clicks **Take Dose** on the card or the bullet icon in the schedule table. The app marks the item as completed and decrements the stock quantity by 1.
4. **Step 4 - Undo & Restock**: If clicked accidentally, clicking **Undo** replenishes the dose count. When pills run low, the patient clicks **+5 Refill** in the Stock Tracker to update inventory.
5. **Step 5 - Filtering & Search**: Patients type in the search bar or select filter pills (*Pending*, *Taken*, *Low Stock*) to view targeted subsets instantly.

---

## 4. Architecture & Tech Stacks Used

### Technology Stack
- **Structure**: Semantic HTML5 (Single comprehensive `index.html` file).
- **Styling**: Vanilla CSS3 (Single global `styles.css` file with CSS variables, Flexbox, CSS Grid, and keyframe animations).
- **Client Logic**: Pure Vanilla JavaScript (ES6+, async/await, no frameworks, no build tools).
- **Backend & Database**: **Supabase** (PostgreSQL cloud database accessed via the official Supabase JS CDN client).
- **Icons**: **Lucide Icons** (Loaded via unpkg CDN, dynamically rendered as crisp SVG vectors).
- **Typography**: **Plus Jakarta Sans** (Google Fonts).

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                      index.html                     │   │
│   │  - Semantic Layout & Navigation (Sidebar, Navbar)   │   │
│   │  - Dynamic Views (Dashboard, Schedule, Stock)       │   │
│   │  - Vanilla JS Controller (State, CRUD, Search)      │   │
│   └───────────────┬─────────────────────┬───────────────┘   │
│                   │                     │                   │
│         links     │           imports   │                   │
│                   ▼                     ▼                   │
│            ┌────────────┐        ┌─────────────┐            │
│            │ styles.css │        │ Lucide CDN  │            │
│            └────────────┘        └─────────────┘            │
│                   │                                         │
│         persists  │                                         │
│                   ▼                                         │
│            ┌──────────────┐                                 │
│            │ localStorage │                                 │
│            └──────┬───────┘                                 │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    │ HTTPS / REST (Anon Key)
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Cloud Platform                   │
│                                                             │
│   - PostgreSQL Database ('medicines' table)                 │
│   - Row Level Security (RLS) Public Policy                  │
│   - RESTful API Endpoint (PostgREST)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. How It Works

### Database Schema (`medicines` Table)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `bigint` | Primary Key, Identity | Unique identifier for each medicine |
| `created_at` | `timestamptz` | Default `now()` | Timestamp of record creation |
| `name` | `text` | Not Null | Name of the medication (e.g. Paracetamol) |
| `dosage` | `text` | Not Null | Prescription dosage (e.g. 500mg, 1 tablet) |
| `scheduled_time` | `text` | Not Null | Scheduled hour (e.g. 08:00 AM) |
| `stock` | `integer` | Default `15` | Current remaining pill count |
| `notes` | `text` | Nullable | Dietary or physician instructions |
| `is_taken` | `boolean` | Default `false` | Daily completion status flag |

### Cloud Synchronization & Offline Fallback
- **Supabase Cloud Queries**: Built-in simple `select`, `insert`, `update`, and `delete` calls keep prescriptions synchronized in the cloud.
- **Offline & First-Run Resiliency**: If network connectivity drops or the cloud table is not yet configured, the app seamlessly reads from and writes to `localStorage` under `mediremind_data`.
- **Auto-Sync Engine**: The application checks cloud availability periodically. Once the cloud table is online, it automatically migrates local entries directly to the database.

---

## 6. How to Open

No installations, no Node.js commands, no `npm install`, and no build scripts are required!

### Method 1: Double-Click Direct in Browser
1. Navigate to the project directory: `d:\webdev project\WebDevelopmentProject`.
2. Double-click **`index.html`** or right-click $\rightarrow$ **Open with** $\rightarrow$ **Google Chrome** (or Edge/Firefox/Safari).

### Method 2: VS Code Live Server
1. Open the project folder in VS Code.
2. Right-click **`index.html`** in the file explorer.
3. Select **"Open with Live Server"**.
4. The application will launch at `http://127.0.0.1:5500/index.html`.

---

## 7. Cloud Database Activation (Optional)
To enable multi-device cloud synchronization, run this SQL script in your **[Supabase Project SQL Editor](https://supabase.com/dashboard/project/hsztbpkulujygxlaquxj/sql)**:

```sql
create table medicines (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  dosage text not null,
  scheduled_time text not null,
  stock integer default 15,
  notes text,
  is_taken boolean default false
);

alter table medicines enable row level security;

create policy "Allow all operations for public users"
on medicines
for all
to public
using (true)
with check (true);
```
