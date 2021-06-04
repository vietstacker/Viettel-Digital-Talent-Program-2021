# Practice 1: Deploy WordPress with Command Line #
---
#### Step 1: Create a network

```console
$ docker network create wordpress-network
```

#### Step 2: Create a volume for MariaDB persistence and create a MariaDB container

```console
$ docker volume create --name mariadb_data
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

```console
$ docker volume create --name wordpress_data
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
 
#### Access application at http://localhost:8080

![Practice 1 (1)](https://user-images.githubusercontent.com/48465162/117472251-e6ef8c00-af82-11eb-8124-d192feaf86f3.png)
![Practice 1 (2)](https://user-images.githubusercontent.com/48465162/117472268-ea831300-af82-11eb-8c1c-37544b00b617.png)
