@description('Container Registry name')
param name string

@description('Location for the Container Registry')
param location string

@description('Tags for the Container Registry')
param tags object = {}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = {
  name: name
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
  tags: tags
}

output name string = containerRegistry.name
output loginServer string = containerRegistry.properties.loginServer
output username string = containerRegistry.listCredentials().username
output password string = containerRegistry.listCredentials().passwords[0].value
