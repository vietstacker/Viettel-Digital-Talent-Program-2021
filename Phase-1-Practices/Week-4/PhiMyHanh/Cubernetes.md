## Install Kubernetes on PC by using mini-kube and specify Kubernetes components and Deploy Wordpress on Kubernetses ##  

*Giới thiệu*  

**1. Kubernetes**  

Kubernetes (hoặc k8s) là một nền tảng mã nguồn mở, sử dụng để tự động hoá việc quản lý, scaling và triển khai ứng dụng dưới dạng container hay còn gọi là Container orchestration engine. Kubernetes giúp chúng ta loại bỏ rất nhiều các quy trình thủ công liên quan đến việc triển khai và mở rộng các containerized applications.  

Kubernetes có thể gọi tắt là k8s - tức là bắt đầu bằng chữ "k", giữa là 8 ký tự và cuối là chữ "s" 😃)  

Kubernetes orchestration cho phép chúng ta xây dựng các dịch vụ ứng dụng mở rộng với nhiều containers. Nó lên lịch các containers đó trên một cụm, mở rộng các containers và quản lý tình trạng của các containers theo thời gian.  

Kubernetes là một công cụ mạnh mẽ được phát triển bởi Google, trước khi public thì Google đã sử dụng nó để quản lý hàng tỉ container của mình. 

**Kubenetes giải quyết vấn đề gì?**  

Bằng việc sử dụng docker, trên 1 host bạn có thể tạo ra nhiều container. Tuy nhiên nếu bạn có ý định sử dụng trên môi trường production thì phải bắt buộc phải nghĩ đến những vấn đề dưới đây:

Việc quản lý hàng loạt docker host
Container Scheduling
Rolling update
Scaling/Auto Scaling
Monitor vòng đời và tình trạng sống chết của container.
Self-hearing trong trường hợp có lỗi xãy ra. (Có khả năng phát hiện và tự correct lỗi)
Service discovery
Load balancing
Quản lý data, work node, log
Infrastructure as Code
Sự liên kết và mở rộng với các hệ thống khác
Bằng việc sử dụng một Container orchestration engine như K8s có thể giải quyết được nhưng vấn đề trên đây. Trong trường hợp không sử dụng k8s, Thì sẽ phải cần thiết tạo ra cơ chế tự động hoá cho những cái kể trên, như thế thì cực kỳ tốn thời gian và không khả thi.

**Các thành phần của K8S**  
1. Pods
![image](https://user-images.githubusercontent.com/46991949/123567565-a676f680-d7ec-11eb-85a3-2186e470ec35.png)

Khi triển khai ứng dụng, Kubernetes tạo ra Pod để lưu trữ phiên bản chạy của ứng dụng của bạn. Một Pod là một khái niệm trừu tượng của Kubernetes, đại diện cho một nhóm gồm một hoặc nhiều ứng dụng containers (ví dụ như Docker hoặc rkt) và một số tài nguyên được chia sẻ cho các containers đó.  
Mỗi Pod được gắn với Node nơi nó được lên lịch trình, và tiếp tục ở đó cho đến khi chấm dứt (theo chính sách khởi động lại). Trong trường hợp có lỗi ở Node, các Pods giống nhau được lên lịch trình trên các Nodes có sẵn khác trong cluster.  

2. Notes

Một Pod luôn chạy trên một Node. Một Node là một máy worker trong Kubernetes và có thể là máy ảo hoặc máy vật lý, tuỳ thuộc vào cluster. Mỗi Node được quản lí bởi Master. Một Node có thể chứa nhiều Pods và Kubernetes master tự động xử lí việc lên lịch trình các Pods thuộc các Nodes ở trong cluster. Việc lên lịch trình tự động của Master sẽ tính đến các tài nguyên có sẵn trên mỗi Node.

Mỗi Node ở Kubernetes chạy ít nhất:

* Kubelet, một quy trình chịu trách nhiệm liên lạc giữa Kubernetes Master và Node; quản lí các Pods và các containers đang chạy trên cùng một máy.
* Một container runtime (như Docker, rkt) chịu trách nhiệm lấy container image từ registry, giải nén container và chạy ứng dụng. Các containers chỉ nên được lên lịch trình cùng nhau trong một Pod duy nhất nếu chúng được liên kết chặt chẽ.
![image](https://user-images.githubusercontent.com/46991949/123568661-01a9e880-d7ef-11eb-8314-f7d0c9a49cbc.png)

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
```curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64```  
2. Cài đặt vào thư mục / usr / local / bin / minikube với  
  ```sudo install minikube-linux-amd64 /usr/local/bin/minikube```  
3. Cấp quyền điều hành tệp bằng lệnh chmod  
  ```sudo chmod 755 /usr/local/bin/minikube```   
4. Config sử dụng driver là docker
  ```minikube config set driver docker```
6. xác minh rằng bạn đã cài đặt thành công Minikube bằng cách kiểm tra phiên bản của phần mềm  
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
  ```sudo usermod -aG docker $USER && newgrp docker```
  ```minikube start```   
*Note:Nếu gặp lỗi như sau:  
![image](https://user-images.githubusercontent.com/46991949/119990283-5856b380-bff2-11eb-99ad-a88c663c1afc.png)  
*Thì có thế fix bằng cách bỏ qua kiểm tra CPU (kể từ v1.5.2) bằng cách sử dụng      
  ```minikube start --extra-config=kubeadm.ignore-preflight-errors=NumCPU --force --cpus 1```  

*Hoặc bạn gặp phải lỗi   
  ```Exiting due to GUEST_MISSING_CONNTRACK: Sorry, Kubernetes 1.20.2 requires conntrack to be installed in root's path```    
*Thì có thể sử dụng 2 câu lệnh sau để fix*    
  ```sudo apt-get install -y conntrack```  
  ```sudo -E minikube start --driver=none```  
Output  
![image](https://user-images.githubusercontent.com/46991949/120010069-eb014d80-c006-11eb-9f09-93c3f6e8ef08.png)
![image](https://user-images.githubusercontent.com/46991949/122777612-6688ae80-d2d6-11eb-9b5e-6d2f103d4ab9.png)  

Mở dashbroad của kubernet
  ```minikube dashboard --url```  
![image](https://user-images.githubusercontent.com/46991949/123578279-a9c7ad80-d7ff-11eb-9abf-ced10acda3ac.png)
![image](https://user-images.githubusercontent.com/46991949/123578765-b567a400-d800-11eb-98b3-2181b6b6fd02.png)



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
  Tiếp tục chạy    
    ```kubectl apply -f wordpress-deployment.yaml```  
  Output    
 ![image](https://user-images.githubusercontent.com/46991949/123580119-59eae580-d803-11eb-83fe-260414809168.png)
 ![image](https://user-images.githubusercontent.com/46991949/123580190-81da4900-d803-11eb-80f0-ba42b9db25fb.png)
 
 Hiển thị trạng thái Pods
![image](https://user-images.githubusercontent.com/46991949/123580359-e2698600-d803-11eb-8184-30c9c409c2a6.png)

Kiểm tra pod, service và deployment
![image](https://user-images.githubusercontent.com/46991949/123580485-22c90400-d804-11eb-9cdc-1a25fbc1e906.png)
![image](https://user-images.githubusercontent.com/46991949/123580557-4d1ac180-d804-11eb-832d-e02d4acc51fc.png)

Chạy lệnh 
![image](https://user-images.githubusercontent.com/46991949/123580657-79364280-d804-11eb-8a03-4748f6ada4ca.png)

Ta thấy rằng external-ip của wordpress-service luôn ở trong trạng thái pending. Do đó nên ta vẫn chưa tìm thấy được ip để kết nối tới wordpress. Lý do luôn ở trạng thái như trên là bởi các custom Kubernetes Cluster (như minikube, kubeadm) không có các LoadBlalancer tích hợp (các cloud AWS hay Google Cloud đều có)  

Giải quyết bằng cách chạy lệnh ```minikube service list```  
![image](https://user-images.githubusercontent.com/46991949/123580795-b995c080-d804-11eb-9881-be7672aeb87d.png)

Ta nhìn thấy địa chỉ sau http://192.168.  49.2:30338, và đây sẽ là địa chỉ truy cập
![image](https://user-images.githubusercontent.com/46991949/123581236-b222e700-d805-11eb-940d-1f3cdd4942c0.png)
