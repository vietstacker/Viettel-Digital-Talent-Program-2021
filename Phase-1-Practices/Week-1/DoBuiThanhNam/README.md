# WEEK 1: Get Bitnami Docker Image for Wordpress

## Setup Docker in VM

### Run the commands to set up Docker

```
  $ sudo apt-get remove docker docker.io docker-engine
  $ sudo apt install docker.io
  $ sudo usermod -aG docker ${USER}
  $ su - ${USER} 
  $ sudo systemctl start docker 
  $ sudo systemctl enable docker 
```

## Set up Docker Compose

```sh
  $ sudo apt install curl 
  $ sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	$ sudo chmod +x /usr/local/bin/docker-compose 
```

## Practice 1: Deploy Wordpress with command line 

### Step 1: Create network to connect with database <br />

`$ docker network create wordpress-network`

### Step 2: Run MariaDB  <br />

Create volume for mariadb <br />

`$ docker volume create --name mariadb_data`

Run , connect MariaDB with network
```sh
   $ docker run -d --name mariadb \
   --env ALLOW_EMPTY_PASSWORD=yes \
   --env MARIADB_USER=bn_wordpress \
   --env MARIADB_PASSWORD=bitnami \
   --env MARIADB_DATABASE=bitnami_wordpress \
   --network wordpress-network \
   --volume mariadb_data:/bitnami/mariadb \
   bitnami/mariadb:latest
``` 
### Step 3: Run Wordpress <br />

Create volume for Wordpress 

`$ docker volume create --name wordpress_data` 

Run, connect with network

```sh
   $docker run -d --name wordpress \
   -p 8080:8080 -p 8443:8443 \
   --env ALLOW_EMPTY_PASSWORD=yes \
   --env WORDPRESS_DATABASE_USER=bn_wordpress \
   --env WORDPRESS_DATABASE_PASSWORD=bitnami \
   --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
   --network wordpress-network \
   --volume wordpress_data:/bitnami/wordpress \
   bitnami/wordpress:latest
```

### Now access your application at  https://localhost:8443

### Result:

![HW1_6.png](https://raw.githubusercontent.com/dobuithanhnam/VDT2021/main/Week1/pic/HW1_6.png)
 
## Practice 2: Deploy Wordpress with Docker-compose

Run the commands:

```sh 
   $ curl -sSL https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml > docker-compose.yml
   $ docker-compose up -d
```

### Now access your application at https://localhost:8443 

### Result:

![HW2_2.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week1/pic/HW2_2.png?raw=true)

## Practice 3: Deploy WordPress with Command Line on two virtual machines

### On VM-1: 

Create volume for MariaDB

`$ docker volume create --name mariadb_data`

Run , connect MariaDB with network

```sh
    $ docker run -d --name mariadb \
    --env ALLOW_EMPTY_PASSWORD=yes \
    --env MARIADB_USER=bn_wordpress \
    --env MARIADB_PASSWORD=bitnami \
    --env MARIADB_DATABASE=bitnami_wordpress \
    --network wordpress-network \
    --volume mariadb_data:/bitnami/mariadb \
    bitnami/mariadb:latest
```
### On VM-2:

Create volume for Wordpress

`$ docker volume create --name wordpress_data`

Run, connect with network 

```sh
     $docker run -d --name wordpress \
    -p 8080:8080 -p 8443:8443 \
    --env ALLOW_EMPTY_PASSWORD=yes \
    --env WORDPRESS_DATABASE_USER=bn_wordpress \
    --env WORDPRESS_DATABASE_PASSWORD=bitnami \
    --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
    --network wordpress-network \
    --volume wordpress_data:/bitnami/wordpress \
    bitnami/wordpress:latest
```

### Result:

![HW3_1.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week1/pic/HW3_1.png?raw=true)
