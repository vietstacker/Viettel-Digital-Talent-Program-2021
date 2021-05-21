# Practice 1

### Step 1: Create a network

```
$ docker network create wordpress-network
```

### Step 2: Create a volume for MariaDB persistence and create a MariaDB container

```
$ docker volume create --name mariadb_data
```
```
$ docker run -d --name mariadb \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network wordpress-network \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
  ```

  ```
$ docker volume create --name wordpress_data
```

```
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
![alt](https://user-images.githubusercontent.com/83031380/119077215-16d86e00-ba1e-11eb-97a6-4134ae6e50ad.png)

![alt](https://user-images.githubusercontent.com/83031380/119077249-2788e400-ba1e-11eb-8a71-2a9c5f9ff9be.png)

# Practice 2

```
$ curl -sSL https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml > docker-compose.yml
```
```
$ docker-compose up -d
```
![alt](https://user-images.githubusercontent.com/83031380/119077558-ad0c9400-ba1e-11eb-9296-52370fd42604.png)
![alt](https://user-images.githubusercontent.com/83031380/119077567-b269de80-ba1e-11eb-8933-49ef44bc268b.png)

# Practice 3

* vm1(192.168.56.106): deloy mariadb
* vm2(192.168.56.107): deploy wordpress

### Deploy Mariadb on vm1 

```
$ docker volume create --name mariadb_data
```

```
$ docker run -d --name mariadb \
  -p 3306:3306 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
```

### Deploy Wordpress on vm2

```
$ docker volume create --name wordpress_data
```
```
$ docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_PASSWORD=bitnami \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --env WORDPRESS_DATABASE_HOST=192.168.56.106 \
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest
```


![alt](https://user-images.githubusercontent.com/83031380/119080920-2dce8e80-ba25-11eb-8b53-3a4635cbfebf.png)