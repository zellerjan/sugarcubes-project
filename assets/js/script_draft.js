
// WAIT FOR DOCUMENT TO FINISH LOADING
document.addEventListener('DOMContentLoaded', () => {


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
            // Setze die Grössen der Elemente
            this.dotSize = this.$dot.offsetWidth;
            this.outlineSize = this.$outline.offsetWidth;
    
            this.setupEventListeners();
            this.animateDotOutline();
        },
    
        setupEventListeners: function() {
            let self = this;
    
            // Mausbewegungen direkt verfolgen
            document.addEventListener('mousemove', function(e) {
                self.cursorVisible = true;
                self.toggleCursorVisibility();
    
                // Verfolge direkt die Mausposition
                self.endX = e.pageX;
                self.endY = e.pageY;
                self.updateCursorPosition();
    
                // Überprüfe, ob der Cursor über einem Element mit der Klasse .magenta ist
                self.checkIfHoveringMagenta(e);
            });
    
            // Interaktionen mit Links
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
    
            // Mausklick-Interaktionen
            document.addEventListener('mousedown', function() {
                self.cursorEnlarged = true;
                self.toggleCursorSize();
            });
            document.addEventListener('mouseup', function() {
                self.cursorEnlarged = false;
                self.toggleCursorSize();
            });
    
            // Cursor anzeigen/verstecken
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
    
        checkIfHoveringMagenta: function(e) {
            // Überprüfe, ob der Cursor über einem .magenta-Element ist
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
    
            // Passe die Klassen an, wenn der Cursor über einem magenta-Element ist
            if (isHoveringMagenta) {
                this.$dot.classList.add('hovering-magenta');
                this.$outline.classList.add('hovering-magenta-outline');
            } else {
                this.$dot.classList.remove('hovering-magenta');
                this.$outline.classList.remove('hovering-magenta-outline');
            }
        },
    
        updateCursorPosition: function() {
            // Aktualisiere direkt die Position von .cursor-dot und .cursor-dot-outline
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

});
