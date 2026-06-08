function startCountdown(
  unlockTime
) {

  const countdown =
    document.getElementById(
      "countdown"
    );

  const interval =
    setInterval(() => {

      const remaining =
        unlockTime -
        Date.now();

      if (remaining <= 0) {

        clearInterval(
          interval
        );

        chrome.storage.sync.set({
            shortsFocusActive: false,
            shortsUnlockTime: null
        }, () => {
            location.reload();
        });

        return;
      }

      const hours =
        Math.floor(
          remaining /
          3600000
        );

      const minutes =
        Math.floor(
          (
            remaining %
            3600000
          ) / 60000
        );

      const seconds =
        Math.floor(
          (
            remaining %
            60000
          ) / 1000
        );

      countdown.textContent =
        `${hours}h ${minutes}m ${seconds}s`;

    }, 1000);
}

const defaults = {
  enabled: true,
  hideShorts: true,
  hideComments: false,
  hideFeed: false,
  hideSidebar: false,
  shortsFocusActive: false,
  shortsUnlockTime: null
};

chrome.storage.sync.get(defaults, settings => {

    if (
        settings.shortsFocusActive &&
        settings.shortsUnlockTime &&
        Date.now() >= settings.shortsUnlockTime
        ) {

        chrome.storage.sync.set({
            shortsFocusActive: false,
            shortsUnlockTime: null
        });

        settings.shortsFocusActive = false;
        settings.shortsUnlockTime = null;
    }

    const focusActiveScreen =
    document.getElementById(
        "focus-active-screen"
    );

  const offScreen =
    document.getElementById("off-screen");

  const onScreen =
    document.getElementById("on-screen");

    if (
        settings.shortsFocusActive &&
        settings.shortsUnlockTime
    ) {

        offScreen.style.display = "none";
        onScreen.style.display = "none";

        focusActiveScreen.style.display =
            "block";

        startCountdown(
            settings.shortsUnlockTime
        );

        return;
    }

  if (settings.enabled) {

    offScreen.style.display = "none";
    onScreen.style.display = "block";

  } else {

    offScreen.style.display = "block";
    onScreen.style.display = "none";
  }

  document.getElementById("hideShorts").checked =
    settings.hideShorts;

  document.getElementById("hideComments").checked =
    settings.hideComments;

  document.getElementById("hideFeed").checked =
    settings.hideFeed;

  document.getElementById("hideSidebar").checked =
    settings.hideSidebar;
});

document
.getElementById("turn-on")
.addEventListener("click", () => {

  chrome.storage.sync.set({
    enabled: true
  }, () => location.reload());
});

document
.getElementById("turn-off")
.addEventListener("click", () => {

  chrome.storage.sync.set({
    enabled: false
  }, () => location.reload());
});

[
 "hideShorts",
 "hideComments",
 "hideFeed",
 "hideSidebar"
].forEach(id => {

  document
  .getElementById(id)
  .addEventListener("change", e => {

    chrome.storage.sync.set({
      [id]: e.target.checked
    });
  });
});

const focusBtn =
  document.getElementById(
    "focusBtn"
  );

const focusScreen =
  document.getElementById(
    "focusScreen"
  );

focusBtn.addEventListener(
  "click",
  () => {

    focusScreen.hidden =
      !focusScreen.hidden;

  }
);

document
  .getElementById(
    "startFocus"
  )
  .addEventListener(
    "click",
    async () => {

      const minutes =
        Number(
          document
            .getElementById(
              "focusMinutes"
            )
            .value
        );

      const unlockTime =
        Date.now() +
        minutes *
        60 *
        1000;

      await chrome.storage.sync.set({

        shortsFocusActive:
          true,

        shortsUnlockTime:
          unlockTime

      });

      window.close();

    }
);