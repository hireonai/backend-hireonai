# Deployment Guide for HireOnAI Backend

This guide explains how to deploy the HireOnAI backend to Google Cloud Run using GitHub Actions CI/CD.

## Prerequisites

1. A GitHub account with access to this repository
2. A Google Cloud Platform account
3. Basic knowledge of GitHub and GCP

## Initial Setup

### 1. Google Cloud Setup

1. Create a new Google Cloud Project or use an existing one
2. Enable the following APIs:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API
   - Secret Manager API (if using Secret Manager)
3. Create a service account with permissions as detailed in the `github-secrets-setup.md` file
4. Generate and download a JSON key for this service account

### 2. GitHub Secrets Setup

Follow the instructions in `github-secrets-setup.md` to set up all required GitHub Secrets for the CI/CD workflow.

## Deployment Process

### Automatic Deployment

The CI/CD pipeline is configured to automatically deploy to Google Cloud Run when changes are pushed to the `main` branch. This process:

1. Builds a Docker image using the optimized `Dockerfile.cloudrun`
2. Pushes the image to Google Container Registry
3. Deploys the image to Cloud Run with all environment variables

### Manual Deployment

You can also trigger a deployment manually:

1. Go to the "Actions" tab in your GitHub repository
2. Select the "Deploy to Cloud Run" workflow
3. Click "Run workflow"
4. Select the branch to deploy from (default: `main`)
5. Click "Run workflow" again

## Verifying Deployment

After deployment:

1. The GitHub Action will output the Cloud Run service URL
2. You can access the API documentation at `https://[your-cloud-run-url]/docs`
3. Check the Cloud Run console in GCP to see your deployed service

## Troubleshooting

If deployment fails:

1. Check the GitHub Actions logs for error messages
2. Verify that all required GitHub Secrets are set correctly
3. Check the Google Cloud Build logs for Docker build issues
4. Verify your service account has all necessary permissions

## Best Practices

- Never store sensitive information in the code or commit `.env` files
- Rotate credentials periodically
- Test changes in a development environment before merging to main
- Consider setting up staging and production environments with separate workflows

## Rollback

If you need to roll back to a previous version:

1. Go to the Google Cloud Console
2. Navigate to Cloud Run
3. Select your service
4. Click "REVISIONS"
5. Find the revision you want to roll back to
6. Click "DEPLOY NEW REVISION"
7. Select "Deploy revision from a previous revision"
8. Choose the revision and click "DEPLOY" 