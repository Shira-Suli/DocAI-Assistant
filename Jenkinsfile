pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git branch: 'dev-b',
            url: 'https://github.com/Shira-Suli/DocAI-Assistant/tree/dev-b'
      }
    }

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

    stage('Build Docker images') {
      steps {
        sh 'docker-compose build'
      }
    }
  }
}
