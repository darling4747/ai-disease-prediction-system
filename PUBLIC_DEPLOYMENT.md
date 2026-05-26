# Public Deployment Guide

Your app cannot work on other people's phones over the internet just by running it on `localhost` or by connecting to the same Wi-Fi. To make it work like Flipkart, you need to deploy it to a public server with a public URL, HTTPS, and a database that the server can reach.

## What This Project Needs

This project has four runtime parts:

- React frontend: the website users open on their phones.
- Spring Boot backend: the secure API used by the frontend.
- Python ML service: predicts diseases from symptoms.
- MongoDB: stores users, doctors, hospitals, predictions, and appointments.

For public use, users should open only the frontend URL, for example:

```text
https://your-health-app.com
```

The frontend should call:

```text
https://your-health-app.com/api/...
```

The nginx config forwards `/api/...` to the Spring Boot backend inside Docker. The backend then talks to MongoDB and the ML service privately.

## Recommended Deployment Option

Use a VPS or cloud VM first because this repo already has Docker support.

Good beginner-friendly options:

- Render
- Railway
- DigitalOcean Droplet
- AWS Lightsail
- Azure VM

On the server:

```bash
git clone <your-repo-url>
cd idp
docker compose up --build -d
```

Then point your domain to the server IP and put HTTPS in front of it using a reverse proxy such as Nginx, Caddy, or a platform-managed HTTPS proxy.

## Important Production Settings

Do these before sharing the app publicly:

- Do not use `localhost` in frontend API URLs.
- Do not use `http://backend:8080` as a browser URL. That name only works inside Docker.
- Keep MongoDB, backend, and ML service private when possible.
- Use HTTPS for login and JWT traffic.
- Replace default database usernames and passwords.
- Set real CORS origins instead of allowing every origin once you know your final domain.

## Frontend API Behavior

The frontend now works in two modes:

1. Same-domain deployment:

```text
https://your-health-app.com
https://your-health-app.com/api/auth/login
```

No `.env` value is required.

2. Separate frontend/backend domains:

```text
Frontend: https://your-health-app.com
Backend:  https://your-health-api.com
```

Create `frontend/hospital-management/.env` from `.env.example`:

```env
REACT_APP_API_URL=https://your-health-api.com
```

Then rebuild the frontend.

## Local Phone Testing

If you only want to test from a phone on the same Wi-Fi:

```bash
cd frontend/hospital-management
npm run start:lan
```

Open this on the phone:

```text
http://<your-laptop-ip>:3001
```

This is only local network testing. It will not work for people outside your Wi-Fi.

## Temporary Outside-Wi-Fi Testing

For a temporary public test from your laptop, keep MongoDB, the ML service, backend, and frontend running, then create a tunnel to the frontend port:

```bash
npx localtunnel --port 3001 --local-host 127.0.0.1 --subdomain hospital-management-idp
```

The tunnel prints a public URL such as:

```text
https://hospital-management-idp.loca.lt/login
```

Open the login page directly to avoid exposing backend or raw IP details. If the subdomain is already taken, change `hospital-management-idp` to another unique name and rerun the command.

Share that URL with a phone using mobile data to test outside your Wi-Fi. The URL works only while your laptop, the frontend, backend, ML service, MongoDB, and localtunnel process are running.

## Project Description For Your Report

The most suitable AI agent for this project is a Goal-Based Healthcare Assistant Agent. Its goal is to predict likely diseases from user symptoms and guide the user toward suitable healthcare actions. It collects symptom inputs, preprocesses them, sends them through machine learning models such as Random Forest, Logistic Regression, Naive Bayes, and SVM, and returns disease predictions with doctor and hospital recommendations. Unlike a simple rule-based system, the agent evaluates possible outcomes and selects a healthcare response based on prediction confidence and symptom patterns. This makes the system an intelligent healthcare decision-support platform rather than only a basic prediction model.
