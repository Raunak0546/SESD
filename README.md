# Alumnest – Alumni Networking, Mentorship & Referral Platform (MERN)
(earlier name: AlumniConnect)

## 1. Install once (on your computer)
| Tool | Version | Check |
|---|---|---|
| Node.js (includes npm) | 18 or newer (LTS recommended) | `node -v` |
| MongoDB Community Server **or** a free MongoDB Atlas cluster | 6.0+ | `mongosh` connects |
| VS Code | any | |

## 2. Run (inside VS Code)
1. File > Open Folder > select this `AlumniConnect` folder.
2. Open the terminal: Terminal > New Terminal (make sure it is in this folder).
3. Run these, one at a time:
   ```
   npm run install:all     # installs root, server and client packages (needs internet, ~2-5 min)
   npm run seed            # adds demo users, alumni profiles and jobs to MongoDB
   npm run dev             # starts API (port 5001) and React app (port 5173) together
   ```
   (or `npm run setup` = install:all + seed)
4. Open http://localhost:5173
5. Health check for the API: http://localhost:5001/api/health  ->  {"ok":true}

## 2b. Email OTP verification (new)
Every login and registration now sends a 6-digit code to the user's email, and the code must be entered to get in.
- **Quick start (no setup):** leave `SMTP_HOST` empty in `server/.env`. The code is printed in the **server terminal** (look for `[DEV MAIL]`). Copy it into the page.
- **Real emails (Gmail example):** turn on 2-Step Verification in your Google account, create an App Password, then set in `server/.env`:
  ```
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=youraddress@gmail.com
  SMTP_PASS=your-16-char-app-password
  MAIL_FROM=Alumnest <youraddress@gmail.com>
  ```
  Restart `npm run dev`. After changing dependencies run `npm run install:all` again (nodemailer was added).
- Codes expire in 5 minutes, allow 5 wrong tries, and can be resent after 30 seconds.

See **docs/GMAIL_OTP_SETUP.md** for step-by-step Gmail setup (MERN with SMTP, or the standalone demo with EmailJS).

## 3. Demo logins (password: password123)
| Role | Email |
|---|---|
| Student | student@demo.com |
| Alumni | alumni1@demo.com ... alumni4@demo.com |
| Admin | admin@demo.com |

## 4. MongoDB options
- **Local:** install MongoDB Community Server. On Windows it runs as a service automatically. Default `server/.env` already points to `mongodb://127.0.0.1:27017/alumniconnect`.
- **Atlas (cloud):** create a free cluster, add a database user, allow your IP (Network Access > Add IP), copy the connection string and put it in `server/.env` as `MONGO_URI=...` (add `/alumniconnect` before the `?`). Special characters in the password must be URL-encoded.

## 5. Troubleshooting
| Problem | Fix |
|---|---|
| `MongoDB connection failed` / `ECONNREFUSED 27017` | MongoDB is not running. Start the service (Windows: Services > MongoDB > Start; Mac: `brew services start mongodb-community`; Linux: `sudo systemctl start mongod`) or use Atlas. |
| `EADDRINUSE :::5001` | Another program uses the port. Change `PORT` in `server/.env` and `VITE_API_URL` in `client/.env` to match. |
| Login page says "Network Error" | API is not running (check terminal for errors) or `client/.env` URL does not match the server port. Restart `npm run dev` after editing any `.env`. |
| `'concurrently' is not recognized` | Run `npm run install:all` first. |
| `Cannot find module ...` | Same: run `npm run install:all` from the project root. |
| Directory is empty | You skipped `npm run seed`, or seeded a different database. |
| Node version errors (vite / syntax) | Install Node 18+ and re-run `npm run install:all`. |
| PowerShell says scripts are disabled | Use Command Prompt terminal in VS Code, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |

## 6. Folder map
- `server/` Express API: auth with email OTP, alumni directory, jobs, referrals (models, controllers, routes, middleware, seed.js)
- `client/` React + Vite + Tailwind app (login with OTP, directory, dashboards, job board)
- `docs/Alumnest-Demo.html` the full six-module demo (Home, Explore, Jobs, Messages, Community, Profile). Double-click to open, no install.
- `docs/SESD_Project_Report_Alumnest.docx` the 17-page report; `docs/Project-Presentation.pptx` the slides (still titled AlumniConnect); `docs/GMAIL_OTP_SETUP.md` Gmail setup.

## 7. What is built where (be clear about this when presenting)
| Feature | docs/Alumnest-Demo.html | MERN code (server + client) |
|---|---|---|
| Validation + email OTP login | yes (demo inbox, or real email with EmailJS) | yes (real email with Gmail SMTP) |
| Alumni directory, filters, referrals | yes | yes |
| Jobs (post and list) | yes | yes |
| Saved/applied jobs, connections, chat, mentorship sessions, community, profile settings | yes | not yet (designed in the report) |

## 8. Extra things to do
**Before your presentation (about 30 minutes)**
1. Run the MERN app once on your computer (`npm run setup`, then `npm run dev`) and confirm you can log in with the OTP from the terminal.
2. Optional: set up Gmail (docs/GMAIL_OTP_SETUP.md) so the code arrives in a real inbox.
3. Change `JWT_SECRET` in `server/.env` to your own long random text.
4. Fill your name, hall ticket number and guide on the report cover page, and update the slide title to Alumnest if you want matching names.
5. Practise the two-tab demo: student sends a connection request, alumnus accepts in the other tab, chat, request a meeting.
6. Open the report in Word and check it is still 17 pages.

**To make the project stronger (in this order)**
1. Build the missing server APIs: Connection, Message, MentorSession, Post and profile settings (models and routes follow the same pattern as referrals). This makes the MERN app match the demo and the report.
2. Real-time chat and notifications with Socket.io.
3. Deploy: database on MongoDB Atlas, API on Render, client on Vercel or Netlify (set VITE_API_URL, CLIENT_URL and the SMTP variables in the hosts).
4. Add automated tests (Jest + Supertest for the API) and put the code on GitHub with this README.
5. Password reset using the same OTP service, and an admin screen to verify alumni.

Before any public deployment change `JWT_SECRET` in `server/.env`.
