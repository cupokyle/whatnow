import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import axios from 'axios';

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [leftButton, setLeftButton] = useState("");
  const [rightButton, setRightButton] = useState("");
  const [leftTwoButton, setLeftTwoButton] = useState("");
  const [rightTwoButton, setRightTwoButton] = useState("");
  const [imgResult, setImgResult] = useState("");

  async function onSubmit(event) {
    setImgResult('https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e471pwmo03hyhg4v6pv4fg8a0pcfrucr5ob7oudbhgw&rid=giphy.gif&ct=g');
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompty: userInput }),
    });

    var imgdata = JSON.stringify({
      "prompt": userInput + ", digital art",
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
    setImgResult('https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e471pwmo03hyhg4v6pv4fg8a0pcfrucr5ob7oudbhgw&rid=giphy.gif&ct=g');
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
      "prompt": "You " + userInput + ", digital art",
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
          {imgResult === 'https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e471pwmo03hyhg4v6pv4fg8a0pcfrucr5ob7oudbhgw&rid=giphy.gif&ct=g' && <img src={imgResult} width="100px" />}
          {!result && (
            <input
              type="text"
              name="prompty"
              placeholder="Enter a prompt"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          )}
          {!result && <input type="submit" value="Generate Text" />}
        </form>
        {imgResult !== '' && imgResult !== 'https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e471pwmo03hyhg4v6pv4fg8a0pcfrucr5ob7oudbhgw&rid=giphy.gif&ct=g' && <img src={imgResult} width="200px" />}
        <div className={styles.result}>{result}</div>
        <form onSubmit={onSubmitButton} className={styles.buttonbox}>
          {result && !leftButton && !rightButton && !leftTwoButton && !rightTwoButton && <h3>Game Over</h3>}
          {imgResult !== 'https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e471pwmo03hyhg4v6pv4fg8a0pcfrucr5ob7oudbhgw&rid=giphy.gif&ct=g' && result && leftButton && (
            <input
              className={styles.button}
              type="submit"
              name="prompty"
              value={leftButton}
              onClick={(e) => setUserInput(e.target.value)}
            />
          )}
          {imgResult !== 'https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e471pwmo03hyhg4v6pv4fg8a0pcfrucr5ob7oudbhgw&rid=giphy.gif&ct=g' && result && rightButton && (
            <input
              className={styles.button}
              type="submit"
              name="prompty"
              value={rightButton}
              onClick={(e) => setUserInput(e.target.value)}
            />
          )}
          {imgResult !== 'https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e471pwmo03hyhg4v6pv4fg8a0pcfrucr5ob7oudbhgw&rid=giphy.gif&ct=g' && result && leftTwoButton && (
            <input
              className={styles.button}
              type="submit"
              name="prompty"
              value={leftTwoButton}
              onClick={(e) => setUserInput(e.target.value)}
            />
          )}
          {imgResult !== 'https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e471pwmo03hyhg4v6pv4fg8a0pcfrucr5ob7oudbhgw&rid=giphy.gif&ct=g' && result && rightTwoButton && (
            <input
              className={styles.button}
              type="submit"
              name="prompty"
              value={rightTwoButton}
              onClick={(e) => setUserInput(e.target.value)}
            />
          )}
        </form>
      </main>
    </div>
  );
}
