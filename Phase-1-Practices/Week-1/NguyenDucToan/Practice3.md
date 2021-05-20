# Deploy wordpress on two VM 

1. setup 2 ubuntu virtual machine with docker
machine 1's ipadd: 192.168.1.4
machine 2's ipadd: 192.168.1.11  

2. Enable port and check
```
$ sudo ufw enable

$ sudo ufw allow 8080

$ sudo ufw allow 22 
```

note: enable port 22 to ssh from my windows host machine

```
$ sudo ufw status
```
![](https://raw.githubusercontent.com/toanduc0671/week1-vietteldigitaltalent/main/image/enableport.png)

3. on machine 1 (192.168.1.4):
create volume for container mariadb and run the image mariadb:latest

```
$ docker volume create --name mariadb_data

$ docker run -d --name mariadb \
  -p 3306:3306 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
```
	Publish a container via port 3306

![](https://github.com/toanduc0671/week1-vietteldigitaltalent/blob/main/image/RunMariadb.png)

4. on machine 2 (192.168.1.11):
create volume for container mariadb and run the image bitnami/wordpress:latest

```
docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_PASSWORD=bitnami \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --volume wordpress_data:/bitnami/wordpress \
  --add-host mariadb:192.168.1.4 \
  bitnami/wordpress:latest
```
![](https://github.com/toanduc0671/week1-vietteldigitaltalent/blob/main/image/RunBitnamiWordpress.png)

	- Publish a container via port 8080 and 8443
	- add host mariadb as 192.168.1.4

5. access at http://your-ip:8080 to test

![](https://github.com/toanduc0671/week1-vietteldigitaltalent/blob/main/image/result3.png)
