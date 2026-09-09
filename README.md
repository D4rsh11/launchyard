# Launchyard

Launchyard is a container-based deployment platform that builds applications from Git repositories and serves the generated artifacts through project-specific URLs.

## Architecture

<p align="center">
  <img width="4328" height="2378" alt="launchyard" src="https://github.com/user-attachments/assets/44236744-1eef-45bc-bf15-07fa0131be9d" />
</p>



## How It Works

1. A Git repository URL is submitted through the frontend.
2. The API server creates a project ID and starts an ECS Fargate task.
3. The build server clones the repository inside the container.
4. Dependencies are installed and the project is built.
5. Build logs are published to Valkey and streamed to the frontend using Socket.IO.
6. The generated `dist` directory is uploaded to S3.
7. The reverse proxy maps the project ID to the corresponding S3 artifacts.
8. The deployed application is served through its project URL.

## Project Structure

```text
launchyard/
├── frontend/
├── api-server/
├── build-server/
└── s3-reverse-proxy/
```

## Running Locally

### Prerequisites

- Node.js
- npm
- Docker
- Git
- AWS account
- S3 bucket
- ECS Fargate configuration
- Valkey or Redis-compatible server

### Clone the Repository

```bash
git clone https://github.com/D4rsh11/launchyard.git
cd launchyard
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### API Server

```bash
cd api-server
npm install
node index.js
```

### Reverse Proxy

```bash
cd s3-reverse-proxy
npm install
node index.js
```

The build server is designed to run as an ECS Fargate task rather than as a normal local development server.

## Environment Variables

The API server and build server require AWS and Valkey configuration.

Example:

```env
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

ECS_CLUSTER_ARN=
ECS_TASK_DEFINITION=

VALKEY_URL=
```

## Build Requirements

The current build workflow expects the target repository to support:

```bash
npm install
npm run build
```

and produce its static output inside:

```text
dist/
```

## License

MIT License
