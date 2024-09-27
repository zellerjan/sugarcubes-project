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

        // Variables to control pattern
        let index = 0;
        let occupiedSpaces = 40; // occupied spaces  with title, text etc. (including double)
        let remainingSpaces = totalGridSpaces - occupiedSpaces; // Remaining spaces to fill
        let currentRowPosition = occupiedSpaces % columnsGrid; // Track the current position in the row


        // Create new divs as long as there are free spaces available
        while (remainingSpaces > 0) {
            // Create a new div element
            const newDiv = document.createElement('div');
            
            // Assign the next class in the array cyclically
            newDiv.classList.add(classes[index]);
            
            // Optionally add the 'double' class (35% chance)
            let divSpace = 1;
            if (Math.random() < 0.35 && remainingSpaces >= 2) {
                newDiv.classList.add('double');
                divSpace = 2;
            }

            // If we're at the end of the row and a double div would overflow, force single
            if (divSpace === 2 && currentRowPosition >= columnsGrid - 1) {
                // Not enough space at the end of the row, so keep it single
                divSpace = 1;
                newDiv.classList.remove('double');
            }

            // Append the div to the grid
            grid.appendChild(newDiv);
            
            // Update the occupied and remaining spaces
            occupiedSpaces += divSpace;
            remainingSpaces = totalGridSpaces - occupiedSpaces;

            // Update current row position (wrap around if necessary)
            currentRowPosition = (currentRowPosition + divSpace) % columnsGrid;

            // Increment the index for the next class in the array
            index = (index + 1) % classes.length;
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


    // --------------------------- CUSTOM CURSOR ---------------------------------
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
                // set size of elements
                this.dotSize = this.$dot.offsetWidth;
                this.outlineSize = this.$outline.offsetWidth;
        
                this.setupEventListeners();
                this.animateDotOutline();
            },
    
            // track mouse movement
            setupEventListeners: function() {
                let self = this;
        
                document.addEventListener('mousemove', function(e) {
                    self.cursorVisible = true;
                    self.toggleCursorVisibility();
        
                    self.endX = e.pageX;
                    self.endY = e.pageY;
                    self.updateCursorPosition();
        
                    // fire function: check if cursor is above elemente with .magenta
                    self.checkIfHoveringMagenta(e);
                });
        
                // set interacion with links
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
        
                // set interaction on click
                document.addEventListener('mousedown', function() {
                    self.cursorEnlarged = true;
                    self.toggleCursorSize();
                });
                document.addEventListener('mouseup', function() {
                    self.cursorEnlarged = false;
                    self.toggleCursorSize();
                });
        
                // hide / show cursor
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
        
            // check if cursor is over a element with .magenta
            checkIfHoveringMagenta: function(e) {
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
        
                // change css-class, when hovering over magenta-element
                if (isHoveringMagenta) {
                    this.$dot.classList.add('hovering-magenta');
                    this.$outline.classList.add('hovering-magenta-outline');
                } else {
                    this.$dot.classList.remove('hovering-magenta');
                    this.$outline.classList.remove('hovering-magenta-outline');
                }
            },
        
            // update position on .cursor-dot, .cursor-dot-outline
            updateCursorPosition: function() {
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

        // fire custom cursor action
        cursor.init();
    
    


    // --------------------------MAKE DIVS VISIBLE ON HOVER ----------------------------------
        document.querySelectorAll('.black, .magenta, .cyan').forEach(div => {
            div.addEventListener('mouseenter', () => {
                div.classList.add('visible');
            });
        });

    //-------------- FUNCTION FOR RANDOM DIVS APPEARING ON SCREEN OVER TIME --------------------
        // Collect all divs with the classes .black, .magenta, .cyan
        const divs = document.querySelectorAll('.black, .magenta, .cyan');
        let visibleDivs = [];

        // how close an element can be to the window edges and still be considered "visible"
        const edgeThreshold = 200; 

        // Function to check if a div is close enough to the window to be considered visible
        function isDivCloseToWindowEdge(div) {
            const rect = div.getBoundingClientRect();
            
            // Check if the div's bounding box is within the window, allowing for an edge margin (threshold)
            return (
                rect.top >= -edgeThreshold && rect.left >= -edgeThreshold &&
                rect.bottom <= window.innerHeight + edgeThreshold &&
                rect.right <= window.innerWidth + edgeThreshold
            );
        }

        // Function to randomly show a div that is visible or close to the window edges
        function showRandomVisibleDiv() {
            // Filter the visible divs to only those within or close to the window bounds
            const divsNearWindow = visibleDivs.filter(isDivCloseToWindowEdge);

            if (divsNearWindow.length > 0) {
                const randomIndex = Math.floor(Math.random() * divsNearWindow.length);
                const randomDiv = divsNearWindow[randomIndex];

                // Add 'visible' class if it’s not already present
                if (!randomDiv.classList.contains('visible')) {
                    randomDiv.classList.add('visible');
                }
            }
        }

        // IntersectionObserver to track the visibility of the divs
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add the div to the visible array if it’s in the viewport
                    if (!visibleDivs.includes(entry.target)) {
                        visibleDivs.push(entry.target);
                    }
                } else {
                    // Remove the div from the visible array if it’s no longer in the viewport
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

        // Function to update the interval based on the window width
        function updateInterval() {
            let windowWidth = window.innerWidth;
            if (windowWidth <= 600) {
                setInterval(showRandomVisibleDiv, 200); // Call every 0.2 seconds for small screens
            } else {
                setInterval(showRandomVisibleDiv, 500); // Call every .5 second for larger screens
            }
        }

        // Initialize the interval based on the window width
        updateInterval();


        // ------------------- Disclaimer, prints to console -------------------------
        const disclaimer = 'Hey! This project was created as part of the course "Webtechnologien" at "Schule für Gestaltung Zürich". Its an interpretation of an existing poster for the Band "Sugarcubes". © Original Poster from Swissted https://www.swissted.com/products/the-sugarcubes-at-limelight-1992';
        console.log(disclaimer);

});