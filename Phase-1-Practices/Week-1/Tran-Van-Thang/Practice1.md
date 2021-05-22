# Pratice 1 - Using the Docker Command Line


##### Step 1: Create a network
``` $ docker network create wordpress-network  ```

> MariaDb and Wordpress will run same network 



##### Step 2: Create a volume for MariaDB persistence and create a MariaDB container

Create volume for MariaDb
```console
$ docker volume create --name mariadb_data
```
Run MariaDb in network [wordpress-network][dill] 
```console
$ docker run -d --name mariadb \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network wordpress-network \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
```
#### Step 3: Create volumes for WordPress persistence and launch the container
Create volume for WordPress
```console 
$ docker volume create --name wordpress_data 
```
Run WordPress in network [wordpress-network][dill] 
```console
$ docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_PASSWORD=bitnami \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --network wordpress-network \
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest
```

# Result
Go to *http://localhost:8080* or *https://localhost:8443* to test
![image](https://user-images.githubusercontent.com/43313369/117467889-50b96700-af7e-11eb-98ae-98468c31f484.png)
