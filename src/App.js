import Amplify, { API, Auth } from 'aws-amplify'
import "bootswatch/dist/minty/bootstrap.min.css";
import config from './aws-exports'
import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Club from './components/Club';
import {Route, Link} from "react-router-dom";
//easy

//daychanger
//delete current day's wordle data
//leave group
//change all squares to white/black
//faq/help
//permissions, only things involving own username, do this by adding userId to all posts or deletes in back end and maybe changing table to userid partition key

//medium

//restrict group access, delegate admins? delegate pending?

//hard

// multiple pages 

//do this, and app is fine to leave until desired

Amplify.configure(config);

function App() {
  const [number, setNumber] = useState('')
  const [data, setData] = useState([])
  const [score, setScore] = useState('')
  const [username, setUsername] = useState('')
  const [targetClub, setTargetClub] = useState('')
  const joinedClubs = [];
  const sharedClubUsers = [];
  // const [wordle, setWordle] = useState([])

  // const { attributes } = await Auth.currentAuthenticatedUser();
  // need to get user id, search database for /wordles/object/userid/number, with a payload of userid and number. get number from all that date shit above

  useEffect(() => {
    const onStart = async () => {
        // try {
        // const currentSpan = document.getElementById('underFriends');
        // const outerFriends = document.getElementById('outerFriends');
        // console.log(currentSpan);
        // var newWordleSpan = document.createElement("div"); 
        // var newWordleContent = document.createTextNode("test");
        // newWordleSpan.appendChild(newWordleContent);
        // outerFriends.insertBefore(newWordleSpan, currentSpan);
        // } catch (error) {
        //   console.log(error)
        // }





      const attributes = await Auth.currentAuthenticatedUser();
      setUsername(attributes.username);
      sharedClubUsers[0] = attributes.username;
      var date2 = new Date('6/20/2021');
      var date1 = new Date();
      var difference = date1.getTime() - date2.getTime();
      var days = Math.ceil(difference / (1000 * 3600 * 24));
      await API.get("trackleapi", "/wordles/" + attributes.username + "/" + days)
      .then(response => {
        // console.log(response);
        const wordleToday = response['0'];
        // console.log(wordleToday);
        // console.log(Object.keys(wordleToday).length);
        if (Object.keys(wordleToday).length > 0) {
          // document.getElementById("guess1").innerHTML = wordleToday.data[1];
          for (let i = 0; i < wordleToday['data'].length; i++) {
            // console.log("wordleToday " + i + ": " +  wordleToday.data[i]);
            document.getElementById("guess"+ i).innerHTML = wordleToday.data[i] + "\n";
            // document.getElementById("guess"+ i).style.display = "none";
          }
          document.getElementById("score").innerHTML = wordleToday.score;
          // console.log("wordleToday: " + wordleToday.score);
        }
      }).catch(error => {console.log(error.response);});
      await API.get("userclubsapi", "/userclubs/clubsfromuser/" + attributes.username)
      .then(response => {
        // console.log(response);
        for (let i = 0; i < Object.keys(response).length; i++) {
          if (!joinedClubs.includes(response[i]["club"])) {
            joinedClubs[joinedClubs.length] = response[i]["club"];
          }
        }
      }).catch(error => {console.log(error.response);});
      for (let i = 0; i < joinedClubs.length; i++) {
        await API.get("userclubsapi", "/userclubs/" + joinedClubs[i])
        .then(response => {
          // console.log("users sharing clubs",[response]);
          for (let jj = 0; jj < Object.keys(response).length; jj++) {
            if (!sharedClubUsers.includes(response[jj]["username"])) {
              sharedClubUsers[sharedClubUsers.length] = response[jj]["username"];
            }
          }
        }).catch(error => {console.log(error.response);});
      }

      console.log(["joinedClubs",joinedClubs])
      console.log(["sharedClubUsers",sharedClubUsers])

      for (let i = 1; i < sharedClubUsers.length; i++) {
        // const addedWordleElements = [];
        await API.get("trackleapi", "/wordles/" + sharedClubUsers[i] + "/" + days)
          .then(response => {console.log(["friend wordle",response]);
            var currentWordle = response['0'];
            var newWordleContent;
            var newWordleSpan;
            const parent = document.getElementById('outerFriends');
            const currentSpan = document.getElementById("underFriends");
            if (Object.keys(currentWordle).length > 0) {
              // document.getElementById("guess1").innerHTML = wordleToday.data[1];
              // addedWordleElements[i-1] = [];
              newWordleSpan = document.createElement("div"); 
              newWordleContent = document.createTextNode(currentWordle.username);
              newWordleSpan.appendChild(newWordleContent);
              parent.insertBefore(newWordleSpan, currentSpan);
              for (let jj = 0; jj < currentWordle['data'].length; jj++) {
                newWordleSpan = document.createElement("div"); 
                newWordleContent = document.createTextNode(currentWordle.data[jj]);
                console.log(["currentWordle['data'].length",currentWordle['data'].length]);
                console.log(["wordle data line",currentWordle.data[jj]]);
                newWordleSpan.appendChild(newWordleContent);
                console.log(newWordleSpan);
                console.log(currentSpan);
                parent.insertBefore(newWordleSpan, currentSpan);
                console.log("test2");
              }
              console.log(["wordle score",currentWordle.score]);
              newWordleSpan = document.createElement("div"); 
              newWordleContent = document.createTextNode(currentWordle.score);
              newWordleSpan.appendChild(newWordleContent);
              parent.insertBefore(newWordleSpan, currentSpan);
            }
          }).catch(error => {console.log(error.response);});
      }
    }
    onStart();
  },[]);

  const handleWordleSubmit = e => {
    e.preventDefault()

    var postRequest = {
      body: {
        number: number,
        data: data,
        score: score,
        username: username
      }
    };
    console.log(postRequest);

    API.post('trackleapi', '/wordles', postRequest).catch(error => {
      console.log(error.response);
    });
    window.location.reload();
  };

  const handleWordleChange = e => {
    var stringData = e.target.value.replace(/\n/g, " ");
    var rawData = stringData.split(" ");
    setNumber(parseInt(rawData[1]));
    setScore(rawData[2]);
    setData(rawData.slice(4));
  }

  const handleClubSubmit = e => {
    e.preventDefault()

    var postRequest = {
      body: {
        club: targetClub,
        username: username
      }
    };
    console.log(postRequest);

    API.post('userclubsapi', '/userclubs', postRequest)
    .then(response => {
      console.log("club post",[response]);
    }).then(response => {
      window.location.reload();
    }).catch(error => {
      console.log(error.response);
    });
  };

  const handleClubChange = e => {
    setTargetClub(e.target.value);
    console.log(e.target.value);
  }
  
  return (
    <div className="App">
      <Authenticator>
      <Header />
      {/* <Route exact path="/" component={App}/> */}
      {/* <Route exact path="/club" component={Club}/> */}
      <header className="App-header">
        <br></br> <h1>Wordle</h1> <br></br>
        <div className="App">
          <div className='Guesses'>
            <pre> 
              <span id = 'guess0'></span>
              <span id = 'guess1'></span>
              <span id = 'guess2'></span>
              <span id = 'guess3'></span>
              <span id = 'guess4'></span>
              <span id = 'guess5'></span>
              <span id = 'score'></span>
            </pre>
          </div>

          <form onSubmit={handleWordleSubmit} id="wordleDataForm">
            <textarea className="form-control" placeholder="Paste the whole Wordle data that gets copied when you click the 'share' button" onChange={handleWordleChange}/>
          </form>
          <button className="btn btn-primary" form="wordleDataForm" type="submit"> Submit Wordle</button> 
          <br></br>
          <br></br>
        </div>
      </header>
      <main>
        <br></br>
        <h1>Friends</h1>
        <div id="outerFriends">
          <div id="underFriends"><br></br>End of Friend's Wordles</div>
        </div> <br></br>
        <form onSubmit={handleClubSubmit} id="clubDataForm">
          <textarea className="form-control" placeholder="Enter the name of the Group you want to join here" onChange={handleClubChange}/>
        </form>
        <button className="btn btn-primary" form="clubDataForm" type="submit"> Join a Group</button> 
      </main>
      </Authenticator>
    </div>
  );
}

export default withAuthenticator(App);
