pipeline {
    agent any

    stages {
        stage("build") {
            steps {
                echo 'Building...'
                bat 'npm install'
                bat 'npm run tsc'
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
                // bat 'npm run fstart'
            }
        }
    }
}