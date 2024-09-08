document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.black, .magenta, .cyan').forEach(div => {
        div.addEventListener('mouseenter', () => {
            // Add the 'visible' class to make div visible
            div.classList.add('visible');
            });
        });

    // ------ RANDOM APPEAR OF DIVS -------    
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
                // If the div is in the viewport, add it to the visibleDivs array
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

    // Call the function at regular intervals (e.g., every 2 seconds)
    setInterval(showRandomVisibleDiv, 1000);
});
