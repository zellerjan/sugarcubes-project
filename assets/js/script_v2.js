// WAIT FOR DOCUMENT TO FINISH LOADING
document.addEventListener('DOMContentLoaded', () => {

    // -------------- GENERATE DIVS WITH RANDOM COLOR AND SOLO / DOUBLE SPACE ------------
        // Define the available classes in the order of the pattern
        const classes = ['magenta', 'cyan', 'black'];

        // Get all divs in your grid
        const grid = document.getElementById('grid');

        // Read the CSS variables for the number of columns and rows
        const rootStyles = getComputedStyle(document.documentElement);
        const columnsGrid = parseInt(rootStyles.getPropertyValue('--grid').trim());

        // Calculate the total number of spaces in the grid
        const totalGridSpaces =  columnsGrid * columnsGrid;

        // Variables to control the pattern
        let index = 0;
        let occupiedSpaces = 42; // Counts the actually occupied spaces (including double)

        // Calculate the number of divs that are already present
        const existingDivs = document.querySelectorAll('div');
        existingDivs.forEach(div => {
            // Count normal divs as 1 and double divs as 2
            if (div.classList.contains('double')) {
                occupiedSpaces += 2; // Double takes 2 spaces
            } else {
                occupiedSpaces += 1; // Normal div takes 1 space
            }
        });

        // Calculate the remaining spaces in the grid that still need to be filled
        let remainingSpaces = totalGridSpaces - occupiedSpaces;

        // Create new divs as long as there are free spaces available
        while (remainingSpaces > 0) {
            // Create a new div element
            const newDiv = document.createElement('div');
            
            // Assign the next class in the array cyclically
            newDiv.classList.add(classes[index]);

            // Increment the index and reset it if it reaches the end of the array
            index = (index + 2) % classes.length;
            
            // Optionally add the 'double' class (35% chance)
            let divSpace = 1;
            if (Math.random() < 0.35 && remainingSpaces >= 2) {
                newDiv.classList.add('double');
                divSpace = 2;
            }

            // Append the div to the grid
            grid.appendChild(newDiv);
            
            // Subtract the occupied spaces from the remaining
            remainingSpaces -= divSpace;
        }


    // ----------------------- STOP SCROLLING ON MOBILE ---------------------------
        // Function to prevent default scrolling behavior
        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation(); 
        }

        // Function to disable all scrolling
        function disableScroll() {
            // Disable scrolling via mousewheel
            window.addEventListener('wheel', preventDefault, { passive: false });
            
            // Disable touch scrolling on mobile devices
            document.addEventListener('touchmove', preventDefault, { passive: false });
        }

        // Call disableScroll()
        disableScroll();


    // ------------------------ CUSTOM CURSOR ---------------------------------
        const cursor = {
            delay: 25,
            _x: 0,
            _y: 0,
            endX: (window.innerWidth / 2),
            endY: (window.innerHeight / 2),
            cursorVisible: true,
            cursorEnlarged: false,
            $dot: document.querySelector('.cursor-dot'),
            $outline: document.querySelector('.cursor-dot-outline'),

            init: function() {
                // Set up element sizes
                this.dotSize = this.$dot.offsetWidth;
                this.outlineSize = this.$outline.offsetWidth;
                
                this.setupEventListeners();
                this.animateDotOutline();
            },

            getTransformedCoordinates: function(x, y) {
                // Adjust based on body's rotation (45 degrees)
                let angle = 45 * (Math.PI / 180);
                let offsetX = window.innerWidth / 2;
                let offsetY = window.innerHeight / 2;

                // Calculate the transformed coordinates + adjustments so it matches original cursor
                let transformedX = Math.cos(angle) * (x - offsetX) - Math.sin(angle) * (y - offsetY) + offsetX + 180;
                let transformedY = Math.sin(angle) * (x - offsetX) + Math.cos(angle) * (y - offsetY) + offsetY + 75;

                return {
                    x: transformedX,
                    y: transformedY
                };
            },

            setupEventListeners: function() {
                let self = this;
                
                // Anchor hovering
                document.querySelectorAll('a').forEach(function(el) {
                    el.addEventListener('mouseover', function() {
                        self.cursorEnlarged = true;
                        self.toggleCursorSize();
                    });
                    el.addEventListener('mouseout', function() {
                        self.cursorEnlarged = false;
                        self.toggleCursorSize();
                    });
                });
                
                // Click events
                document.addEventListener('mousedown', function() {
                    self.cursorEnlarged = true;
                    self.toggleCursorSize();
                });
                document.addEventListener('mouseup', function() {
                    self.cursorEnlarged = false;
                    self.toggleCursorSize();
                });

                // Mouse move event with transformed coordinates
                document.addEventListener('mousemove', function(e) {
                    // Show the cursor
                    self.cursorVisible = true;
                    self.toggleCursorVisibility();

                    // Get transformed coordinates
                    let coords = self.getTransformedCoordinates(e.pageX, e.pageY);
                    self.endX = coords.x;
                    self.endY = coords.y;
                    self.updateCursorPosition();

                    // Check if hovering over any part of a div with class .magenta
                    let magentaElements = document.querySelectorAll('.magenta');
                    let isHoveringMagenta = false;

                    magentaElements.forEach(function(magentaElement) {
                        let rect = magentaElement.getBoundingClientRect();
                        let isInBounds = (
                            e.clientX >= rect.left &&
                            e.clientX <= rect.right &&
                            e.clientY >= rect.top &&
                            e.clientY <= rect.bottom
                        );

                        if (isInBounds) {
                            isHoveringMagenta = true;
                        }
                    });

                    if (isHoveringMagenta) {
                        self.$dot.classList.add('hovering-magenta');
                        self.$outline.classList.add('hovering-magenta-outline');
                    } else {
                        self.$dot.classList.remove('hovering-magenta');
                        self.$outline.classList.remove('hovering-magenta-outline');
                    }
                });
                
                // Hide/show cursor on page entry/exit
                document.addEventListener('mouseenter', function() {
                    self.cursorVisible = true;
                    self.toggleCursorVisibility();
                    self.$dot.style.opacity = 1;
                    self.$outline.style.opacity = 1;
                });
                
                document.addEventListener('mouseleave', function() {
                    self.cursorVisible = false;
                    self.toggleCursorVisibility();
                    self.$dot.style.opacity = 0;
                    self.$outline.style.opacity = 0;
                });
            },

            updateCursorPosition: function() {
                // Directly updating the top and left positions
                this.$dot.style.top = `${this.endY}px`;
                this.$dot.style.left = `${this.endX}px`;
                this.$outline.style.top = `${this._y}px`;
                this.$outline.style.left = `${this._x}px`;
            },
            
            animateDotOutline: function() {
                let self = this;
                
                self._x += (self.endX - self._x) / self.delay;
                self._y += (self.endY - self._y) / self.delay;
                self.updateCursorPosition();
                
                requestAnimationFrame(this.animateDotOutline.bind(self));
            },

            toggleCursorSize: function() {
                if (this.cursorEnlarged) {
                    this.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
                    this.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                } else {
                    this.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
                    this.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            },
            
            toggleCursorVisibility: function() {
                if (this.cursorVisible) {
                    this.$dot.style.opacity = 1;
                    this.$outline.style.opacity = 1;
                } else {
                    this.$dot.style.opacity = 0;
                    this.$outline.style.opacity = 0;
                }
            }
        };
        cursor.init();


    // --------------------------MAKE DIVS VISIBLE ON HOVER ----------------------------------
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

    // Call the function every .5s
    setInterval(showRandomVisibleDiv, 500);


});