const noUiSlider = require('nouislider');

function myFunction() {
  var popup = document.getElementById('myPopup');
  popup.classList.add('show');
}

window.onload = () => {
  var slider = document.getElementById('left');

  noUiSlider.create(slider, {
    start: [0, 60],
    connect: true,
    range: {
      min: 0,
      max: 60,
    },
  });
};
