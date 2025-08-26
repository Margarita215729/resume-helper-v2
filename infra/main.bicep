targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

// Generate a unique token for naming resources
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = { 'azd-env-name': environmentName }

// Create resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

// Deploy container registry
module containerRegistryModule 'modules/registry.bicep' = {
  name: 'container-registry-deployment'
  scope: rg
  params: {
    name: 'cr${resourceToken}'
    location: location
    tags: tags
  }
}

// Deploy container apps environment
module containerAppsEnvironmentModule 'modules/environment.bicep' = {
  name: 'container-apps-environment-deployment'
  scope: rg
  params: {
    name: 'cae-${resourceToken}'
    location: location
    tags: tags
  }
}

// Deploy container app
module containerAppModule 'modules/containerapp.bicep' = {
  name: 'container-app-deployment'
  scope: rg
  params: {
    name: 'ca-${resourceToken}'
    location: location
    tags: tags
    containerAppsEnvironmentId: containerAppsEnvironmentModule.outputs.environmentId
    containerRegistryLoginServer: containerRegistryModule.outputs.loginServer
    containerRegistryUsername: containerRegistryModule.outputs.username
    containerRegistryPassword: containerRegistryModule.outputs.password
  }
}

// Outputs
output AZURE_LOCATION string = location
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistryModule.outputs.loginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerRegistryModule.outputs.name
output AZURE_CONTAINER_APP_NAME string = containerAppModule.outputs.name
output AZURE_CONTAINER_APP_ENVIRONMENT_NAME string = containerAppsEnvironmentModule.outputs.name
