@description('Container App name')
param name string

@description('Location for the Container App')
param location string

@description('Tags for the Container App')
param tags object = {}

@description('Container Apps Environment ID')
param containerAppsEnvironmentId string

@description('Container Registry Login Server')
param containerRegistryLoginServer string

@description('Container Registry Username')
param containerRegistryUsername string

@description('Container Registry Password')
@secure()
param containerRegistryPassword string

@description('GitHub Token for API access')
@secure()
param githubToken string

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: name
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 3000
        transport: 'http'
        allowInsecure: false
      }
      registries: [
        {
          server: containerRegistryLoginServer
          username: containerRegistryUsername
          passwordSecretRef: 'container-registry-password'
        }
      ]
      secrets: [
        {
          name: 'container-registry-password'
          value: containerRegistryPassword
        }
        {
          name: 'github-token'
          value: githubToken
        }
      ]
    }
    template: {
      containers: [
        {
          image: 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
          name: 'resume-helper-v2'
          env: [
            {
              name: 'DATABASE_URL'
              value: 'postgresql://username:password@localhost:5432/resume_helper_dev'
            }
            {
              name: 'GITHUB_TOKEN'
              secretRef: 'github-token'
            }
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'NEXT_PUBLIC_APP_URL'
              value: 'https://${name}.azurecontainerapps.io'
            }
          ]
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 10
      }
    }
  }
  tags: tags
}

output name string = containerApp.name
output fqdn string = containerApp.properties.configuration.ingress.fqdn
