# HOMEWORK/ PRACTICE
### 1) Cập nhật apt và thực hiện các cài đặt sau:
`sudo apt-get install curl apt-transport-https docker.io`

    `sudo apt install virtualbox virtualbox-ext-pack`
 ### 2) cài đặt kubectl
 
 
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
##### Kiểm tra và đảm bảo đã cài thành công bản mới nhất
`kubectl version --client
`
 ![186543032_2900931346815297_711197519356468142_n](https://user-images.githubusercontent.com/84090649/120004265-c0ac9180-c000-11eb-9cf0-24ebdcd32a27.jpg)

 
Kiểm tra version của kubectl sau khi cài đặt thành công


`kubectl version -o json`

![191775799_493757405163525_5500550877236452781_n](https://user-images.githubusercontent.com/84090649/120004144-a4a8f000-c000-11eb-8cdb-fe386358e780.jpg)

 ### 3) Cài đặt minikube
#### cài đặt packgae minikube
`wget https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64`
#### sử dụng minikube ở terminal
`sudo mv minikube-linux-amd64 /usr/local/bin/minikube`

`sudo chmod 755 /usr/local/bin/minikube`

 Kiểm tra version của minikube khi đã cài đặt thành công
 
`minikube version`

#### thực hiện bắt đầu 1 cluster

`minikube start --driver=docker`

### 4) Cấu hình sử dụng minikube

 Thêm tài khoản trên ubuntu
`sudo adduser minikube`

`sudo passwd minikub` 

Sau đó nhập và xác thực mật khẩu cho tài khoản minikube

#### Thêm tài khoản vừa tạo vào group sudo và docker
`sudo usermod -aG sudo minikube`
`sudo usermod -aG docker minikube`
`newgrp docker`

bắt đầu 1 cluster sử dụng docker drive

`minikube start --driver=docker`


![189843299_1386119935079167_678981017143705795_n](https://user-images.githubusercontent.com/84090649/120004400-e8035e80-c000-11eb-840c-758193b26a88.gif)

### 4) Triển khai MariaDb và Wordpress

#### Nội dung file mariadb_PV.yaml
```
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

#### Next, viết file mariadb_PVC.yaml

```
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
      storage: 2Gi``

 #### viết file mariadb.yaml
``---
apiVersion: v1
kind: Service
metadata:
  name: mariadb-server
  labels:
    app: wordpress-k8s
spec:
  ports:
    - port: 3306
  selector:
    app: wordpress-k8s
    tier: mariadb
    author: bitnami
  clusterIP: None
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wordpress-mariadb-volume
  labels:
    app: wordpress-k8s
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress-mariadb
  labels:
    app: wordpress-k8s
spec:
  selector:
    matchLabels:
      app: wordpress-k8s
      tier: mariadb
      author: bitnami
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress-k8s
        tier: mariadb
        author: bitnami
    spec:
      containers:
      - name: mariadb
        image: bitnami/mariadb:latest
        env:
        - name: ALLOW_EMPTY_PASSWORD
          value: "yes"
        - name: MARIADB_USER
          value: bn_wordpress
        - name: MARIADB_DATABASE
          value: bitnami_wordpress
        - name: MARIADB_PASSWORD
          value: bitnami
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: mariadb-volume
          mountPath: /var/lib/mariadb
      volumes:
      - name: mariadb-volume
        persistentVolumeClaim:
          claimName: wordpress-mariadb-volume
  ```

#### Deploy mariadb:

##### run các lệnh: 
``kubectl apply -f mariadb_PV.yaml`
`kubectl apply -f mariadb_PVC.yaml
`kubectl apply -f deploy-mariadb.yaml``

## Nếu có lỗi `The connection to the server localhost:8080 was refused - did you specify the right host or port?`

### có thể tham khảo sửa lỗi bằng việc run command:
```
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
BASH
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf HOME/.kube/config sudo chown (id -u):$(id -g) $HOME/.kube/config
```

![192303146_342221654082614_7925044578669865513_n](https://user-images.githubusercontent.com/84090649/120004376-de79f680-c000-11eb-9d2b-b021cfda8df6.gif)


và bắt đầu deploy lại 

### Tạo service Wordpress
viết deploy wordpress.yaml
```
apiVersion: v1
kind: Service
metadata:
  name: wordpress
  labels:
    app: wordpress-k8s
spec:
  ports:
    - port: 8080
  selector:
    app: wordpress-k8s
    tier: frontend
    author: bitnami
  type: LoadBalancer
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wordpress-volume
  labels:
    app: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress-k8s
spec:
  selector:
    matchLabels:
      app: wordpress-k8s
      tier: frontend
      author: bitnami
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress-k8s
        tier: frontend
        author: bitnami
    spec:
      containers:
      - name: wordpress
        image: bitnami/wordpress:latest
        env:
          - name: ALLOW_EMPTY_PASSWORD
            value: "yes"
          - name: WORDPRESS_DATABASE_USER
            value: bn_wordpress
          - name: WORDPRESS_DATABASE_NAME
            value: bitnami_wordpress
          - name: WORDPRESS_DATABASE_PASSWORD
            value: bitnami
          - name: WORDPRESS_DATABASE_HOST
            value: mariadb-server
        ports:
        - containerPort: 80
          name: wordpress
        volumeMounts:
        - name: wordpress-storage
          mountPath: /var/www/html
      volumes:
      - name: wordpress-storage
        persistentVolumeClaim:
          claimName: wordpress-volume
```
   #### để chạy service, hãy run       
` kubectl apply -f wordpress.yaml

minikube service wordpress --url` 
 