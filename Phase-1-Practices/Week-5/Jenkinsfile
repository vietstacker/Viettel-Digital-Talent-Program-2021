pipeline {
    agent any

    tools {
        nodejs "nodejs"
    }
    stages {
        stage ('Start') {
            steps {
                echo "hello"
            }
        }

        stage ('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage ('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
