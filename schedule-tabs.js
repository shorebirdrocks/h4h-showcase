/**
 * Hack4Her Schedule Tabs & Keynote Modal Controller
 * Guarantees Friday, Saturday, and Sunday tabs work instantly & flawlessly.
 */

(function () {
  const SCHEDULE_DATA = {
    friday: {
      dateTitle: "Friday, June 19",
      dateSubtitle: "Workshops & Networking",
      items: [
        { time: "13:30 - 14:00", activity: "Arrival & Check-In", location: "Vrije Universiteit Amsterdam NU Building 4th Floor" },
        { time: "14:00 - 14:15", activity: "Introduction", location: "NU-Theatre 7" },
        { time: "14:15 - 14:45", activity: "A word from our sponsors!", location: "NU-Theatre 7" },
        { time: "14:45 - 15:15", activity: "Keynote", location: "NU-Theatre 7", isKeynote: true },
        { time: "15:30 - 16:30", activity: "Workshops Round 1", isWorkshop: true },
        { time: "16:45 - 17:45", activity: "Workshops Round 2", isWorkshop: true },
        { time: "17:45 - 19:30", activity: "Networking Event", location: "Vrije Universiteit NU" },
        { time: "19:30", activity: "Day Ends" }
      ]
    },
    saturday: {
      dateTitle: "Saturday, June 20",
      dateSubtitle: "Hackathon Day 1",
      items: [
        { time: "9:00 - 9:30", activity: "Arrival & Check-In", location: "Vrije Universiteit NU Building Ground Floor" },
        { time: "9:30 - 10:00", activity: "Breakfast", location: "Vrije Universiteit NU Building Ground Floor" },
        { time: "10:00 - 10:15", activity: "Introduction", location: "NU-Theatre 7" },
        { time: "10:15 - 11:00", activity: "Challenge Workshops", location: "TBD" },
        { time: "11:00 - 13:00", activity: "Hacking", location: "TBD" },
        { time: "13:00 - 14:00", activity: "Lunch", location: "Vrije Universiteit NU Building Ground Floor" },
        { time: "14:00 - 18:00", activity: "Hacking", location: "TBD" },
        { time: "18:30 - 19:30", activity: "Dinner", location: "Vrije Universiteit NU Building Ground Floor" },
        { time: "19:30 - 22:00", activity: "Hacking (optional)", location: "TBD" }
      ]
    },
    sunday: {
      dateTitle: "Sunday, June 21",
      dateSubtitle: "Hackathon Day 2 & Awards",
      items: [
        { time: "9:00 - 9:30", activity: "Arrival & Check-In", location: "Vrije Universiteit NU Building Ground Floor" },
        { time: "9:30 - 10:00", activity: "Breakfast", location: "Vrije Universiteit NU Building Ground Floor" },
        { time: "10:00 - 13:00", activity: "Hacking", location: "NU-4B17, NU-4B25, NU-4B43, NU-4B47, NU-4B05, NU-4B11" },
        { time: "13:00 - 14:00", activity: "Lunch", location: "Vrije Universiteit NU Building Ground Floor" },
        { time: "14:00 - 16:00", activity: "Hacking", location: "NU-4B17, NU-4B25, NU-4B43, NU-4B47, NU-4B05, NU-4B11" },
        { time: "16:00 - 18:00", activity: "Judging / Presenting", location: "NU-4B17 (Bol), NU-4B05 (Uber), NU-4B11 (VU)" },
        { time: "18:00 - 18:30", activity: "Deliberation", location: "NU-4B17 (Bol), NU-4B05 (Uber), NU-4B11 (VU)" },
        { time: "18:30 - 19:30", activity: "Closing and Presentation of Awards", location: "NU-Theatre 7" }
      ]
    }
  };

  const KEYNOTE_INFO = {
    title: "Keynote Presentation",
    company: "Special Guest Keynote",
    description: "Join us for an inspiring talk on empowering women in tech and building innovative solutions.",
    time: "14:45 - 15:15",
    location: "NU-Theatre 7"
  };

  function renderDaySchedule(dayKey) {
    const data = SCHEDULE_DATA[dayKey];
    if (!data) return;

    const tabContent = document.querySelector(".tab-content.svelte-1est5um, .tab-content");
    if (!tabContent) return;

    let itemsHtml = "";
    data.items.forEach(item => {
      let activityMarkup = "";
      if (item.isKeynote) {
        activityMarkup = `
          <button class="keynote-button svelte-1est5um" onclick="window.hack4herOpenKeynote && window.hack4herOpenKeynote()">
            <div class="activity-title keynote-title svelte-1est5um">Keynote</div>
          </button>
        `;
      } else if (item.isWorkshop) {
        activityMarkup = `
          <a href="/workshops" class="activity-link svelte-1est5um">
            <div class="activity-title svelte-1est5um">${item.activity}</div>
          </a>
        `;
      } else {
        activityMarkup = `<div class="activity-title svelte-1est5um">${item.activity}</div>`;
      }

      let locationMarkup = item.location ? `<div class="activity-location svelte-1est5um">(${item.location})</div>` : "";

      itemsHtml += `
        <div class="schedule-item svelte-1est5um">
          <div class="time-column svelte-1est5um">${item.time}</div>
          <div class="activity-column svelte-1est5um">
            ${activityMarkup}
            ${locationMarkup}
          </div>
        </div>
      `;
    });

    tabContent.innerHTML = `
      <div class="schedule-container svelte-1est5um" style="animation: fadeInTab 0.25s ease-out;">
        <div class="day-header svelte-1est5um">
          <h3 class="svelte-1est5um">${data.dateTitle}</h3>
          <p class="svelte-1est5um">${data.dateSubtitle}</p>
        </div>
        ${itemsHtml}
      </div>
    `;

    document.querySelectorAll(".tab-button.svelte-1est5um, .tab-button").forEach(btn => {
      const txt = btn.textContent.trim().toLowerCase();
      if (txt.includes(dayKey)) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  window.hack4herOpenKeynote = function () {
    let modal = document.getElementById("keynote-modal-backdrop");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "keynote-modal-backdrop";
      modal.className = "modal-backdrop svelte-1est5um";
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center;
        z-index: 9999; backdrop-filter: blur(8px);
      `;
      modal.innerHTML = `
        <div class="modal-container svelte-1est5um" style="max-width: 500px; width: 90%; background: var(--color-surface, #1e1e24); border-radius: 16px; padding: 24px; border: 1px solid var(--color-border); box-shadow: 0 20px 40px rgba(0,0,0,0.5); color: var(--color-text);">
          <div class="modal-header svelte-1est5um" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 class="modal-title svelte-1est5um" style="margin: 0; font-size: 1.5rem;">${KEYNOTE_INFO.title}</h2>
            <button class="modal-close svelte-1est5um" onclick="window.hack4herCloseKeynote()" style="background: none; border: none; cursor: pointer; color: inherit; font-size: 24px;">×</button>
          </div>
          <div class="modal-content svelte-1est5um">
            <h3 style="font-size: 1.1rem; color: var(--color-primary); margin-bottom: 8px;">${KEYNOTE_INFO.company}</h3>
            <p style="line-height: 1.6; opacity: 0.9; margin-bottom: 16px;">${KEYNOTE_INFO.description}</p>
            <div style="font-size: 0.95rem; opacity: 0.85;">
              <p style="margin: 4px 0;">🕒 ${KEYNOTE_INFO.time}</p>
              <p style="margin: 4px 0;">📍 ${KEYNOTE_INFO.location}</p>
            </div>
          </div>
        </div>
      `;
      modal.addEventListener("click", function (e) {
        if (e.target === modal) window.hack4herCloseKeynote();
      });
      document.body.appendChild(modal);
    }
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  window.hack4herCloseKeynote = function () {
    const modal = document.getElementById("keynote-modal-backdrop");
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "";
  };

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") window.hack4herCloseKeynote();
  });

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".tab-button.svelte-1est5um, .tab-button");
    if (!btn) return;

    const text = btn.textContent.trim().toLowerCase();
    if (text.includes("friday")) {
      e.preventDefault();
      renderDaySchedule("friday");
    } else if (text.includes("saturday")) {
      e.preventDefault();
      renderDaySchedule("saturday");
    } else if (text.includes("sunday")) {
      e.preventDefault();
      renderDaySchedule("sunday");
    }
  }, true);

  function attachListeners() {
    const keynoteBtn = document.querySelector(".keynote-button");
    if (keynoteBtn && !keynoteBtn._keynoteBound) {
      keynoteBtn._keynoteBound = true;
      keynoteBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.hack4herOpenKeynote();
      });
    }
  }

  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInTab {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tab-button {
      cursor: pointer !important;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: background-color 0.25s ease, color 0.25s ease !important;
    }
  `;
  document.head.appendChild(style);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachListeners);
  } else {
    attachListeners();
  }

  new MutationObserver(attachListeners).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
