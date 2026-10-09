Certainly! Below is a simplified version of JavaScript functionality for a basic hospital management system. This example includes form validation, button events, dynamic content updates, and loading indicators.


document.addEventListener('DOMContentLoaded', function() {
    // Form Validation
    const form = document.getElementById('patientForm');
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const emailInput = document.getElementById('email');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        validateForm();
    });

    function validateForm() {
        let isValid = true;

        if (!nameInput.value.trim()) {
            nameInput.classList.add('invalid');
            isValid = false;
        } else {
            nameInput.classList.remove('invalid');
        }

        if (!ageInput.value.trim()) {
            ageInput.classList.add('invalid');
            isValid = false;
        } else {
            ageInput.classList.remove('invalid');
        }

        if (!emailInput.value.trim()) {
            emailInput.classList.add('invalid');
            isValid = false;
        } else {
            emailInput.classList.remove('invalid');
        }

        if (isValid) {
            addPatient();
        }
    }

    // Button Events
    const addButton = document.getElementById('addButton');
    const patientList = document.getElementById('patientList');

    addButton.addEventListener('click', function() {
        if (form.checkValidity()) {
            addPatient();
        } else {
            validateForm();
        }
    });

    function addPatient() {
        const name = nameInput.value.trim();
        const age = ageInput.value.trim();
        const email = emailInput.value.trim();

        const patientItem = document.createElement('div');
        patientItem.classList.add('patient-item');

        const patientName = document.createElement('p');
        patientName.textContent = `Name: ${name}`;
        patientItem.appendChild(patientName);

        const patientAge = document.createElement('p');
        patientAge.textContent = `Age: ${age}`;
        patientItem.appendChild(patientAge);

        const patientEmail = document.createElement('p');
        patientEmail.textContent = `Email: ${email}`;
        patientEmail.classList.add('email');
        patientItem.appendChild(patientEmail);

        patientList.appendChild(patientItem);

        // Clear form fields
        nameInput.value = '';
        ageInput.value = '';
        emailInput.value = '';

        // Loading Indicator
        showLoadingIndicator();
        setTimeout(function() {
            hideLoadingIndicator();
        },


(() => {
    "use strict";

    const storagePrefix = "ai_generated_demo_";
    let activeModule = "";
    let originalMainDisplay = "";

    function titleCase(value) {
        return value.replace(/[-_]+/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    function getModuleName(anchor) {
        const label = (anchor.innerText || anchor.textContent || "").trim();
        const href = anchor.getAttribute("href") || "";
        if (!label) return "";

        if (/^(home|index|logo)$/i.test(label)) return "";
        if (/^(logout|sign out)$/i.test(label)) return "logout";

        if (href.startsWith("#") && href.length > 1) {
            return decodeURIComponent(href.slice(1)).split(/[?&]/)[0];
        }

        const file = href.split("/").pop().split("?")[0];
        if (file && /\.html?$/i.test(file)) {
            return file.replace(/\.html?$/i, "");
        }

        return label.toLowerCase().replace(/[^a-z0-9]+/g, "_")
            .replace(/^_|_$/g, "");
    }

    function getMain() {
        let main = document.querySelector("main");
        if (!main) {
            main = document.createElement("main");
            main.id = "app-main";
            const header = document.querySelector("header");
            if (header && header.parentNode) {
                header.parentNode.insertBefore(main, header.nextSibling);
            } else {
                document.body.insertBefore(main, document.body.firstChild);
            }
            while (main.nextSibling &&
                   main.nextSibling.tagName !== "SCRIPT") {
                main.appendChild(main.nextSibling);
            }
        }
        return main;
    }

    function getView() {
        let view = document.getElementById("dynamic-page-view");
        if (!view) {
            view = document.createElement("section");
            view.id = "dynamic-page-view";
            view.hidden = true;
            const main = getMain();
            main.parentNode.insertBefore(view, main.nextSibling);
        }
        return view;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;",
            '"': "&quot;", "'": "&#39;"
        })[char]);
    }

    function readRecords(module) {
        try {
            return JSON.parse(
                localStorage.getItem(storagePrefix + module) || "[]"
            );
        } catch (_) {
            return [];
        }
    }

    function saveRecords(module, records) {
        try {
            localStorage.setItem(
                storagePrefix + module, JSON.stringify(records)
            );
            return true;
        } catch (_) {
            return false;
        }
    }

    function renderModule(module) {
        if (!module || module === "logout") {
            if (module === "logout") {
                sessionStorage.removeItem("ai_demo_logged_in");
                location.hash = "#/";
            }
            return;
        }

        activeModule = module;
        const main = getMain();
        const view = getView();

        if (!originalMainDisplay) {
            originalMainDisplay = main.style.display;
        }
        main.style.display = "none";
        view.hidden = false;

        const title = titleCase(module);
        const records = readRecords(module);

        view.innerHTML = `
            <p><a href="#/" data-app-home>← Back to application home</a></p>
            <h1>${escapeHtml(title)}</h1>
            <p class="notice">
                Demo module. Records are stored in this browser.
            </p>
            <div class="module-toolbar">
                <input id="module-search" type="search"
                       placeholder="Search ${escapeHtml(title)}...">
                <button type="button" id="show-add-form">+ Add record</button>
            </div>
            <form class="module-form" id="module-form" hidden>
                <h2>Add ${escapeHtml(title.replace(/s$/i, ""))}</h2>
                <label>
                    Name
                    <input name="name" required maxlength="120"
                           placeholder="Enter name">
                </label>
                <label>
                    Details
                    <input name="details" maxlength="300"
                           placeholder="Enter details">
                </label>
                <button type="submit">Save record</button>
                <button type="button" id="cancel-add">Cancel</button>
            </form>
            <div id="module-records"></div>
        `;

        function draw(filter = "") {
            const container = view.querySelector("#module-records");
            const filtered = readRecords(module).filter(record =>
                (record.name + " " + record.details)
                    .toLowerCase().includes(filter.toLowerCase())
            );

            if (!filtered.length) {
                container.innerHTML =
                    '<p class="notice">No records found. Use Add record to create one.</p>';
                return;
            }

            container.innerHTML = `
                <table>
                    <thead><tr><th>Name</th><th>Details</th><th>Actions</th></tr></thead>
                    <tbody>${filtered.map(record => `
                        <tr>
                            <td>${escapeHtml(record.name)}</td>
                            <td>${escapeHtml(record.details || "")}</td>
                            <td>
                                <button type="button" data-delete="${escapeHtml(record.id)}">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `).join("")}</tbody>
                </table>
            `;
        }

        draw();

        view.querySelector("#module-search").addEventListener("input", event => {
            draw(event.target.value);
        });

        view.querySelector("#show-add-form").addEventListener("click", () => {
            view.querySelector("#module-form").hidden = false;
            view.querySelector('#module-form input[name="name"]').focus();
        });

        view.querySelector("#cancel-add").addEventListener("click", () => {
            view.querySelector("#module-form").hidden = true;
        });

        view.querySelector("#module-form").addEventListener("submit", event => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            const current = readRecords(module);
            current.push({
                id: String(Date.now()) + Math.random().toString(16).slice(2),
                name: String(data.get("name") || "").trim(),
                details: String(data.get("details") || "").trim()
            });

            if (!saveRecords(module, current)) {
                alert("Unable to save. Browser storage may be unavailable.");
                return;
            }

            form.reset();
            form.hidden = true;
            draw(view.querySelector("#module-search").value);
        });

        view.addEventListener("click", event => {
            const button = event.target.closest("[data-delete]");
            if (!button) return;

            if (!confirm("Delete this demo record?")) return;

            const updated = readRecords(module).filter(
                record => record.id !== button.dataset.delete
            );
            saveRecords(module, updated);
            draw(view.querySelector("#module-search").value);
        });

        // Mark the selected navigation item.
        document.querySelectorAll("nav a, aside a, .sidebar a").forEach(link => {
            const linkModule = getModuleName(link);
            link.classList.toggle("active", linkModule === module);
            if (linkModule === module) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function goHome() {
        const main = getMain();
        const view = getView();
        view.hidden = true;
        main.style.display = originalMainDisplay;
        activeModule = "";
    }

    document.addEventListener("click", event => {
        const anchor = event.target.closest("a[href]");
        if (!anchor || event.defaultPrevented ||
            event.button !== 0 || event.metaKey || event.ctrlKey ||
            event.shiftKey || event.altKey || anchor.target === "_blank") {
            return;
        }

        if (anchor.hasAttribute("data-app-home")) {
            event.preventDefault();
            history.pushState(null, "", "#/");
            goHome();
            return;
        }

        const href = anchor.getAttribute("href") || "";
        if (/^(mailto:|tel:|https?:|javascript:)/i.test(href)) return;

        const module = getModuleName(anchor);
        if (!module) {
            if (href.startsWith("#") && href.length > 1) {
                const section = document.getElementById(href.slice(1));
                if (section) return;
            }
            if (href === "#" || href === "index.html" ||
                href === "./" || href === "/") {
                event.preventDefault();
                history.pushState(null, "", "#/");
                goHome();
            }
            return;
        }

        // Keep real login and registration forms accessible.
        if (["login", "register", "registration"].includes(module)) {
            const target = href.split("/").pop();
            if (target && /\.html?$/i.test(target)) return;
        }

        event.preventDefault();
        const route = "#/" + encodeURIComponent(module);
        if (location.hash !== route) history.pushState(null, "", route);
        renderModule(module);
    });

    function routeFromLocation() {
        const route = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
        if (route) renderModule(route);
        else goHome();
    }

    window.addEventListener("popstate", routeFromLocation);
    window.addEventListener("hashchange", routeFromLocation);

    document.addEventListener("DOMContentLoaded", () => {
        routeFromLocation();

        const login = document.getElementById("loginForm");
        if (login) {
            login.addEventListener("submit", event => {
                event.preventDefault();
                sessionStorage.setItem("ai_demo_logged_in", "true");
                location.href = "dashboard.html";
            });
        }

        const register = document.getElementById("registerForm");
        if (register) {
            register.addEventListener("submit", event => {
                event.preventDefault();
                alert("Demo registration submitted.");
                location.href = "login.html";
            });
        }
    });
})();
