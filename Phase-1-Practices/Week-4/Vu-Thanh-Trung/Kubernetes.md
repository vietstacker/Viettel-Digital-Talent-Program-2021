# Practice: Deploy Wordpress + MariaDB on Kubernetes using Minikube

## Table of Contents

- [I. About Kubernetes](#I-About-Kubernetes)

- [II. Practice](#II-Practice)

  - [1. Minikube & kubectl](#1-Minikube--kubectl)

  - [2. Deploy MariaDB](#2-Deploy-MariaDB)

  - [3. Deploy Wordpress](#3-Deploy-Wordpress)

  - [4. Access Wordpress](#4-Access-Wordpress)

## I. About Kubernetes

- [What is Kubernetes?](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)

- [Install and Set Up kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## II. Practice

### 1. Minikube & kubectl

- Install required packages

```console
sudo apt update
sudo apt install curl
sudo apt install docker.io
```

- Install `minikube`

```console
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

![install-minikube](https://user-images.githubusercontent.com/48465162/121794388-e4431f00-cc31-11eb-9118-29c5211acbdf.png)

- Install `kubectl`

```console
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

![install-kubectl](https://user-images.githubusercontent.com/48465162/121794390-e6a57900-cc31-11eb-8038-3315b525020f.png)

- Add user to the 'docker' group

```console
sudo usermod -aG docker $USER && newgrp docker
```

- minikube start

```console
minikube start --driver=docker
```

![minikube-start](https://user-images.githubusercontent.com/48465162/121794391-e907d300-cc31-11eb-9975-002675f087bc.png)

- *Note:* Deploying MariaDB and Wordpress both need:
  - A [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes) file
  - A [Persistent Volumes Claim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) file
  - A file for deploying

### 2. Deploy MariaDB

- MariaDB Persistent Volumes

```console
touch mariadb-pv.yaml
nano mariadb-pv.yaml
```

```console
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mariadb-pv
spec:
  storageClassName: manual
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

- MariaDB Persistent Volumes Claim

```console
touch mariadb-pvc.yaml
nano mariadb-pvc.yaml
```

```console
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mariadb-pvc
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
```

- MariaDB deploying file

```console
touch mariadb-deploy.yaml
nano mariadb-deploy.yaml
```

```console
apiVersion: v1
kind: Service
metadata:
  name: mariadb
  labels:
    app: wordpress
spec:
  ports:
    - port: 3306
  selector:
    app: wordpress
    tier: mariadbbitnami
  clusterIP: None
---  
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mariadb
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: mariadbbitnami
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: mariadbbitnami
    spec:
      initContainers:
      - name: volume-permissions
        image: busybox
        command: ['sh', '-c', 'chmod -R g+rwX /bitnami']
        volumeMounts:
        - mountPath: /bitnami
          name: mariadb-data
      containers:
      - image: bitnami/mariadb:latest
        name: mariadbbitnami
        env:
        - name: MARIADB_USER
          value: bn_wordpress
        - name: MARIADB_PASSWORD
          value: bitnami
        - name: MARIADB_DATABASE
          value: bitnami_wordpress
        - name: ALLOW_EMPTY_PASSWORD
          value: "yes"
        ports:
        - containerPort: 3306
          name: mariadbbitnami
        volumeMounts:
        - name: mariadb-data
          mountPath: /bitnami
      volumes:
      - name: mariadb-data
        persistentVolumeClaim:
          claimName: mariadb-pvc
```

- Deploy MariaDB

```console
kubectl apply -f mariadb-pv.yaml
kubectl apply -f mariadb-pvc.yaml
kubectl apply -f mariadb-deploy.yaml
```

![mariadb-deploy](https://user-images.githubusercontent.com/48465162/121794393-ead19680-cc31-11eb-84e9-772fe198e193.png)

![mariadb-result](https://user-images.githubusercontent.com/48465162/121794395-ec9b5a00-cc31-11eb-8e91-38c7e9a8ecf0.png)

### 3. Deploy Wordpress

- Wordpress Persistent Volumes

```console
touch wordpress-pv.yaml
nano wordpress-pv.yaml
```

```console
apiVersion: v1
kind: PersistentVolume
metadata:
  name: wordpress-pv
spec:
  storageClassName: manual
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

- Wordpress Persistent Volumes Claim

```console
touch wordpress-pvc.yaml
nano wordpress-pvc.yaml
```

```console
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wordpress-pvc
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
```

- Wordpress deploying file

```console
touch wordpress-deploy.yaml
nano wordpress-deploy.yaml
```

```console
apiVersion: v1
kind: Service
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  selector: 
    app: wordpress
  type: NodePort
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
    nodePort: 30303
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
    spec:
      containers:
      - image: bitnami/wordpress:latest
        name: wordpress
        env:
        - name: WORDPRESS_DATABASE_USER
          value: bn_wordpress
        - name: WORDPRESS_DATABASE_PASSWORD
          value: bitnami
        - name: WORDPRESS_DATABASE_NAME
          value: bitnami_wordpress
        ports:
        - containerPort: 8080
          name: wordpress
        volumeMounts:
        - name: wordpress-data
          mountPath: /bitnami
      volumes:
      - name: wordpress-data
        persistentVolumeClaim:
          claimName: wordpress-pvc
```

- Deploy Wordpress

```console
kubectl apply -f wordpress-pv.yaml
kubectl apply -f wordpress-pvc.yaml
kubectl apply -f wordpress-deploy.yaml
```

![wordpress-deploy](https://user-images.githubusercontent.com/48465162/121794398-ee651d80-cc31-11eb-9fd3-f3983254aa7f.png)

![wordpress-result](https://user-images.githubusercontent.com/48465162/121794400-f02ee100-cc31-11eb-8961-364038bcfbe9.png)

### 4. Access Wordpress

```console
minikube dashboard
```

![dashboard](https://user-images.githubusercontent.com/48465162/121794483-aeeb0100-cc32-11eb-8b94-68279801c90b.png)

- Get deployment url

```console
minikube service wordpress --url
```

![get-url](https://user-images.githubusercontent.com/48465162/121794562-77c91f80-cc33-11eb-8dc5-d085ec806463.png)

- Access the result link

![result](https://user-images.githubusercontent.com/48465162/121794564-7a2b7980-cc33-11eb-9728-79cab5232ce4.png)
