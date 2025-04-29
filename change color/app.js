const body = document.querySelector('body');
const buttons = document.querySelectorAll(".button");


buttons.forEach((button) => {
    button.addEventListener('click', (ev) => {
        const color = ev.target.id; // Get the ID of the clicked button
        if (['grey', 'yellow', 'white', 'blue'].includes(color)) {
            body.style.backgroundColor = color; // Set the background color dynamically
        }
    });
});

// buttons.forEach(function (button) {
 
//     button.addEventListener('click', function (ev) {

//         if (ev.target.id === 'grey') {
//             body.style.backgroundColor = ev.target.id;
//         }
//         if (ev.target.id === 'yellow') {
//             body.style.backgroundColor = ev.target.id;
//         }
//         if (ev.target.id === 'white') {
//             body.style.backgroundColor = ev.target.id;
//         }
//         if (ev.target.id === 'blue') {
//             body.style.backgroundColor = ev.target.id;
//         }
//     });
// });