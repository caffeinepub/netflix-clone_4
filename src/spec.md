# Specification

## Summary
**Goal:** Convert Saanufox into a Progressive Web App with offline support and home screen installation capability.

**Planned changes:**
- Add manifest.json with app metadata for PWA functionality
- Link manifest and add theme-color meta tag in index.html
- Create service worker (sw.js) with caching strategies for offline support
- Register service worker in main.tsx
- Create offline fallback page (offline.html)
- Add apple-touch-icon meta tags for iOS home screen support

**User-visible outcome:** Users can install Saanufox on their home screen like a native app and access cached content offline. The app will work seamlessly without internet connection for previously viewed content.
