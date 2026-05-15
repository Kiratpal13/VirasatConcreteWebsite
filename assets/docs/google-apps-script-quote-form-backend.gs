const RECIPIENTS = 'info@virasatconcrete.ca,admin@virasatconcrete.ca';
const DEFAULT_REDIRECT_URL = 'https://virasatconcrete.ca/thank-you/';
const FROM_NAME = 'Virasat Concrete Website';

function doGet() {
  return HtmlService.createHtmlOutput('Virasat Concrete quote form backend is running.');
}

function doPost(e) {
  const data = e && e.parameter ? e.parameter : {};
  const redirectUrl = data.redirect || DEFAULT_REDIRECT_URL;

  try {
    const submission = {
      formName: cleanValue(data.form_name),
      name: cleanValue(data.name),
      email: cleanValue(data.email),
      phone: cleanValue(data.phone),
      area: cleanValue(data.area),
      service: cleanValue(data.service),
      message: cleanValue(data.message)
    };

    const subject = [
      'New Quote Request',
      submission.service ? `- ${submission.service}` : '',
      submission.name ? `- ${submission.name}` : ''
    ].join(' ').replace(/\s+/g, ' ').trim();

    const plainBody = [
      'New quote request from virasatconcrete.ca',
      '',
      `Form: ${submission.formName || 'Homepage Quote Form'}`,
      `Name: ${submission.name || 'Not provided'}`,
      `Email: ${submission.email || 'Not provided'}`,
      `Phone: ${submission.phone || 'Not provided'}`,
      `Project Location: ${submission.area || 'Not provided'}`,
      `Service Needed: ${submission.service || 'Not provided'}`,
      '',
      'Project Details:',
      submission.message || 'Not provided'
    ].join('\n');

    const htmlBody = `
      <h2>New Quote Request</h2>
      <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#dbe2ea;font-family:Arial,sans-serif;font-size:14px;">
        <tr><td><strong>Form</strong></td><td>${escapeHtml(submission.formName || 'Homepage Quote Form')}</td></tr>
        <tr><td><strong>Name</strong></td><td>${escapeHtml(submission.name || 'Not provided')}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(submission.email || 'Not provided')}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(submission.phone || 'Not provided')}</td></tr>
        <tr><td><strong>Project Location</strong></td><td>${escapeHtml(submission.area || 'Not provided')}</td></tr>
        <tr><td><strong>Service Needed</strong></td><td>${escapeHtml(submission.service || 'Not provided')}</td></tr>
        <tr><td><strong>Project Details</strong></td><td>${escapeHtml(submission.message || 'Not provided').replace(/\n/g, '<br>')}</td></tr>
      </table>
    `;

    MailApp.sendEmail({
      to: RECIPIENTS,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: FROM_NAME,
      replyTo: submission.email || undefined
    });

    return redirectPage(redirectUrl);
  } catch (error) {
    console.error(error);
    return HtmlService.createHtmlOutput(
      '<h1>Something went wrong</h1><p>Please go back and try again, or call (587) 936-2818.</p>'
    );
  }
}

function redirectPage(url) {
  const safeUrl = escapeAttribute(url || DEFAULT_REDIRECT_URL);
  return HtmlService.createHtmlOutput(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="0; url=${safeUrl}">
        <script>window.top.location.href = ${JSON.stringify(url || DEFAULT_REDIRECT_URL)};</script>
        <title>Redirecting...</title>
      </head>
      <body>
        <p>Redirecting... <a href="${safeUrl}">Continue</a></p>
      </body>
    </html>
  `);
}

function cleanValue(value) {
  return String(value || '').trim();
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}
