Certainly! Below is a simplified version of JavaScript code for a basic hospital management system. This example includes form validation, button events, dynamic content updates, and loading indicators using `fetch` for asynchronous data handling.


// Form Validation
const form = document.getElementById('patientForm');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const symptomsTextarea = document.getElementById('symptoms');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Basic form validation
    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    const gender = genderSelect.value;
    const symptoms = symptomsTextarea.value.trim();

    if (!name || !age || !gender || !symptoms) {
        alert('All fields are required.');
        return;
    }

    if (isNaN(age) || age < 0) {
        alert('Age must be a positive number.');
        return;
    }

    // Proceed with the form submission
    submitPatientData(name, age, gender, symptoms);
});

// Function to handle patient data submission
function submitPatientData(name, age, gender, symptoms) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';

    fetch('/submit-patient-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            age: age,
            gender: gender,
            symptoms: symptoms
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        displayMessage('Patient data submitted successfully.');
    })
    .catch((error) => {
        console.error('Error:', error);
        displayMessage('Failed to submit patient data. Please try again.');
    })
    .finally(() => {
        loadingIndicator.style.display = 'none';
    });
}

// Display message in the UI
function displayMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
}

// Dynamic Content - Example: Displaying patient list
function fetchPatientList() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';

    fetch('/get-patient-list')
    .then(response => response.json())
    .then


(() => {
  "use strict";
  const prefix = "ai_generated_demo_";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
  const titleCase = value => value.replace(/[-_]+/g," ").replace(/\b\w/g,c=>c.toUpperCase());

  function mainElement() {
    let main = document.querySelector("main");
    if (!main) {
      main = document.createElement("main");
      document.body.appendChild(main);
    }
    return main;
  }

  function getView() {
    let view = document.getElementById("dynamic-page-view");
    if (!view) {
      view = document.createElement("section");
      view.id = "dynamic-page-view";
      view.hidden = true;
      mainElement().after(view);
    }
    return view;
  }

  function recordsFor(module) {
    try {
      const value = JSON.parse(localStorage.getItem(prefix + module) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function renderModule(module) {
    if (!module) return;
    if (module === "logout") {
      sessionStorage.removeItem("ai_demo_logged_in");
      location.href = "login.html";
      return;
    }
    const main = mainElement();
    const view = getView();
    main.hidden = true;
    view.hidden = false;
    const title = titleCase(module);

    view.innerHTML = `
      <p><a href="dashboard.html" data-app-home>← Back to dashboard</a></p>
      <h1>${esc(title)}</h1>
      <p class="notice">Demo records are stored in this browser only, not in a server database.</p>
      <div class="module-toolbar">
        <input id="module-search" type="search" placeholder="Search ${esc(title)}" aria-label="Search ${esc(title)}">
        <button type="button" id="show-add">+ Add record</button>
      </div>
      <form id="module-form" class="module-form" hidden>
        <label>Name<input name="name" required maxlength="120" placeholder="Enter name"></label>
        <label>Details<input name="details" maxlength="300" placeholder="Enter details"></label>
        <button type="submit">Save record</button>
        <button type="button" id="cancel-add">Cancel</button>
      </form>
      <div id="module-records"></div>`;

    const container = view.querySelector("#module-records");
    const draw = (filter = "") => {
      const rows = recordsFor(module).filter(row =>
        (String(row.name || "") + " " + String(row.details || "")).toLowerCase().includes(filter.toLowerCase())
      );
      container.innerHTML = rows.length ? `
        <table><thead><tr><th>Name</th><th>Details</th><th>Action</th></tr></thead>
        <tbody>${rows.map(row => `
          <tr><td>${esc(row.name)}</td><td>${esc(row.details || "")}</td>
          <td><button type="button" data-delete="${esc(row.id)}">Delete</button></td></tr>
        `).join("")}</tbody></table>
      ` : '<p class="notice">No records yet. Select Add record to create one.</p>';
    };

    draw();
    view.querySelector("#module-search").addEventListener("input", event => draw(event.target.value));
    view.querySelector("#show-add").addEventListener("click", () => {
      view.querySelector("#module-form").hidden = false;
    });
    view.querySelector("#cancel-add").addEventListener("click", () => {
      view.querySelector("#module-form").hidden = true;
    });
    view.querySelector("#module-form").addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const rows = recordsFor(module);
      rows.push({
        id: String(Date.now()) + Math.random().toString(16).slice(2),
        name: String(data.get("name") || "").trim(),
        details: String(data.get("details") || "").trim()
      });
      try {
        localStorage.setItem(prefix + module, JSON.stringify(rows));
      } catch (_) {
        alert("Browser storage is unavailable.");
        return;
      }
      event.currentTarget.reset();
      event.currentTarget.hidden = true;
      draw(view.querySelector("#module-search").value);
    });
    view.addEventListener("click", event => {
      const button = event.target.closest("[data-delete]");
      if (!button || !confirm("Delete this demo record?")) return;
      const rows = recordsFor(module).filter(row => row.id !== button.dataset.delete);
      localStorage.setItem(prefix + module, JSON.stringify(rows));
      draw(view.querySelector("#module-search").value);
    });
  }

  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return;
    if (link.hasAttribute("data-app-home")) {
      event.preventDefault();
      location.href = "dashboard.html";
      return;
    }

    const href = link.getAttribute("href") || "";
    if (/^(mailto:|tel:|https?:|javascript:)/i.test(href)) return;
    if (["login.html", "register.html"].includes(href)) return;

    let module = "";
    if (href.startsWith("#/")) module = decodeURIComponent(href.slice(2));
    else if (/\.html?$/i.test(href)) module = href.split("/").pop().replace(/\.html?$/i, "");
    else if (href.startsWith("#") && href.length > 1) module = href.slice(1);
    else if (href === "#" || href === "./" || href === "/" || href === "index.html") return;
    else module = (link.textContent || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

    if (!module || ["dashboard", "index", "home"].includes(module)) return;
    event.preventDefault();
    history.pushState(null, "", "#/" + encodeURIComponent(module));
    renderModule(module);
  });

  window.addEventListener("popstate", () => {
    const route = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (route) renderModule(route);
    else {
      getView().hidden = true;
      mainElement().hidden = false;
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const login = document.getElementById("loginForm");
    if (login) login.addEventListener("submit", event => {
      event.preventDefault();
      const email = login.querySelector('[name="email"]')?.value.trim();
      const password = login.querySelector('[name="password"]')?.value;
      let user = null;
      try { user = JSON.parse(localStorage.getItem("demoUser") || "null"); } catch (_) {}
      if (user && user.email === email && user.password === password) {
        sessionStorage.setItem("ai_demo_logged_in", "true");
        location.href = "dashboard.html";
      } else {
        alert("Invalid demo credentials. Please register first.");
      }
    });

    const register = document.getElementById("registerForm");
    if (register) register.addEventListener("submit", event => {
      event.preventDefault();
      const username = register.querySelector('[name="username"]')?.value.trim();
      const email = register.querySelector('[name="email"]')?.value.trim();
      const password = register.querySelector('[name="password"]')?.value;
      if (!username || !email || !password) {
        alert("Please complete every field.");
        return;
      }
      if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
      }
      localStorage.setItem("demoUser", JSON.stringify({ username, email, password }));
      alert("Demo registration complete. Please sign in.");
      location.href = "login.html";
    });

    document.querySelectorAll("[data-logout]").forEach(button => {
      button.addEventListener("click", () => {
        sessionStorage.removeItem("ai_demo_logged_in");
        location.href = "login.html";
      });
    });

    const route = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (route) renderModule(route);
  });
})();