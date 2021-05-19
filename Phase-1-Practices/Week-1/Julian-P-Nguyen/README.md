# WEEK-1 PRACTICES DOCUMENTATION
---
## **Author:** *Julian (Phong) Ng.*
**Date of issue**: *May 4th 2021*

> My first doc & take-home project at **Viettelnet**. Enjoy reading :smile_cat:. Feel free to contact me if you find anything needs to be edited!

## Requirements:
**1. System**:
- Ubuntu Server Image (**Ubuntu 20.04** is used in below practices: [Download image](https://ubuntu.com/download/server))
- Desktop hypervisor for running virtual machines (E.g: *Virtual Box, VM Workstation, etc*)

**2. Knowledge**:
- Basic Linux, Networking concepts.
- Basic Docker usage.
- Comfortable using Vim :wink:

## System Configuration on VM(s):

### 1. Install essential packages via `apt`:
- Update apt (*Well, better do this all the time*):
```
 $ sudo apt-get update -y
```
- Install some neccessary packages:
```
$ sudo apt-get install -y vim net-tools systemd git curl  
```

### 2. Install Docker CE:

Please refer to this official doc for further details [Install Docker CE Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

### **Note:** 
*Docker CE is installed via Repository in below practices*

### Basic must-know diagnostic commands:
### A. Docker:
**1. View logs of container**:

```
$ docker logs <Container's id/name>
```
**Flags**:
<dl>
    <dt>
      -f
    </dt>
    <dd>
      Follow log output
    </dd>
</dl>

**2. Runs command in a container**:

```
$ docker exec -it -u0 <Container's id/name> <Program>
```

**E.g:**
> Runs interactive `bash` shell in the container. Now user can enter it can take control from inside
```
$ docker exec -it -u0 wordpress bash
```
**Flags**:
<dl>
    <dt>
      -i
    </dt>
    <dd>
      Interactive
    </dd>
    <dt>
      -t
    </dt>
    <dd>
      Keep STDIN open even if not attached
    </dd>
    <dt>
      -u
    </dt>
    <dd>
      Username (<code>-u0</code> as <code>root</code>)
    </dd>
</dl>

**3. View Info of Container:**
> Displayed in JSON format

```
$ docker inspect <Container's id/name>
```


### B. Linux: `TODO`


## I. Practice 1: `Deploy WordPress with Command Line`

### A. Step-by-step:

**1. Create network:**
```
$ docker network create wordpress-network
```

**2. Create a volume for MariaDB persistence:**
```
$ docker volume create --name mariadb_data
```

**3. Run MariaDB container:**
```
$ docker run -d --name mariadb \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network wordpress-network \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
```


**4. Create a volume for WordPress persistence:**
```
$ docker volume create --name wordpress_data
```

**5. Run WordPress container:**
```
$ docker run -d --name wordpress \
  -p 8080:8080 -p 8443:8443 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --network wordpress-network \
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest
```

### B. Expected Outcomes:
> Running Containers:

<img src="./imgs/hw1 - docker.png">

> Landing Page:
<img src="./imgs/hw1 - page.png">

## II. Practice 2: `Deploy WordPress with Docker Compose`

### A. Step-by-step:

**1. Install `docker-compose`:** *can install via `apt`* 
```
$ sudo apt install docker-compose
```

**2. Download `docker-compose.yml` of WordPress project**
```
$ curl -sSL https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml > docker-compose.yml
```

**3. Run application:**
```
$ docker-compose up -d
```

### B. Expected Outcomes:
> Running Containers:

<img src="./imgs/hw 2 - docker.png">

> Landing Page:

<img src="./imgs/hw 2 - page.png">

## III. Practice 3: `Deploy WordPress with Command Line on two virtual machines`
### **Note:** 
  - Requires 2 Ubuntu Nodes. Thus, basic configuration must be done on both machines.*
  - *In order to save time, **Cloning VM** is an option*

### A. Step-by-step guide:

> Presume that environment on both nodes are ready. 

> Some steps can be skipped if re-use VM from previous Practices.

#### **a. Database Node `(MariaDB)`**:
**1. Set Hostname:**
```
$ hostnamectl set-hostname mariadb
```

**2. Create network:**
```
$ docker network create wordpress-network
```

**3. Create a volume for MariaDB persistence:**
```
$ docker volume create --name mariadb_data
```

**4. Run MariaDB container:**

```
$ docker run -d --name mariadb \
  -p 3306:3306 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --env MARIADB_PASSWORD=12345678 \
  --network wordpress-network \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest
```

#### **b. WordPress Node**:

**1. Create a volume for WordPress persistence:**
```
$ docker volume create --name wordpress_data
```

**2. Run WordPress container:**

>   Please notice tag of image. Image `bitnami/wordpress:mod` has been **modified/rebuilt** for debugging.

```
$ docker run -d --name wordpress  -p 8080:8080 -p 8443:8443   --env MARIADB_HOST=192.168.80.132   --env MARIADB_PORT_NUMBER=3306   --env WORDPRESS_DATABASE_NAME=bitnami_wordpress   --env WORDPRESS_DATABASE_USER=bn_wordpress   --env WORDPRESS_DATABASE_PASSWORD=12345678 --entrypoint="/app-entrypoint.sh" --add-host mariadb:192.168.80.132   --volume wordpress_data:/bitnami/wordpress  bitnami/wordpress:mod httpd -f /opt/bitnami/apache/conf/httpd.conf -DFOREGROUND
```

**Explain**:
<dl>
  <dt>--add-host</dt>
  <dd>
    Map hostname to IP address of MariaDB node in 
    <code>/etc/hosts</code>
  </dd>
  <dt>--entrypoint</dt>
  <dd>
    Set the path to entrypoint file for container.
  </dd>
  <dt>
    httpd -f /opt/bitnami/apache/conf/httpd.conf -DFOREGROUND
  </dt>
  <dd>
    Last argument injected as CMD for container. Starting Apache server in this case
  </dd>
</dl>


### B. Notes on Debugging Process:
### 1. `Failed to connect to mariadb:3306 after 36 tries`

> According to logs from `Wordpress` container, it is unable to establish connection to `MariaDB` container. `Wordpress` container exits after 36 tries fails.

> **Note**:
*There might be a bug in default Image. Despite passing `--env MARIADB_HOST="some-host"`as environment variable, container receives this variable but still uses the default `mariadb` when starting*

#### **Diagnosis:**
  - Network connection
  - Firewall blocking connection
  - VM unable resolve host name

    ....

#### **Suggested Approaches**
- Rebuild Image from `Dockerfile`: 
> Remove `ENTRYPOINT` thus the container won't run `app-entrypoint.sh` and exits automatically.
  
 Modified `Dockerfile`: [Original file Here](https://github.com/bitnami/bitnami-docker-wordpress/blob/master/5/debian-10/Dockerfile)

```
FROM docker.io/bitnami/minideb:buster
LABEL maintainer "Bitnami <containers@bitnami.com>"

ENV BITNAMI_PKG_CHMOD="-R g+rwX" \
    HOME="/" \
    PATH="/opt/bitnami/php/bin:/opt/bitnami/php/sbin:/opt/bitnami/apache/bin:/opt/bitnami/wp-cli/bin:/opt/bitnami/mysql/bin:/opt/bitnami/common/bin:/opt/bitnami/nami/bin:$PATH"

COPY prebuildfs /
# Install required system packages and dependencies
RUN install_packages ca-certificates curl gzip libaudit1 libbsd0 libbz2-1.0 libc6 libcap-ng0 libcom-err2 libcurl4 libexpat1 libffi6 libfftw3-double3 libfontconfig1 libfreetype6 libgcc1 libgcrypt20 libglib2.0-0 libgmp10 libgnutls30 libgomp1 libgpg-error0 libgssapi-krb5-2 libhogweed4 libicu63 libidn2-0 libjemalloc2 libjpeg62-turbo libk5crypto3 libkeyutils1 libkrb5-3 libkrb5support0 liblcms2-2 libldap-2.4-2 liblqr-1-0 libltdl7 liblzma5 libmagickcore-6.q16-6 libmagickwand-6.q16-6 libmcrypt4 libmemcached11 libmemcachedutil2 libncurses6 libnettle6 libnghttp2-14 libonig5 libp11-kit0 libpam0g libpcre3 libpng16-16 libpq5 libpsl5 libreadline7 librtmp1 libsasl2-2 libsodium23 libsqlite3-0 libssh2-1 libssl1.1 libstdc++6 libsybdb5 libtasn1-6 libtidy5deb1 libtinfo6 libunistring2 libuuid1 libwebp6 libx11-6 libxau6 libxcb1 libxdmcp6 libxext6 libxml2 libxslt1.1 libzip4 procps sudo tar unzip zlib1g
RUN /build/bitnami-user.sh
RUN /build/install-nami.sh
RUN bitnami-pkg install php-7.4.16-8 --checksum d55ac4995e2b1c5060c1631aaf1bd0ed50a4100a5b061c8786b1eff8567f2680
RUN bitnami-pkg unpack apache-2.4.46-7 --checksum cfb1835e471967ec5a6df8c622bdd907be03fb5b57b4f86f68eb7b73fe0f6be3
RUN bitnami-pkg install wp-cli-2.4.0-2 --checksum 33c3b53e87e9e433291ac3511e68263c80b43aa4de3dead9502934f506b7f2e6
RUN bitnami-pkg unpack mysql-client-10.3.28-0 --checksum 9398376ca9e2033d5bc193232e8aa9b57d91d4ccf06fa67bfa0d30ef36e44c25
RUN bitnami-pkg install libphp-7.4.16-1 --checksum 70248d4fc19d31ff422044ba05e3f50712881be444bb1ac22bf2080782877431
RUN bitnami-pkg unpack wordpress-5.7.1-6 --checksum f7f230ded28d75dfe5f3e47ebdb645a4512b316c8e26367ccd42367ebed68eac
RUN bitnami-pkg install tini-0.19.0-1 --checksum 9b1f1c095944bac88a62c1b63f3bff1bb123aa7ccd371c908c0e5b41cec2528d
RUN bitnami-pkg install gosu-1.12.0-2 --checksum 4d858ac600c38af8de454c27b7f65c0074ec3069880cb16d259a6e40a46bbc50
RUN ln -sf /dev/stdout /opt/bitnami/apache/logs/access_log && \
    ln -sf /dev/stderr /opt/bitnami/apache/logs/error_log

COPY rootfs /
ENV ALLOW_EMPTY_PASSWORD="no" \
    APACHE_ENABLE_CUSTOM_PORTS="no" \
    APACHE_HTTPS_PORT_NUMBER="8443" \
    APACHE_HTTP_PORT_NUMBER="8080" \
    BITNAMI_APP_NAME="wordpress" \
    BITNAMI_IMAGE_VERSION="5.7.1-debian-10-r19" \
    MARIADB_HOST="mariadb" \
    MARIADB_PORT_NUMBER="3306" \
    MARIADB_ROOT_PASSWORD="" \
    MARIADB_ROOT_USER="root" \
    MYSQL_CLIENT_CREATE_DATABASE_NAME="" \
    MYSQL_CLIENT_CREATE_DATABASE_PASSWORD="" \
    MYSQL_CLIENT_CREATE_DATABASE_PRIVILEGES="ALL" \
    MYSQL_CLIENT_CREATE_DATABASE_USER="" \
    MYSQL_CLIENT_ENABLE_SSL="no" \
    MYSQL_CLIENT_SSL_CA_FILE="" \
    NAMI_PREFIX="/.nami" \
    OS_ARCH="amd64" \
    OS_FLAVOUR="debian-10" \
    OS_NAME="linux" \
    PHP_MEMORY_LIMIT="256M" \
    PHP_OPCACHE_ENABLED="yes" \
    SMTP_HOST="" \
    SMTP_PASSWORD="" \
    SMTP_PORT="" \
    SMTP_PROTOCOL="" \
    SMTP_USER="" \
    SMTP_USERNAME="" \
    WORDPRESS_BLOG_NAME="User's Blog!" \
    WORDPRESS_DATABASE_NAME="bitnami_wordpress" \
    WORDPRESS_DATABASE_PASSWORD="" \
    WORDPRESS_DATABASE_SSL_CA_FILE="" \
    WORDPRESS_DATABASE_USER="bn_wordpress" \
    WORDPRESS_EMAIL="user@example.com" \
    WORDPRESS_EXTRA_WP_CONFIG_CONTENT="" \
    WORDPRESS_FIRST_NAME="FirstName" \
    WORDPRESS_HTACCESS_OVERRIDE_NONE="yes" \
    WORDPRESS_HTACCESS_PERSISTENCE_ENABLED="no" \
    WORDPRESS_HTTPS_PORT="8443" \
    WORDPRESS_HTTP_PORT="8080" \
    WORDPRESS_LAST_NAME="LastName" \
    WORDPRESS_PASSWORD="bitnami" \
    WORDPRESS_RESET_DATA_PERMISSIONS="no" \
    WORDPRESS_SCHEME="http" \
    WORDPRESS_SKIP_INSTALL="no" \
    WORDPRESS_TABLE_PREFIX="wp_" \
    WORDPRESS_USERNAME="user"

EXPOSE 8080 8443

USER 1001
```

- Configure `/etc/hosts` manually:
> I recommend using `mariadb` as hostname for MariaDB ser
```
$ vi /etc/hosts
```

```
...
<ip-database-node>  mariadb
...
```

- Test connection to `MariaDB` to ensure network functioning
```
$ mysql -u <user> -p  \
        -h <IP-db-node> -P 3306 \
        -D <db-name>
```
Or
```
$ telnet <IP-db-node> 3306
```

- Firewall status check:
```
$ sudo ufw status
```

### 2. `Docker0 interface down`:
> If Docker's NIC down, container won't able to connect to outside.
- Let's stick with the traditional. Reboot your VM :stuck_out_tongue_closed_eyes:

```
$ sudo reboot
```

### 3. `Apache Server Issues`:

#### a. `httpd (pid: XX) already running`:

- Running `bash` shell on container & Remove PID file:

```
$ docker exec -it -u0 wordpress bash
$ rm /opt/bitnami/apache/tmp/httpd.pid
```

#### b. `Could not reliably determine the server's fully qualified domain name, using <container ip>. Set the 'ServerName' directive globally to suppress this message`
- Configure Apache:
```
$ vi /opt/bitnami/apache/conf/bitnami/bitnami-ssl.conf
$ vi /opt/bitnami/apache/conf/bitnami/bitnami.conf
```

-  Insert below lines within `<VirtualHost>`
```
  ServerName localhost
  ServerAlias localhost
```

....

### C. Expected Outcomes:

> Running Container on `Wordpress` Node:

<img src="./imgs/hw 3 - wordpress node.png">

> Running Container on `MariaDB` Node:

<img src="./imgs/hw 3 - mariadb node.png">

> Landing Page (HTTP via port 8080):

<img src="./imgs/hw 3 - page8080.png">


> Landing Page (HTTPS via port 8443):

<img src="./imgs/hw 3 - page.png">
