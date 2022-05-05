var navDropdowns = [].slice.call(
  document.querySelectorAll(".p-navigation__item--dropdown-toggle")
);
var dropdownWindow = document.querySelector(".dropdown-window");
var dropdownWindowOverlay = document.querySelector(".dropdown-window-overlay");

navDropdowns.forEach(function (dropdown) {
  dropdown.addEventListener("click", function (event) {
    event.preventDefault();
    var clickedDropdown = this;

    dropdownWindow.classList.remove("slide-animation");
    dropdownWindowOverlay.classList.remove("fade-animation");

    navDropdowns.forEach(function (dropdown) {
      var dropdownContent = document.getElementById(dropdown.id + "-content");
      var dropdownContentMobile = document.getElementById(
        dropdown.id + "-content-mobile"
      );
      if (dropdown === clickedDropdown) {
        if (dropdown.classList.contains("is-selected")) {
          closeMenu(dropdown, dropdownContent, dropdownContentMobile);
        } else {
          dropdown.classList.add("is-selected");
          dropdownContent.classList.remove("u-hide");
          dropdownContentMobile.classList.remove("u-hide");

          if (window.history.pushState) {
            window.history.pushState(null, null, "#" + dropdown.id);
          }
        }
      } else {
        dropdown.classList.remove("is-selected");
        dropdownContent.classList.add("u-hide");
        dropdownContentMobile.classList.add("u-hide");
      }
    });
  });
});

// Close the menu if browser back button is clicked
window.addEventListener("hashchange", function () {
  navDropdowns.forEach(function (dropdown) {
    var dropdownContent = document.getElementById(dropdown.id + "-content");
    var dropdownContentMobile = document.getElementById(
      dropdown.id + "-content-mobile"
    );

    if (dropdown.classList.contains("is-selected")) {
      closeMenu(dropdown, dropdownContent, dropdownContentMobile);
    }
  });
});

if (dropdownWindowOverlay) {
  dropdownWindowOverlay.addEventListener("click", function () {
    navDropdowns.forEach(function (dropdown) {
      var dropdownContent = document.getElementById(dropdown.id + "-content");
      var dropdownContentMobile = document.getElementById(
        dropdown.id + "-content-mobile"
      );
      if (dropdown.classList.contains("is-selected")) {
        dropdownContent.classList.add("u-hide");
        closeMenu(dropdown, dropdownContent, dropdownContentMobile);
      }
    });
  });
}

function closeMenu(dropdown, dropdownContent, dropdownContentMobile) {
  console.log("dropdonw", dropdown);
  console.log("dropdownContent", dropdownContent);
  dropdown.classList.remove("is-selected");
  dropdownWindow.classList.add("slide-animation");
  dropdownWindowOverlay.classList.add("fade-animation");
  dropdownContent.classList.add("u-hide");
  dropdownContentMobile.classList.add("u-hide");
  if (window.history.pushState) {
    window.history.pushState(null, null, window.location.href.split("#")[0]);
  }
}

if (window.location.hash) {
  var tabId = window.location.hash.split("#")[1];
  var tab = document.getElementById(tabId);

  if (tab) {
    setTimeout(function () {
      document.getElementById(tabId).click();
    }, 0);
  }
}

var origin = window.location.href;

addGANavEvents("#canonical-global-nav", "www.ubuntu.com-nav-global");
addGANavEvents("#canonical-login", "www.ubuntu.com-nav-0-login");
addGANavEvents("#enterprise-content", "www.ubuntu.com-nav-1-enterprise");
addGANavEvents("#developer-content", "www.ubuntu.com-nav-1-developer");
addGANavEvents("#community-content", "www.ubuntu.com-nav-1-community");
addGANavEvents("#download-content", "www.ubuntu.com-nav-1-download");
addGANavEvents(".p-navigation--secondary", "www.ubuntu.com-nav-2");
addGANavEvents(".p-contextual-footer", "www.ubuntu.com-footer-contextual");
addGANavEvents(".p-footer__nav", "www.ubuntu.com-nav-footer-0");
addGANavEvents(".p-footer--secondary", "www.ubuntu.com-nav-footer-1");
addGANavEvents(".js-product-card", "www.ubuntu.com-product-card");

function addGANavEvents(target, category) {
  var t = document.querySelector(target);
  if (t) {
    [].slice.call(t.querySelectorAll("a")).forEach(function (a) {
      a.addEventListener("click", function (e) {
        dataLayer.push({
          event: "GAEvent",
          eventCategory: category,
          eventAction: "from:" + origin + " to:" + a.href,
          eventLabel: a.text,
          eventValue: undefined,
        });
      });
    });
  }
}

addGAContentEvents("#main-content");

function addGAContentEvents(target) {
  var t = document.querySelector(target);
  if (t) {
    [].slice.call(t.querySelectorAll("a")).forEach(function (a) {
      let category;
      if (a.classList.contains("p-button--positive")) {
        category = "www.ubuntu.com-content-cta-0";
      } else if (a.classList.contains("p-button")) {
        category = "www.ubuntu.com-content-cta-1";
      } else {
        category = "www.ubuntu.com-content-link";
      }
      if (!a.href.startsWith("#")) {
        a.addEventListener("click", function () {
          dataLayer.push({
            event: "GAEvent",
            eventCategory: category,
            eventAction: "from:" + origin + " to:" + a.href,
            eventLabel: a.text,
            eventValue: undefined,
          });
        });
      }
    });
  }
}

addGAImpressionEvents(".js-product-card", "product-card");

function addGAImpressionEvents(target, category) {
  var t = [].slice.call(document.querySelectorAll(target));
  if (t) {
    t.forEach(function (section) {
      if (!section.classList.contains("u-hide")) {
        var a = section.querySelector("a");
        dataLayer.push({
          event: "NonInteractiveGAEvent",
          eventCategory: "www.ubuntu.com-impression-" + category,
          eventAction: "from:" + origin + " to:" + a.href,
          eventLabel: a.text,
          eventValue: undefined,
        });
      }
    });
  }
}

addGADownloadImpressionEvents(".js-download-option", "download-option");

function addGADownloadImpressionEvents(target, category) {
  var t = [].slice.call(document.querySelectorAll(target));
  if (t) {
    t.forEach(function (section) {
      dataLayer.push({
        event: "NonInteractiveGAEvent",
        eventCategory: "www.ubuntu.com-impression-" + category,
        eventAction: "Display option",
        eventLabel: section.innerText,
        eventValue: undefined,
      });
    });
  }
}

addUTMToForms();

function addUTMToForms() {
  var params = new URLSearchParams(window.location.search);
  const utm_names = ["campaign", "source", "medium"];
  for (let i = 0; i < utm_names.length; i++) {
    var utm_fields = document.getElementsByName("utm_" + utm_names[i]);
    for (let j = 0; j < utm_fields.length; j++) {
      if (utm_fields[j]) {
        utm_fields[j].value = params.get("utm_" + utm_names[i]);
      }
    }
  }
}

var accountContainer = document.querySelector(".js-account");
var accountContainerSmall = document.querySelector(".js-account--small");
if (accountContainer && accountContainerSmall) {
  fetch("/account.json")
    .then((response) => response.json())
    .then((data) => {
      if (data.account === null) {
        accountContainerSmall.innerHTML = `<a href="/login" class="p-navigation__link"><i class="p-icon--user is-light">Sign in</i></a>`;
        accountContainer.innerHTML = `<a href="/login" class="p-navigation__link" style="padding-right: 1rem;"><span>Sign in</span><i class="p-icon--user is-light"></i></a>`;
      } else {
        window.accountJSONRes = data.account;
        accountContainerSmall.innerHTML = `<span class="p-navigation__link">${data.account.fullname} (<a href="/logout" class="p-link--inverted">logout</a>)</span>`;
        accountContainer.innerHTML = `<div class="p-navigation__item--dropdown-toggle">
            <a href="#" class="p-navigation__link" aria-controls="user-menu" aria-expanded="false" aria-haspopup="true">${data.account.fullname}</a>
            <ul class="p-navigation__dropdown--right" id="user-menu" aria-hidden="true">
              <li><a href="/pro/dashboard" class="p-navigation__dropdown-item">Ubuntu Pro dashboard</a></li>
              <li>
                <hr class="u-no-margin--bottom">
                <a href="/account/invoices" class="p-navigation__dropdown-item">Invoices & Payments</a>
              </li>
              <li>
                <a href="https://login.ubuntu.com/" class="p-navigation__dropdown-item">Account settings</a>
              </li>
              <li>
                <a href="/logout" class="p-navigation__dropdown-item">Logout</a>
              </li>
            </ul>
          </div>`;
      }

      function toggleMenu(element, show) {
        const dropdownWindow = document.querySelector(".dropdown-window");
        const container = element.closest(
          ".p-navigation__item--dropdown-toggle"
        );
        var target = document.getElementById(
          element.getAttribute("aria-controls")
        );

        if (show) {
          container.classList.add("is-active");
          [].slice.call(dropdownWindow.children).forEach((dropdownContent) => {
            if (dropdownContent.classList.contains("u-hide") === false) {
              dropdownContent.classList.add("u-hide");
            }
          });
        } else {
          container.classList.remove("is-active");
        }

        if (target) {
          element.setAttribute("aria-expanded", show);
          target.setAttribute("aria-hidden", !show);

          if (show) {
            target.focus();
            navDropdowns.forEach(function (dropdown) {
              closeMenu(dropdown);
            });
          }
        }
      }

      /**
        Attaches event listeners for the menu toggle open and close click events.
        @param {HTMLElement} menuToggle The menu container element.
      */
      function setupContextualMenu(menuToggle) {
        menuToggle.addEventListener("click", function (event) {
          event.preventDefault();

          var menuAlreadyOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

          var top = menuToggle.offsetHeight;
          // for inline elements leave some space between text and menu
          if (window.getComputedStyle(menuToggle).display === "inline") {
            top += 5;
          }

          toggleMenu(menuToggle, !menuAlreadyOpen, top);
        });
      }

      /**
        Attaches event listeners for all the menu toggles in the document and
        listeners to handle close when clicking outside the menu or using ESC key.
        @param {String} contextualMenuToggleSelector The CSS selector matching menu toggle elements.
      */
      function setupAllContextualMenus(contextualMenuToggleSelector) {
        // Setup all menu toggles on the page.
        var userToggle = document.querySelector(contextualMenuToggleSelector);
        if (userToggle) {
          setupContextualMenu(userToggle);

          // Add handler for clicking outside the menu.
          document.addEventListener("click", function (event) {
            var contextualMenu = document.getElementById(
              userToggle.getAttribute("aria-controls")
            );
            var clickOutside = !(
              userToggle.contains(event.target) ||
              contextualMenu.contains(event.target)
            );

            if (clickOutside) {
              toggleMenu(userToggle, false);
            }
          });
        }
      }

      setupAllContextualMenus(
        ".p-navigation__user .p-navigation__item--dropdown-toggle .p-navigation__link"
      );
    });
}

// TEMP FIX - PETE F 15.05.23
// UPDATES 'UBUNTU ADVANTAGE' TO 'UBUNTU PRO' IN THE MEGANAV UNTIL
// WE MERGE THE NEW MEGANAV
function replaceUbuntuAdvantage() {
  const globalNav = document.querySelector("#canonical-global-nav");
  const targetElementsArray = globalNav.querySelectorAll(
    "[href='https://ubuntu.com/support']"
  );
  targetElementsArray.forEach(function (element) {
    if (element.children.length) {
      element.querySelector("h4").innerText = "Ubuntu Pro ›";
    } else {
      element.innerText = "Ubuntu Pro";
    }
  });
}
replaceUbuntuAdvantage();
