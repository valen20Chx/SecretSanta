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
            when {
                expression {
                    BRANCH_NAME == 'dev'
                }
            }
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