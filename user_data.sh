#!/bin/bash

# Get node
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt-get install nodejs

# Install packages
apt-get update
apt-get install nodejs nginx build-essential

# Get repo and install packages
git clone https://github.com/maxim-kht/cloud-web-server.git
cd cloud-web-server
npm install

# Install PM2 and start app on the background
npm install -g pm2
pm2 start app.js
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Add Nginx config
cat > /etc/nginx/sites-available/default <<EOL
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
sudo service nginx restart
