# Week 4 : Kubernetes 
- [Week 4 : Kubernetes](#week-4--kubernetes)
  - [Cai dat minikube](#cai-dat-minikube)
    - [Chuan bi :](#chuan-bi-)
  - [Cac buoc thuc hien deploy wordpress](#cac-buoc-thuc-hien-deploy-wordpress)
  - [Tai lieu tham khao](#tai-lieu-tham-khao)
## Cai dat minikube
### Chuan bi : 
1. Install kubectl 
   - Install curl 
    ```sh
    sudo apt install curl 
    ```
   - Dowload latest release with the command:
    ```sh
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    ```
   - Install kubectl
    ```sh
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    ```
   - Test to ensure the version you installed is up-to-date:
    ```sh
    kubectl version --client
    ```
    > Ket qua thuc hien <br/>
  ![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2020-07-12.png "")
2. Install minikube
    - Recommended configuration
    ```sh
        2 CPUs or more
        2GB of free memory
        20GB of free disk space
        Internet connection
        Container or virtual machine manager, such as: Docker,      Hyperkit, Hyper-V, KVM, Parallels, Podman, VirtualBox, or VMWare
    ```
    - Dowload latest release
    ```sh
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    ```
    - Install 
    ```sh 
    sudo install minikube-linux-amd64 /usr/local/bin/minikube
    ```
3. Start a cluster using docker driver
   ```sh
   minikube start --driver=docker
   ```
   To make docker the default driver:
   ```sh
   minikube config set driver docker
   ```
    > Tạo một local Kubernetes gồm 1 node chạy trên  container minikube <br/>
  ![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2020-06-02.png "") 

    > kubectl version <br/>
  ![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2020-08-38.png "")

## Cac buoc thuc hien deploy wordpress
- Tao thu muc lam viec 
  ```sh 
  mkdir minikube_test
  cd minikube_test
  ```
1. Deploy mariadb 
    - Tao PersistentVolumes (mariadb-pv) 
    - Tao PersistentVolumeClaims (mariadb-pvc)
    - Tao service ,deployment mariadb 
- Tao PersistentVolumes
    ```sh 
    touch mariadb_PV.yaml
    ```
    > file mariadb_PV.yaml
```sh
---
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
- Tao PersistentVolumeClaim
  ```sh
  touch mariadb_PVC.yaml
  ```
> file mariadb_PVC.yaml
```sh
---
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
- Deployment mariadb
  ```sh
  touch deploy-mariadb.yaml
  ```
> file deploy-mariadb.yaml
```sh
---
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
---
```
> Note: command phía dưới dùng để cấp quyền ghi cho container mariadb trên persistent directory  
```sh
initContainers:
      - name: volume-permissions
        image: busybox
        command: ['sh', '-c', 'chmod -R g+rwX /bitnami']
        volumeMounts:
        - mountPath: /bitnami
          name: mariadb-data
```
- Deploy mariadb: 
  ```sh
  kubectl apply -f mariadb_PV.yaml
  kubectl apply -f mariadb_PVC.yaml
  kubectl apply -f deploy-mariadb.yaml
  ```
  >Ket qua thuc hien <br/>
  ![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2015-57-52.png "")
  
  - Descirbe pod mariadb
    ```sh
    kubectl describe pod mariadb
    ```
    ![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2019-24-31.png "")

1. Deploy wordpress
    - Tao PersistentVolumes (wordpress-pv) 
    - Tao PersistentVolumeClaims (wordpress-pvc)
    - Tao service ,deployment wordpress 
- Tao PersistentVolumes
    ```sh 
    touch wordpress_PV.yaml
    ```
    > file wordpress_PV.yaml
```sh
---
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
- Tao PersistentVolumeClaim
  ```sh
  touch wordpress_PVC.yaml
  ```
> file wordpress_PVC.yaml
```sh
---
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
- Deployment wordpress
  ```sh
  touch deploy-wordpress.yaml
  ```
> file deploy-wordpress.yaml
```sh
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
    nodePort: 30521
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
- Deploy wordpress: 
  ```sh
  kubectl apply -f wordpress_PV.yaml
  kubectl apply -f wordpress_PVC.yaml
  kubectl apply -f deploy-wordpress.yaml
  ```
  >Ket qua thuc hien <br/>
  ![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2016-21-07.png "")
  
  - Open Kubernetes dashboard trong browser
    ```sh
    minikube dashboard
    ```

    ![alt ]( https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2016-21-31.png "")
  - Kiem tra trang thai cac pods 
    ```sh
    kubectl get pods -o wide
    ```
    ![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2020-21-27.png "")
  - Descirbe pod wordpress
    ```sh
    kubectl describe pod wordpress
    ```
    ![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2019-52-16.png "")
  - Describe service wordpress
    ```sh
    kubectl get svc wordpress
    ```
    ![alt ](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-27%2007-35-29.png "")
  - Get link trang ket qua 
    ```sh
    minikube service wordpress --url
    ```
    ![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2019-34-29.png "")
    > http://192.168.49.2:30521
1. Kiem tra ket qua 
   
  - Truy cap dia chi : http://192.168.49.2:35021
    > ket qua 
   ![alt](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-27%2007-36-02.png  "")
   <!-- ```sh
   minikube ssh
   ```
   > ssh vao container minikube
   ```sh
   curl -k http://192.168.49.2:30521
   ```
   > ket qua 
   ![alt](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/Screenshot%20from%202021-05-26%2018-15-29.png  "") -->

## Tai lieu tham khao 
    https://minikube.sigs.k8s.io/docs/start/
    https://kubernetes.io/docs/tasks/run-application/run-single-instance-stateful-application/
    https://docs.bitnami.com/tutorials/work-with-non-root-containers/
    https://kubernetes.io/vi/docs/reference/kubectl/cheatsheet/

> kubectl cheat sheet

    kubectl get ...
    kubectl describe pods my-pod
    
    kubectl logs my_pod 
    minikube ssh
    minikube dashboard
   
   
