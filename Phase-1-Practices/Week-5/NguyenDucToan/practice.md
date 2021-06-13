# Continuous Integration for basic web project with jenkins

## Step by step

### basic web:
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week5/main/images/basicweb.png)

1. build jenkins with docker

```bash
$ docker run 
-v /usr/bin/docker:/usr/bin/docker 
-v /home/jenkins/jenkins_data:/var/jenkins_home  
-p 8080:8080  --user 1001:998 --name jenkins-server 
-d jenkins/jenkins:lts
```

![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week5/main/images/startjenkins.png)

2. public port 8080 using ngrok:

```
$ ngrok http 8080
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week5/main/images/ngrok.png)
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week5/main/images/ngrok2.png)

3. add jenkinsfile to github main branch:

````jenkinsfile
pipeline {

  agent none

  stages {
    stage("Test") {
      agent {
          docker {
            image 'python:3.8-slim-buster'
            args '-u 0:0'
          }
      }
      steps {
        sh "pip install poetry"
        sh "poetry install"
        sh "poetry run pytest"
      }
    }

  post {
    success {
      echo "SUCCESSFUL"
    }
    failure {
      echo "FAILED"
    }
  }
}
````

4. add webhook from github with Payload url == "https://4c6ad187ad9b.ngrok.io/github-webhook/"
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week5/main/images/webhooks.png)

5. create pipeline from jenkins
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week5/main/images/1.png)
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week5/main/images/2.png)

6. build
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan-week5/main/images/build-fail.png)