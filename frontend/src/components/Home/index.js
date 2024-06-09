import { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode'
import Tweet from './tweet.js';

export default function Home() {

    //get token from cookie
    const token = new Cookies().get('token');
    const navigate = useNavigate();
    const [tweets, setTweets] = useState([]);
    

    // fetch all following tweets
    const getTweets = async() => {
        const response = await fetch('http://localhost:3000/tweets/following', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        setTweets(await response.json());
    }

    const getMyTweets = async() => {
        const response = await fetch('http://localhost:3000/tweets', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        setTweets(await response.json());
    }

    const addTweet = (newTweet) => {
        setTweets(prevTweets => [...prevTweets, newTweet]);
    }

    const editTweet = async(tweetId) => {
        const newContent = prompt('Enter new content');
        await fetch(`http://localhost:3000/tweets/${tweetId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                content: newContent
            })
        });
        getTweets();
    }

    const deleteTweet = async(tweetId) => {
        await fetch(`http://localhost:3000/tweets/${tweetId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });
        getTweets();
    }

    useEffect(() => {
        //if token is not present, redirect to login page
        if (!token) {
            navigate('/login')
        } else {
            getTweets();
        }
    }, []);
    
    return (
        <div>
            <Tweet addTweet={addTweet} />
            <h1>For you:</h1>
            {tweets.map((tweet) => (
                <div key={tweet._id}>
                    <p>{tweet.content} - by <i>{tweet.userId.username}</i></p>
                    
                    {tweet.userId._id === jwtDecode(token).userId && (
                        <button onClick={() => editTweet(tweet._id)}>Edit</button>
                    )}
                    {tweet.userId._id === jwtDecode(token).userId && (
                        <button onClick={() => deleteTweet(tweet._id)}>Delete</button>
                    )}
                    
                </div>
            ))}
        </div>
    );
};
