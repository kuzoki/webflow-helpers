document.addEventListener("DOMContentLoaded", function () {
  /**
   * Render pagination based on the specified style.
   * @param {string} style - The pagination style ('default' or 'balanced').
   */
  const renderPagination = (style) => {
    const paginationContainers = [...document.querySelectorAll(`[kuzo-pagination='${style}']`)];

    paginationContainers.forEach((container) => {
      const pageCountElement = container.querySelector(".w-page-count");
      if (!pageCountElement) throw new Error("Page count element not found");
      const pageCountText = pageCountElement?.textContent.trim(); // "1 / 6"
      const totalPages = Number(pageCountText?.split("/")[1]?.trim());
      const nextButton = container.querySelector(".w-pagination-next");

      if (!nextButton) return;

      const paramPrefix = nextButton.getAttribute("href")?.match(/([^?=&]+)_page=/)?.[1] || "page";
      const current = getCurrentPageByPrefix(paramPrefix);
      const numbersPlaceholder = container.querySelector("[kuzo-pagination-numbers]");
      if (!numbersPlaceholder) return;

      const firstPageElement = numbersPlaceholder.querySelector("a");
      if (!firstPageElement) return;

      // Generate pages based on style
      const pages = generatePagination(current, totalPages, style);
      numbersPlaceholder.innerHTML = ""; // Clear existing pagination
      pages.forEach((page) => {
        const newClone = firstPageElement.cloneNode(true);
        newClone.textContent = page;

        if (page === "...") {
          newClone.classList.add("disabled");
        } else {
          newClone.href = `?${paramPrefix}_page=${page}`;

          updateURLWithParams(newClone); // Update URL with new page number

          if (page === current) {
            newClone.classList.add("active");
          }
        }
        numbersPlaceholder.appendChild(newClone); // Append to DOM
      });
    });
  };

  /**
   * Generate an array of pages to display.
   * @param {number} currentPage - The current page number.
   * @param {number} totalPages - The total number of pages.
   * @param {string} [type='default'] - The pagination type ('default' or 'balanced').
   * @returns {Array} - An array of page numbers and ellipses.
   */
  function generatePagination(currentPage, totalPages, type = "default") {
    const pagination = [];
    const maxElements = 7; // Total elements in pagination

    if (totalPages <= maxElements || type === "default") {
      for (let i = 1; i <= totalPages; i++) {
        pagination.push(i);
      }
      return pagination;
    }

    pagination.push(1); // Always include the first page

    if (currentPage <= 4) {
      pagination.push(2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pagination.push("...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pagination.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pagination;
  }

  /**
   * Get the current page numbers from the URL.
   * @returns {Array} - An array of objects containing prefix and page number.
   */
  function getCurrentPageNumbers() {
    const urlObj = new URL(window.location.href);
    const pages = [];

    for (const [key, value] of urlObj.searchParams.entries()) {
      if (key.endsWith("_page")) {
        pages.push({
          prefix: key.replace("_page", ""),
          page: parseInt(value, 10) || 1,
        });
      }
    }

    return pages;
  }

  /**
   * Get the current page number by prefix.
   * @param {string} prefix - The prefix used in the URL parameter.
   * @returns {number} - The current page number.
   */
  function getCurrentPageByPrefix(prefix) {
    const currentPages = getCurrentPageNumbers(); // Get all current pages
    const pageData = currentPages.find((entry) => entry.prefix === prefix);
    return pageData ? pageData.page : 1; // Return the page if found, otherwise default to 1
  }

  /**
   * Update the URL with new parameters when a pagination link is clicked.
   * @param {HTMLElement} link - The pagination link element.
   */
  function updateURLWithParams(link) {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior
      console.log("link clicked");
      const url = new URL(window.location.href);
      const newParams = new URL(this.href).searchParams;

      // Merge existing parameters with new ones
      newParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });

      window.location.href = url.toString(); // Navigate with updated parameters
    });
  }

  // Initialize both styles
  if (document.querySelector("[kuzo-pagination='default']")) {
    renderPagination("default");
  }
  if (document.querySelector("[kuzo-pagination='balanced']")) {
    renderPagination("balanced");
  }
});
