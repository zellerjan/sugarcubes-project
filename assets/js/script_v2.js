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