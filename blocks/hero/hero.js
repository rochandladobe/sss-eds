export default async function decorate(block) {
  const rows = [...block.children];
  let heading = '';
  let text = '';
  let ctaText = '';
  let ctaHref = '';
  let bgImage = '';
  let bgAlt = '';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const key = cells[0]?.textContent?.trim()?.toLowerCase();
    const value = cells[1];

    switch (key) {
      case 'heading':
        heading = value?.innerHTML?.trim() || '';
        break;
      case 'text':
      case 'body':
        text = value?.innerHTML?.trim() || '';
        break;
      case 'cta': {
        const link = value?.querySelector('a');
        if (link) {
          ctaText = link.textContent?.trim() || '';
          ctaHref = link.href || '';
        } else {
          // Fallback: "link text | url" pattern in plain text
          const raw = value?.textContent?.trim() || '';
          const parts = raw.split('|').map((p) => p.trim());
          if (parts.length >= 2) {
            [ctaText, ctaHref] = parts;
          } else {
            ctaText = raw;
          }
        }
        break;
      }
      case 'image': {
        const img = value?.querySelector('img');
        if (img) {
          bgImage = img.src || '';
          bgAlt = img.alt || '';
        }
        break;
      }
      default:
        break;
    }
  });

  // Build hero HTML
  const styleAttr = bgImage ? ` style="--hero-bg: url('${bgImage}')"` : '';

  block.innerHTML = `
    <div class="hero__inner"${styleAttr}>
      ${bgImage ? `<div class="hero__bg-image" role="img" aria-label="${bgAlt}"></div>` : ''}
      <div class="hero__overlay"></div>
      <div class="hero__content">
        ${heading ? `<h1 class="hero__heading">${heading}</h1>` : ''}
        ${text ? `<div class="hero__text">${text}</div>` : ''}
        ${ctaText ? `<a href="${ctaHref}" class="hero__cta">${ctaText}</a>` : ''}
      </div>
    </div>
  `;
}
