// Login functionality
const usernameInput = document.querySelector('input[type="text"]');
const passwordInput = document.querySelector('input[type="password"]');
const loginButton = document.querySelector("button");

const demoUserName = "admin";
const demoPassword = "admin123";

loginButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === demoUserName && password === demoPassword) {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password.");
  }
});

// Page Navigation Toggle
const allFilterBtn = document.getElementById("all-filter-btn");
const openFilterBtn = document.getElementById("open-filter-btn");
const closedFilterBtn = document.getElementById("closed-filter-btn");
function toggleStyle(id) {
  allFilterBtn.classList.remove("btn-primary", "text-white");
  openFilterBtn.classList.remove("btn-primary", "text-white");
  closedFilterBtn.classList.remove("btn-primary", "text-white");

  const selected = document.getElementById(id);
  selected.classList.add("btn-primary", "text-white");
}

// =====================
// Spinner Management
// =====================

const manageSpinner = (status) => {
  const spinner = document.getElementById("spinner");
  const cardContainer = document.getElementById("allCards");

  if (status) {
    spinner.classList.remove("hidden");
    cardContainer.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    cardContainer.classList.remove("hidden");
  }
};

// =====================
// Load All Issues
// =====================

const loadIssues = () => {
  manageSpinner(true);

  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((data) => {
      displayIssues(data.data);
    });
};

// =====================
// Display Issues
// =====================

const displayIssues = (issues) => {
  const container = document.getElementById("allCards");

  container.innerHTML = "";

  document.getElementById("issues-count").innerText = issues.length;

  issues.forEach((issue) => {
    const card = document.createElement("div");

    const borderColor =
      issue.status === "open"
        ? "border-t-4 border-green-500"
        : "border-t-4 border-purple-500";

    card.className = "h-full";

    card.innerHTML = `
    
    <div onclick="loadIssueDetails(${issue.id})"
    class="bg-white rounded-xl shadow-sm p-5 cursor-pointer ${borderColor} flex flex-col h-full">

        <!-- Header -->
        <div class="flex justify-between items-center mb-3">

            <span>
                ${
                  issue.status === "open"
                    ? `<img src="./assets/Open-Status.png" class="w-4 h-4">`
                    : `<img src="./assets/Closed-Status.png" class="w-4 h-4">`
                }
            </span>

            <span class="text-xs px-2 py-1 rounded-full ${
              issue.priority === "high"
                ? "text-red-500 bg-red-100"
                : issue.priority === "medium"
                  ? "text-orange-500 bg-orange-100"
                  : "text-gray-500 bg-gray-100"
            }">
                ${issue.priority.toUpperCase()}
            </span>

        </div>

        <!-- Content -->
        <div class="flex-1">
            <h2 class="font-bold text-lg line-clamp-2 mb-2">
                ${issue.title}
            </h2>

            <p class="text-gray-500 text-sm line-clamp-2">
                ${issue.description}
            </p>
        </div>

        <!-- Labels -->
        <div class="flex gap-2 flex-wrap mt-3 min-h-[32px]">
        ${issue.labels
          .map((label) => {
            const labelName = label.toLowerCase();

            const labelConfig = {
              bug: {
                text: "text-red-500",
                bg: "bg-red-100",
                border: "border-red-600",
                iconImg: "",
                iconFA: `<i class="fa-solid fa-bug" style="color: #ef4444;"></i>`,
              },
              "help wanted": {
                text: "text-orange-500",
                bg: "bg-orange-100",
                border: "border-orange-600",
                iconImg: "",
                iconFA: `<i class="fa-solid fa-life-ring" style="color: #d97706;"></i>`,
              },
              enhancement: {
                text: "text-green-500",
                bg: "bg-green-100",
                border: "border-green-600",
                iconImg: "",
                iconFA: `<i class="fa-solid fa-wand-magic-sparkles" style="color: #00a96e;"></i>`,
              },
            };

            const style = labelConfig[labelName] || {
              text: "text-gray-500",
              bg: "bg-gray-100",
              border: "border-gray-600",
              iconImg: "",
              iconFA: `<i class="fa-solid fa-circle-info" style="color: #9ca3af;"></i>`,
            };

            return `
        <span class="flex items-center gap-0.25 text-sm px-1 pr-2 pl-2 py-[1px] rounded-full border ${style.border} ${style.text} ${style.bg}">
            ${
              style.iconImg
                ? `<img src="${style.iconImg}" class="w-2 h-2">`
                : style.iconFA
            }
            ${label.toUpperCase()}
        </span>
        `;
          })
          .join("")}
        </div>


        <!-- Divider line -->
        <div class="border-t border-gray-300 mt-3 w-full"></div>
                
        <!-- Footer -->
        <div class="text-xs text-gray-400 mt-3">
            #${issue.id} by ${issue.author}
            <br/>
            ${new Date(issue.createdAt).toLocaleDateString()}  <!-- Only date -->
        </div>

        </div>
    
    `;

    container.append(card);
  });

  manageSpinner(false);
};
// =====================
// Load Issue Details
// =====================

const loadIssueDetails = async (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  displayIssueDetails(data.data);
};

// =====================
// Display Issue Details
// =====================

const displayIssueDetails = (issue) => {
  const container = document.getElementById("issue-details-container");

  container.innerHTML = `
        <div class="w-full px-8"> <!-- inner content wrapper -->

        <h2 class="text-2xl font-bold mb-2">
            ${issue.title}
        </h2>

        <div class="flex items-center gap-3 text-sm mb-4">

            <span class="px-3 py-1 rounded-full text-white ${
              issue.status === "open" ? "bg-green-700" : "bg-red-600"
            }">
            ${issue.status === "open" ? "Opened" : "Closed"}
            </span>
                        
            <div class="h-2 w-2 rounded-full bg-gray-500"></div>

            <span class="text-gray-500">
            Opened by ${issue.author}
            </span>
            
            <div class="h-2 w-2 rounded-full bg-gray-500"></div>

            <span class="text-gray-500">
            ${new Date(issue.createdAt).toLocaleDateString()}
            </span>

        </div>

        <div class="flex gap-2 flex-wrap mb-4">
    ${issue.labels
      .map((label) => {
        const labelName = label.toLowerCase();

        const labelConfig = {
          bug: {
            text: "text-red-500",
            bg: "bg-red-100",
            border: "border-red-600",
            iconImg: "",
            iconFA: `<i class="fa-solid fa-bug" style="color: #ef4444;"></i>`,
          },
          "help wanted": {
            text: "text-orange-500",
            bg: "bg-orange-100",
            border: "border-orange-600",
            iconImg: "",
            iconFA: `<i class="fa-solid fa-life-ring" style="color: #d97706;"></i>`,
          },
          enhancement: {
            text: "text-green-500",
            bg: "bg-green-100",
            border: "border-green-600",
            iconImg: "",
            iconFA: `<i class="fa-solid fa-wand-magic-sparkles" style="color: #00a96e;"></i>`,
          },
        };

        const style = labelConfig[labelName] || {
          text: "text-gray-500",
          bg: "bg-gray-100",
          border: "border-gray-600",
          iconImg: "",
          iconFA: `<i class="fa-solid fa-circle-info" style="color: #9ca3af;"></i>`,
        };

        return `
        <span class="flex items-center gap-1 text-sm px-1 py-0.5 rounded-full border ${style.border} ${style.text} ${style.bg}">
            ${style.iconImg ? `<img src="${style.iconImg}" class="w-3 h-3">` : style.iconFA}
            ${label.toUpperCase()}
        </span>
        `;
      })
      .join("")}
    </div>

      <p class="text-gray-600 text-sm mb-6">
        ${issue.description}
      </p>

      <div class="bg-gray-100 p-4 rounded-lg flex justify-between">

          <div>
              <p class="text-sm text-gray-500">Assignee</p>
              <p class="font-semibold">${issue.author}</p>
          </div>

          <div>
              <p class="text-sm text-gray-500">Priority</p>
              <span class="px-3 py-1 rounded-full text-white ${
                issue.priority.toLowerCase() === "high"
                  ? "bg-red-600"
                  : issue.priority.toLowerCase() === "medium"
                    ? "bg-orange-600"
                    : "bg-green-600"
              } text-xs">
                ${issue.priority.toUpperCase()}
              </span>
          </div>

      </div>

    </div> <!-- wrapper ends -->
  `;

  // Make modal wider by overriding modal-box class
  const modalBox = document.querySelector("#issue_modal .modal-box");
  modalBox.classList.add("w-full", "max-w-3xl");
  modalBox.style.paddingLeft = "2rem";
  modalBox.style.paddingRight = "2rem";

  document.getElementById("issue_modal").showModal();
};

// =====================
// Filter Issues
// =====================

const filterIssues = (type) => {
  manageSpinner(true);

  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((data) => {
      let issues = data.data;

      if (type !== "all") {
        issues = issues.filter((issue) => issue.status === type);
      }

      displayIssues(issues);
    });
};

// =====================
// Search Issues
// =====================

const searchIssues = (text) => {
  manageSpinner(true);

  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayIssues(data.data);
    });
};

// =====================
// Load initial data
// =====================

loadIssues();

document
  .querySelector('input[type="search"]')
  .addEventListener("input", (e) => {
    const value = e.target.value.trim();

    if (value === "") {
      loadIssues();
    } else {
      searchIssues(value);
    }
  });
