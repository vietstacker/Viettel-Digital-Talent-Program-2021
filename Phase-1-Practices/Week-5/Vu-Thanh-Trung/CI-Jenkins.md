# Practice: Simple Jenkins CI Pipeline

A simple Jenkins CI Pipeline practice

[About Jenkins and CI](https://www.guru99.com/jenkin-continuous-integration.html)

## Install Jenkins for Windows

**Note:** Building on the controller node can be a security issue. You should set up distributed builds.

- Prerequisite: JDK 11 (remember to setup JAVA_HOME and Path in Environment variables)

- Download Jenkins LTS for Windows

![download-jenkins](https://user-images.githubusercontent.com/48465162/121563399-93ba9e80-ca44-11eb-9bef-41eeeec12ddd.png)

- Install then access at `localhost:8080`

## Setup Jenkins

- Sample repo: <https://github.com/trungvuthanh/simple-python-test-ci>

- Create Jenkinsfile in Github repo

```console
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                git branch: 'main', url: 'https://github.com/trungvuthanh/simple-python-test-ci.git'
            }
        }
        
        stage('Test') {
            steps {
                bat 'pytest -v -s'
                echo 'Testing application...'
            }
        }
    }
}
```

- Make new pipeline

![create-pipeline](https://user-images.githubusercontent.com/48465162/121568705-2c075200-ca4a-11eb-92c3-8e17465c8d09.png)

- In `Pipeline/Definition`, select `Pipeline script from SCM`, select `Git`, add repo URL, branch `*/main`

![repo-url](https://user-images.githubusercontent.com/48465162/121569634-31b16780-ca4b-11eb-8259-0d1eca805123.png)

- Build pipeline

![build-result](https://user-images.githubusercontent.com/48465162/121577713-0121fb80-ca54-11eb-9725-4f42c5ecfad3.png)

- Failed result after modified test source code

![test-fail](https://user-images.githubusercontent.com/48465162/121582157-e1410680-ca58-11eb-93af-3cc77f7a7f44.png)
