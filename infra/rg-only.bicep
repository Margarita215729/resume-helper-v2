targetScope = 'subscription'

@description('Name of the environment')
param environmentName string

@description('Primary location for all resources')
param location string

var tags = { 'azd-env-name': environmentName }

// Create resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

output resourceGroupName string = rg.name
