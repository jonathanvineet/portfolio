export class Masonry {
  constructor(container, items, options = {}) {
    this.container = container;
    this.items = items;
    this.options = {
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      duration: 0.8,
      stagger: 0.06,
      animateFrom: 'bottom',
      blurToFocus: true,
      ...options,
    };

    this.columns = 0;
    this.gridData = [];
    this.hasMounted = false;

    this.init();
  }

  static async preloadImages(items) {
    await Promise.all(
      items.map(
        item =>
          new Promise(resolve => {
            const img = new Image();
            img.src = item.img;
            img.onload = img.onerror = resolve;
          })
      )
    );
  }

  getColumns() {
    const queries = ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)', '(min-width: 400px)'];
    const columnCounts = [5, 4, 3, 2];
    const defaultColumns = 1;
    
    const index = queries.findIndex(q => window.matchMedia(q).matches);
    return columnCounts[index] ?? defaultColumns;
  }

  calculateLayout() {
    this.columns = this.getColumns();
    const containerWidth = this.container.offsetWidth;
    const columnWidth = containerWidth / this.columns;
    const colHeights = new Array(this.columns).fill(0);

    this.gridData = this.items.map(item => {
      const colIndex = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * colIndex;
      const y = colHeights[colIndex];
      // Use a fixed aspect ratio or pre-defined height
      const height = item.height ? (item.height / 2) : (columnWidth * 1.2);

      colHeights[colIndex] += height;

      return { ...item, x, y, w: columnWidth, h: height };
    });

    this.container.style.height = `${Math.max(...colHeights)}px`;
  }

  getInitialPosition(item) {
    let { animateFrom } = this.options;
    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      animateFrom = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (animateFrom) {
      case 'top': return { x: item.x, y: -300, ...item };
      case 'bottom': return { x: item.x, y: window.innerHeight, ...item };
      case 'left': return { x: -300, y: item.y, ...item };
      case 'right': return { x: window.innerWidth, y: item.y, ...item };
      default: return { x: item.x, y: item.y + 100, ...item };
    }
  }

  render() {
    this.calculateLayout();

    this.gridData.forEach((item, index) => {
      const itemEl = this.container.querySelector(`[data-key="${item.id}"]`);
      if (!itemEl) return;

      const initialPos = this.getInitialPosition(item);
      
      // Initial state (before animation)
      let initialStyle = `
        width: ${item.w}px;
        height: ${item.h}px;
        transform: translate(${initialPos.x}px, ${initialPos.y}px);
        opacity: 0;
      `;
      if (this.options.blurToFocus) {
        initialStyle += 'filter: blur(10px);';
      }
      
      // Final state (for transition)
      const finalStyle = `
        transition-duration: ${this.options.duration}s;
        transition-timing-function: ${this.options.ease};
        transition-property: transform, opacity, filter;
        transition-delay: ${index * this.options.stagger}s;
        transform: translate(${item.x}px, ${item.y}px);
        opacity: 1;
        filter: blur(0px);
      `;

      if (!this.hasMounted) {
        itemEl.style.cssText = initialStyle;
        // Use setTimeout to allow browser to apply initial styles before transitioning
        setTimeout(() => {
          itemEl.style.cssText += finalStyle;
        }, 10);
      } else {
        // For resize, just move to new position
        itemEl.style.cssText = `
          width: ${item.w}px;
          height: ${item.h}px;
          transition-duration: 0.4s;
          transition-timing-function: ${this.options.ease};
          transform: translate(${item.x}px, ${item.y}px);
          opacity: 1;
          filter: blur(0px);
        `;
      }
    });

    if (!this.hasMounted) {
      this.hasMounted = true;
    }
  }

  createDOM() {
    const fragment = document.createDocumentFragment();
    this.items.forEach(item => {
      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'masonry-item-wrapper';
      itemWrapper.dataset.key = item.id;
      itemWrapper.onclick = () => window.open(item.url, '_blank', 'noopener');

      const itemImg = document.createElement('div');
      itemImg.className = 'item-img';
      itemImg.style.backgroundImage = `url(${item.img})`;
      
      itemWrapper.appendChild(itemImg);
      fragment.appendChild(itemWrapper);
    });
    this.container.appendChild(fragment);
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  async init() {
    this.container.classList.add('masonry-list');
    await Masonry.preloadImages(this.items);
    this.createDOM();
    this.render();
    window.addEventListener('resize', this.debounce(() => this.render(), 100));
  }
}
