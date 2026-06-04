# SSS EDS

AEM Edge Delivery Services site for the Selective Service System (sss.gov).

## Preview

https://main--sss-eds--rochandladobe.aem.page/

## Content Source

SharePoint — see [SharePoint Setup](./SHAREPOINT-SETUP.md) for configuration instructions.

## Blocks

| Block | Description |
|-------|-------------|
| `header` | USWDS-style site header with USA banner, nav, Register/Verify CTAs |
| `footer` | Big footer with 3 link columns + contact info |
| `hero` | Full-width hero with background image, heading, CTA |
| `cards` | Icon + title + description + link card grid |
| `section-metadata` | Utility block for section styling (e.g., `style: dark`) |

## Local Development

```bash
npm install
npx aem up
```

## Content Authoring

Edit Word documents in SharePoint, then use the AEM Sidekick to Preview and Publish.
