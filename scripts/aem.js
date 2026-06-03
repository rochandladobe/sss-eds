/*
 * aem.js — AEM EDS core helpers
 * Standard Franklin / AEM Edge Delivery Services helper library.
 */

/**
 * log RUM if part of the sample.
 * @param {string} checkpoint identifies the checkpoint in funnel
 * @param {Object} data additional data for RUM sample
 * @param {string} data.source DOM node that is the source of a checkpoint event,
 * identified by #id or .classname
 * @param {string} data.target subject of the checkpoint event,
 * for instance the href of a link, or a search term
 */
export function sampleRUM(checkpoint, data = {}) {
  sampleRUM.defer = sampleRUM.defer || [];
  const defer = (fnname) => {
    sampleRUM[fnname] = sampleRUM[fnname]
      || ((...args) => sampleRUM.defer.push({ fnname, args }));
  };
  sampleRUM.drain = sampleRUM.drain
    || ((dfnname, fn) => {
      sampleRUM[dfnname] = fn;
      sampleRUM.defer
        .filter(({ fnname }) => dfnname === fnname)
        .forEach(({ args }) => fn(...args));
    });
  sampleRUM.on = (chkpnt, fn) => { sampleRUM.cases[chkpnt] = fn; };
  defer('observe');
  defer('cwv');
  try {
    window.hlx = window.hlx || {};
    if (!window.hlx.rum) {
      const usp = new URLSearchParams(window.location.search);
      const weight = usp.get('rum') === 'on' ? 1 : 100;
      const id = Math.random().toString(36).slice(-4);
      const origin = window.location.origin || 'https://localhost';
      window.hlx.rum = {
        weight,
        id,
        origin,
        generation: 'aem-eds',
        pqueue: [],
        squeue: [],
      };
    }
    const { weight, id } = window.hlx.rum;
    if (Math.random() * weight < 1) {
      const sendPing = (pdata = data) => {
        // eslint-disable-next-line object-curly-newline
        const body = JSON.stringify({
          weight,
          id,
          referer: window.location.href,
          checkpoint,
          ...data,
          ...pdata,
        });
        const url = `https://rum.hlx.page/.rum/${weight}`;
        // fire-and-forget
        navigator.sendBeacon(url, body);
        // eslint-disable-next-line no-console
        console.debug(`[rum] ${checkpoint}`, data);
      };
      sampleRUM.cases = sampleRUM.cases || {
        cwv: () => sampleRUM.cwv(data) || true,
        lazy: () => {
          const script = document.createElement('script');
          script.src = 'https://rum.hlx.page/.rum/@adobe/helix-rum-enhancer@^1/src/index.js';
          document.head.appendChild(script);
          return true;
        },
      };
      sendPing();
      if (sampleRUM.cases[checkpoint]) {
        sampleRUM.cases[checkpoint]();
      }
    }
  } catch (error) {
    // something went wrong
  }
}

/**
 * Setup block utils.
 */
export function setup() {
  window.hlx = window.hlx || {};
  window.hlx.RUM_MASK_URL = 'full';
  window.hlx.codeBasePath = '';
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';

  const scriptEl = document.querySelector('script[src$="/scripts/scripts.js"]');
  if (scriptEl) {
    try {
      [window.hlx.codeBasePath] = new URL(scriptEl.src).pathname.split('/scripts/scripts.js');
    } catch (error) {
      // not a valid URL
    }
  }
}

/**
 * Auto-blocks need to be created before decorating sections.
 * @param {Element} main The main element
 */
export function buildAutoBlocks() {
  // extend in scripts.js if needed
}

/**
 * Converts a string to a URL-friendly class name (kebab-case).
 * @param {string} name The string to convert
 * @returns {string} The sanitized class name
 */
export function toClassName(name) {
  return typeof name === 'string'
    ? name
        .toLowerCase()
        .replace(/[^0-9a-z]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : '';
}

/**
 * Converts a string to camelCase.
 * @param {string} name The string to convert
 * @returns {string} The camelCase string
 */
export function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Reads block config from a two-column table block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        let value = '';
        if (col.querySelector('a')) {
          const aArr = [...col.querySelectorAll('a')];
          if (aArr.length === 1) {
            value = aArr[0].href;
          } else {
            value = aArr.map((a) => a.href);
          }
        } else if (col.querySelector('img')) {
          const imgArr = [...col.querySelectorAll('img')];
          if (imgArr.length === 1) {
            value = imgArr[0].src;
          } else {
            value = imgArr.map((img) => img.src);
          }
        } else if (col.querySelector('p')) {
          const pArr = [...col.querySelectorAll('p')];
          if (pArr.length === 1) {
            value = pArr[0].textContent;
          } else {
            value = pArr.map((p) => p.textContent);
          }
        } else {
          value = row.children[1].textContent;
        }
        config[name] = value;
      }
    }
  });
  return config;
}

/**
 * Sanitizes a name for use as a class name.
 * @param {string} name The unsanitized name
 * @returns {string} The class name
 */
export function sanitizeClass(name) {
  return toClassName(typeof name === 'string' ? name : '');
}

/**
 * Decorates all icons found in the element.
 * @param {Element} [element] The element to decorate icons in. Defaults to document.
 * @param {string} [prefix] Optional prefix for icon sprites.
 */
export function decorateIcons(element = document, prefix = '') {
  const icons = [...element.querySelectorAll('span.icon')];
  icons.forEach((span) => {
    const iconName = Array.from(span.classList)
      .find((c) => c.startsWith('icon-'))
      ?.substring(5);
    if (iconName) {
      const img = document.createElement('img');
      img.dataset.iconName = iconName;
      img.src = `${window.hlx.codeBasePath}${prefix}/icons/${iconName}.svg`;
      img.alt = iconName;
      img.loading = 'lazy';
      span.append(img);
    }
  });
}

/**
 * Decorates paragraphs containing a single link as a button.
 * @param {Element} element The element to decorate buttons in
 */
export function decorateButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement?.parentElement;
      if (!a.querySelector('img')) {
        if (
          up.childNodes.length === 1
          && (up.tagName === 'P' || up.tagName === 'DIV')
        ) {
          a.className = 'button primary';
          up.classList.add('button-container');
        }
        if (
          up.childNodes.length === 1
          && up.tagName === 'STRONG'
          && twoup?.childNodes.length === 1
          && twoup?.tagName === 'P'
        ) {
          a.className = 'button primary';
          twoup.classList.add('button-container');
        }
        if (
          up.childNodes.length === 1
          && up.tagName === 'EM'
          && twoup?.childNodes.length === 1
          && twoup?.tagName === 'P'
        ) {
          a.className = 'button secondary';
          twoup.classList.add('button-container');
        }
      }
    }
  });
}

/**
 * Returns the true origin of the current page in the browser.
 * If the page is running in a frameset, the origin of the top frame is returned.
 * @returns {string} The origin of the current page
 */
export function getOrigin() {
  return window.location.href === window.parent?.location.href
    ? window.location.origin
    : window.parent?.location.origin;
}

/**
 * Returns the true of the current page in the browser.mac
 * If the page is running in a frameset, the href of the top frame is returned.
 * @returns {string} The href of the current page
 */
export function getHref() {
  if (window.location.href === window.parent?.location.href) return window.location.href;
  try {
    return window.parent?.location.href;
  } catch (e) {
    return window.location.href;
  }
}

/**
 * Returns a picture element with webp and fallback image.
 * @param {string} src The image URL
 * @param {string} [alt] The image alt text
 * @param {boolean} [eager] Set loading attribute to eager
 * @param {Array} [breakpoints] Breakpoints and corresponding params
 * @returns {Element} The picture element
 */
export function createOptimizedPicture(
  src,
  alt = '',
  eager = false,
  breakpoints = [
    { media: '(min-width: 600px)', width: '2000' },
    { width: '750' },
  ],
) {
  const url = new URL(src, getHref());
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute(
      'srcset',
      `${pathname}?width=${br.width}&format=webply&optimize=medium`,
    );
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute(
        'srcset',
        `${pathname}?width=${br.width}&format=${ext}&optimize=medium`,
      );
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute(
        'src',
        `${pathname}?width=${br.width}&format=${ext}&optimize=medium`,
      );
    }
  });

  return picture;
}

/**
 * Checks if an element is currently visible in the viewport.
 * @param {Element} element The element
 * @returns {boolean} True if element is visible
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Gets the value of a query string parameter.
 * @param {string} name The parameter name
 * @returns {string} The parameter value
 */
export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...document.head.querySelectorAll(`meta[${attr}="${name}"]`)].map(
    (m) => m.content,
  );
  return meta.join(', ');
}

/**
 * Loads a CSS file.
 * @param {string} href URL to the CSS file
 * @returns {Promise<void>} A promise that resolves when the CSS is loaded
 */
export function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.append(link);
    } else {
      resolve();
    }
  });
}

/**
 * Loads a JavaScript module.
 * @param {string} src URL to the JavaScript file
 * @returns {Promise<HTMLScriptElement>} A promise that resolves when the script is loaded
 */
export function loadScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`head > script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      Object.keys(attrs).forEach((attr) => {
        script.setAttribute(attr, attrs[attr]);
      });
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    } else {
      resolve();
    }
  });
}

/**
 * Returns the language-dependent root path.
 * @param {string} [language] The language code (defaults to 'en')
 * @returns {string} The root path
 */
export function getRootPath(language = 'en') {
  const loc = window.location.pathname;
  const languageMatch = loc.match(`^/${language}/`);
  return languageMatch ? `/${language}` : '';
}

/**
 * Retrieves the content of a metadata tag.
 * @param {string} name The metadata name (or property)
 * @returns {string} The metadata value
 */
export function getMetadataValue(name) {
  return getMetadata(name);
}

/**
 * Given an element, finds the closest section metadata block.
 */
export function getSectionMetadata(section) {
  const meta = {};
  const sectionMeta = section.querySelector('div.section-metadata');
  if (sectionMeta) {
    const rows = [...sectionMeta.children];
    rows.forEach((row) => {
      if (row.children.length >= 2) {
        const key = toClassName(row.children[0].textContent);
        const val = row.children[1].textContent;
        meta[key] = val;
      }
    });
    sectionMeta.parentNode.removeChild(sectionMeta);
  }
  return meta;
}

/**
 * Builds a block DOM element from a two-dimensional array.
 * @param {string} blockName The name of the block
 * @param {any[][]} content The content of the block
 * @returns {Element} The block element
 */
export function buildBlock(blockName, content) {
  const table = Array.isArray(content) ? content : [[content]];
  const blockEl = document.createElement('div');
  // build image block nested div structure
  blockEl.classList.add(blockName);
  table.forEach((row) => {
    const rowEl = document.createElement('div');
    row.forEach((col) => {
      const colEl = document.createElement('div');
      const vals = col.elems ? col.elems : [col];
      vals.forEach((val) => {
        if (val) {
          if (typeof val === 'string') {
            colEl.innerHTML += val;
          } else {
            colEl.appendChild(val);
          }
        }
      });
      rowEl.appendChild(colEl);
    });
    blockEl.appendChild(rowEl);
  });
  return blockEl;
}

/**
 * Gets the block's class list without block name and variants.
 * @param {string} blockName The block name
 * @param {Element} block The block element
 * @returns {string[]} The additional classes
 */
export function getBlockClasses(blockName, block) {
  return [...block.classList].filter(
    (cls) => cls !== blockName && !cls.startsWith(`${blockName}--`),
  );
}

/**
 * Decorates a block.
 * @param {Element} block The block element
 */
export function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (shortBlockName) {
    block.classList.add('block');
    block.dataset.blockName = shortBlockName;
    block.dataset.blockStatus = 'initialized';
    const blockWrapper = block.parentElement;
    blockWrapper.classList.add(`${shortBlockName}-wrapper`);
    const section = block.closest('.section');
    if (section) section.classList.add(`${shortBlockName}-container`);
  }
}

/**
 * Decorates all blocks in a container.
 * @param {Element} main The container element
 */
export function decorateBlocks(main) {
  main.querySelectorAll('div.section > div > div').forEach(decorateBlock);
}

/**
 * Loads JS and CSS for a block.
 * @param {Element} block The block element
 * @returns {Promise<void>}
 */
export async function loadBlock(block) {
  const status = block.dataset.blockStatus;
  if (status !== 'loading' && status !== 'loaded') {
    block.dataset.blockStatus = 'loading';
    const blockName = block.dataset.blockName;
    try {
      const cssLoaded = loadCSS(
        `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`,
      );
      const decorationComplete = new Promise((resolve) => {
        (async () => {
          try {
            const mod = await import(
              `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`
            );
            if (mod.default) {
              await mod.default(block);
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`failed to load module for ${blockName}`, error);
          }
          resolve();
        })();
      });
      await Promise.all([cssLoaded, decorationComplete]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`failed to load block ${blockName}`, error);
    }
    block.dataset.blockStatus = 'loaded';
  }
  return block;
}

/**
 * Loads JS and CSS for all blocks in a container.
 * @param {Element} main The container element
 * @returns {Promise<void[]>}
 */
export async function loadBlocks(main) {
  updateSectionsStatus(main);
  const blocks = [...main.querySelectorAll('div.block')];
  for (let i = 0; i < blocks.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await loadBlock(blocks[i]);
    updateSectionsStatus(main);
  }
}

/**
 * Updates the status of all sections in the container based on block loading status.
 * @param {Element} main The container element
 */
export function updateSectionsStatus(main) {
  const sections = [...main.querySelectorAll(':scope > div.section')];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const loadingBlock = section.querySelector(
      '.block[data-block-status="initialized"], .block[data-block-status="loading"]',
    );
    if (loadingBlock) {
      section.dataset.sectionStatus = 'loading';
      break;
    } else {
      section.dataset.sectionStatus = 'loaded';
      section.style.display = null;
    }
  }
}

/**
 * Decorates all sections in a container element.
 * @param {Element} main The container element
 */
export function decorateSections(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach((e) => {
      if (e.tagName === 'DIV' || !defaultContent) {
        const wrapper = document.createElement('div');
        wrappers.push(wrapper);
        defaultContent = e.tagName !== 'DIV';
        if (defaultContent) wrapper.classList.add('default-content-wrapper');
      }
      wrappers[wrappers.length - 1].append(e);
    });
    wrappers.forEach((wrapper) => section.append(wrapper));
    section.classList.add('section');
    section.dataset.sectionStatus = 'initialized';
    section.style.display = 'none';

    // apply section metadata
    const sectionMeta = getSectionMetadata(section);
    const keys = Object.keys(sectionMeta);
    keys.forEach((key) => {
      if (key === 'style') {
        const styles = sectionMeta.style.split(',').map((style) => toClassName(style.trim()));
        styles.forEach((style) => section.classList.add(style));
      } else {
        section.dataset[toCamelCase(key)] = sectionMeta[key];
      }
    });
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads the header block.
 * @param {Element} header The header element
 * @returns {Promise<void>}
 */
export async function loadHeader(header) {
  const headerBlock = buildBlock('header', '');
  header.append(headerBlock);
  decorateBlock(headerBlock);
  return loadBlock(headerBlock);
}

/**
 * Loads the footer block.
 * @param {Element} footer The footer element
 * @returns {Promise<void>}
 */
export async function loadFooter(footer) {
  const footerBlock = buildBlock('footer', '');
  footer.append(footerBlock);
  decorateBlock(footerBlock);
  return loadBlock(footerBlock);
}

/**
 * Waits for the first image in the element to load.
 * @param {Element} el The element to wait for
 * @returns {Promise<void>}
 */
export function waitForFirstImage(el) {
  const img = el.querySelector('img');
  if (!img || img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  });
}

/**
 * Returns a list of properties listed in a block.
 * @param {string} blockName The block name
 * @returns {object} The block props
 */
export function getBlockProps(blockName) {
  const block = document.querySelector(`.${blockName}`);
  if (!block) return {};
  return readBlockConfig(block);
}
