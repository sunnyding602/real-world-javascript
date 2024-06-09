import React from "react";
import { useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Tweet(props) {
    const { addTweet } = props;
    const [tweetText, setTweetText] = useState("");
    const cookies = new Cookies()
    const userId = jwtDecode(cookies.get('token')).userId;
    const username = jwtDecode(cookies.get('token')).username;

    const handleInputChange = (event) => {
        setTweetText(event.target.value);
    }

    const handleTweetSubmit = () => {
        fetch("http://localhost:3000/tweets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": cookies.get('token')
            },
            body: JSON.stringify({
                content: tweetText
            })
        });
        addTweet({ content: tweetText, userId :{ _id: userId, username }});
        setTweetText("");
    }
    return (
            <div>
                <textarea value={tweetText}  onChange={(e) => handleInputChange(e)}/>
                <button onClick={(e) => handleTweetSubmit(e)}>Publish</button>
            </div>
        );
};