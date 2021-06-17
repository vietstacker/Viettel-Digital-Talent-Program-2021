pipeline {
agent any
    stage {
        stage ('setup') {
            checkout scm
        }
        stage ('Build') {
            sh 'npm install'
        }
        stage ('Test') {
            sh 'mocha test'
        }
    }

}