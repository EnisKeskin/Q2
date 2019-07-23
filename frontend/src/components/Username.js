import React, { useState } from 'react';
import io from '../connection';
import { Redirect } from 'react-router'

const Pin = () => {
  const [code, setCode] = useState(null);
  const [quiz, setQuiz] = useState(null);

  function send() {
    io.emit("sendUsername", code);
    setQuiz(true);
  }

  return (
    <div>
      {quiz ?
        <Redirect to='/Players' />
        :
        <div>
          <div className="figure"></div>
          <div className="figure-2"></div>
          <div className="capsule">
            <div className="container pin">
              <div className="pin-logo">
                <img src="../images/logo/logo-w.png" className="img-pin-logo" alt="" />
              </div>
              <div className="pin-text">
                <input type="text" className="txt-pin" placeholder="Username" onChange={e => setCode(e.target.value)} />
              </div>

              <div className="pin-button">
                <button onClick={send} type="submit" className="btn-pin">Enter</button>
              </div>
              <div className="a">
                {/* <a href="">Login or Register</a> */}
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Pin;
