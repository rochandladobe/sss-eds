export default async function decorate(block) {
  const cards = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      icon: cells[0]?.querySelector('img')?.src || '',
      iconAlt: cells[0]?.querySelector('img')?.alt || '',
      title: cells[1]?.textContent?.trim() || '',
      desc: cells[2]?.innerHTML || '',
      linkText: cells[3]?.textContent?.trim() || '',
      linkHref: cells[4]?.querySelector('a')?.href || cells[4]?.textContent?.trim() || '',
    };
  });

  block.innerHTML = `<ul class="cards__list">
    ${cards
      .map(
        (card) => `
      <li class="cards__item">
        ${card.icon ? `<div class="cards__icon"><img src="${card.icon}" alt="${card.iconAlt}" width="48" height="48" loading="lazy"></div>` : ''}
        <div class="cards__body">
          <h3 class="cards__title">${card.title}</h3>
          <div class="cards__desc">${card.desc}</div>
          ${card.linkText && card.linkHref ? `<a href="${card.linkHref}" class="cards__link">${card.linkText} →</a>` : ''}
        </div>
      </li>
    `,
      )
      .join('')}
  </ul>`;
}
