# Deploy wordpress with command line
## A.Step by step
1. pull image bitnami/wordpress:<br />
```
$ docker pull bitnami/wordpress:latest
```

2. Create a network:<br />
```
$ docker network create wordpress-network
```

3. Create a volume for MariaDB persistence and create a MariaDB container:<br />
```
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
4. Create volumes for WordPress persistence and launch the container:<br />
```
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
![](https://raw.githubusercontent.com/toanduc0671/week1-vietteldigitaltalent/main/image/Createvolumesfor%20WordPress.png)


##
5. access at http://your-ip:8080<br />
## B.result 1
![](https://raw.githubusercontent.com/toanduc0671/week1-vietteldigitaltalent/main/image/result1.png)
