require('dotenv').config({
    path: '../.env'
})

const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const Redis = require('ioredis')

const publisher = new Redis(process.env.VALKEY_URL)

publisher.on('error', err => {
    console.log('Valkey Client Error:', err)
})

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const PROJECT_ID = process.env.PROJECT_ID

async function publishLog(log) {
    await publisher.publish(
        `logs:${PROJECT_ID}`,
        JSON.stringify({ log })
    )
}

async function init() {
    console.log('Executing script.js')
    console.log('Connected to Valkey')

    await publishLog('Build Started...')

    const outDirPath = path.join(__dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', async function (data) {
        console.log(data.toString())
        await publishLog(data.toString())
    })

    p.stderr.on('data', async function (data) {
        console.log('Error', data.toString())
        await publishLog(`error: ${data.toString()}`)
    })

    p.on('close', async function (code) {
        if (code !== 0) {
            console.log(`Build Failed with exit code ${code}`)
            await publishLog(`Build Failed with exit code ${code}`)
            return
        }

        console.log('Build Complete')
        await publishLog('Build Complete')

        const distFolderPath = path.join(
            __dirname,
            'output',
            'dist'
        )

        if (!fs.existsSync(distFolderPath)) {
            console.log('Build Failed: dist folder not found')
            await publishLog('Build Failed: dist folder not found')
            return
        }

        const distFolderContents = fs.readdirSync(
            distFolderPath,
            { recursive: true }
        )

        await publishLog('Starting to upload')

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file)

            if (fs.lstatSync(filePath).isDirectory()) {
                continue
            }

            console.log('uploading', filePath)
            await publishLog(`uploading ${file}`)

            const command = new PutObjectCommand({
                Bucket: 'launchyard',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command)

            await publishLog(`uploaded ${file}`)
            console.log('uploaded', filePath)
        }

        await publishLog('Done')
        console.log('Done...')
    })

    p.on('error', async function (error) {
        console.error('Build process error:', error)
        await publishLog(`Build process error: ${error.message}`)
    })
}

init()