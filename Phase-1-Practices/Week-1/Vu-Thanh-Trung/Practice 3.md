# Practice 3: Deploy WordPress with Command Line on two virtual machines

## For both VMs
In VM VirtualBox Manager: **Select a VM > [Settings] > [Network] > [Adapter 1] > Attached to: [Bridged Adapter] > Promiscuous Mode: [Allow All]**

![Screenshot 2021-05-12 075555](https://user-images.githubusercontent.com/48465162/117903343-9026e100-b2f9-11eb-810c-0c29f1c1f71c.png)


## On VM1:

#### Step 1: Create a network

```console
$ sudo docker network create wordpress-network
```

#### Step 2: Create a volume for MariaDB persistence and create a MariaDB container
**(Note: Publish container's port *3306* to host)**

```console
$ sudo docker volume create --name mariadb_data
$ sudo docker run -d --name mariadb \
  -p 3306:3306 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network wordpress-network \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
```
![{3C394083-E552-42CE-A3FF-6FBAF7E1B733}](https://user-images.githubusercontent.com/48465162/117906320-e0547200-b2fe-11eb-83da-343222bc38eb.png)

## On VM2:

#### Step 1: Create volumes for WordPress persistence and launch the container
**Note:**

`MARIADB_HOST`: VM1 ip address

(Check your ip address by using `ifconfig` or `ip a`, your ip should be like *192.168.x.x*)

`MARIADB_PORT_NUMBER`: VM1 mariadb port

```console
$ sudo docker volume create --name wordpress_data
$ sudo docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env MARIADB_HOST=192.168.1.84 \
  --env MARIADB_PORT_NUMBER=3306 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_PASSWORD=bitnami \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --network wordpress-network \
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest
```

![{0CF85D2A-4546-4653-8151-D1277E47C4C6}](https://user-images.githubusercontent.com/48465162/117907031-41307a00-b300-11eb-8b73-b87691aff8a1.png)

#### Step 2: Access application at http://localhost:8080

![{DD9C1347-A1CF-4FCE-9437-EBC22A4CAC09}](https://user-images.githubusercontent.com/48465162/117909436-7343db00-b304-11eb-9bbd-198ead4b32e9.png)

---
For more information, please visit: https://docs.docker.com/reference/
