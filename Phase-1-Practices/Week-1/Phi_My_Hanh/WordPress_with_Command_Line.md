# WordPress with Command Line!
Hello everyone, here are the steps for me to run the WordPress manually instead of using docker-comp. Hope you can contribute to guide my way, I can complete better.

**Step 1: Install Docker**
1. First, download and add the GPG key with the following command:  
```$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -```
2. Add the Docker repository with the following command:  
```$ add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"```
3. Once the repository is added, you can install the Docker and Docker Compose using the following command:  
```$ apt-get install docker-ce docker-ce-cli containerd.io  -y```
4. After installing both packages, check the installed version of Docker with the following command:  
```$ docker --version```

**Step 2: Create a MariaDB Containerr**
1. download the WordPress image from the Docker repository using the following command:  
```# docker pull mariadb```  

Output:
```root@myhanh:~# docker pull mariadb
Using default tag: latest
latest: Pulling from library/mariadb
345e3491a907: Pull complete
57671312ef6f: Pull complete
5e9250ddb7d0: Pull complete
2d512e2ff778: Pull complete
57c1a7dc2af9: Pull complete
5f1da40ab8a2: Pull complete
5d5cfc668726: Pull complete
deb86f297614: Pull complete
6861f77e80d5: Pull complete
81a5dea1514d: Pull complete
e3b5cf124c10: Pull complete
3352c2c9d21c: Pull complete
Digest: sha256:36288c675a192bd0a8a99cd6ba0780e31df85f0bfd0cbb204837cd108be3d236
Status: Downloaded newer image for mariadb:latest
docker.io/library/mariadb:latest
```
2. create a directory structure for WordPress on your server:
```mkdir ~/wordpress
mkdir -p ~/wordpress/database
mkdir -p ~/wordpress/html
```
3. create a MariaDB container with name wordpressdb by running the following command  
```docker run -e MYSQL_ROOT_PASSWORD=root-password -e MYSQL_USER=wpuser -e MYSQL_PASSWORD=password -e MYSQL_DATABASE=wpdb -v /root/wordpress/database:/var/lib/mysql --name wordpressdb -d mariadb```
Output  
```e8c780b34cdcb66db9278635b109debb1775d6a6b6785c4e74c8e0815e3ba5e3```  
4. check the IP address of MariaDB container with the following command  
```docker inspect -f '{{ .NetworkSettings.IPAddress }}' wordpressdb```  
Output  
```172.17.0.2```
5. connect to your MariaDB container using the database user and password      
```
mysql -u wpuser -h 172.17.0.2 -p
Enter password:
```
Output:  
```
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 3
Server version: 10.5.9-MariaDB-1:10.5.9+maria~focal mariadb.org binary distribution
Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```
```> show databases;```  
Output  
```+--------------------+
| Database           |
+--------------------+
| information_schema |
| wpdb               |
+--------------------+
2 rows in set (0.00 sec)
```
```exit;```  
**Step 3: Create a WordPress Container**
1. download the WordPress image from the Docker repository using the following command:
```docker pull wordpress:latest```
Output
```latest: Pulling from library/wordpress
f7ec5a41d630: Pull complete
941223b59841: Pull complete
a5f2415e5a0c: Pull complete
b9844b87f0e3: Pull complete
5a07de50525b: Pull complete
caeca1337a66: Pull complete
5dbe0d7f8481: Pull complete
b5287b60e185: Pull complete
a3bdca77fbaf: Pull complete
e3edcade6aa2: Pull complete
703ba034e6f0: Pull complete
36ef47972442: Pull complete
4acb239a9263: Pull complete
e74d610ba693: Pull complete
97f505d02f6f: Pull complete
d6dd6701aaec: Pull complete
43ef3ceb4f4b: Pull complete
a59b940a007f: Pull complete
714359ef8f41: Pull complete
24b7e9a8c62d: Pull complete
b400ea29ad59: Pull complete
Digest: sha256:208def35d7fcbbfd76df18997ce6cd5a5221c0256221b7fdaba41c575882d4f0
Status: Downloaded newer image for wordpress:latest
docker.io/library/wordpress:latest
```
2. create a new WordPress container named wpcontainer from the downloaded image using the following command  
```docker run -e WORDPRESS_DB_USER=wpuser -e WORDPRESS_DB_PASSWORD=password -e WORDPRESS_DB_NAME=wpdb -p 8081:80 -v /root/wordpress/html:/var/www/html --link wordpressdb:mysql --name wpcontainer -d wordpress```
3. verify your WordPress container with the following command  
```curl -I localhost:8081```  
Output    
```HTTP/1.1 302 Found
Date: Fri, 07 May 2021 10:31:36 GMT
Server: Apache/2.4.38 (Debian)
X-Powered-By: PHP/7.4.19
Expires: Wed, 11 Jan 1984 05:00:00 GMT
Cache-Control: no-cache, must-revalidate, max-age=0
X-Redirect-By: WordPress
Location: http://localhost:8081/wp-admin/install.php
Content-Type: text/html; charset=UTF-8
```
**Step 4: Configure Nginx as a Reverse Proxy**
1. install the Nginx web server with the following command  
```apt-get install nginx -y```
2. create a new Nginx virtual host configuration file  
```nano /etc/nginx/sites-available/wordpress```
3. Add the following lines
```server {
  listen 80;
  server_name wp.example.com;
  location / {
    proxy_pass http://localhost:8081;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```
4. Save and close the file, then activate the virtual host with the following command  
```ln -s /etc/nginx/sites-available/wordpress /etc/nginx/sites-enabled/```
5. Restart the Nginx service to apply the changes  
```systemctl restart nginx```

**Step 5: Access WordPress Interface**
Open your web browser and type the URL localhost:8081(Or: ip_ubuntuServer:8081). You will be redirected to the WordPress installation wizard
![image](https://user-images.githubusercontent.com/46991949/117438667-0cb56a80-af5c-11eb-97b7-dcfb4bbb0132.png)  
![image](https://user-images.githubusercontent.com/46991949/117439625-4470e200-af5d-11eb-8631-74706ffc64ff.png)  
![image](https://user-images.githubusercontent.com/46991949/117439717-64a0a100-af5d-11eb-8d27-93d152b6d339.png)  
![image](https://user-images.githubusercontent.com/46991949/117440323-1dff7680-af5e-11eb-8d9a-22eef25009ec.png)




