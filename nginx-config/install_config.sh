sudo apt install nginx -y
rm /etc/nginx/sites-available/default
cp nginx-config/webserver_config /etc/nginx/sites-available/default
sudo systemctl restart nginx