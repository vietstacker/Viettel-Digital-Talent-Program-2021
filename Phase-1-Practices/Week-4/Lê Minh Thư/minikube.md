# Kubernetes

## Prepare

1. Install curl

```
sudo apt install curl
```

2. Install kubectl

* Download the latest release

```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

* Install kubectl

```
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

3. Install minikube

* Dowload latest release

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
```

* Install minikube

```
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

4. Start a cluster using docker driver

```
minikube start --driver=docker
```

5. Check kubectl version

```
kubectl version
```

![image](https://user-images.githubusercontent.com/83031380/120016397-c14c2480-c00e-11eb-9a19-b46af5a5c41d.png)

## Deploy wordpress

>Create folder:
```
mkdir minikube_test
cd minikube_test
```

### Deploy using yaml file

1. Create file to deploy MariaDB

* Create PersistentVolumes

```
touch MariaDB_PV.yaml
```

> MariaDB_PV.yaml

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mariadb-pv
spec:
  storageClassName: manual
  capacity:
    storage: 3Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

* Create PersistentVolumeClaim

```
touch MariaDB_PVC.yaml
```

> MariaDB_PVC.yaml

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
      storage: 3Gi
```

* Create MariaDB_deployment.yaml

```
touch MariaDB_deployment.yaml
```

> MariaDB_deployment.yaml

```
---
apiVersion: v1
kind: Service
metadata:
  name: mariadb
  labels:
    app: mariadb
spec:
  ports:
    - port: 3306
  selector:
    app: mariadb
  clusterIP: None
---  
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mariadb
  labels:
    app: mariadb
spec:
  selector:
    matchLabels:
      app: mariadb
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: mariadb
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
        name: mariadb-bitnami
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
          name: mariadb-bitnami
        volumeMounts:
        - name: mariadb-data
          mountPath: /bitnami
      volumes:
      - name: mariadb-data
        persistentVolumeClaim:
          claimName: mariadb-pvc
---
```

2. Create file to deploy Wordpress

* Create PersistentVolume

```
touch wordpress_pv.yaml
```

> wordpress_pv.yaml

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: wordpress-pv
spec:
  storageClassName: manual
  capacity:
    storage: 3Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

* Create PersistentVolumeClaim

```
touch wordpress_pvc.yaml
```

> wordpress_pvc.yaml

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

* Create wordpress_deployment.yaml

```
touch wordpress_deployment.yaml
```

>wordpress_deployment.yaml

```
---
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
    nodePort: 31126
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

3. Run file to deploy MariaDB and Wordpress

```
kubectl apply -f MariaDB_PV.yaml
kubectl apply -f MariaDB_PVC.yaml
kubectl apply -f MariaDB_deployment.yaml
```

```
kubectl apply -f wordpress_pv.yaml
kubectl apply -f wordpress_pvc.yaml
kubectl apply -f wordpress_deployment.yaml
```

![image](https://user-images.githubusercontent.com/83031380/120113755-271ee480-c1a6-11eb-877f-1f96792d941d.png)

* Describe pod

```
kubectl describe pod mariadb
```

```
kubectl describe pod wordpress
```

![image](https://user-images.githubusercontent.com/83031380/120113845-9268b680-c1a6-11eb-9896-a42a13b5f47c.png)

![image](https://user-images.githubusercontent.com/83031380/120113879-be843780-c1a6-11eb-97cd-96974dba937e.png)

* List pod/service

```
kubectl get pods
```

```
kubectl get svc
```

![image](https://user-images.githubusercontent.com/83031380/120113961-1b7fed80-c1a7-11eb-809c-cd9117bff88e.png)

* Describe service

```
kubectl describe svc mariadb
```

```
kubectl describe svc wordpress
```
![image](https://user-images.githubusercontent.com/83031380/120114064-93e6ae80-c1a7-11eb-9c6e-4e72a4a9794c.png)


* Open dashboard

```
minikube dashboard
```
![image](https://user-images.githubusercontent.com/83031380/120114154-0bb4d900-c1a8-11eb-8aa9-c95f14ad7409.png)

* Get url of wordpress

```
kubectl service wordpress 
```

![image](https://user-images.githubusercontent.com/83031380/120114248-7c5bf580-c1a8-11eb-8440-d9a07b796104.png)

![image](https://user-images.githubusercontent.com/83031380/120114160-12dbe700-c1a8-11eb-91d6-00c700cd2eb6.png)


### Deploy using helm
 

 * Install snapd

 ```
 sudo apt install snapd
 ```

 * Install helm

 ``` 
 sudo snap install helm --classic
 ``` 

 * minikube start

 ```
 minikube start
 ```

 ![image](https://user-images.githubusercontent.com/83031380/120019358-8f3cc180-c012-11eb-81c2-e136109008fb.png)

* add Bitnami repository:

```
helm repo add bitnami https://charts.bitnami.com/bitnami
```

* list repository:

```
helm repo list
```

![image](https://user-images.githubusercontent.com/83031380/120020377-ceb7dd80-c013-11eb-968b-f3876a732674.png)

* deploy wordpress

```
helm install my-release \
  --set wordpressUsername=admin \
  --set wordpressPassword=password \
  --set mariadb.auth.rootPassword=secretpassword \
    bitnami/wordpress
```

* List all pods in the namespace

```
kubectl get pods 
```

![image](https://user-images.githubusercontent.com/83031380/120020922-9664cf00-c014-11eb-8447-c25204cce37e.png)

* List all services in the namespace

```
kubectl get svc
```
![image](https://user-images.githubusercontent.com/83031380/120022218-4dae1580-c016-11eb-8137-f83defe5fea7.png)

* List deployment

```
kubectl get deployment
```
![image](https://user-images.githubusercontent.com/83031380/120022390-8c43d000-c016-11eb-83d7-4c1cd9d8514e.png)

* get url of wordpress 

```
minikube service my-release-wordpress
```

![image](https://user-images.githubusercontent.com/83031380/120024643-b5b22b00-c019-11eb-80bc-cfa560f9852c.png)

![image](https://user-images.githubusercontent.com/83031380/120024828-f611a900-c019-11eb-8e72-f1067edf9274.png)

## References

<https://kubernetes.io/docs/reference/kubectl/cheatsheet/>

<https://www.bogotobogo.com/DevOps/Docker/Docker_Helm_Chart_WordPress_MariaDB_Minikube_with_Ingress.php>

<https://kubernetes.io/docs/tasks/tools/>
