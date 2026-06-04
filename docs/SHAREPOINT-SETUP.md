# SharePoint Setup for SSS EDS

## Overview

AEM EDS (Edge Delivery Services) will use a SharePoint folder as the content source.
Authors update Word documents in SharePoint → AEM previews/publishes them as web pages.

---

## Step 1: Create a SharePoint Site or Folder

1. Go to your Microsoft 365 admin or SharePoint portal
2. Create a new SharePoint site (Team site recommended) named **sss-eds**
   - Or use an existing SharePoint site and create a folder called `sss-eds`
3. Note the SharePoint folder URL — it will look like:
   `https://<tenant>.sharepoint.com/sites/<sitename>/Shared Documents/<folder>`

---

## Step 2: Share with the AEM Bot

1. In SharePoint, navigate to your content folder
2. Click **Share**
3. Add `helix@adobe.com` with **Edit** permissions
4. This allows AEM EDS to read and sync your content

---

## Step 3: Update fstab.yaml

In the GitHub repo `rochandladobe/sss-eds`, edit `fstab.yaml`:

```yaml
mountpoints:
  /:
    url: https://<your-tenant>.sharepoint.com/:f:/r/sites/<site>/Shared%20Documents/<folder>
    type: markup
```

Replace the placeholder URL with your actual SharePoint folder URL.

---

## Step 4: Upload Word Documents to SharePoint

Upload the following documents to your SharePoint folder:

| Document | Path | Purpose |
|----------|------|---------|
| `index.docx` | `/` | Homepage |
| `nav.docx` | `/nav` | Site navigation |
| `footer.docx` | `/footer` | Site footer |

Convert the `.md` files in this folder to Word documents (.docx) maintaining the table structure.

---

## Step 5: Add the AEM Sidekick

1. Install the AEM Sidekick Chrome extension
2. Navigate to `https://github.com/rochandladobe/sss-eds`
3. Click the Sidekick extension icon → **Add project**
4. Navigate to your SharePoint folder
5. Use Sidekick to **Preview** and **Publish** each page

---

## Step 6: Preview URL

Once configured, your site will be available at:

- **Preview:** `https://main--sss-eds--rochandladobe.aem.page/`
- **Live:** `https://main--sss-eds--rochandladobe.aem.live/`

---

## Content Authoring Workflow

1. Open a Word document in SharePoint
2. Edit content using standard Word formatting
3. Use Sidekick in the browser to **Preview** changes
4. Use Sidekick to **Publish** when ready to go live

---

## Block Syntax in Word Documents

EDS blocks are created using Word tables:

- First cell of first row = block name (e.g., `hero`, `cards`, `nav`, `footer`)
- Subsequent rows = block content
- Tables become interactive blocks on the rendered web page

### Example: Hero Block

| hero | |
|------|--|
| heading | Page Heading Text |
| text | Body copy goes here. |
| cta | [Button Label](/path/) |
| image | (attached image file) |

### Example: Cards Block

| cards | | | | |
|-------|--|--|--|--|
| (icon.svg) | Card Title | Card description text. | CTA Label | [/path/] |

### Special Files

| File | Purpose |
|------|---------|
| `nav.docx` | Drives the global site header and navigation menu |
| `footer.docx` | Drives the global site footer |
| `index.docx` | Homepage — maps to the root `/` path |

All other pages follow the same pattern: the file path in SharePoint maps directly to the URL path on the live site.
