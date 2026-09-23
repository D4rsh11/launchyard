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

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    // credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    // }
})

const PROJECT_ID = process.env.PROJECT_ID

function publishLog(log) {
    publisher.publish(
        `logs:${PROJECT_ID}`,
        JSON.stringify({ log })
    )
}

async function init() {
    console.log('Executing script.js')
    publishLog('Build Started...')

    const outDirPath = path.join(__dirname, 'output')

    console.log('Build directory:', outDirPath)

    // Build the cloned repository directly.
    // The repository does NOT have an output/frontend directory.
    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function (data) {
        console.log(data.toString())
        publishLog(data.toString())
    })

    p.stderr.on('data', function (data) {
        console.error(data.toString())
        publishLog(`error: ${data.toString()}`)
    })

    p.on('close', async function (code) {
        if (code !== 0) {
            console.log(`Build failed with exit code ${code}`)
            publishLog(`Build failed with exit code ${code}`)
            process.exitCode = code
            return
        }

        console.log('Build Complete')
        publishLog('Build Complete')

        const distFolderPath = path.join(outDirPath, 'dist')

        if (!fs.existsSync(distFolderPath)) {
            console.error('dist folder was not created')
            publishLog('dist folder was not created')
            process.exitCode = 1
            return
        }

        const distFolderContents = fs.readdirSync(
            distFolderPath,
            { recursive: true }
        )

        publishLog('Starting to upload')

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file)

            if (fs.lstatSync(filePath).isDirectory()) {
                continue
            }

            console.log('Uploading:', filePath)
            publishLog(`Uploading ${file}`)

            const command = new PutObjectCommand({
                Bucket: 'launchyard',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath) || 'application/octet-stream'
            })

            await s3Client.send(command)

            console.log('Uploaded:', filePath)
            publishLog(`Uploaded ${file}`)
        }

        publishLog('Done')
        console.log('Done...')
    })
}

init()