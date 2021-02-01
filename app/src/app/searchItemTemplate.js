/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/*
<div class="search-item" url="">
  <img src="https://i.ytimg.com/vi/vdrrjCv3vwI/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLB2k6mJrYq0ObtgFyVAHg93NXoXCw" class="search-img">
  <label class="search-label">TEST</label>
</div>
*/

const search_div_template = document.createElement('div');
search_div_template.classList.add('search-item');

const search_img = document.createElement('img');
search_img.classList.add('search-img');

const search_label = document.createElement('span');
search_label.classList.add('search-label');

search_div_template.appendChild(search_img);
search_div_template.appendChild(search_label);
