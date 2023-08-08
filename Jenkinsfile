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
                url: 'https://github.com/AwesomeGuy76/Jenkins.git'
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
            }
        }

        stage('Image push to ECR') {
            steps {
                sh 'docker build -t public.ecr.aws/i9j0a8l3/reca1team-ecr:$BUILD_NUMBER .'
                sh 'docker push public.ecr.aws/i9j0a8l3/reca1team-ecr:$BUILD_NUMBER'
            }
        }
        
        stage('Update Menifest ArgoCD') {
            steps {
                sh 'git config --global user.email "apfhd159862@naver.com"'
                sh 'git config --global user.name "sjh7711"'

                withCredentials([gitUsernamePassword(credentialsId: 'github-sjh', gitToolName: 'Default')]) {
                    sh 'git checkout argocd'
                    sh 'git pull origin argocd'
                    
                    sh 'sed -i "s~image: public.ecr.aws/i9j0a8l3/reca1team-ecr:|backend-v[0-9]+([.][0-9]+)*[0-9a-zA-Z.-]*~image: public.ecr.aws/i9j0a8l3/reca1team-ecr::$BUILD_NUMBER~" argo/infra.yaml'
                    sh 'git add argo/infra.yaml'
                    sh 'git commit -m "Update image in infra.yaml"'
                    sh 'git push origin argocd'
                }
            }
        }
    }
}
