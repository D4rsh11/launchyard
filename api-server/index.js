require('dotenv').config({
    path: '../.env'
})
const express = require('express')
const cors = require('cors')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
const { Server } = require('socket.io')
const Redis = require('ioredis')

const app = express()
const PORT = 9100

const subscriber = new Redis(process.env.VALKEY_URL)

subscriber.on('error', err => {
    console.log('Valkey Client Error', err)
})

const io = new Server({
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

io.listen(9002, () => console.log('Socket Server 9002'))

const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const config = {
    CLUSTER: process.env.ECS_CLUSTER_ARN,
    TASK: process.env.ECS_TASK_DEFINITION
}
app.use(cors())
app.use(express.json())

app.post('/project', async (req, res) => {
    const { gitURL, slug, socketId } = req.body
    const projectSlug = slug ? slug : generateSlug()

    const socket = io.sockets.sockets.get(socketId)

    if (!socket) {
        return res.status(400).json({
            status: 'error',
            message: 'Socket connection not found'
        })
    }
    const logChannel = `logs:${projectSlug}`

    socket.join(logChannel)

    console.log(`Socket ${socketId} joined ${logChannel}`)

    // Spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['subnet-03152a6dfeca9a14a', 'subnet-0057674947e4bc80d', 'subnet-093507d2f70cfb459'],
                securityGroups: ['sg-08566c65b3bf1983f']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'builder-image',
                    environment: [
                        { name: 'GIT_REPOSITORY_URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    })

    await ecsClient.send(command);

    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } })

})

async function initValkeySubscribe() {
    console.log('Connecting to Valkey...')
    await subscriber.psubscribe('logs:*')
    console.log('Subscribed to logs....')
    subscriber.on('pmessage', (pattern, channel, message) => {
        console.log(`Log received from ${channel}:`, message)
        io.to(channel).emit('message', message)
    })
}

initValkeySubscribe()

app.listen(PORT, () => console.log(`API Server Running..${PORT}`))