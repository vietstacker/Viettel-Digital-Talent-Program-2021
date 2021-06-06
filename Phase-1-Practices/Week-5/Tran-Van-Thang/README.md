# CI/CD với Jenkins, Docker, K8S

- [CI/CD với Jenkins, Docker, K8S](#cicd-với-jenkins-docker-k8s)
  - [I.Chuẩn bị môi trường](#ichuẩn-bị-môi-trường)
  - [II. Cài đặt môi trường](#ii-cài-đặt-môi-trường)
    - [1. Cài đặt trên Server chạy Jenkins](#1-cài-đặt-trên-server-chạy-jenkins)
    - [2. Cài đặt trên Server chạy K8s](#2-cài-đặt-trên-server-chạy-k8s)
  - [III. Continuous Integration(CI)](#iii-continuous-integrationci)
    - [1. Setup repo](#1-setup-repo)
    - [2. Build và xem logs](#2-build-và-xem-logs)
  - [IV. Continuous Delivery(CD)](#iv-continuous-deliverycd)
    - [1. Build image Docker](#1-build-image-docker)
    - [2. Publish lên registry](#2-publish-lên-registry)
    - [3. Deploy thành service LoadBalancer K8s](#3-deploy-thành-service-loadbalancer-k8s)
  - [V. Kiểm tra kết quả](#v-kiểm-tra-kết-quả)
  - [VI. Tài liệu tham khảo](#vi-tài-liệu-tham-khảo)

## I.Chuẩn bị môi trường

- Bài thực hành được thực hiện với 2 máy ảo Ubutu 18.04 ram 4gb, ổ cứng 40gb, 2 cores CPU, sử dụng network brigde ra internet.Trong đó:
  - Máy 1: Server chạy Jenkins phục vụ CI/CD có địa chỉ ip `192.168.0.105`
  - Máy 2: Server chạy K8s có địa chỉ ip `192.168.0.106`

## II. Cài đặt môi trường

### 1. Cài đặt trên Server chạy Jenkins

- Cài đặt docker

```console
    sudo apt update
    sudo apt install docker.io
```

- Cài đặt docker:dind để chạy được docker command trong Jenkins node

```console
    docker network create jenkins
    docker run --name jenkins-docker --rm --detach \
    --privileged --network jenkins --network-alias docker \
    --env DOCKER_TLS_CERTDIR=/certs \
    --volume jenkins-docker-certs:/certs/client \
    --volume jenkins-data:/var/jenkins_home \
    --publish 2376:2376 docker:dind --storage-driver overlay2
```

- Tạo image custom Jenkins bằng Dockerfile

```console
   FROM jenkins/jenkins:2.289.1-lts-jdk11
   USER root
   RUN apt-get update && apt-get install -y apt-transport-https \
       ca-certificates curl gnupg2 \
       software-properties-common
   RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
   RUN apt-key fingerprint 0EBFCD88
   RUN add-apt-repository \
       "deb [arch=amd64] https://download.docker.com/linux/debian \
       $(lsb_release -cs) stable"
   RUN apt-get update && apt-get install -y docker-ce-cli
   USER jenkins
   RUN jenkins-plugin-cli --plugins "blueocean:1.24.6 docker-workflow:1.26"
```

sau đó build images với tên và tag tùy ý, ở đây mình dùng `myjenkins:1.1`

```console
    docker build -t myjenkins:1.1 .
```

- Khởi chạy Jenkins

```console
docker run --name jenkins-blueocean --rm --detach \
  --network jenkins --env DOCKER_HOST=tcp://docker:2376 \
  --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 --publish 50000:50000 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  --volume "$HOME":/home \
  myjenkins:1.1
```

- Sau khi khởi chạy thành công bạn có thể truy cập `http://{ip-máy-đang-chạy-jenkins}:8080/`, như setup ip của mình ở trên thì mình sẽ truy cặp `http://192.168.0.105:8080`, ở giao diện này Jenkins yêu cầu nhập `initialAdminPassword`. Muốn lấy mật khẩu này bạn phải `exec` vào container chạy Jenkins sau đó đọc file `/var/jenkins_home/secrets/initialAdminPassword` để lấy ra password và điền vào giao diện.

- Sau đó vào giao diện chính, bạn truy cập `http://192.168.0.105:8080/pluginManager/` cài dặt các plugin liên quan đến docker như: Docker API Plugin, Docker Commons Plugin,
  Docker Pipeline, Pineline

> Tất cả quá trình cài đặt Jenkins trên mình đều làm theo ở đây `https://www.jenkins.io/doc/tutorials/build-a-java-app-with-maven/`

### 2. Cài đặt trên Server chạy K8s

- Cài đặt K8s mình đã có bài viết ở đây `https://github.com/tranthang2404/Viettel-Digital-Talent-Program-2021/blob/week4/Phase-1-Practices/Week-4/Tran-Van-Thang/k8s.md`

> Lưu ý: Bài viết trên mình tạo thêm user `minikube` nhưng trong cài đặt lần này mình sử dụng luôn user có quyền sudo mặc định khi tạo máy ảo

## III. Continuous Integration(CI)

> CI của mình chỉ gồm có quá trình build và test code đơn giản với Java

### 1. Setup repo

- Tạo repo và push code của bạn lên git
- Tạo pipeline và trỏ đến repo github của bạn:
  > Trang chủ -> New Item -> Điền tên pineline rồi chọn `pipeline` sau đó ấn `OK`
  
  > -> Chọn tab `Build Triggers` rồi tích chọn `GitHub hook trigger for GITScm polling` (Sau này mỗi khi repo github của bạn có thay đổi nó sẽ thông báo cho bạn bởi webhook)
  
  > -> Tiếp tục click sang tab `Pipeline` chọn `Pipeline script from SCM` ở mục Definition
  
  > -> chọn `Git` ở mục SCM -> Điền links repo của bạn vào muc `Repository URL` 
  
  > -> Save
- Trỏ port 8080 của jenkins ra ngoài để ip public có thể gọi đến bằng `ngrok` 
  ```console
    sudo apt install snapd
    sudo snap install ngrok
    ngrok http 8080
  ```
> Cài đặt webhook trên github như hình ảnh sau:

  ![step web-hook](https://user-images.githubusercontent.com/43313369/121549503-1e48d100-ca38-11eb-86e0-d7df50551480.PNG)



### 2. Build và xem logs

Trên giao diện chính bên phải, bạn click vào pipeline bạn vừa tạo sau đó ấn `Build Now` -> Sau đó màn hình sẽ hiển thị ra thêm một mục ở `Build History` -> Truy cập trang đó và xem logs quá trình build ở mục `Console Output`

```console
stage('Build') {
    agent {
        docker {
            image 'maven:3.8.1-adoptopenjdk-11'
            args '-v /root/.m2:/root/.m2'
        }
    }
    steps {
        sh 'mvn -B -DskipTests clean package'
    }
}
stage('Test') {
    agent {
        docker {
            image 'maven:3.8.1-adoptopenjdk-11'
            args '-v /root/.m2:/root/.m2'
        }
    }
    steps {
        sh 'mvn test'
    }
    post {
        always {
            junit 'target/surefire-reports/*.xml'
        }
    }
}
```

> Khi commit một trường hợp test case sai, quá trình build của mình sẽ thất bại do không vượt qua test

![image](https://user-images.githubusercontent.com/43313369/121551202-a380b580-ca39-11eb-8366-528bca5c9ff2.png)


## IV. Continuous Delivery(CD)

> Sau khi test và chạy code thành công

>  -> Build thành một image Docker

>  -> Push image đó lên registry (build và push image đều thực hiện trên container chạy Jenkins)

>  -> Chạy service bởi K8s trên Server `192.168.0.106`

### 1. Build image Docker

Mình sử dụng node agent `master` mặc định để build image

```console
stage("Build Docker file"){

    agent { node 'master' }

    steps {
        sh 'docker build -t tranthang2404/simple-java:latest .'
    }

}

```

### 2. Publish lên registry

> Trước khi publish được bởi agent `master` mình đã phải exec vào container chạy Jenkins và đăng nhập tài khoản docker hub( Các bạn có thể xem thêm tại: `https://docs.docker.com/engine/reference/commandline/login/`)

```console
stage("Publish to Docker hub"){

    agent { node 'master' }

    steps {
        sh 'docker push tranthang2404/simple-java:latest'
    }

}
```

### 3. Deploy thành service LoadBalancer K8s

> Vì server K8s mình chạy trên một server khác nên để kết nối với Jenkins thì Jenkins có hỗ trợ phương thức thêm `Node`. Ở đây mình sử dụng cơ chế ssh để kết nối Jenkins và K8s.

> Lưu ý: Trên Server chạy k8s các bạn cài đặt thêm Java8 hoặc Java11 để quá trình kết nối giữa Jenkins và server K8s không xảy ra lỗi.

Các bạn truy cập `http://192.168.0.105:8080/computer/new` -> Điền tên node theo ý của mình -> Các bạn điền các thông tin liên quan đến server. Các bạn nhớ click chữ `Add` (theo mũi tên như hình) để cung cấp thông tin đăng nhập, vì ở đây sử dụng cơ chế ssh nên các bạn cần cấp (tài khoản,mật khẩu) hoặc ssh key.
![jenkins](https://user-images.githubusercontent.com/43313369/120930746-c9941600-c718-11eb-96fd-a5691e3db514.PNG)

Kết quả setup thành công:
![2node](https://user-images.githubusercontent.com/43313369/120930787-fea06880-c718-11eb-81fb-8c16ca6307b0.PNG)



Tạo sẵn một file `~/k8s/simple-server-java.yaml` để triển khai service LoadBalancer khi có yêu cầu từ Jenkins. File đó có nội dung như sau (thay đổi tên images theo tên bạn đã sử dụng):

```console
apiVersion: v1
kind: Service
metadata:
  name: simple-java
  labels:
    app: simple-java
spec:
  ports:
    - port: 8000
  selector:
    app: simple-server
  type: LoadBalancer

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: simple-java
  labels:
    app: simple-server
spec:
  selector:
    matchLabels:
      app: simple-server
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: simple-server
    spec:
      containers:
      - name: simple-server
        image: tranthang2404/simple-java:latest
        ports:
        - containerPort: 8000
```

Mọi thử setup xong xuôi, mình sẽ thêm một step vào pipeline của Jenkinfile:

```console
stage('Deploy on K8s') {

    agent { node 'node-k8s' }

    steps {
    sh 'kubectl apply -f ~/k8s/simple-server-java.yaml'
    }
}
```

> `node-k8s` là tên node mình vừa thêm ở các bước trên

 > Kết quả build thành công hay thất bại đều hiển thị ở trang quản trị
 
 ![image](https://user-images.githubusercontent.com/43313369/121551981-4a655180-ca3a-11eb-9fe9-382ebf458ddc.png)

## V. Kiểm tra kết quả

- Kết quả của mình:

Truy cập vào `server k8s`(sau khi build các step trong Jenkinsfile thành công), lấy địa chỉ ip của service vừa build bằng cách:

```console
minikube service simple-java --url
```

Sau đó gọi API `tests` để xem kết quả (trả về chữ `Hello`):

```console
    curl "http://192.168.49.2:30393/tests"
```

![kkqetqua](https://user-images.githubusercontent.com/43313369/120930764-de70a980-c718-11eb-914f-60ba1f31a767.PNG)

## VI. Tài liệu tham khảo

- [Cài đặt Jenkins và tạo pipeline CI với Jenkins(nguồn tham khảo chính viết bài viết này)](https://www.jenkins.io/doc/tutorials/build-a-java-app-with-maven/)

- [Jenkinsfile syntax cơ bản](https://viblo.asia/p/jenkins-pipeline-for-beginners-Qbq5QgJJZD8)
