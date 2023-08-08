pipeline {
    agent any

    tools {
        gradle 'gradle8.2.1'
        jdk 'jdk17'
    }

    stages {
        stage('Jenkins Git Progress') {
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
                sh 'echo "COPY ./build/libs/board-0.0.1-SNAPSHOT.jar app.jar" >> dockerfile'
                sh 'echo "ENTRYPOINT ["java","-jar","/app.jar"]" >> dockerfile'
                sh 'echo "EXPOSE 8080" >> dockerfile'

                sh 'aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/i9j0a8l3'
                sh 'docker build -t web .'
                sh 'docker tag web:latest public.ecr.aws/i9j0a8l3/web:$BUILD_NUMBER'
            }
        }

        stage('Image push to ECR') {
            steps {
                sh 'docker push public.ecr.aws/i9j0a8l3/web:$BUILD_NUMBER'
            }
        }
        
        stage('Update Menifest ArgoCD') {
            steps {
                sh 'git config --global user.email "apfhd159862@naver.com"'
                sh 'git config --global user.name "sjh7711"'

                withCredentials([gitUsernamePassword(credentialsId: 'github-sjh', gitToolName: 'Default')]) {
                    sh 'git checkout tmp'
                    sh 'git branch -a'
                    sh 'git status'
                    
                    sh 'sed -i "s~image: public.ecr.aws/i9j0a8l3/web:[0-9]*~image: public.ecr.aws/i9j0a8l3/web:$BUILD_NUMBER~" argo/tomcat.yaml'
                    sh 'git status'
                    sh 'git add argo/tomcat.yaml'
                    sh 'git status'
                    sh 'git commit -m "Update image in tomcat.yaml"'
                    sh 'git status'
                    sh 'git push origin tmp'
                    sh 'git status'
                    sh 'git checkout main'
                    sh 'git merge tmp'
                    sh 'git push origin main'
                }
            }
        }
    }
}
