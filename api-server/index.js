require('dotenv').config({
    path: '../.env'
})

const express = require('express')
const cors = require('cors')
const { generateSlug } = require('random-word-slugs')
const {
    ECSClient,
    RunTaskCommand
} = require('@aws-sdk/client-ecs')
const { Server } = require('socket.io')
const Redis = require('ioredis')

const app = express()
const PORT = 9001

app.use(cors())
app.use(express.json())

// --------------------
// Valkey
// --------------------

const subscriber = new Redis(process.env.VALKEY_URL)

subscriber.on('error', err => {
    console.error('Valkey error:', err.message)
})

// --------------------
// Socket.IO
// --------------------

const io = new Server({
    cors: {
        origin: '*'
    }
})

io.on('connection', socket => {
    console.log('Socket connected:', socket.id)

    socket.on('subscribe', channel => {
        console.log(`Socket ${socket.id} subscribed to ${channel}`)

        socket.join(channel)

        socket.emit(
            'message',
            JSON.stringify({ log: `Joined ${channel}` })
        )
    })
})

io.listen(9002, () => {
    console.log('Socket Server 9002')
})

// --------------------
// AWS ECS
// --------------------

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

// --------------------
// Deploy project
// --------------------

app.post('/project', async (req, res) => {
    try {
        const { gitURL, slug } = req.body

        const projectSlug = slug || generateSlug()

        console.log('-------------------------')
        console.log('Deploy request')
        console.log('Git URL:', gitURL)
        console.log('Project:', projectSlug)
        console.log('-------------------------')

        const command = new RunTaskCommand({
            cluster: config.CLUSTER,
            taskDefinition: config.TASK,

            launchType: 'FARGATE',

            count: 1,

            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: 'ENABLED',

                    subnets: [
                        'subnet-03152a6dfeca9a14a',
                        'subnet-0057674947e4bc80d',
                        'subnet-093507d2f70cfb459'
                    ],

                    securityGroups: [
                        'sg-08566c65b3bf1983f'
                    ]
                }
            },

            overrides: {
                containerOverrides: [
                    {
                        name: 'builder',

                        environment: [
                            {
                                name: 'GIT_REPOSITORY_URL',
                                value: gitURL
                            },
                            {
                                name: 'PROJECT_ID',
                                value: projectSlug
                            }
                        ]
                    }
                ]
            }
        })

        const result = await ecsClient.send(command)

        console.log(
            'ECS task:',
            result.tasks?.[0]?.taskArn
        )

        return res.json({
            status: 'queued',

            data: {
                projectSlug,
                url: `http://${projectSlug}.localhost:8000`
            }
        })

    } catch (error) {

        console.error('Deployment failed:')
        console.error(error)

        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
})

// --------------------
// Valkey log subscriber
// --------------------

async function initRedisSubscribe() {
    console.log('Subscribing to logs:*')

    await subscriber.psubscribe('logs:*')

    subscriber.on(
        'pmessage',
        (pattern, channel, message) => {

            console.log(
                `Log received [${channel}]`
            )

            io.to(channel).emit(
                'message',
                message
            )
        }
    )
}

initRedisSubscribe()

// --------------------
// API
// --------------------

app.listen(PORT, () => {
    console.log(`API Server Running..${PORT}`)
})