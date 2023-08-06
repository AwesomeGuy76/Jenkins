pipeline {
    agent any

    tools {
        gradle 'gradle8.2.1'
        jdk 'jdk17'
    }

    stages {
        stage('Git Progress') {
            steps {
                // Git 저장소에서 소스 코드를 체크아웃하는 단계입니다.
                git branch: 'main',
                credentialsId: 'b09432f5-5c15-491f-8213-ccd755902363',
                url: 'git@github.com:AwesomeGuy76/Jenkins.git'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'chmod +x gradlew'
                sh './gradlew clean build --exclude-task test'
            }
        }
    }
}
