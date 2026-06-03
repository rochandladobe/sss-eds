export default function decorate(block) {
  const meta = {};

  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const key = row.children[0];
      const value = row.children[1];
      if (key && value) {
        meta[key.textContent.trim().toLowerCase()] = value.textContent.trim().toLowerCase();
      }
    }
  });

  const section = block.closest('.section');

  Object.keys(meta).forEach((key) => {
    if (key === 'style') {
      // Support comma-separated styles e.g. "dark, centered"
      const classes = meta[key]
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      section.classList.add(...classes);
    } else if (key === 'background') {
      section.style.setProperty('--section-bg', meta[key]);
    } else if (key === 'id') {
      section.id = meta[key];
    } else {
      // Store any other metadata as a data attribute on the section
      section.dataset[key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = meta[key];
    }
  });

  // Remove the block from the DOM — it is utility-only
  block.remove();
}
