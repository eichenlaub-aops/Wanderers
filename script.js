// Define the slides with image paths and captions
const slides = [
    // Jupiter images
    {
        image: "images/wanderers_Jupiter.png",
        caption: "Example 1: Jupiter"
    },
    {
        image: "images/wanderers_Jupiter_2025_03_11_arrow.png",
        caption: "Jupiter - March 11, 2025"
    },
    {
        image: "images/wanderers_Jupiter_2025_03_18.png",
        caption: "Jupiter - March 18, 2025"
    },
    {
        image: "images/wanderers_Jupiter_2025_03_25.png",
        caption: "Jupiter - March 25, 2025"
    },
    {
        image: "images/wanderers_Jupiter_2025_04_01.png",
        caption: "Jupiter - April 1, 2025"
    },
    {
        image: "images/wanderers_Jupiter_2025_04_08.png",
        caption: "Jupiter - April 8, 2025"
    },
    {
        image: "images/wanderers_Jupiter_2025_04_15.png",
        caption: "Jupiter - April 15, 2025"
    },
    
    // Mars images
    {
        image: "images/wanderers_Mars.png",
        caption: "What will the next planet be?"
    },
    {
        image: "images/wanderers_Mars_2025_05_16.png",
        caption: "Mars - May 16, 2025"
    },
    {
        image: "images/wanderers_Mars_2025_05_23.png",
        caption: "Mars - May 23, 2025"
    },
    {
        image: "images/wanderers_Mars_2025_05_30.png",
        caption: "Mars - May 30, 2025"
    },
    {
        image: "images/wanderers_Mars_2025_06_06.png",
        caption: "Mars - June 6, 2025"
    },
    
    // Saturn images
    {
        image: "images/wanderers_Saturn.png",
        caption: "Last Planet"
    },
    {
        image: "images/wanderers_Saturn_2022_07_13.png",
        caption: "Saturn - July 13, 2022"
    },
    {
        image: "images/wanderers_Saturn_2022_07_20.png",
        caption: "Saturn - July 20, 2022"
    },
    {
        image: "images/wanderers_Saturn_2022_07_27.png",
        caption: "Saturn - July 27, 2022"
    },
    {
        image: "images/wanderers_Saturn_2022_08_03.png",
        caption: "Saturn - August 3, 2022"
    },
    
    // Venus-Saturn-Mercury images
    {
        image: "images/wanderers_Venus.png",
        caption: " "
    },
    {
        image: "images/wanderers_Venus_0.png",
        caption: " "
    },
    {
        image: "images/wanderers_Venus_Saturn_Mercury_2025_04_29.png",
        caption: "Venus, Saturn & Mercury - April 29, 2025"
    },
    {
        image: "images/wanderers_Venus_Saturn_Mercury_2025_05_06.png",
        caption: "Venus, Saturn & Mercury - May 6, 2025"
    },
    {
        image: "images/wanderers_Venus_Saturn_Mercury_2025_05_13.png",
        caption: "Venus, Saturn & Mercury - May 13, 2025"
    },
    {
        image: "images/wanderers_Venus_Saturn_Mercury_2025_05_20.png",
        caption: "Venus, Saturn & Mercury - May 20, 2025"
    },
    {
        image: "images/wanderers_Venus_Saturn_Mercury_2025_05_27.png",
        caption: "Venus, Saturn & Mercury - May 27, 2025"
    },
    {
        image: "images/wanderers_Venus_Saturn_Mercury_2025_06_03.png",
        caption: "Venus, Saturn & Mercury - June 3, 2025"
    },
    {
        image: "images/wanderers_zz_00.png",
        caption: " "
    },
    {
        image: "images/wanderers_zz_01.png",
        caption: " "
    },
    {
        image: "images/wanderers_zz_02.png",
        caption: " "
    }
];

let currentSlideIndex = 0;

// Initialize the slideshow
function initSlideshow() {
    showSlide(currentSlideIndex);
    
    // Add keyboard event listeners
    document.addEventListener('keydown', function(event) {
        if (event.key === "ArrowLeft") {
            changeSlide(-1);
        } else if (event.key === "ArrowRight") {
            changeSlide(1);
        }
    });
    
    // Add error handling for images
    document.getElementById('slide-image').onerror = function() {
        this.onerror = null;
        this.src = 'images/error.png'; // You can create a simple placeholder image
        console.error('Error loading image: ' + slides[currentSlideIndex].image);
        alert('Error loading image. Make sure your images are in the correct folder structure.');
    };
}

// Show the current slide
function showSlide(index) {
    const slideImage = document.getElementById('slide-image');
    const slideCaption = document.getElementById('slide-caption');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    // Update image and caption
    slideImage.src = slides[index].image;
    slideCaption.textContent = slides[index].caption;
    
    // Update button states
    prevButton.disabled = index === 0;
    nextButton.disabled = index === slides.length - 1;
    
    // Debug info
    console.log('Loading image: ' + slides[index].image);
}

// Change to next or previous slide
function changeSlide(step) {
    const newIndex = currentSlideIndex + step;
    
    if (newIndex >= 0 && newIndex < slides.length) {
        currentSlideIndex = newIndex;
        showSlide(currentSlideIndex);
    }
}

// Initialize when the page loads
window.onload = initSlideshow;
