/* ==========================================================================
   Bay Eight Studios — site scripts
   Vanilla JS only. Bootstrap's bundle (with Popper) is loaded before this.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Header: solid background once the page is scrolled past the top
     ------------------------------------------------------------------ */
  const header = document.getElementById('mainNav');

  if (header) {
    const setHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
  }

  /* ------------------------------------------------------------------
     Hero video — fall back to the poster/black backdrop if it can't play
     (the file may not be in assets/video/ yet)
     ------------------------------------------------------------------ */
  const heroVideo = document.querySelector('.hero-video');

  if (heroVideo) {
    const source = heroVideo.querySelector('source');
    if (source) {
      source.addEventListener('error', () => {
        heroVideo.style.display = 'none';
      });
    }
    // Autoplay can still be refused (low-power mode, some browsers) — retry once.
    const play = heroVideo.play();
    if (play && typeof play.catch === 'function') {
      play.catch(() => {
        document.addEventListener(
          'click',
          () => heroVideo.play().catch(() => {}),
          { once: true }
        );
      });
    }
  }

  /* ------------------------------------------------------------------
     Scroll reveal — add class="reveal" to anything that should fade up
     ------------------------------------------------------------------ */
  const revealItems = document.querySelectorAll('.reveal');

  if (revealItems.length) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      revealItems.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      );

      revealItems.forEach((el) => revealer.observe(el));
    }
  }

  /* ------------------------------------------------------------------
     Artists strip — pointing at (or tabbing to) a portrait swaps the name
     shown in the centre card and dims the rest of the row
     ------------------------------------------------------------------ */
  const artistsRow = document.getElementById('artistsRow');
  const activeArtist = document.getElementById('activeArtist');

  if (artistsRow && activeArtist) {
    const artists = artistsRow.querySelectorAll('.artist');
    // Whatever is marked active in the markup is what we fall back to
    const fallback = artistsRow.querySelector('.artist.is-active') || artists[0];

    const setActive = (target) => {
      artists.forEach((a) => a.classList.toggle('is-active', a === target));
      activeArtist.textContent = target.dataset.artist;
    };

    artists.forEach((artist) => {
      const activate = () => {
        artistsRow.classList.add('has-active');
        setActive(artist);
      };
      artist.addEventListener('mouseenter', activate);
      artist.addEventListener('focus', activate);
      artist.addEventListener('click', activate);
    });

    const reset = () => {
      artistsRow.classList.remove('has-active');
      setActive(fallback);
    };

    artistsRow.addEventListener('mouseleave', reset);
    artistsRow.addEventListener('focusout', (event) => {
      // Only reset when focus leaves the strip entirely
      if (!artistsRow.contains(event.relatedTarget)) reset();
    });
  }

  /* ------------------------------------------------------------------
     Horizontal rails — arrow buttons scroll by one card, and disable
     themselves at each end
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-rail][data-dir]').forEach((button) => {
    const rail = document.getElementById(button.dataset.rail);
    if (!rail) return;

    button.addEventListener('click', () => {
      const card = rail.querySelector(':scope > *');
      // Read the gap off the rail so one "step" is a full card plus its gutter
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      // Fall back to a viewport-width step if the rail is somehow empty
      const step = card ? card.getBoundingClientRect().width + gap : rail.clientWidth;
      rail.scrollBy({ left: step * Number(button.dataset.dir) });
    });
  });

  document.querySelectorAll('.js-rail').forEach((rail) => {
    const buttons = document.querySelectorAll('[data-rail="' + rail.id + '"][data-dir]');
    if (!buttons.length) return;

    const syncEnds = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      buttons.forEach((button) => {
        const forward = Number(button.dataset.dir) > 0;
        // 2px of slack — sub-pixel layout keeps scrollLeft just shy of the end
        const atEnd = forward ? rail.scrollLeft >= maxScroll - 2 : rail.scrollLeft <= 2;
        button.disabled = maxScroll <= 2 || atEnd;
        button.style.opacity = button.disabled ? '0.35' : '';
      });
    };

    syncEnds();
    rail.addEventListener('scroll', syncEnds, { passive: true });
    window.addEventListener('resize', syncEnds);
  });

  /* ------------------------------------------------------------------
     Video facades — swap the poster for the real player on first click,
     so no YouTube payload is loaded until someone actually asks for it
     ------------------------------------------------------------------ */
  document.querySelectorAll('.video-frame[data-video-id]').forEach((frame) => {
    const trigger = frame.querySelector('.video-play');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const id = frame.dataset.videoId;
      const iframe = document.createElement('iframe');
      iframe.src =
        'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
      iframe.title = 'Bay Eight Studios video';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      frame.replaceChildren(iframe);
    });
  });

  /* ------------------------------------------------------------------
     Session builder — room rate plus add-on rates, times the hours
     ------------------------------------------------------------------ */
  const builder = document.getElementById('builderForm');

  if (builder) {
    const out = {
      room: document.getElementById('sumRoom'),
      rate: document.getElementById('sumRate'),
      hours: document.getElementById('sumHours'),
      addons: document.getElementById('sumAddons'),
      total: document.getElementById('sumTotal'),
    };

    const money = (n) => n.toLocaleString('en-US');

    const quote = () => {
      const room = builder.querySelector('input[name="room"]:checked');
      const hours = builder.querySelector('input[name="hours"]:checked');
      const addons = Array.from(builder.querySelectorAll('input[name="addon"]:checked'));

      const roomRate = room ? Number(room.dataset.price) : 0;
      const hourCount = hours ? Number(hours.value) : 0;
      const addonRate = addons.reduce((sum, a) => sum + Number(a.dataset.price), 0);

      out.room.textContent = room ? room.value : '—';
      out.rate.textContent = room ? '$' + roomRate + '/hr' : '';
      out.hours.textContent = hourCount + ' hr';
      out.addons.textContent = addons.length
        ? addons.map((a) => a.value).join(' · ')
        : 'None';
      out.total.textContent = money((roomRate + addonRate) * hourCount);
    };

    builder.addEventListener('change', quote);
    // Browsers restore prior selections on reload, so recompute from the DOM
    quote();
  }

  /* ------------------------------------------------------------------
     Contact form — front-end only. Validates, then shows an inline
     confirmation; nothing is sent anywhere.
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactStatus.hidden = false;
        contactStatus.dataset.state = 'error';
        contactStatus.textContent = 'Please fill in the required fields.';
        // Surfaces the browser's own messages and focuses the first bad field
        contactForm.reportValidity();
        return;
      }

      contactStatus.hidden = false;
      contactStatus.dataset.state = 'ok';
      contactStatus.textContent =
        "Thanks — we've got your request. Our team will get back to you within 15 minutes.";
      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------
     Close the slide-in menu after tapping a link
     ------------------------------------------------------------------ */
  const menu = document.getElementById('siteMenu');

  if (menu) {
    menu.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        bootstrap.Offcanvas.getOrCreateInstance(menu).hide();
      });
    });
  }

  /* ------------------------------------------------------------------
     Back to top — only shown once there's somewhere to go back to
     ------------------------------------------------------------------ */
  const toTop = document.getElementById('toTop');

  if (toTop) {
    const syncToTop = () => {
      toTop.hidden = window.scrollY < window.innerHeight;
    };
    syncToTop();
    window.addEventListener('scroll', syncToTop, { passive: true });

    toTop.addEventListener('click', () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
