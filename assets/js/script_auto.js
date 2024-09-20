// WAIT FOR DOCUMENT TO FINISH LOADING
document.addEventListener('DOMContentLoaded', () => {

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
        
        // Optionally add the 'double' class (40% chance)
        let divSpace = 1; // By default, a normal div takes 1 space
        if (Math.random() < 0.35 && remainingSpaces >= 2) {
            newDiv.classList.add('double');
            divSpace = 2; // Double takes 2 spaces
        }

        // Append the div to the grid
        grid.appendChild(newDiv);
        
        // Subtract the occupied spaces from the remaining
        remainingSpaces -= divSpace;
        }



});