- [I. Các thành phần chính của k8s](#i-các-thành-phần-chính-của-k8s)
  - [1. Cluster](#1-cluster)
  - [2. Node](#2-node)
    - [a. Master Node](#a-master-node)
    - [b. Worker Node](#b-worker-node)
  - [3. Pods](#3-pods)
- [II. Demo](#ii-demo)
  - [1. Chuẩn bị môi trường](#1-chuẩn-bị-môi-trường)
  - [2. Cài đặt Minikube và Kubectl](#2-cài-đặt-minikube-và-kubectl)
    - [a. Cập nhật apt và cài đặt các package cần thiết](#a-cập-nhật-apt-và-cài-đặt-các-package-cần-thiết)
    - [b. Cài đặt minikube](#b-cài-đặt-minikube)
    - [c. Cài đặt kubectl](#c-cài-đặt-kubectl)
  - [3. Cấu hình sử dụng minikube](#3-cấu-hình-sử-dụng-minikube)
  - [4. Triển khai MariaDb và Wordpress](#4-triển-khai-mariadb-và-wordpress)
    - [a. Tạo service MariaDb](#a-tạo-service-mariadb)
    - [b. Tạo service Wordpress](#b-tạo-service-wordpress)
  - [5. Tài liệu tham khảo](#5-tài-liệu-tham-khảo)

# I. Các thành phần chính của k8s

## 1. Cluster

- Là một cụm các máy vật lý( hoặc máy ảo) có tác dụng quản lý vòng đời các container.
- Một Kubernetes Cluster có khả năng lên lịch và chạy các Container trên một nhóm máy.
- Gồm 2 thành phần chính: `Master Node` và `Worker Node`

## 2. Node

### a. Master Node

- Là đầu não của Cluster, nó chịu trách nhiệm quản lý cụm. Nó quản lý các Worker Node, giám sát hệ thống và truyền nhiệm vụ xuống Worker Node.
- Nó gồm một số thành phần chính sau đây:
  - API Server: Nó giúp chúng ta tương tác với k8s cluster.
  - Scheduler: Nó có trách nhiệm theo dõi tải của các nodes. Từ đó có thể phân phối các công việc cho các nodes.
  - Controller-Manager: Nó là một components chạy nhiều controller khác như: `Node Controller` có tác dụng thoogn báo và phản hồi khi node gặp sự cố, `Replication Controller` chịu trách nhiệm duy trì đủ số lượng pods của mỗi object,...
  - Cloud-Controller-Manager:: tương tự Controller-Manager nhưng nó tùy chỉnh để tương tác với các nhà cung cấp dịch vụ cloud.
  - ETCD: Là nơi lưu trữ cấu hình mà các node trong cluster có thể sử dụng (thông qua Kubernetes API server)

### b. Worker Node

- Là một máy vật lý hoặc một máy ảo có tác dụng quản lý các pods và cung cấp `Kubernetes runtime environment`.
- Các thành phần chính:
  - Container Runtime: Là thành phần chịu trách nhiệm chạy containers. k8s hỗ trợ nhiều runtimes trong đó có Docker.
  - Kubelet: Chịu trách nhiệm đảm bảo containers chạy đúng nodes. Tương tác với Master node để nhận lệnh. Bên cạnh đó cũng cập nhật trạng thái của node cho Master.
  - Kube-Proxy: Có tác dụng quản lý môi trường mạng của node. Nó có khả năng `forward request` đến container mong muốn.

## 3. Pods

- Là đơn vị triển khai nhỏ nhất mà K8s có thể quản lý. Một pod gồm một hoặc nhiều container có cùng địa chỉ ip.
- Các container trong một pod có thể giao tiếp và tương tác với nhau.
- Nếu node chứa pod bị chết. Một pod mới sẽ được tạo ra với tên tương tự nhưng với UID mới.

# II. Demo

## 1. Chuẩn bị môi trường

Bài thực hành này được thực hiện trên máy ảo Ubuntu 16.04, ram 8Gb, disk 40gb

## 2. Cài đặt Minikube và Kubectl

### a. Cập nhật apt và cài đặt các package cần thiết

```console
    sudo apt-get update
    sudo apt-get install curl apt-transport-https docker.io
    sudo apt install virtualbox virtualbox-ext-pack
```

### b. Cài đặt minikube

- cài đặt packgae minikube

```console
wget https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
```

- sử dụng minikube ở command line

```console
sudo mv minikube-linux-amd64 /usr/local/bin/minikube
sudo chmod 755 /usr/local/bin/minikube
```

- Kiểm tra version của minikube khi đã cài đặt thành công

```console
minikube version
```

Nó sẽ ra kết quả tương tự như thế này:

`minikube version: v1.20.0 commit: c61663e942ec43b20e8e70839dcca52e44cd85ae`

### c. Cài đặt kubectl

- Tải package cần thiết

```console
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
```

- sử dụng kubectl ở command line

```console
sudo mv ./kubectl /usr/local/bin/kubectl
sudo chmod 755 /usr/local/bin/kubectl
```

- Kiểm tra version của kubectl sau khi cài đặt thành công

```console
kubectl version -o json
```

## 3. Cấu hình sử dụng minikube

- Thêm tài khoản trên ubuntu

```console
sudo adduser minikube
sudo passwd minikube
```

Sau đó nhập và xác thực mật khẩu cho tài khoản `minikube`

- Thêm tài khoản vừa tạo vào group `sudo` và `docker`

```console
sudo usermod -aG sudo minikube
sudo usermod -aG docker minikube
newgrp docker
```

- Thực hiện bài thực hành với tài khoản `minikube` vừa tạo ở trên( Nếu thực hiện ở tài khoản `root` nó sẽ cảnh báo `The "docker" driver should not be used with root privileges.`)

```console
su minikube
minikube start --driver=docker
```

## 4. Triển khai MariaDb và Wordpress

### a. Tạo service MariaDb

- Nội dung file `mariadb.yaml`

```console
---
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

> Chú ý đến tên của service này (`mariadb-server`) vì sẽ dùng nó để kết nối với mariadb

- Chạy service

```console
kubectl apply -f mariadb.yaml
```

### b. Tạo service Wordpress

- Nội dung fie `wordpress.yaml`

```console
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

> sử dụng `WORDPRESS_DATABASE_HOST= mariadb-server` với `mariadb-server` là tên service đã triển khai mariadb

- Chạy service

```console
kubectl apply -f wordpress.yaml
```

- Lấy địa chỉ để vào giao diện của wordpress

```console
minikube service wordpress --url
```

> Do wordpress có sử dụng kiểu LoadBalancer
> 
> Kết quả sẽ ra một địa chỉ giống như sau: http://192.168.49.2:31662

> Sử dụng địa chỉ trên để kiểm tra kết quả.
> ![image](https://user-images.githubusercontent.com/43313369/119906512-8c8d8e00-bf78-11eb-8813-baa1b7df88db.png)

## 5. Tài liệu tham khảo

- [Networking in K8s](https://cloud.google.com/kubernetes-engine/docs/concepts/network-overview)

- [Bài hướng dẫn deploy mysql+wordpress trang chủ k8s](https://kubernetes.io/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)

- [Labels và Selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)

- [Một số bài tương tự trên github](https://github.com/vietstacker/Viettel-Digital-Talent-Program-2021)
