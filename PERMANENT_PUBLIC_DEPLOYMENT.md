# Blueprint for Permanent Public Deployment (E-Commerce Style)

To run your platform **exactly like Amazon, Flipkart, or YouTube**, it must be hosted on public cloud infrastructure. This ensures:
1. **24/7 Availability**: The app stays online even if your laptop is turned off or closed.
2. **Fixed, Permanent URL**: Access via a standard domain name (e.g., `https://cureai-diagnostics.com`) that never changes.
3. **Global Multi-Device Access**: Accessible from any phone, laptop, or tablet on any mobile network/Wi-Fi globally.
4. **Production Security**: Standard HTTPS encryption for patient records and logins.

---

## Part 1: Production Cloud Architecture

To mimic Flipkart or Amazon, the architecture must transition from local processes to cloud-native services:

```
                  [ User Phone/Laptop/Tablet ]
                               │ (HTTPS / Fixed Domain)
                               ▼
                  [ Vercel / Netlify (Frontend) ]
                               │ (API Requests)
                               ▼
               [ Nginx Proxy / Render (Backend Gateway) ]
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
     [ Spring Boot App ]            [ Python ML Service ]
               │
               ▼
     [ MongoDB Atlas Cloud ]
```

### 1. Database: MongoDB Atlas (Free Tier)
For a multi-device setup, a local database on your laptop won't work once the services are in the cloud. You must host it on **MongoDB Atlas** (MongoDB's official managed cloud):
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2. Deploy a free **M0 Sandbox** cluster.
3. In Database Access, create a database user and password.
4. In Network Access, whitelist `0.0.0.0/0` (allows cloud services to connect securely).
5. Copy the connection string (looks like `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/hospital_management`).

### 2. Backend & ML Service: Render or Railway (Free/Cheap Tiers)
Cloud containers are ideal for running the Spring Boot backend and the Python Flask ML Service:
* **Render.com** or **Railway.app** are perfect beginner-friendly cloud app hosts.
* **ML Service Hosting**:
  - Link your GitHub repository to Render/Railway.
  - Create a new **Web Service** pointing to the `ml-service` directory.
  - Set the build command to `pip install -r requirements.txt` and start command to `python api/ml_api.py`.
  - Copy the generated fixed URL (e.g., `https://disease-prediction-ml.onrender.com`).
* **Spring Boot Backend Hosting**:
  - Create a new **Web Service** pointing to the `backend` directory.
  - Add Environment Variables:
    - `SPRING_DATA_MONGODB_URI` = Your MongoDB Atlas Connection String
    - `ML_SERVICE_URL` = Your Render ML Service URL (from above step)
  - Copy the generated fixed URL (e.g., `https://hospital-management-api.onrender.com`).

### 3. Frontend: Vercel or Netlify (100% Free)
The React CureAI UI is static, making it perfect for hosting on **Vercel** or **Netlify** (which are incredibly fast and globally distributed, just like Amazon's CDN):
1. Sign up on [Vercel.com](https://vercel.com) using your GitHub account.
2. Import your repository, select the `frontend/hospital-management` directory as the root folder.
3. Under Environment Variables, add:
   - `REACT_APP_API_URL` = Your Render Spring Boot Backend URL
4. Click **Deploy**. Vercel will give you a permanent, free fixed subdomain ending in `.vercel.app` (e.g., `https://cureai-hospital.vercel.app`).

---

## Part 2: Custom Domains (The "Amazon/Flipkart" URL)

To have a custom domain name without the `.vercel.app` or `.onrender.com` endings:
1. Buy a domain name from a registrar (e.g., GoDaddy, Namecheap, Hostinger) for as low as $1 to $5.
2. In your Vercel Dashboard, go to **Settings > Domains** and add your custom domain (e.g., `cureai-diagnostics.com`).
3. Vercel will give you the DNS records (A record and CNAME record) to copy.
4. Paste these records into your domain registrar's DNS Management panel.
5. Vercel will automatically provision a **free SSL Certificate (HTTPS)**, giving you a secure lock icon next to your permanent URL!

---

## Part 3: Free Permanent Tunnel from Local Laptop (Alternative Option)

If you must run the server code **directly on your physical laptop** but want a **fixed public URL that does not change** and works globally, you can bypass localtunnel (which changes subdomains and can be slow) and use **Cloudflare Tunnels**:

### Step 1: Install Cloudflare Tunnel
1. Create a free account at [cloudflare.com](https://www.cloudflare.com).
2. Add your purchased custom domain (Cloudflare has a free plan that manages DNS).
3. Download the Cloudflare Tunnel daemon (`cloudflared`) on your laptop.

### Step 2: Create a Permanent Tunnel
Run the following commands to create a tunnel that routes your domain traffic straight to your local ports:
```bash
# 1. Login to Cloudflare
cloudflared tunnel login

# 2. Create the tunnel
cloudflared tunnel create hospital-tunnel

# 3. Route your domain to the tunnel
cloudflared tunnel route dns hospital-tunnel app.yourdomain.com
cloudflared tunnel route dns hospital-tunnel api.yourdomain.com
```

### Step 3: Configure Ingress Rules
Configure the tunnel to route `app.yourdomain.com` to your React frontend (port `3001`) and `api.yourdomain.com` to your Spring Boot backend (port `8080`). 

This creates a highly stable, **completely permanent connection** to your local laptop that is 100% free, fast, and does not require opening ports on your Wi-Fi router.
