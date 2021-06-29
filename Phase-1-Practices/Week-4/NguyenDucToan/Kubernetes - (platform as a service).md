# Kubernetes - (platform as a service) 

## set up an ubuntu VM

- 2 CPUs or more
- 2GB of free memory
- 20GB of free disk space
- Internet connection

## **A. install kubernetes via mini-kube**
1. requirement packet:</br >
First update the system and get latest stable packet version for Ubuntu:

```bash
$ sudo apt update
$ sudo apt upgrade
```

- curl:
```bash
$ sudo apt install curl
```
- docker:
```bash
$ sudo apt install docker.io
```

2. install minikube on x86-64 Linux using Debian package:
```bash
$ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
$ sudo dpkg -i minikube_latest_amd64.deb
```

3. install kubectl

```bash
$ sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

4. Start minikube
```bash
$ sudo usermod -aG docker $USER && newgrp docker
$ minikube start --driver=docker
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week4/main/image/MinikubeStart.png)

## **B. write manifest file to deploy wordpress on kubernetes**

1. create mariadb.yaml
```bash
$ gedit mariadb.yaml
```
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mariadb
  labels:
    app: mariadb
    user: pinpoint
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mariadb
      tier: mariadb
  template:
    metadata:
      labels:
        app: mariadb
        tier: mariadb
    spec:
      containers:
      - name: mariadb
        image: bitnami/mariadb:latest
        ports:
          - containerPort: 3306
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "    "

---
apiVersion: v1
kind: Service
metadata:
  name: mariadb-svc
  labels:
    user: pinpoint
spec:
  selector:
     app: mariadb
  type: ClusterIP
  ports:
    - port: 3306
      targetPort: 3306
```

2. create wordpress.yaml
```bash
$ gedit wordpress.yaml
```

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
    user: pinpoint
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wordpress
      tier: wordpress
  template:
    metadata:
      labels:
        app: wordpress
        tier: wordpress
    spec:
      containers:
      - name: wordpress
        image: bitnami/wordpress:latest
        ports:
          - containerPort: 80
        env:
        - name: WORDPRESS_DB_HOST
          value: "mariadb-svc"
        - name: WORDPRESS_DB_USER
          value: "root"
        - name: WORDPRESS_DB_PASSWORD
          value: "    "
        - name: WORDPRESS_DB_NAME
          value: "wp-test"

---
apiVersion: v1
kind: Service
metadata:
  name: wordpress-svc
  labels:
    user: pinpoint
spec:
  selector:
     app: wordpress
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 80
```

3. apply:
```bash
$ kubectl apply -f mariadb.yaml
$ kubectl apply -f wordpress.yaml
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week4/main/image/applyMariadbyaml.png)

![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week4/main/image/applyWordpress.png)

## **C. result**

```bash
$ kubectl get pods
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week4/main/image/getpods.png)

```bash
$ kubectl get service
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week4/main/image/getservice.png)

