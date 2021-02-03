import React, { FC } from 'react';
import { Outer } from './style';

const Trim: FC = () => {
  return (
    <Outer>
      <label>Trim video</label>
    </Outer>
  );
};

/*
<span>
  <label onclick="openTrimPopup(this)">Trim video</label>
  <div class="outer">
    <span class="trim-btn-span" name="buttons">
      <button class="trim-btn" onclick="openTrimPopup(this.parentNode.parentNode.parentNode.children[0])">Leave</button>
      <button class="trim-btn" onclick="addClip(this, 0, 8, 24, 504)">Add clip</button>
    </span>
  </div>
</span>
*/

export default Trim;
