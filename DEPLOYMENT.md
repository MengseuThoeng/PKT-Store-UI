# 🚀 PKT Store - Docker Deployment Guide

Complete guide for deploying PKT Store on your own server using Docker.

## 📋 Prerequisites

- Ubuntu/Debian server (or any Linux distribution)
- Docker installed
- Docker Compose installed
- Domain name pointed to your server
- Port 3000 available (or configure different port)

## 🔧 Installation Steps

### 1. Install Docker (if not installed)

```bash
# Update package list
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2. Clone Your Repository

```bash
cd /opt
sudo git clone https://github.com/MengseuThoeng/PKT-Store-UI.git pkt-store
cd pkt-store
sudo chown -R $USER:$USER .
```

### 3. Run Setup Script

```bash
# Make script executable
chmod +x setup-env.sh

# Run setup (it will ask you for all environment variables)
./setup-env.sh
```

The script will prompt you for:
- Telegram Bot credentials
- Supabase credentials
- Email configuration
- JWT secret
- **Your domain name**
- Bakong KHQR credentials

### 4. Build and Run

If you didn't auto-build in step 3:

```bash
# Build the Docker image
docker-compose build

# Start the container
docker-compose up -d
```

### 5. Verify It's Running

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Test the application
curl http://localhost:3000
```

## 🌐 Configure Nginx (Recommended)

For production with SSL, use Nginx as reverse proxy:

```bash
# Install Nginx
sudo apt install nginx certbot python3-certbot-nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/pkt-store
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and get SSL:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pkt-store /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 📊 Useful Commands

### Container Management

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f pkt-store
```

### Updates and Rebuilds

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Health Check

```bash
# Check container health
docker-compose ps

# Check resource usage
docker stats

# Enter container shell
docker-compose exec pkt-store sh
```

## 🔒 Security Recommendations

1. **Firewall Configuration**
```bash
# Allow SSH
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

2. **Keep System Updated**
```bash
sudo apt update && sudo apt upgrade -y
```

3. **Regular Backups**
```bash
# Backup .env.production
cp .env.production .env.production.backup

# Backup database (if using local DB)
```

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -h
```

### Port already in use
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Change port in docker-compose.yml
# Change "3000:3000" to "8080:3000"
```

### Bakong API not working
```bash
# Check if Bakong API is accessible
curl -X POST https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"md5":"test"}'
```

## 📝 Environment Variables

If you need to update environment variables:

```bash
# Edit .env.production
nano .env.production

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## 🔄 Auto-restart on Boot

Docker containers are configured with `restart: unless-stopped` which means they will automatically restart if the server reboots.

## 📞 Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables in `.env.production`
3. Ensure domain DNS is pointing to server IP
4. Check firewall rules

## ✅ Success Checklist

- [ ] Docker and Docker Compose installed
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] Container built and running
- [ ] Nginx configured (if using)
- [ ] SSL certificate installed (if using)
- [ ] Domain pointing to server
- [ ] Bakong API accessible from server
- [ ] Test payment completed successfully

---

**Your PKT Store should now be running on your own server! 🎉**

Access it at: https://your-domain.com
