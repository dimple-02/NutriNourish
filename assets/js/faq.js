const accordions = document.querySelectorAll(".accordion");

function setAccordionState(accordion, isOpen) {
  const header = accordion.querySelector(".accordion__header");
  const content = accordion.querySelector(".accordion__content");
  const icon = accordion.querySelector(".accordion__icon i");

  content.style.height = isOpen ? `${content.scrollHeight}px` : "0px";
  header.setAttribute("aria-expanded", String(isOpen));
  icon.classList.toggle("ri-add-line", !isOpen);
  icon.classList.toggle("ri-subtract-fill", isOpen);
}

function toggleAccordion(targetIndex) {
  accordions.forEach((accordion, index) => {
    const content = accordion.querySelector(".accordion__content");
    const isCurrentOpen = content.style.height === `${content.scrollHeight}px`;
    const shouldOpen = index === targetIndex ? !isCurrentOpen : false;
    setAccordionState(accordion, shouldOpen);
  });
}

accordions.forEach((accordion, index) => {
  const header = accordion.querySelector(".accordion__header");

  header.addEventListener("click", () => toggleAccordion(index));
  header.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAccordion(index);
    }
  });

  setAccordionState(accordion, false);
});