class ImageSlider {
    constructor(selector) {
        this.autoPlayDelay = 5000;
        this.slider = document.querySelector(selector);
        this.track = this.slider.querySelector(".slider-track");
        this.slides = Array.from(this.track.children);
        this.prevButton = this.slider.querySelector(".prev");
        this.nextButton = this.slider.querySelector(".next");
        this.dotsContainer = this.slider.querySelector(".slider-dots");
        this.dots = [];
        this.currentIndex = 0;
        this.autoPlayTimer = null;

        this.init();
    }

    init() {
        this.createDots();
        this.bindEvents();
        this.updateSliderPosition();
        this.startAutoPlay();
    }

    updateSliderPosition() {
        const offset = this.currentIndex * 100;
        this.track.style.transform = `translateX(-${offset}%)`;

        this.slides.forEach((slide, index) => {
            slide.setAttribute(
                "aria-hidden",
                String(index !== this.currentIndex)
            );
        });

        this.updateDots();
    }

    nextSlide() {
        this.currentIndex =
            (this.currentIndex + 1) % this.slides.length;

        this.updateSliderPosition();
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.slides.length - 1;
        }

        this.updateSliderPosition();
    }

    createDots() {
        this.dotsContainer.innerHTML = "";
        this.dots = [];

        this.slides.forEach((slide, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.classList.add("dot");
            dot.setAttribute("aria-label", `Show photo ${index + 1}`);

            dot.addEventListener("click", () => {
                this.currentIndex = index;
                this.updateSliderPosition();
            });

            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            const isActive = index === this.currentIndex;

            dot.classList.toggle("active", isActive);
            dot.setAttribute("aria-pressed", String(isActive));
        });
    }

    startAutoPlay() {
        if (this.slides.length < 2 ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        this.stopAutoPlay();
        this.autoPlayTimer = window.setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer !== null) {
            window.clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    bindEvents() {
        this.nextButton.addEventListener("click", () => {
            this.nextSlide();
        });

        this.prevButton.addEventListener("click", () => {
            this.prevSlide();
        });

        // Use the keyboard arrow keys.
        this.slider.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                this.nextSlide();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                this.prevSlide();
            }
        });

        let startX = null;
        let startY = null;

        this.slider.addEventListener("touchstart", (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }, { passive: true });

        this.slider.addEventListener("touchend", (event) => {
            if (startX === null) return;

            const differenceX =
                event.changedTouches[0].clientX - startX;
            const differenceY =
                event.changedTouches[0].clientY - startY;

            if (
                Math.abs(differenceX) > 50 &&
                Math.abs(differenceX) > Math.abs(differenceY)
            ) {
                if (differenceX < 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            startX = null;
        }, { passive: true });

        this.slider.addEventListener("touchcancel", () => {
            startX = null;
        });

        this.slider.addEventListener("mouseenter", () => {
            this.stopAutoPlay();
        });

        this.slider.addEventListener("mouseleave", () => {
            this.startAutoPlay();
        });

        this.slider.addEventListener("focusin", () => {
            this.stopAutoPlay();
        });

        this.slider.addEventListener("focusout", (event) => {
            if (!this.slider.contains(event.relatedTarget)) {
                this.startAutoPlay();
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ImageSlider(".slider");
});