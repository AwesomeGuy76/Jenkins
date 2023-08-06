pipeline {
    agent any

    tools {
        gradle 'gradle8.2.1'
        jdk 'jdk17'
    }

    stages {
        stage('Git Progress') {
            steps {
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

        stage('Build Docker Image') {
            steps {
                sh 'echo "FROM openjdk:17-oracle" > dockerfile'
                sh 'echo "RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime" >> dockerfile'
                sh 'echo "COPY ./build/lib/board-0.0.1-SNAPSHOT.jar app.jar" >> dockerfile'
                sh 'echo "ENTRYPOINT ["java","-jar","/app.jar"]" >> dockerfile'
                sh 'echo "EXPOSE 8080" >> dockerfile'

                sh 'aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/i9j0a8l3'
                sh 'docker build -t web .'
                sh 'dockertag=$(date +"%G%m%d%H%M%S%N")'
                sh 'docker tag web:latest public.ecr.aws/i9j0a8l3/web:$dockertag'
            }
        }

        stage('Push to ECR'){
            steps {
                sh 'docker push public.ecr.aws/i9j0a8l3/web:$dockertag'
            }
        }
    }
}
