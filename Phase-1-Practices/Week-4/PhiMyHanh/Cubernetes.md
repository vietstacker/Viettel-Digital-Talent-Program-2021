## Install Kubernetes on PC by using mini-kube and specify Kubernetes components and Deploy Wordpress on Kubernetses ##  

*Giới thiệu*  
*Minikube là một công cụ mã nguồn mở cho phép bạn thiết lập một cụm Kubernetes một nút trên máy cục bộ của bạn. Cụm được chạy bên trong một máy ảo và bao gồm Docker, cho phép bạn chạy các vùng chứa bên trong nút.*  


## A: Install Kubernetes on PC by using mini-kube and specify Kubernetes components ##
**Step 1: Cập nhật hệ thống và cài đặt các gói yêu cầu**  
```sudo apt-get update -y```  
```sudo apt-get upgrade -y```  
Ngoài ra, hãy đảm bảo cài đặt (hoặc kiểm tra xem bạn đã có chưa) các gói bắt buộc sau:  
```sudo apt-get install curl```  
```sudo apt-get install apt-transport-https```  

**Step 2: Cài đặt VirtualBox Hypervisor**  

Sẽ cần một máy ảo trong đó bạn có thể thiết lập cụm nút đơn của mình với Minikube  
Để cài đặt VirtualBox trên Ubuntu , hãy chạy lệnh  
```sudo apt install virtualbox virtualbox-ext-pack```  

**Step 3: Cài đặt Minikube**  

1. Đầu tiên, tải xuống bản nhị phân Minikube mới nhất bằng lệnh wget  
```wget https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64```  
2. Sao chép tệp đã tải xuống và lưu trữ vào thư mục / usr / local / bin / minikube với  
```sudo cp minikube-linux-amd64 /usr/local/bin/minikube```  
3. Cấp quyền điều hành tệp bằng lệnh chmod  
```sudo chmod 755 /usr/local/bin/minikube```  
4. xác minh rằng bạn đã cài đặt thành công Minikube bằng cách kiểm tra phiên bản của phần mềm  
```minikube version```  
![image](https://user-images.githubusercontent.com/46991949/119974088-76b2b400-bfde-11eb-9dad-221041554ba2.png)

**Step 4:  Cài đặt Kubectl**  

1. Tải xuống kubectl bằng lệnh sau  
```curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl```  
2. Làm cho tệp nhị phân có thể thực thi bằng cách nhập  
```chmod +x ./kubectl```  
3. Sau đó, di chuyển nhị phân vào đường dẫn của bạn bằng lệnh  
```sudo mv ./kubectl /usr/local/bin/kubectl```  
4. Xác minh cài đặt bằng cách kiểm tra phiên bản cá thể kubectl của bạn  
```kubectl version -o json```  
![image](https://user-images.githubusercontent.com/46991949/119974434-d741f100-bfde-11eb-8d50-ff138cf4826b.png)  

**Step 5: Khởi động Minikube**  

```minikube start```   
*Note:Nếu gặp lỗi như sau:  
![image](https://user-images.githubusercontent.com/46991949/119990283-5856b380-bff2-11eb-99ad-a88c663c1afc.png)  
*Thì có thế fix bằng cách bỏ qua kiểm tra CPU (kể từ v1.5.2) bằng cách sử dụng      
```minikube start --extra-config=kubeadm.ignore-preflight-errors=NumCPU --force --cpus 1```  

*Hoặc bạn gặp phải lỗi ```Exiting due to GUEST_MISSING_CONNTRACK: Sorry, Kubernetes 1.20.2 requires conntrack to be installed in root's path```  
*Thì có thể sử dụng 2 câu laanhj sau để fix*  
```sudo apt-get install -y conntrack```  
```sudo -E minikube start --driver=none```  
Output  
![image](https://user-images.githubusercontent.com/46991949/120010069-eb014d80-c006-11eb-9f09-93c3f6e8ef08.png)

## B: Deploy a WordPress blog on Minikube with persistent data ##  

Tạo thư mục /wordpress-minikube  
**Step 1: Tạo mật khẩu bí mật Kubernetes**  

1. Tạo một bản trình bày base64 cho mật khẩu của bạn. Lệnh dưới đây sẽ làm điều đó cho bạn  
```echo -n '1f2d1e2e67df' | base64```  

Lưu ý rằng đó 1f2d1e2e67dflà mật khẩu của bạn. Hãy thoải mái sử dụng bất kỳ mật khẩu nào bạn chọn. Đầu ra của lệnh trên sẽ là mật khẩu được mã hóa base64 của bạn . Sao chép nó.
Bây giờ, hãy tạo một tệp secrets.ymlvà dán mật khẩu được mã hóa base64 của bạn vào dòng cuối cùng.  
  ```apiVersion: v1
  kind: Secret
  metadata:
    name: mysql-pass
  type: Opaque
  data:
    password:
```  
Thực hiện lệnh này để tạo bí mật  
```kubectl apply -f secret.yml```  

**Step 2: Thực hiện deploy wordpress**  

1. Tạo file wordpress-deployment.yaml  
```apiVersion: v1
kind: Service
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  ports:
    - port: 80
  selector:
    app: wordpress
    tier: frontend
  type: LoadBalancer
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wp-pv-claim
  labels:
    app: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
---
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: frontend
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: frontend
    spec:
      containers:
      - image: wordpress:5.4.1-apache
        name: wordpress
        imagePullPolicy: Always
        
        env:
        - name: WORDPRESS_DB_HOST
          value: wordpress-mysql
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-pass
              key: password
        ports:
        - containerPort: 80
          name: wordpress
        volumeMounts:
        - name: wordpress-persistent-storage
          mountPath: /var/www/html
      volumes:
      - name: wordpress-persistent-storage
        persistentVolumeClaim:
          claimName: wp-pv-claim
  ```  
          
2. Tạo file mysql-deployment.yaml  
```apiVersion: v1
kind: Service
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
spec:
  ports:
    - port: 3306
  selector:
    app: wordpress
    tier: mysql
  clusterIP: None
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pv-claim
  labels:
    app: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
---
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: mysql
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: mysql
    spec:
      containers:
      - image: mysql:5.6
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-pass
              key: password
              imagePullPolicy: Always
        ports:
        - containerPort: 3306
          name: mysql
        readinessProbe:
          tcpSocket:
            port: 3306
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          tcpSocket:
            port: 3306
          initialDelaySeconds: 15
          periodSeconds: 20
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pv-claim
  ```  
  3. Lần lượt chạy các lệnh  
  ```sudo kubectl apply -f mysql-deployment.yaml```  
  Output  
  ``` service/wordpress-mysql created```  
  ```persistentvolumeclaim/mysql-pv-claim created```  
  ```deployment.apps/wordpress-mysql created```  
  Tiếp tục chạy    
  ```kubectl apply -f wordpress-deployment.yaml```  
  Output    
  ```service/wordpress created```  
  ```persistentvolumeclaim/wp-pv-claim created```  
  ```deployment.apps/wordpress created```