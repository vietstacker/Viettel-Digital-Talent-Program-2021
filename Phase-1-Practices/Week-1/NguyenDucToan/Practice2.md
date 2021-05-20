# Deploy wordpress with docker-compose
## A. Step by step

1. install docker compose:
```
$ sudo apt install docker-compose
```

2. create docker-compose.yml
```
$ touch docker-compose.yml
```

```python
version: '2'
services:
  mariadb:
    image: docker.io/bitnami/mariadb:10.3
    volumes:
      - 'mariadb_data:/bitnami/mariadb'
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
      - MARIADB_USER=bn_wordpress
      - MARIADB_DATABASE=bitnami_wordpress
  wordpress:
    image: docker.io/bitnami/wordpress:5
    ports:
      - '80:8080'
      - '443:8443'
    volumes:
      - 'wordpress_data:/bitnami/wordpress'
    depends_on:
      - mariadb
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
      - WORDPRESS_DATABASE_HOST=mariadb
      - WORDPRESS_DATABASE_PORT_NUMBER=3306
      - WORDPRESS_DATABASE_USER=bn_wordpress
      - WORDPRESS_DATABASE_NAME=bitnami_wordpress
volumes:
  mariadb_data:
    driver: local
  wordpress_data:
    driver: local
```


![](https://raw.githubusercontent.com/toanduc0671/week1-vietteldigitaltalent/main/image/docker-compose.png)

3. run application:
```
$ docker-compose up -d
```

## B. result 2
![](https://raw.githubusercontent.com/toanduc0671/week1-vietteldigitaltalent/main/image/result2-1.png)

5. access at http://your-ip:80<br />

![](https://raw.githubusercontent.com/toanduc0671/week1-vietteldigitaltalent/main/image/result2-2.png)
