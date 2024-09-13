
// WAIT FOR DOCUMENT TO FINISH LOADING
document.addEventListener('DOMContentLoaded', () => {

    // make divs visible if mouser hover over
    document.querySelectorAll('.black, .magenta, .cyan').forEach(div => {
        div.addEventListener('mouseenter', () => {
            div.classList.add('visible');
            });
        });

    //-------------- FUNCTION FOR RANDOM DIVS APPEARING ON SCREEN OVER TIME --------------------
    // random appear of divs over time
    const divs = document.querySelectorAll('.black, .magenta, .cyan');
    let visibleDivs = [];

    // Function to randomly show divs inside the viewport
    function showRandomVisibleDiv() {
        if (visibleDivs.length > 0) {
            const randomIndex = Math.floor(Math.random() * visibleDivs.length);
            const randomDiv = visibleDivs[randomIndex];

            if (!randomDiv.classList.contains('visible')) {
                randomDiv.classList.add('visible');
            }
        }
    }

    // Set up the IntersectionObserver to track visibility of divs
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If div is in the viewport, add it to the visibleDivs array
                if (!visibleDivs.includes(entry.target)) {
                    visibleDivs.push(entry.target);
                }
            } else {
                // If the div is not in the viewport, remove it from the visibleDivs array
                const index = visibleDivs.indexOf(entry.target);
                if (index > -1) {
                    visibleDivs.splice(index, 1);
                }
            }
        });
    });

    // Start observing each div
    divs.forEach(div => {
        observer.observe(div);
    });

    // Call the function 1s)
    setInterval(showRandomVisibleDiv, 500);


    // ----------------------- STOP SCROLLING ON MOBILE --------------------
    // Function to prevent default scrolling behavior
    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();  // Also stop propagation to prevent further event handling
    }

    // Function to disable all scrolling
    function disableScroll() {
        // Disable scrolling via mousewheel
        window.addEventListener('wheel', preventDefault, { passive: false });
        
        // Disable touch scrolling on mobile devices
        document.addEventListener('touchmove', preventDefault, { passive: false });
    }

    // Call disableScroll() when needed
    disableScroll();


});
