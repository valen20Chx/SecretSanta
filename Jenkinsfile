pipeline {
    agent any

    stages {
        stage("build") {
            steps {
                echo 'Building...'
                sh 'npm install'
                sh 'npm run tsc'
            }
        }
        stage("test") {
            steps {
                echo 'Testing...'
            }
        }
        stage("deploy") {
            steps {
                echo 'Deploying...'
                sh 'npm fstart'
            }
        }
    }
}