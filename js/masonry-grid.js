/**
 * Modular Masonry Grid System
 * A reusable, responsive masonry grid implementation
 */
class MasonryGrid {
  constructor(container, config = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    
    if (!this.container) {
      console.error('MasonryGrid: Container not found');
      return;
    }

    // Default configuration
    this.config = {
      breakpoints: {
        mobile: { maxWidth: 767, columns: 2 },
        tablet: { maxWidth: 1023, columns: 3 },
        desktop: { maxWidth: 1399, columns: 4 },
        large: { maxWidth: 9999, columns: 5 } // Changed from Infinity to large number
      },
      gutter: 15,
      itemSelector: '.cake', // Changed default to .cake to match art.html
      enableResize: true,
      resizeDelay: 250,
      ...config
    };

    this.masonry = null;
    this.currentBreakpoint = null;
    this.resizeTimer = null;
    this.isInitialized = false;

    this.init();
  }

  init() {
    if (!window.Masonry) {
      console.error('MasonryGrid: Masonry library not found. Please include masonry.pkgd.min.js');
      return;
    }

    if (!window.imagesLoaded) {
      console.error('MasonryGrid: imagesLoaded library not found. Please include imagesloaded.pkgd.min.js');
      return;
    }

    // Prevent double initialization
    if (this.container.hasAttribute('data-masonry-initialized')) {
      console.log('⚠️ Container already has masonry initialized, skipping...');
      return;
    }

    this.container.setAttribute('data-masonry-initialized', 'true');
    this.setupContainer();
    this.initMasonry();
    
    if (this.config.enableResize) {
      this.setupResizeHandler();
    }
  }

  setupContainer() {
    // Ensure container has the proper CSS class for styling
    this.container.classList.add('masonry-grid-container');
  }

  getCurrentBreakpoint() {
    const width = window.innerWidth;
    console.log('🔍 Checking breakpoint for width:', width);
    
    // Check breakpoints in order of preference (largest to smallest)
    const sortedBreakpoints = Object.entries(this.config.breakpoints).sort((a, b) => a[1].maxWidth - b[1].maxWidth);
    
    for (const [name, breakpoint] of sortedBreakpoints) {
      console.log(`- Checking ${name}: maxWidth ${breakpoint.maxWidth}, columns ${breakpoint.columns}`);
      if (width <= breakpoint.maxWidth) {
        console.log(`✅ Selected breakpoint: ${name} (${breakpoint.columns} columns)`);
        return { name, ...breakpoint };
      }
    }
    
    // Fallback to largest breakpoint
    const fallback = sortedBreakpoints[sortedBreakpoints.length - 1];
    console.log(`🔄 Fallback to: ${fallback[0]} (${fallback[1].columns} columns)`);
    return { name: fallback[0], ...fallback[1] };
  }

  calculateColumnWidth() {
    const breakpoint = this.getCurrentBreakpoint();
    const containerWidth = this.container.offsetWidth;
    const gutter = this.config.gutter;
    
    // Calculate column width based on desired columns
    // Use smaller units for masonry to work properly (like original columnWidth: 100)
    const columnWidth = Math.floor(containerWidth / (breakpoint.columns * 2.2));
    
    console.log('📐 Column calculation:', {
      breakpoint: breakpoint.name,
      desiredColumns: breakpoint.columns,
      containerWidth,
      calculatedColumnWidth: columnWidth,
      estimatedImageWidth: columnWidth * 2.2,
      availableSpace: containerWidth - (gutter * (breakpoint.columns - 1))
    });
    
    return columnWidth;
  }

  initMasonry() {
    const breakpoint = this.getCurrentBreakpoint();
    
    // Only initialize masonry for tablet and above
    if (window.innerWidth < 768) {
      this.destroyMasonry();
      return;
    }

    const columnWidth = this.calculateColumnWidth();
    
    // Destroy existing masonry if breakpoint changed
    if (this.currentBreakpoint && this.currentBreakpoint.name !== breakpoint.name) {
      this.destroyMasonry();
    }

    this.currentBreakpoint = breakpoint;

    // Wait for images to load before initializing masonry
    window.imagesLoaded(this.container, () => {
      this.masonry = new window.Masonry(this.container, {
        itemSelector: this.config.itemSelector,
        columnWidth: columnWidth,
        gutter: this.config.gutter,
        percentPosition: true,
        transitionDuration: 0,
        fitWidth: true, // This should help with centering
        // Note: horizontalOrder is NOT used to allow proper gap filling
      });

      this.isInitialized = true;
      this.container.classList.add('masonry-initialized');
      
      // Debug logging - always enabled for art page debugging
      console.log('🔧 MasonryGrid initialized:', {
        breakpoint: breakpoint.name,
        columns: breakpoint.columns,
        columnWidth,
        containerWidth: this.container.offsetWidth,
        containerOffsetLeft: this.container.offsetLeft,
        parentWidth: this.container.parentElement.offsetWidth,
        masonryColumns: this.masonry.cols
      });
      
      // Check centering after masonry init
      setTimeout(() => {
        console.log('📏 Post-masonry container position:', {
          offsetLeft: this.container.offsetLeft,
          offsetWidth: this.container.offsetWidth,
          parentWidth: this.container.parentElement.offsetWidth,
          computedMargin: window.getComputedStyle(this.container).margin,
          computedLeft: window.getComputedStyle(this.container).left,
          computedTransform: window.getComputedStyle(this.container).transform
        });
      }, 200);
    });
  }

  destroyMasonry() {
    if (this.masonry) {
      this.masonry.destroy();
      this.masonry = null;
      this.isInitialized = false;
      this.container.classList.remove('masonry-initialized');
    }
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.handleResize();
      }, this.config.resizeDelay);
    });
  }

  handleResize() {
    const newBreakpoint = this.getCurrentBreakpoint();
    console.log('🔄 Resize triggered, current:', this.currentBreakpoint?.name, 'new:', newBreakpoint.name);
    
    // Only reinitialize if breakpoint actually changed
    if (this.currentBreakpoint && this.currentBreakpoint.name === newBreakpoint.name) {
      console.log('⏭️ Same breakpoint, just relayout');
      if (this.masonry) {
        this.masonry.layout();
      }
      return;
    }
    
    console.log('🔄 Breakpoint changed, reinitializing...');
    this.initMasonry();
  }

  // Public methods for manual control
  layout() {
    if (this.masonry) {
      this.masonry.layout();
    }
  }

  addItems(elements) {
    if (this.masonry) {
      this.masonry.appended(elements);
    }
  }

  removeItems(elements) {
    if (this.masonry) {
      this.masonry.remove(elements);
      this.masonry.layout();
    }
  }

  destroy() {
    this.destroyMasonry();
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

// Make it available globally
window.MasonryGrid = MasonryGrid;

// Auto-initialize grids with data attributes
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Auto-initializing masonry grids...');
  const autoGrids = document.querySelectorAll('[data-masonry-grid]');
  console.log('Found', autoGrids.length, 'grids to initialize');
  
  autoGrids.forEach((container, index) => {
    console.log(`Initializing grid ${index + 1}:`, container);
    const configAttr = container.getAttribute('data-masonry-config');
    const config = configAttr ? JSON.parse(configAttr) : {};
    console.log('Config for grid:', config);
    new MasonryGrid(container, config);
  });
});