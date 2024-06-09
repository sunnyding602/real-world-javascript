import mongoose from 'mongoose'
import express from 'express'
import User from './models/user.js'
import Tweet from './models/tweet.js'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import bodyParser from 'body-parser'


const app = express()
app.use(cors())
app.use(bodyParser.json())
const url = 'mongodb+srv://runxi:Jxiz2gPe0gAq0LUr@cluster0.stndwtf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const MY_SECRET_KEY = "secret"

async function main() {
    await mongoose.connect(url).then(() => console.log('Database Connected!'))

    app.post("/auth/token", async (req, res) => {
        const { username, password } = req.body
        const user = await User
            .findOne({ username, password })
            .exec()
        if (!user) {
            res.status(401).send("Invalid username or password")
            return
        }
        console.log(user._id);
        const token = jwt.sign({ userId: user._id, username}, MY_SECRET_KEY, { expiresIn: '1h' })
        res.send({ token })
    })

    function verifyToken(req, res, next) {
        const token = req.headers.authorization
        try {
            const decoded = jwt.verify(token, MY_SECRET_KEY)
            req.userId = decoded.userId
            next()
        } catch (error) {
            res.status(401).send("Invalid token")
        }
    }
    // create a new tweet
    app.post('/tweets', verifyToken, async (req, res) => {
        const { content } = req.body
        const tweet = new Tweet({ content, userId: req.userId })
        await tweet.save()
        res.send(tweet.populate('userId'))
    })

    // edit a tweet
    app.put('/tweets/:id', verifyToken, async (req, res) => {
        const tweetId = req.params.id
        const { content } = req.body
        const tweet = await Tweet.findOne({ _id: tweetId })
        if (tweet.userId != req.userId) {
            res.status(401).send("You are not authorized to edit this tweet")
            return
        }
        tweet.content = content
        await tweet.save()
        tweet.populate('userId')
        res.send(tweet)
    })

    // delete a tweet
    app.delete('/tweets/:id', verifyToken, async (req, res) => {
        const tweetId = req.params.id
        await Tweet.deleteOne({ _id: tweetId, userId: req.userId })
        res.send("Tweet deleted")
    })

    // get a user's all followers
    app.get('/users/followers', verifyToken, async (req, res) => {
        const user = await User.findOne({ _id: req.userId }).populate('followers')
        res.send(user.followers)
    })
    
    
    // get tweets of a user's following users
    app.get('/tweets/following', verifyToken, async (req, res) => {
        const user = await User.findOne({ _id: req.userId });
        user.following.push(req.userId)
        const tweets = await Tweet.find({ userId: user.following }).populate('userId')
        res.send(tweets)
    })

    app.get('/users', verifyToken, async (req, res) => {
        const allUsers = await User.find()
        res.send(allUsers)
    })

    // create a user
    app.post('/users', async (req, res) => {
        const { username, password } = req.body
        const user = new User({ username, password })
        try {
            await user.save()
            res.send(user)
        } catch (error) {
            res.status(400).send("Username already exists")
        }
    })

    app.get('/users/:id', async (req, res) => {
        const userId = req.params.id
        const user = await User.findOne({ _id: userId })
        res.send(user)
    })
    
    app.listen(3000, () => console.log('Server listening on port 3000 : http://localhost:3000'))
}

main()
