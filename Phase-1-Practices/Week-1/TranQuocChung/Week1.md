# Wordpress-Docker
Bài tập tuần 1 - Viettel cloud 

## Table of content 
- [Wordpress-Docker](#wordpress-docker)
  - [Table of content](#table-of-content)
  - [Cài đặt môi trường docker trên VM](#cài-đặt-môi-trường-docker-trên-vm)
    - [Chạy các lệnh sau trên terminal để cài đặt docker](#chạy-các-lệnh-sau-trên-terminal-để-cài-đặt-docker)
  - [Cài đặt docker compose](#cài-đặt-docker-compose)
  - [Tạo máy ảo bằng Virtualbox](#tạo-máy-ảo-bằng-virtualbox)
  - [Practice 1 : Deploy Wordpress with command line](#practice-1--deploy-wordpress-with-command-line)
    - [Bước 1 : Cài đặt Virtualbox và tạo máy ảo Ubuntu](#bước-1--cài-đặt-virtualbox-và-tạo-máy-ảo-ubuntu)
    - [Bước 2 : Cài đặt docker trên máy ảo](#bước-2--cài-đặt-docker-trên-máy-ảo)
    - [Bước 3 : Deploy wordpress bằng command line](#bước-3--deploy-wordpress-bằng-command-line)
    - [Truy cập vào địa chỉ  https://localhost:8443](#truy-cập-vào-địa-chỉ--httpslocalhost8443)
  - [Practice 2 : Deploy Wordpress with Docker-compose](#practice-2--deploy-wordpress-with-docker-compose)
    - [Bước 1 : Cài đặt Virtualbox và tạo máy ảo Ubuntu](#bước-1--cài-đặt-virtualbox-và-tạo-máy-ảo-ubuntu-1)
    - [Bước 2 : Cài đặt docker,docker-compose trên máy ảo](#bước-2--cài-đặt-dockerdocker-compose-trên-máy-ảo)
    - [Bước 3 : Deploy wordpress bằng docker-compose](#bước-3--deploy-wordpress-bằng-docker-compose)
    - [Truy cập vào địa chỉ trang web :  https://localhost:8443](#truy-cập-vào-địa-chỉ-trang-web---httpslocalhost8443)
  - [Practice 3: Deploy Wordpress và database trên 2 máy ảo riêng biệt](#practice-3-deploy-wordpress-và-database-trên-2-máy-ảo-riêng-biệt)
    - [Bước 1 : Tạo 2 máy ảo Ubuntu , cài đặt docker trên mỗi máy](#bước-1--tạo-2-máy-ảo-ubuntu--cài-đặt-docker-trên-mỗi-máy)
    - [Bước 2 :](#bước-2-)
      - [Trên máy VM-1 :](#trên-máy-vm-1-)
      - [Trên máy VM-2:](#trên-máy-vm-2)

## Cài đặt môi trường docker trên VM
### Chạy các lệnh sau trên terminal để cài đặt docker
```sh
  $ sudo apt-get remove docker docker.io docker-engine
  $	sudo apt install docker.io
	$ sudo systemctl status docker(kiểm tra đã cài đặt thành công ? )
  $ sudo usermod -aG docker name_user_ubuntu
  $	su - name_user_ubuntu 
  $	sudo systemctl start docker 
  $	sudo systemctl enable docker 
```
## Cài đặt docker compose
```sh
  $ sudo apt install curl 
  $ sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	$ sudo chmod +x /usr/local/bin/docker-compose 
```
## Tạo máy ảo bằng Virtualbox 
```sh
  $ sudo apt install virtualbox 
```
Dowload file iso của Ubuntu 20.04  <br />
Tạo máy ảo chạy Ubuntu bằng Virtualbox
## Practice 1 : Deploy Wordpress with command line 
### Bước 1 : Cài đặt Virtualbox và tạo máy ảo Ubuntu
### Bước 2 : Cài đặt docker trên máy ảo 
### Bước 3 : Deploy wordpress bằng command line
1.Tạo network để kết nối database với app <br />
```sh
  $ docker network create wordpress-network
```
2.Run MariaDB  <br />
Tạo volume cho mariadb <br />
```sh
   $ docker volume create --name mariadb_data
```
Run , connect MariaDB với mạng đã tạo 
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
3.Run Wordpress <br />
Tạo volume cho Wordpress 
```sh
   $ docker volume create --name wordpress_data
``` 
Run,connect với network
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
### Truy cập vào địa chỉ  https://localhost:8443 
## Practice 2 : Deploy Wordpress with Docker-compose
### Bước 1 : Cài đặt Virtualbox và tạo máy ảo Ubuntu
### Bước 2 : Cài đặt docker,docker-compose trên máy ảo 
### Bước 3 : Deploy wordpress bằng docker-compose
Chạy các lệnh sau trên terminal :
```sh 
   $ curl -sSL https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml > docker-compose.yml
   $ docker-compose up -d
```
### Truy cập vào địa chỉ trang web :  https://localhost:8443 
## Practice 3: Deploy Wordpress và database trên 2 máy ảo riêng biệt 
### Bước 1 : Tạo 2 máy ảo Ubuntu , cài đặt docker trên mỗi máy 
### Bước 2 : 
#### Trên máy VM-1 : 
  
Tạo volume cho mariadb
```sh
    $ docker volume create --name mariadb_data
```
Run , connect MariaDB với mạng đã tạo
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
#### Trên máy VM-2:
Tạo volume cho Wordpress
```sh
      $ docker volume create --name wordpress_data
``` 
Run,connect với network 
```sh
     $docker run -d --name wordpress \
    -p 8080:8080 -p 8443:8443 \
    --env ALLOW_EMPTY_PASSWORD=yes \
    --env WORDPRESS_DATABASE_USER=bn_wordpress \
    --env WORDPRESS_DATABASE_PASSWORD=bitnami \
    --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
    --env WORDPRESS_DATABASE_HOST=192.168.1.50:3306 \
    --network wordpress-network \
    --volume wordpress_data:/bitnami/wordpress \
    bitnami/wordpress:latest
```
> Result <br/>
![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/ketqua3.png "")
