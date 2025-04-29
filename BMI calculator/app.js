const form = document.querySelector('form');
// const height = parseFloat(document.querySelector('#height').value); this is not valid

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const height = parseFloat(document.querySelector('#height').value);
    const weight = parseFloat(document.querySelector('#weight').value);
    const result = document.querySelector('#results');

    if (height < 0 || height === '' || isNaN(height) ) {
        result.innerHTML = `Please give valid height ${height}`;
    } else if(weight < 0 || weight === '' || isNaN(weight)){
        result.innerHTML = `Please give valid weight ${weight}`;
    } else {
        const bmi = (weight / ((height * height) / 10000)).toFixed(2);
        result.innerHTML = `<span>${bmi}</span>`;
    }

});