# Get the verification code in Gmail

Why you saw the code inside the app: the hosted preview link is a plain web page. It is not allowed to connect to mail servers, so it shows the code in a "Demo inbox" box. Real email needs one of the two options below.

---
## Option A: Full MERN project (recommended, real and secure)
The server generates the code, stores only a hash, and emails it with Gmail SMTP.

1. Google Account > Security > turn on **2-Step Verification**.
2. Google Account > Security > **App passwords** > create one (name: Alumnest). Copy the 16-character password.
3. Open `server/.env` and fill:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=youraddress@gmail.com
   SMTP_PASS=abcdefghijklmnop        <- the 16 characters, no spaces
   MAIL_FROM=Alumnest <youraddress@gmail.com>
   ```
4. In the VS Code terminal run `npm run install:all` once (installs nodemailer), then `npm run dev`.
5. Log in on http://localhost:5173. The code arrives in the inbox of the email you typed (check Spam the first time).

Troubleshooting: `Invalid login` / `535` = you used your normal password, use the App Password. No email and no error = `SMTP_HOST` is empty, so the code is printed in the server terminal as `[DEV MAIL]`.

---
## Option B: Standalone demo file (docs/AlumniConnect-Demo.html) with EmailJS (free, no server)
EmailJS sends the email from the browser through your Gmail. Free plan: 200 emails per month.

1. Sign up at https://www.emailjs.com and verify your account.
2. **Email Services > Add New Service > Gmail** > connect your Gmail. Copy the **Service ID**.
3. **Email Templates > Create New Template**:
   - To Email: `{{to_email}}`
   - Subject: `Your Alumnest verification code`
   - Content: `Hi {{to_name}}, your {{app_name}} verification code is {{otp}}. It is valid for 5 minutes.`
   - Save and copy the **Template ID**.
4. **Account > General** > copy the **Public Key**.
5. Open `docs/AlumniConnect-Demo.html` in VS Code, find this line near the top of the script and fill the 3 values:
   ```js
   var EMAILJS={service:'service_xxxx',template:'template_xxxx',key:'your_public_key'};
   ```
6. Open the file in Chrome from your computer (double-click). Log in with any account: the code is emailed, and the page no longer shows it.

Important: in this option the code is created in the browser, so it is a demonstration of the flow, not strong security. Use Option A for the real, secure version.
If sending fails (wrong keys, no internet), the page falls back to the demo inbox and tells you why.
