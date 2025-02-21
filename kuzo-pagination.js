document.addEventListener("DOMContentLoaded", function () {
    const renderPagination = (style) => {
      const paginationContainers = [...document.querySelectorAll(`[kuzo-pagination='${style}']`)];
  
      paginationContainers.forEach((container) => {
        const totalPages = Number(container.getAttribute("pages"));
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
        let paginationHTML = "";
        pages.forEach((page) => {
          const newClone = firstPageElement.cloneNode(true);
          newClone.textContent = page;
          if (page === "...") {
            newClone.classList.add("disabled");
          } else {
            newClone.href = `?${paramPrefix}_page=${page}`;
            if (style === "balanced") {
              newClone.addEventListener("click", () => updatePagination(page, totalPages));
            }
            if (page === current) {
              newClone.classList.add("active");
            }
          }
          paginationHTML += newClone.outerHTML;
        });
        numbersPlaceholder.innerHTML = paginationHTML;
      });
    };
  
   
  
    // Generate an array of pages to display
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
  
    // Get the current page number from the URL
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
  
    function getCurrentPageByPrefix(prefix) {
      const currentPages = getCurrentPageNumbers(); // Get all current pages
      const pageData = currentPages.find((entry) => entry.prefix === prefix);
      return pageData ? pageData.page : 1; // Return the page if found, otherwise default to 1
    }
  
    const paginationLinks = document.querySelectorAll("[kuzo-pagination] a");
    if (paginationLinks.length > 0) {
      paginationLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent default link behavior
  
          const url = new URL(window.location.href);
          const newParams = new URL(this.href).searchParams;
  
          // Merge existing parameters with new ones
          newParams.forEach((value, key) => {
            url.searchParams.set(key, value);
          });
  
          window.location.href = url.toString(); // Navigate with updated parameters
        });
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
  