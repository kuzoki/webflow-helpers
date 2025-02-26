document.addEventListener("DOMContentLoaded", function () {
    // Inject styles into the document head
    const style = document.createElement("style");
    style.textContent = `
        .custom-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .custom-modal.show {
          opacity: 1;
        }
        .custom-modal-content {
          opacity: 0;
          transform: scale(0.95);
          transition: all 0.3s ease;
        }
        .custom-modal-content.show {
          opacity: 1;
          transform: scale(1);
            transition: all 0.3s ease;
        }
        .custom-modal button.custom-modal-close {
          position: absolute;
          display: flex;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 5px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
          transition: background-color 0.2s ease;
        }
        .custom-modal button.custom-modal-close svg{
              width: 25px;
              height: 25px;
              pointer-events: none;
        }
        .custom-modal button.custom-modal-close:hover {
          background: white;
        }
        .custom-modal-next,
        .custom-modal-prev {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 15px;
          cursor: pointer;
          border-radius: 50%;
          font-size: 20px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .custom-modal-next:hover,
        .custom-modal-prev:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }
        .custom-modal-next {
          right: 30px;
        }
        .custom-modal-prev {
          left: 30px;
        }
        .custom-modal-caption{
          color: white;
          font-size: 16px;
          font-weight: 600;
          margin-top: 10px;
        }
      `;
    document.head.appendChild(style);
  
    const imgBox = document.querySelectorAll("[kuzo-img-box]");
  
    imgBox.forEach((item) => {
      const type = item.getAttribute("kuzo-img-box");
      let imagesItems = item.querySelectorAll(".w-richtext-figure-type-image img");
  
      if (imagesItems.length > 0) {
        let currentIndex = 0;
  
        imagesItems.forEach((image, index) => {
          image.addEventListener("click", function () {
            currentIndex = index;
            openModal(currentIndex);
          });
        });
  
        function openModal(index) {
          const figure = imagesItems[index].closest("figure");
          const caption = figure ? figure.querySelector("figcaption")?.innerText || "" : "";
  
          const modal = document.createElement("div");
          modal.className = "custom-modal";
          modal.innerHTML = `
           ${type == 'slider' ? '<button class="custom-modal-prev">&#10094;</button>' : ''}
            <div class="custom-modal-content">
              <img src="${imagesItems[index].src}" class="custom-modal-image" />
              <div class="custom-modal-caption">${caption}</div>
            </div>
            ${type == 'slider' ? '<button class="custom-modal-next">&#10095;</button>' : ''}
            <button class="custom-modal-close">
              <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 8L8 16M8.00001 8L16 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
          `;
  
          document.body.appendChild(modal);
          modal.classList.add("show");
          const modalContent = modal.querySelector(".custom-modal-content");
          setTimeout(() => modalContent.classList.add("show"), 10);
  
          const modalImage = modal.querySelector(".custom-modal-image");
          const modalCaption = modal.querySelector(".custom-modal-caption");
          const prevButton = modal.querySelector(".custom-modal-prev");
          const nextButton = modal.querySelector(".custom-modal-next");
  
          function updateImage() {
            modalContent.classList.remove("show");
            setTimeout(() => {
              modalImage.src = imagesItems[currentIndex].src;
              const newFigure = imagesItems[currentIndex].closest("figure");
              modalCaption.innerText = newFigure ? newFigure.querySelector("figcaption")?.innerText || "" : "";
              modalContent.classList.add("show");
            }, 300);
          }
          updateImage();
  
          if (type == 'slider') {
            nextButton.addEventListener("click", () => {
              currentIndex = (currentIndex + 1) % imagesItems.length;
              updateImage();
            });
  
            prevButton.addEventListener("click", () => {
              currentIndex = (currentIndex - 1 + imagesItems.length) % imagesItems.length;
              updateImage();
            });
          }
  
          modal.addEventListener("click", (event) => {
            console.log(event.target);
            if (event.target === modal || event.target.classList.contains("custom-modal-close")) {
               modalContent.classList.remove("show");
              setTimeout(() => modal.remove(), 300);
            }
          });
        }
      }
    });
});