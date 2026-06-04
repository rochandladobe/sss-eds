/*
 * scripts.js — AEM EDS page lifecycle
 * Selective Service System (sss.gov)
 */

import {
  buildBlock,
  loadHeader,
  loadFooter,
  loadSections,
  loadBlock,
  loadCSS,
  getMetadata,
  sampleRUM,
  setup,
  decorateIcons,
  decorateSections,
  decorateBlocks,
} from './aem.js';

/**
 * Builds hero block from the first section if h1 and picture are siblings.
 * @param {Element} main The main element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  if (
    h1
    && picture
    && h1.closest('div') === picture.closest('div')
    && !h1.closest('.block')
  ) {
    const section = h1.closest('div');
    const elems = [...section.children];
    const heroBlock = buildBlock('hero', { elems });
    section.prepend(heroBlock);
  }
}

/**
 * Builds all auto-blocks for the site.
 * @param {Element} main The main element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto block building failed', error);
  }
}

/**
 * Decorates the main element — buttons, icons, auto-blocks, sections, blocks.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to display the page content lazily.
 * @param {Element} doc The document element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later, without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => {
    import('./delayed.js').catch(() => {
      /* delayed.js is optional — silently ignore if absent */
    });
  }, 3000);
}

/**
 * Determines the list of LCP blocks for this project.
 * Extend this array with block names that must be loaded before LCP.
 * @returns {string[]}
 */
function getLCPBlocks() {
  return ['hero'];
}

/**
 * Main page load orchestration:
 *  1. setup()   — initialize window.hlx
 *  2. decorateMain() — annotate DOM
 *  3. reveal body  — set body.appear
 *  4. await LCP block (if any)
 *  5. await LCP image
 *  6. loadLazy() — remaining blocks, header, footer, lazy CSS
 *  7. loadDelayed() — analytics, chatbots, etc. (after 3 s)
 */
async function loadPage() {
  setup();
  sampleRUM('top');

  const main = document.querySelector('main');
  if (main) {
    decorateMain(main);
    document.querySelector('body').classList.add('appear');

    // Load any LCP blocks synchronously so layout doesn't shift
    const lcpBlocks = getLCPBlocks();
    const firstBlock = main.querySelector('.block');
    if (firstBlock && lcpBlocks.includes(firstBlock.dataset.blockName)) {
      await loadBlock(firstBlock);
    }

    // Wait for the first image to ensure LCP is painted
    const lcpImage = main.querySelector('img');
    await new Promise((resolve) => {
      if (lcpImage && !lcpImage.complete) {
        lcpImage.setAttribute('loading', 'eager');
        lcpImage.addEventListener('load', resolve, { once: true });
        lcpImage.addEventListener('error', resolve, { once: true });
      } else {
        resolve();
      }
    });

    sampleRUM('lcp');
  }

  await loadLazy(document);
  loadDelayed();
}

loadPage();
