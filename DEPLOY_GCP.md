# Deploying to Google Cloud Platform (GCP) VM

This guide covers two methods to deploy the Texas Hold'em Assistant on a GCP Compute Engine instance:
1.  **Docker (Recommended)**: Easiest for deployment and reproducibility.
2.  **Manual Setup**: Installing Node.js and running directly.

---

## Prerequisites

1.  A Google Cloud Project.
2.  A **Compute Engine VM instance** (e.g., e2-micro for testing) running **Debian** or **Ubuntu**.
3.  **Firewall Rule**: Allow HTTP traffic (port 80) or the custom port (e.g., 5173).
    *   Go to **VPC Network** > **Firewall**.
    *   Create a rule to allow `tcp:80` (for Docker/Nginx) or `tcp:5173` (for dev).
    *   Source ranges: `0.0.0.0/0`.

---

## Method 1: Docker (Recommended)

This method serves the optimized production build using Nginx on port 80.

### 1. SSH into your VM
Click the "SSH" button in the GCP Console or use your terminal.

### 2. Install Docker
Run the following commands on your VM:
```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker packages:
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow running docker without sudo (optional, requires re-login):
sudo usermod -aG docker $USER
```

### 3. Clone and Run
```bash
# Clone the repo
git clone https://github.com/eugeneyu/texas-holdem-assistant.git
cd texas-holdem-assistant

# Build the image
sudo docker build -t texas-holdem .

# Run the container (mapping port 80 of VM to port 80 of container)
sudo docker run -d -p 80:80 --name poker-app texas-holdem
```

### 4. Access the App
Open your browser and visit: `http://<YOUR_VM_EXTERNAL_IP>`

---

## Method 2: Manual Node.js Setup

Useful for development or quick testing.

### 1. SSH into your VM

### 2. Install Node.js
```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Activate NVM
source ~/.bashrc

# Install Node.js 18 (or latest)
nvm install 18
```

### 3. Clone and Install
```bash
git clone https://github.com/eugeneyu/texas-holdem-assistant.git
cd texas-holdem-assistant
npm install
```

### 4. Run the Application

#### Option A: Dev Mode (Port 5173)
```bash
# Ensure Firewall allows port 5173
npm run dev -- --host 0.0.0.0
```

#### Option B: Production Preview (Port 4173)
```bash
npm run build
npm run preview -- --host 0.0.0.0
```
Access at `http://<YOUR_VM_EXTERNAL_IP>:5173` (or 4173).
