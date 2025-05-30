# Setting Up GitHub Secrets for CI/CD

This document explains how to set up GitHub Secrets for securely handling environment variables in your CI/CD pipeline.

## Why Use GitHub Secrets?

GitHub Secrets provide a secure way to store sensitive information like API keys, passwords, and other environment variables. These secrets are:
- Encrypted at rest
- Not visible in logs
- Not exposed in your repository

## Required Secrets for HireOnAI Backend

You need to set up the following secrets in your GitHub repository:

### Google Cloud Platform Secrets
- `GCP_PROJECT_ID`: Your Google Cloud Project ID
- `GCP_DEPLOY_SA_KEY`: The JSON key file content for a service account with permissions to deploy to Cloud Run. This account needs permissions for Cloud Run, Cloud Build, etc.
- `GCP_STORAGE_SA_KEY`: The JSON key file content for a service account with permissions to access Cloud Storage. This will be used to create the service account key file at `src/keys/gcs-service-account.json` during deployment, which the application uses to interact with Cloud Storage.

### Application Secrets
- `APP_NAME`: Application name (e.g., "HireOnAI")
- `FRONTEND_URL`: URL of the frontend application
- `ML_SERVICE_URL`: URL of the ML service
- `MONGODB_URI`: MongoDB connection URI
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: JWT expiration time
- `COOKIE_PASSWORD`: Password for cookie authentication

### OAuth Secrets
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `LINKEDIN_CLIENT_ID`: LinkedIn OAuth client ID
- `LINKEDIN_CLIENT_SECRET`: LinkedIn OAuth client secret
- `FACEBOOK_CLIENT_ID`: Facebook OAuth client ID
- `FACEBOOK_CLIENT_SECRET`: Facebook OAuth client secret

### Email Secrets
- `SMTP_USER`: SMTP user for sending emails
- `SMTP_PASS`: SMTP password

### Storage Secrets
- `GCP_BUCKET_NAME`: GCP storage bucket name

## How to Set Up GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" > "Actions"
4. Click on "New repository secret"
5. Enter the name of the secret (e.g., `MONGODB_URI`)
6. Enter the value of the secret
7. Click "Add secret"
8. Repeat steps 4-7 for each secret listed above

## Service Account Setup for GCP

### Deployment Service Account

To create a deployment service account key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "IAM & Admin" > "Service Accounts"
3. Create a new service account for deployment (e.g., "hireonai-deployment")
4. Give it the following roles:
   - Cloud Run Admin
   - Cloud Build Editor
   - Service Account User
   - Artifact Registry Writer
5. Create a new key for this service account (JSON format)
6. Copy the entire content of the downloaded JSON key file
7. Add it as a GitHub Secret named `GCP_DEPLOY_SA_KEY`

### Storage Service Account

To create a storage service account key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "IAM & Admin" > "Service Accounts"
3. Create a new service account for storage access (e.g., "hireonai-storage")
4. Give it the following roles:
   - Storage Object Admin (or a more restricted role if possible)
5. Create a new key for this service account (JSON format)
6. Copy the entire content of the downloaded JSON key file
7. Add it as a GitHub Secret named `GCP_STORAGE_SA_KEY`

## Important Security Notes

- Never commit your `.env` file to your repository
- Update your `.gitignore` file to exclude `.env` files
- Rotate your secrets periodically for enhanced security
- Use the principle of least privilege when assigning permissions to your service accounts 