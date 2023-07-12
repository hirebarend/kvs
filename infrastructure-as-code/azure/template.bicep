param name string = 'kvs'

param location string = resourceGroup().location

resource containerInstanceContainerGroup1 'Microsoft.ContainerInstance/containerGroups@2022-09-01' = {
  name: 'ci-${name}-prod-001'
  location: location
  properties: {
    containers: [
      {
        name: name
        properties: {
          image: 'hirebarend/kvs-csharp:latest'
          ports: [
            {
              port: 1337
              protocol: 'TCP'
            }
          ]
          resources: {
            requests: {
              cpu: 1
              memoryInGB: 1
            }
          }
          environmentVariables: [
            {
              name: 'NO_DELAY'
              value: 'true'
            }
            {
              name: 'UNCORK'
              value: 'true'
            }
          ]
        }
      }
    ]
    osType: 'Linux'
    restartPolicy: 'Never'
    ipAddress: {
      type: 'Public'
      ports: [
        {
          port: 1337
          protocol: 'TCP'
        }
      ]
    }
  }
}

resource containerInstanceContainerGroup1Benchmark 'Microsoft.ContainerInstance/containerGroups@2022-09-01' = {
  name: 'ci-${name}-prod-002'
  location: location
  properties: {
    containers: [
      {
        name: name
        properties: {
          image: 'hirebarend/kvs-benchmark:latest'
          ports: [
            {
              port: 1337
              protocol: 'TCP'
            }
          ]
          resources: {
            requests: {
              cpu: 1
              memoryInGB: 1
            }
          }
          environmentVariables: [
            {
              name: 'HOST'
              value: containerInstanceContainerGroup1.properties.ipAddress.ip
            }
          ]
        }
      }
    ]
    osType: 'Linux'
    restartPolicy: 'Never'
    ipAddress: {
      type: 'Public'
      ports: [
        {
          port: 1337
          protocol: 'TCP'
        }
      ]
    }
  }
}
