node {
	stage('Git Progress') {
	  steps {
		git branch: 'main',
		credentialsId: 'b09432f5-5c15-491f-8213-ccd755902363',
		url: 'git@github.com:AwesomeGuy76/Jenkins.git'
	  }
	}


	stage('Gradle build') {
		sh 'gradle clean build --exclude-task test'
	}
	
	
	
}
