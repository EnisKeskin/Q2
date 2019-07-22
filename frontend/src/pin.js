import React from 'react';
import './stylesheets/user.css';
function Pin() {
  return (
    <div>
      <div class="figure">
      </div>
      <div class="figure-2">
      </div>
      <div class="container pin">
        <div class="pin-logo">
          <img src="/images/logo/logo-w.png" className="img-pin-logo" alt="" />
        </div>
        <div class="pin-text">
          <input type="text" class="txt-pin" placeholder="Game Pin" />
        </div>

        <div class="pin-button">
          <button type="button" class="btn-pin">Enter</button>
        </div>

        <div class="a">
          {/* <a href="">Login or Register</a> */}
        </div>
      </div>
    </div>
  );
}

export default Pin;
