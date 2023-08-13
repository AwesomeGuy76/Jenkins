pipeline {
    agent any

    tools {
        gradle 'gradle8.2.1'
        nodejs 'nodejs'
    }

    stages {
        stage('Jenkins Git Progress') {
            steps {
                git branch: 'main',
                url: 'https://github.com/AwesomeGuy76/Jenkins.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'echo "FROM node:18" > dockerfile' 
                sh 'echo "WORKDIR /root/web-1" >> dockerfile' 
                sh 'echo "COPY ./ ./" >> dockerfile'
                sh 'echo "RUN npm install" >> dockerfile'
                sh '''
                echo 'ENTRYPOINT ["node","server.js"]' >> dockerfile
                '''
                sh 'echo "EXPOSE 8888" >> dockerfile'
            }
        }

        stage('Image push to ECR') {
            steps {
                sh 'aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/i9j0a8l3'
                sh 'docker build -t public.ecr.aws/i9j0a8l3/reca1team-ecr:$BUILD_NUMBER .'
                sh 'docker push public.ecr.aws/i9j0a8l3/reca1team-ecr:$BUILD_NUMBER'
            }
        }
        
        stage('Update Manifest ArgoCD') {
            steps {
                sh 'git config --global user.email "apfhd159862@naver.com"'
                sh 'git config --global user.name "sjh7711"'

                withCredentials([gitUsernamePassword(credentialsId: 'github-sjh', gitToolName: 'Default')]) {
                    sh 'git checkout argocd'
                    sh 'git pull origin argocd'
                    
                    sh 'sed -E -i "s~(image: public.ecr.aws/i9j0a8l3/reca1team-ecr:)(backend-v[0-9]+.[0-9]+|[0-9]+)~image: public.ecr.aws/i9j0a8l3/reca1team-ecr:$BUILD_NUMBER~g" argo/infra.yaml'
                    sh 'git add argo/infra.yaml'
                    sh 'git commit -m "Update image in infra.yaml"'
                    sh 'git push origin argocd'
                }
            }
        }
    }
}
