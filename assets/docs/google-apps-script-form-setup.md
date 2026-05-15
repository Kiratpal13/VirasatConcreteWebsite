# Google Apps Script Form Setup

This site is now prepared to use a Google Apps Script web app as the form backend.

## Files

- Website form: [index.html](../../index.html)
- Apps Script backend: [assets/docs/google-apps-script-quote-form-backend.gs](google-apps-script-quote-form-backend.gs)

## What this backend does

- accepts the quote form POST request
- emails both `info@virasatconcrete.ca` and `admin@virasatconcrete.ca`
- uses the visitor email as `reply-to`
- redirects the visitor to `https://virasatconcrete.ca/thank-you/`

## Setup steps

1. Go to https://script.google.com/
2. Create a new standalone Apps Script project.
3. Replace the default code with the contents of [assets/docs/google-apps-script-quote-form-backend.gs](google-apps-script-quote-form-backend.gs).
4. Save the project.
5. Click Deploy → New deployment.
6. Choose Web app.
7. Set Execute as: Me.
8. Set Who has access: Anyone.
9. Deploy and authorize the script.
10. Copy the deployed web app URL ending in `/exec`.
11. Open [index.html](../../index.html#L536-L538).
12. Replace `REPLACE_WITH_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with the deployed `/exec` URL.
13. Publish the site.

## Important notes

- If you change the Apps Script code later, redeploy the web app version.
- Keep the `/exec` URL, not the `/dev` test URL.
- Apps Script has daily email quotas. For a normal local business lead form, this is usually fine.
- The form field names on the site should stay as they are so the script can read them correctly.
