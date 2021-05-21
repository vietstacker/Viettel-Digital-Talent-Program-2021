# WordPress with Docker Compose!
**Step 1: Installing Docker Compose**  
1. Temporarily switch to your root account  
```sudo -i```  
2. Use the install script below to download and apply the docker-compose packet  
```curl -L https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose```  
3. Set the execution permissions to it with  
```chmod +x /usr/local/bin/docker-compose```  

**Step 2: Configuring WordPress with Compose**
1. Setting up containers with Docker Compose works by creating a Dockerfile and docker-compose.yml in the desired working directory. Start off by creating your working directory, e.g. wordpress-compose.  
```mkdir  ~/wordpress-compose && cd ~/wordpress-compose```  
2. Create a docker-compose.yml file. This will tell docker how to configure and start the WordPress and MariaDB containers.
```nano docker-compose.yml```  
3. Copy the example underneath and set the parameters in the file. Replace the database password and public_ip with values appropriate to your cloud server. Make sure the password is the same for both environment variables so that WordPress will be able to access the database.  
```version: '3'

services:
  # Database
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
    networks:
      - wpsite
  # phpmyadmin
  phpmyadmin:
    depends_on:
      - db
    image: phpmyadmin/phpmyadmin
    restart: always
    ports:
      - '8080:80'
    environment:
      PMA_HOST: db
      MYSQL_ROOT_PASSWORD: password 
    networks:
      - wpsite
  # Wordpress
  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - '8000:80'
    restart: always
    volumes: ['./:/var/www/html']
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
    networks:
      - wpsite
networks:
  wpsite:
volumes:
  db_data: 
 ```
 4. ```docker-compose up -d```  
 5. You can then open the public IP or domain of your WordPress server in your web browser to test the installation. You should be redirected to the WordPress initial setup page like the image shown below.  
 ![image](https://user-images.githubusercontent.com/46991949/117460539-d20cfb80-af76-11eb-89a0-efa2e5d721f6.png)

   
 
     

