# Practice CI/CD with Jenkins

## Tổng quan về CI/CD

* CI(Continuous Integration): là phương pháp phát triển phần mềm yêu cầu các thành viên của team tích hợp công việc của họ thường xuyên. Mỗi tích hợp được “build” tự động (bao gồm cả test) nhằm phát hiện lỗi nhanh nhất có thể. Cách tiếp cận này giảm thiểu vấn đề tích hợp và cho phép phát triển phần mềm nhanh hơn.

* CD (Continuous Deployment hoặc Continuous Delivery): có thể hiểu là triển khai liên tục hoặc phân phối liên tục, là một phần mở rộng để tích hợp liên tục trong đó phần mềm hoạt động có thể được phát hành cho người dùng cuối bất cứ lúc nào.

## Chuẩn bị

* Máy ảo Linux (host) để cài đặt và sử dụng Jenkins: 192.168.1.31

> host được cài đặt openssh-sever, docker, ansible

* Máy ảo Linux (node) để triển khai webserver thông qua ansible trên host: 192.168.1.35

>node được cài đặt openssh-server

## Tiến hành

1. Cài đặt Jenkins trên host

    a. Cài đặt Java

        $ sudo apt update
        $ sudo apt install openjdk-11-jdk

    b. Cài đặt Jenkins

        $ wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
        $ sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > \
                         /etc/apt/sources.list.d/jenkins.list'
        $ sudo apt-get update
        $ sudo apt-get install jenkins

    c. Mở khóa Jenkins:

* Truy cập http://localhost:8080/

    ![image](https://user-images.githubusercontent.com/83031380/121773404-f7101200-cba5-11eb-8db8-e83ba9b95222.png)

* Lấy mật khẩu bằng cách chạy lệnh:

    ```
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    ```

* Cài đặt các plugin

* Tạo tài khoản
  
* Tạo pipeline

  * Tạo: Nhập tên + chọn pipeline
  
  * Cấu hình: trong thẻ pipeline:

    * Definition: Pipeline script from SCM
    * SCM: Git
    * Repository: (link of your repository)

2. Viết web server

> soure code đính kèm thư mục

![image](https://user-images.githubusercontent.com/83031380/121774316-32adda80-cbac-11eb-9492-29fb01409b4e.png)


3. Viết unit test

> soure code đính kèm thư mục

4. Đẩy code lên GitHub

<https://github.com/LMThumeo/Simple-Java-We>

5. Viết Jenkinsfile-CI để tiến hành quá trình CI

> Jenkinsfile đính kèm thư mục

```
pipeline {
    agent any
    tools {
        maven 'Maven 3.3.9'
        jdk 'jdk8'
    }
    stages {
        stage('Build') {
            steps {
                git 'https://github.com/LMThumeo/Simple-Java-Web.git'
                sh  'mvn clean compile'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/TEST-*.xml'
                }
            }
        }
        stage('Publish') {
            steps {
                sh 'mvn package'
            }
            post {
                success {
                    archiveArtifacts 'target/*.jar'
                }
            }
        }
    }
}
```

> Console output lưu trong CI_console_output.txt

6. Thêm Dockerfile và Docker-compose.yml vào repository

>Dockerfile

```
FROM maven:3.3.9-jdk-8-alpine
COPY . .
RUN mvn package
ENTRYPOINT ["java", "-jar", "target/demo-0.0.1-SNAPSHOT.jar" ]
```

>Run

```
docker built -t javaweb:latest .
```

>Docker-compose.yml

```
version: '2'
services:
    greeting-server:
        container_name: greeting
        build:
            context: .
            dockerfile: Dockerfile
        image: javaweb:latest
        ports:
            - 18888:9999
```

>Run

```
docker-compose up
```

![image](https://user-images.githubusercontent.com/83031380/121774999-3858ef80-cbaf-11eb-8552-f791c9cc623d.png)

7. Viết Jenkinsfile-CD để build docker image từ repository và đẩy docker image lên DockerHub

>Jenkinsfle-CD đính kèm thư mục

```
pipeline {
  
  agent any
  
  environment {
    registry = "leminhthu/simple-java-web"
    registryCredential = 'dockerhub_id'
    dockerImage = ''
  }
        
  stages {
    //Building Docker images
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry
        }
      }
    }
    
     // Uploading Docker images into Docker Hub
    stage('Upload Image') {
     steps{    
        script {
            docker.withRegistry( '', registryCredential ) {
            dockerImage.push()
            }
          }
      }
    }
  }
}
```

![image](https://user-images.githubusercontent.com/83031380/121774174-39881d80-cbab-11eb-92b3-e6a209a94c58.png)

> Để có thể build được pipeline này, cần tạo credential dockerhub để đẩy image lên dockerhub

![image](https://user-images.githubusercontent.com/83031380/121774697-d055d980-cbad-11eb-95b5-17324209a2cd.png)

> Username: dockerhub ID
>
> Password: mật khẩu của tài khoản dockerhub
>
> ID: tùy ý (ID này sẽ dùng cho registryCredential trong pipeline)
>
> Description: tùy ý

8. Cài đặt ansible plugin

Manage Jenkins > Plugin Manager > Available > filter: ansible

9. Thêm 'Deploy' stage vào Jenkinsfile-CD để triển khai web server lên node thông qua ansible

>Jenkinsfle-CD đính kèm thư mục

```
 stage('Deploy') {
      steps{
        ansiblePlaybook credentialsId: 'thu', disableHostKeyChecking: true, installation: 'ansible', inventory: 'inventory.ini', playbook: 'deploy.yml'
      }
    }
```

> Console output lưu trong CD_console_output.txt

![image](https://user-images.githubusercontent.com/83031380/121774234-ad2a2a80-cbab-11eb-8144-5b2edc3512fb.png)

>Trước đó, cần thực hiện 2 việc
>
> * Sinh private key cho node

        $ ssh key-gen
        $ cd .ssh/
        $ cat id_rsa.pub >> authorized_keys
        $ cat id_rsa

=> Copy key này cho private key khi tạo credential

> * Tạo credential để ssh vào node với private key

       Kind: SSH Username with private key
       Scope: Global
       ID: tùy ý (Dùng cho credentialsId)
       Description: tùy ý
       Username: tùy ý
       Private key: private key được sinh ra ở node

## Tham khảo

<https://www.jenkins.io/doc/book/installing/linux/>

<https://www.youtube.com/watch?v=edQGrDWBlTA&list=PLponjU1wie0an3wBCCweDwSztXth1o4U>

<https://www.coachdevops.com/2020/05/automate-docker-builds-using-jenkins.html>

<https://www.youtube.com/watch?v=13FpCxCClLY>