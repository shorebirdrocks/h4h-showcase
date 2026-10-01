/**
 * Hack4Her Horizontal Gallery Scroll
 * - Hides scrollbar completely across all browsers
 * - Scrolls the gallery horizontally as the user scrolls down the page
 * - Translates vertical mouse-wheel events into horizontal gallery scroll
 * - Supports drag-to-scroll with grab cursor
 */

(function () {
  let isUserInteracting = false;
  let interactTimeout = null;
  let boundGallery = null;

  function setInteracting() {
    isUserInteracting = true;
    clearTimeout(interactTimeout);
    interactTimeout = setTimeout(() => {
      isUserInteracting = false;
    }, 400);
  }

  function initGallery() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    if (gallery === boundGallery && gallery._initialized) return;

    boundGallery = gallery;
    gallery._initialized = true;

    const section = gallery.closest('.section') || gallery.parentElement;

    // 1. Wheel event: translate vertical scroll to horizontal scroll
    gallery.addEventListener('wheel', function (e) {
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;
      if (maxScroll <= 0) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const atStart = gallery.scrollLeft <= 0 && e.deltaY < 0;
        const atEnd = gallery.scrollLeft >= maxScroll - 2 && e.deltaY > 0;

        if (!atStart && !atEnd) {
          e.preventDefault();
          gallery.scrollLeft += e.deltaY * 1.2;
          setInteracting();
        }
      } else {
        setInteracting();
      }
    }, { passive: false });

    // 2. Drag-to-scroll support
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    gallery.addEventListener('mousedown', function (e) {
      isDown = true;
      gallery.style.cursor = 'grabbing';
      startX = e.pageX - gallery.offsetLeft;
      scrollStart = gallery.scrollLeft;
      setInteracting();
    });

    window.addEventListener('mouseup', function () {
      if (isDown) {
        isDown = false;
        gallery.style.cursor = 'grab';
      }
    });

    window.addEventListener('mouseleave', function () {
      if (isDown) {
        isDown = false;
        gallery.style.cursor = 'grab';
      }
    });

    gallery.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.5;
      gallery.scrollLeft = scrollStart - walk;
      setInteracting();
    });

    gallery.addEventListener('touchstart', function () {
      setInteracting();
    }, { passive: true });

    gallery.addEventListener('touchmove', function () {
      setInteracting();
    }, { passive: true });

    // 3. Page scroll-linked horizontal parallax
    function onPageScroll() {
      if (isUserInteracting || isDown) return;
      if (!gallery || !section) return;

      const rect = section.getBoundingClientRect();
      const winHeight = window.innerHeight;

      if (rect.bottom > 0 && rect.top < winHeight) {
        const enterPoint = winHeight * 0.85;
        const exitPoint = -rect.height * 0.2;
        const totalDist = enterPoint - exitPoint;
        const currentPos = enterPoint - rect.top;

        const progress = Math.max(0, Math.min(1, currentPos / totalDist));
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;

        if (maxScroll > 0) {
          gallery.scrollLeft = progress * maxScroll;
        }
      }
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(onPageScroll);
    }, { passive: true });

    requestAnimationFrame(onPageScroll);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }

  const observer = new MutationObserver(() => {
    initGallery();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
