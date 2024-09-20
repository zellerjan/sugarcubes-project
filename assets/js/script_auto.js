// WAIT FOR DOCUMENT TO FINISH LOADING
document.addEventListener('DOMContentLoaded', () => {

        // Definiere die verfügbaren Klassen in der Reihenfolge des Musters
        const klassen = ['magenta', 'cyan', 'black'];

        // Hole alle divs in deinem Grid
        const divs = document.querySelectorAll('div');

        // Variablen zum Steuern des Musters
        let index = 0;

        // Iteriere durch jedes div
        divs.forEach(div => {
        // Weise die nächste Klasse im Array zyklisch zu
        div.classList.add(klassen[index]);
        
        // Inkrementiere den Index und setze ihn zurück, wenn er das Ende des Arrays erreicht
        index = (index + 1) % klassen.length;
        

        if (Math.random() < 0.4) {
            div.classList.add('double');
        }
        });


});