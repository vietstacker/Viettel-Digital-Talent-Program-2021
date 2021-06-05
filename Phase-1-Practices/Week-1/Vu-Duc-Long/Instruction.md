## 1. Setup
### 1.1 Firstly you need to setup your VM and Docker on your VM
- You can setup your Linux virtual machine on VMware or Virtualbox or on some hypervisor you like
- To setup docker you can follow this link [How to install Docker](https://docs.docker.com/engine/install/)
### 1.2 Get wordpress image and Mariadb image
Get Wordpress image and Maria Image created by binami on docker hub.[Docker hub registry](https://hub.docker.com/r/bitnami/wordpress)

> $ docker pull bitnami/wordpress:latest

To use a specific version, you can pull a versioned tag. You can view [the list of available versions](https://hub.docker.com/r/bitnami/wordpress) in the Docker Hub Registry.

> $ docker pull bitnami/wordpress:[TAG] 

- Do the same to get Mariadb.
## 2. Instruction
### Practice 1: Deploy Docker with command line.

#### Step 1: Create a network:
> $ docker network create wordpress-network
#### Step 2: Create a volume for MariaDB persistence
> $ docker volume create --name mariadb_data
#### Step 3: Create your MariaDB container:
> $ docker run -d --name mariadb \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network wordpress-network \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
  
**Note**: Make sure you have downloaded mariadb image.

#### Step 4: Create a volume for Wordpress persistence
> $ docker volume create --name wordpress_data
#### Step 5: Create your Wordpress container:
> $ docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_PASSWORD=bitnami \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --network wordpress-network \
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest
 
 After running you can check your container is running using command:
 > $ sudo docker ps
 ![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Practice/practice%201/container.png?raw=true)

Now you can check your web app by go browser and go to this link : <your_ip_address>:8080.
*You can check your ip address by using this command*:
> $ ip a
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Practice/practice%201/checkip.png?raw=true)

And this reresult:

![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Practice/practice%201/Screenshot%20from%202021-05-07%2022-24-38.png?raw=true)


### Practice 2: Deploy Wordpress with Docker-Compose.
#### Step 1: Install docker-compose:
> $ sudo apt-get install docker-compose
> 
#### Step 2: Get `docker-compose.yml` 
> $ curl -sSL https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml > docker-compose.yml
> 
#### Step 3: Run docker-compose
> $ docker-compose up -d
> 

Container is running:
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Practice/practice%202/Screenshot%20from%202021-05-07%2022-34-55.png?raw=true)

Out come:
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Practice/practice%202/Screenshot%20from%202021-05-07%2022-35-09.png?raw=true)

### Practice 3: Deploy Wordpress with command-line in two virtual machine

#### Step 1: Create 2 VM in your computer and setup docker in there.
#### Step 2: Create a volume for MariaDB persistence and create a MariaDB container in VM 1.
> $ docker volume create --name mariadb_data

> $ docker run -d --name mariadb \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_PASSWORD=bitnami \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network host \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
 
 **Note**: change the network to `host` instead of `wordpress-network`. when we change network to host network it's mean container’s network stack is not isolated from the Docker host (the container shares the host’s networking namespace), and the container does not get its own IP-address allocated.  For instance, if you run a container which binds to port 80 and you use host networking, the container’s application is available on port 80 on the host’s IP address.

Result: 
 ![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Practice/practice%203/run%20container%20db.png?raw=true)
#### Step 3: Create a volume for Wordpress persistence and create a Wordpress container in VM 2.

> $ docker volume create --name wordpress_data

> $ docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_PASSWORD=bitnami \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --network host \
  --add-host mariadb:<ip_add_vm1>
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest

**Note**: 
- Using `network host` 
- Using `add-host` to add a single host to IP mapping within a Docker container. we add `mariadb:<ip-vm1>` to connect wordpress container in VM2 to mariadb container in VM1

![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Practice/practice%203/run%20container%20wordpress.png?raw=true)

=> Result: 
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Practice/practice%203/result.png?raw=true)
