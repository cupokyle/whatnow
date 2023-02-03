import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import axios from 'axios';
import Loading from './Loading';
import Modal from "./Modal/Modal";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [leftButton, setLeftButton] = useState("");
  const [rightButton, setRightButton] = useState("");
  const [leftTwoButton, setLeftTwoButton] = useState("");
  const [rightTwoButton, setRightTwoButton] = useState("");
  const [imgResult, setImgResult] = useState("");
  const [show, setShow] = useState(false);
  const [artStyle, setArtStyle] = useState("digital art");

  async function onSubmit(event) {
    event.preventDefault();
    setImgResult('loading');
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompty: userInput }),
    });

    var imgdata = JSON.stringify({
      "prompt": userInput + `, ${artStyle}`,
      "n": 1,
      "size": "1024x1024"
    });

    var config = {
      method: 'post',
      url: 'https://api.openai.com/v1/images/generations',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: imgdata
    };
    axios(config)
      .then(function (res) {
        setImgResult(res.data.data[0].url);
      })
      .catch(function (error) {
        console.log(error);
      });

    const data = await response.json();
    const newData = JSON.parse(data.result);
    setResult(newData.context);
    setLeftButton(newData.leftButton);
    setRightButton(newData.rightButton);
    setLeftTwoButton(newData.leftTwoButton);
    setRightTwoButton(newData.rightTwoButton);
    setUserInput("");
  }
  async function onSubmitButton(event) {
    event.preventDefault();
    setImgResult('loading');
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompty: "You " + userInput }),
    });
    const data = await response.json();
    const newData = JSON.parse(data.result);

    var imgdata = JSON.stringify({
      "prompt": "You " + userInput + `, ${artStyle}`,
      "n": 1,
      "size": "1024x1024"
    });

    var config = {
      method: 'post',
      url: 'https://api.openai.com/v1/images/generations',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: imgdata
    };

    axios(config)
      .then(function (res) {
        setImgResult(res.data.data[0].url);
      })
      .catch(function (error) {
        console.log(error);
      });

    setResult(newData.context);
    setLeftButton(newData.leftButton);
    setRightButton(newData.rightButton);
    setLeftTwoButton(newData.leftTwoButton);
    setRightTwoButton(newData.rightTwoButton);
    setUserInput("");
  }

  return (
    <div>
      <Head>
        <title>What Now?</title>
        <link rel="icon" href="/badlibs.png" />
      </Head>

      <main className={styles.main}>
        <img src="/badlibs.png" className={styles.icon} />
        <h3>What Now?</h3>
        <form onSubmit={onSubmit}>
          {imgResult === 'loading' && <Loading />}
          {!result && (
            <input
              type="text"
              name="prompty"
              placeholder="Enter a prompt"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          )}
          {!result && <button type="submit">Generate Story</button>}
        </form>
        {imgResult !== '' && imgResult !== 'loading' && <img src={imgResult} width="200px" />}
        <div className={styles.result}>{result}</div>
        <form onSubmit={onSubmitButton} className={styles.buttonbox}>
          {result && !leftButton && !rightButton && !leftTwoButton && !rightTwoButton && <h3>Game Over</h3>}
          {imgResult !== 'loading' && result && leftButton &&
            <button
              className={styles.button}
              type="submit"
              name="prompty"
              value={leftButton}
              onClick={(e) => setUserInput(e.target.value)}
              >{leftButton}</button>
          }
          {imgResult !== 'loading' && result && rightButton &&
            <button
              className={styles.button}
              type="submit"
              name="prompty"
              value={rightButton}
              onClick={(e) => setUserInput(e.target.value)}
              >{rightButton}</button>
          }
          {imgResult !== 'loading' && result && leftTwoButton && 
            <button
              className={styles.button}
              type="submit"
              name="prompty"
              value={leftTwoButton}
              onClick={(e) => setUserInput(e.target.value)}
            >{leftTwoButton}</button>
          }
          {imgResult !== 'loading' && result && rightTwoButton &&
            <button
              className={styles.button}
              type="submit"
              name="prompty"
              value={rightTwoButton}
              onClick={(e) => setUserInput(e.target.value)}
              >{rightTwoButton}</button>
          }
        </form>
        <span className="attribute"><a target="_blank" rel="noopener noreferrer" href="https://iconscout.com/lottie/loading-state-3830434">Loading Icon</a> courtesy of Fujio Studio</span>
      <button onClick={() => setShow(true)}>Settings</button>
      <Modal onClose={() => setShow(false)} show={show} artStyle={artStyle} setArtStyle={setArtStyle}/>
      </main>
    </div>
  );
}
