const div = document.createElement('div');
div.classList.add('playItem');
div.classList.add('show');

const span1 = document.createElement('span');
const span2 = document.createElement('span');
const span3 = document.createElement('span');
span2.classList.add('video-name-container');
span3.classList.add('video-options');

const image = document.createElement('img');
image.classList.add('image');

const label = document.createElement('label');
label.classList.add('video-name');

const menu_image = document.createElement('img');
menu_image.src = "../assets/more_vert-24px.png";
menu_image.id = 'menu-image';

const menu_div = document.createElement('div');
menu_div.classList.add('dropdown-content');

const rename_label = document.createElement('label');
const trim_label = document.createElement('label');
const download_label = document.createElement('label');
rename_label.innerHTML = "Rename video"
trim_label.innerHTML = "Trim video"
download_label.innerHTML = "Download video"

menu_div.appendChild(rename_label);
menu_div.appendChild(trim_label);
menu_div.appendChild(download_label);

span1.appendChild(image);
span2.appendChild(label);
span3.appendChild(menu_image);
span3.appendChild(menu_div);

div.appendChild(span1);
div.appendChild(span2);
div.appendChild(span3);


const templateDiv = div;