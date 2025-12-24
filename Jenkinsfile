pipeline {
  agent any

  tools {
    nodejs 'node20'
  }

  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm install --prefix backend'
      }
    }

    stage('Run tests') {
      steps {
        sh 'npm test --prefix backend'
      }
    }

    // stage('Build Docker images') {
    //   steps {
    //     sh 'docker-compose build'
    //   }
    // }
  }
}
