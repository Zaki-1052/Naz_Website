# Masonry Grid Usage Examples

## Quick Setup for Any Page

### 1. Include Required Files
```html
<link rel="stylesheet" href="css/masonry-grid.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js"></script>
<script src="https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js"></script>
<script src="js/masonry-grid.js"></script>
```

### 2. HTML Structure
```html
<section class="masonry-section">
  <main class="masonry-grid-container" data-masonry-grid>
    <div class="cake">
      <img src="photos/image1.jpg" alt="Description">
    </div>
    <!-- More items... -->
  </main>
</section>
```

## Custom Configuration Examples

### Cakes Page (3-4 columns)
```html
<main class="masonry-grid-container" 
      data-masonry-grid 
      data-masonry-config='{"itemSelector": ".cake", "breakpoints": {"mobile": {"maxWidth": 767, "columns": 2}, "tablet": {"maxWidth": 1023, "columns": 3}, "desktop": {"maxWidth": Infinity, "columns": 4}}}'>
```

### Teacher Page (2-3 columns for larger items)
```html
<main class="masonry-grid-container" 
      data-masonry-grid 
      data-masonry-config='{"itemSelector": ".teacher-item", "breakpoints": {"mobile": {"maxWidth": 767, "columns": 1}, "tablet": {"maxWidth": 1023, "columns": 2}, "desktop": {"maxWidth": Infinity, "columns": 3}}}'>
```

### Manual JavaScript Initialization
```javascript
// For custom control
const artGrid = new MasonryGrid('.art-container', {
  breakpoints: {
    mobile: { maxWidth: 767, columns: 2 },
    tablet: { maxWidth: 1023, columns: 3 },
    desktop: { maxWidth: 1399, columns: 4 },
    large: { maxWidth: Infinity, columns: 5 }
  },
  gutter: 15,
  itemSelector: '.cake'
});
```

## Key Benefits
- ✅ Fully responsive without hardcoded values
- ✅ Proper gap filling (no horizontalOrder)
- ✅ Reusable across all gallery pages
- ✅ Mobile-first design preserved
- ✅ No CSS conflicts with existing styles
- ✅ Easy configuration per page