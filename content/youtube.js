console.log("Lockem loaded hehe 3");

function applyRules(settings) {

  const html =
    document.documentElement;

  html.classList.toggle(
    "lockem-hide-comments",
    settings.enabled &&
    settings.hideComments
  );

  html.classList.toggle(
    "lockem-hide-sidebar",
    settings.enabled &&
    settings.hideSidebar
  );

  html.classList.toggle(
    "lockem-hide-feed",
    settings.enabled &&
    settings.hideFeed
  );

  function isFocusActive(settings) {

    return (
        settings.shortsFocusActive &&
        settings.shortsUnlockTime &&
        Date.now() <
        settings.shortsUnlockTime
    );
    }
    
    const shouldHideShorts =
    settings.enabled &&
    (
        settings.hideShorts ||
        isFocusActive(settings)
    );

    html.classList.toggle(
    "lockem-hide-shorts",
    shouldHideShorts
    );
}

function run() {
  chrome.storage.sync.get(
    {
      enabled: true,
      hideShorts: false,
      hideComments: false,
      hideFeed: false,
      hideSidebar: false,
      shortsFocusActive: false,
      shortsUnlockTime: null
    },
    applyRules
  );
}

run();


chrome.storage.onChanged.addListener(
  run
);