# Pratice 3 - Run In Two Virtual Machines

##### Step 1: Set up machine1, machine2 in the same virtual network
> machine1 will run WordPress has ip ```192.168.5.2``` \
> machine2 will run MariaDb has ip ```192.168.5.10``` 

Install Success when machine1 can ping to machine2
```console
ping 192.168.5.10
```








##### Step 2: Run MariaDb on machine 2
Run MariaDb on network ```host``` auto mapping port to machine 2
```console
$ docker volume create --name mariadb_data
$ docker run -d --name mariadb \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network host \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest

```
#### Step 3: Run WordPress on machine 1
Run WordPress on network ```host``` auto mapping port to machine 1
```console 
$ docker volume create --name wordpress_data
$ docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_PASSWORD=bitnami \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --network host \
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest
```

#### Step 4: Connect MariaDb
Default image WordPress use `mariadb` is hostname  => Add hostname to /etc/hosts on container run WordPress 
```console
$ docker exec -it -u root wordpress bash
$ echo "192.168.5.10 mariadb mariadb" >> /etc/hosts 
```
---
**NOTE**

192.168.5.10 is ipaddress machine2 (mariadb is running on machine2) 

You can go *http://localhost:port/wp-login.php* to become admin web

Access to container run mariadb to change password admin
```console
mysql -u root -p bitnami_wordpress -e "UPDATE wp_users SET user_pass=MD5('root') WHERE ID=1;"
```
then user/password is ``` user/root ```

---


# Result
Go to *http://localhost:8080* or *https://localhost:8443* to test
![image](https://user-images.githubusercontent.com/43313369/117471139-be1ac700-af81-11eb-8c5a-e98b8d000162.png)

