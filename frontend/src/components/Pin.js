import React, { useState, useEffect } from 'react';
import io from '../connection';
import { Redirect } from 'react-router'

const Pin = () => {
  const [code, setCode] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    io.on('connected', (data) => {
      console.log('bağlandun');
    })

    io.on('sendQuiz', (quiz) => {
      if (isNaN(quiz)) {
        console.log(quiz[0]);
        setQuiz(quiz[0]);
      } else {
        console.log("at");
      }
    })

  }, [])

  function send() {
    io.emit("sendPin", code);

  }

  return (
    <div>
      {quiz ?
        <Redirect to="/username"/>
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
                <input type="text" className="txt-pin" placeholder="Game Pin" onChange={e => setCode(e.target.value)} />
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
