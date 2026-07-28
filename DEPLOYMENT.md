# Deployment Guide for Microservices Retail Platform

This document provides instructions for deploying the Microservices Retail Platform to Render.

## Prerequisites

- A Render account (free tier available)
- Git repository containing the project code
- Node.js 20+ environment

## Deployment Steps

### 1. Prepare the Repository

Ensure your repository contains:
- The complete `apps/web` directory
- `render.yaml` configuration file
- `package.json` with correct dependencies

### 2. Connect to Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your Git repository

### 3. Configure the Web Service

Render will automatically detect the `render.yaml` file and use the following configuration:

```yaml
services:
  - type: web
    name: microservices-retail-platform
    env: docker
    plan: free
```

### 4. Environment Variables

The application uses in-memory demo data and doesn't require external environment variables for basic functionality. However, you can add the following if needed:

- `NODE_ENV`: Set to `production` (Render sets this automatically)
- `PORT`: Render sets this automatically (defaults to 10000)

### 5. Deploy

Click "Create Web Service" to start the deployment process. Render will build the Docker image using the Dockerfile at the repository root and start the container.

### 6. Access Your Application

Once deployment is complete, Render will provide a URL like:
`https://microservices-retail-platform.onrender.com`

## Manual Deployment (Alternative)

If you prefer manual configuration without `render.yaml`:

1. **Environment**: Docker
2. **Branch**: `main` or `master`

## Troubleshooting

### Build Failures

- Ensure `pnpm-lock.yaml` is committed to the repository
- Check that all dependencies in `package.json` are correct
- Verify Node.js version compatibility

### Runtime Errors

- Check Render logs for any error messages
- Ensure the build completed successfully
- Verify the start command is correct

### Performance Considerations

The free tier on Render has limitations:
- CPU and memory constraints
- Spin-up time for cold starts
- No custom domains on free tier

For production use, consider upgrading to a paid plan.

## Monitoring

Render provides built-in monitoring:
- **Logs**: View real-time and historical logs
- **Metrics**: CPU, memory, and response time metrics
- **Alerts**: Configure alerts for uptime and performance

## Scaling

To scale the application:
1. Go to your web service settings
2. Adjust the number of instances
3. Upgrade to a paid plan for better performance

## Security Notes

- The current implementation uses demo authentication tokens
- For production, implement proper JWT validation
- Add environment variables for sensitive data
- Enable HTTPS (Render provides this by default)

## Continuous Deployment

Render automatically deploys when you push to the connected branch. To control this:
- Use specific branches for production
- Configure deploy hooks if needed
- Set up manual deploy approvals in settings

## Support

For Render-specific issues:
- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)
