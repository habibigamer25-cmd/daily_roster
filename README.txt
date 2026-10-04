SAFETY OFFICERS ROSTER — WEBSITE WITH PASSWORD-PROTECTED UPLOAD
===================================================================

WHAT'S IN THIS ZIP
-------------------
index.html        -> the PUBLIC page — everyone who visits sees this
admin.html         -> the UPLOAD page — only you should use this (password protected)
save.php           -> server script that checks the password and saves the new roster
shared.js           -> shared code used to read the .xlsx file
roster_data.json  -> the roster data currently shown on the site (starts with the
                      August 2026 sample; gets overwritten every time you publish
                      a new roster from admin.html)

REQUIREMENT: your hosting must support PHP (almost all shared hosting —
cPanel, Hostinger, GoDaddy, etc. — supports this by default).


STEP 1 — SET YOUR PASSWORD
-----------------------------
Open save.php in any text editor and find this line near the top:

    $ADMIN_PASSWORD = 'CHANGE_ME_roster2026';

Change CHANGE_ME_roster2026 to whatever password you want, for example:

    $ADMIN_PASSWORD = 'MySecret2026!';

Save the file. This is the password you'll use on admin.html to publish
updates — nobody else can see or guess it from the website itself.


STEP 2 — UPLOAD TO YOUR HOSTING
-----------------------------------
1. Open your hosting's File Manager (or connect with FTP).
2. Go to your website's main folder (often called public_html, www, or htdocs).
3. Upload ALL FIVE files (index.html, admin.html, save.php, shared.js,
   roster_data.json) into that same folder — keep them together, don't
   put them in separate subfolders.
4. Make sure roster_data.json is writable by the server. In most File
   Managers: right-click it → Permissions/CHMOD → set to 664 (or 666 if
   664 doesn't work). Set the folder itself to 755 (or 775).


STEP 3 — TEST IT
-------------------
- Visit yourwebsite.com/index.html — this is the page you'll share with
  everyone. It should show the current roster.
- Visit yourwebsite.com/admin.html — this is your private upload page.
  (It isn't linked from the public page, but anyone who knows/guesses
  the URL can open the page itself — they just can't publish anything
  without your password.)


HOW TO PUBLISH AN UPDATED ROSTER
------------------------------------
1. Go to yourwebsite.com/admin.html
2. Choose the new roster .xlsx file (same layout as the original —
   day headers like "1 SAT", "2 SUN", and one row per employee).
3. Enter your password.
4. Tap "Publish to website".
5. Done — anyone who opens index.html now (or refreshes it) sees the
   new roster immediately. No re-uploading needed on their end.


SECURITY NOTES
-----------------
- Treat admin.html + your password like a key to your front door — only
  share the password with people who should be able to update the roster.
- The password is checked on the server (save.php), so it never appears
  in the website's visible code.
- If you ever suspect the password has leaked, just open save.php and
  change it to a new one.


TROUBLESHOOTING
------------------
"Could not reach the server (save.php)"
   -> Your hosting may not support PHP, or save.php didn't upload
      correctly. Contact your hosting's support and ask them to confirm
      PHP is enabled for your plan.

"Could not save the file on the server"
   -> roster_data.json (or its folder) isn't writable. Fix its
      permissions as described in Step 2.

"Incorrect password"
   -> Double check what you set in save.php (Step 1) matches exactly
      what you're typing on admin.html.
