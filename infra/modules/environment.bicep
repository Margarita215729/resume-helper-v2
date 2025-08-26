@description('Container Apps Environment name')
param name string

@description('Location for the Container Apps Environment')
param location string

@description('Tags for the Container Apps Environment')
param tags object = {}

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: name
  location: location
  properties: {}
  tags: tags
}

output name string = containerAppsEnvironment.name
output environmentId string = containerAppsEnvironment.id
output defaultDomain string = containerAppsEnvironment.properties.defaultDomain
