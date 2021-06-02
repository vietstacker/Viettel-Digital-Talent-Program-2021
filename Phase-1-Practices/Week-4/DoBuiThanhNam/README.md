# WEEK 4: Kubernetes

## Practice: Setup Minikube and deploy Wordpress

### Step 1: Prepare

- Install Kubectl

```
$ sudo apt install curl 
$ curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
$ sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

- Install Minikube

```
$ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

- Start a cluster

  Grant access

  >$ sudo usermod -aG docker $USER && newgrp docker
  
  Run

  >$ minikube start --driver=docker
#### Result

![Screenshot_2.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week4/pic/Screenshot_2.png)

![Screenshot_3.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week4/pic/Screenshot_3.png)

### Step 2: Deploy MariaDB

- Create directory

```
mkdir minikube_test
cd minikube_test
```

- Create files

```
$ touch mariadb_PV.yaml
$ touch mariadb_PVC.yaml
$ touch mariadb_PV.yaml
```

- Update files

> mariadb_PV.yaml
```
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

> mariadb_PVC.yaml
```
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

> deploy-mariadb.yaml
```
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

- Deploy files

```
$ kubectl apply -f mariadb_PV.yaml
$ kubectl apply -f mariadb_PVC.yaml
$ kubectl apply -f deploy-mariadb.yaml
```

#### Result

![Screenshot_4.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week4/pic/Screenshot_4.png)

### Step 3: Deploy Wordpress

- Create files

```
$ touch wordpress_PV.yaml
$ touch wordpress_PVC.yaml
$ touch deploy-wordpress.yaml
```

- Update files

> mariadb_PV.yaml
```
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

> mariadb_PVC.yaml
```
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

> deploy-mariadb.yaml
```
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

- Deploy files

```
$ kubectl apply -f wordpress_PV.yaml
$ kubectl apply -f wordpress_PVC.yaml
$ kubectl apply -f deploy-wordpress.yaml
```

#### Result

![Screenshot_10.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week4/pic/Screenshot_10.png)

### Step 4: Run Minikube & Deploy

- Run Minikube

> $ minikube dashboard
![Screenshot_7.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week4/pic/Screenshot_7.png)

- Get link

> $ minikube service wordpress --url
![Screenshot_9.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week4/pic/Screenshot_9.png)

- Deploy

![Screenshot_8.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week4/pic/Screenshot_8.png)
