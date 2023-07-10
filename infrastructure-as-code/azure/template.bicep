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
          image: 'hirebarend/kvs-typescript:latest'
          ports: [
            {
              port: 6379
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
          port: 6379
          protocol: 'TCP'
        }
      ]
    }
  }
}

resource containerInstanceContainerGroup2 'Microsoft.ContainerInstance/containerGroups@2022-09-01' = {
  name: 'ci-${name}-prod-002'
  location: location
  properties: {
    containers: [
      {
        name: name
        properties: {
          image: 'hirebarend/kvs-typescript:latest'
          ports: [
            {
              port: 6379
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
          port: 6379
          protocol: 'TCP'
        }
      ]
    }
  }
}

resource containerInstanceContainerGroup3 'Microsoft.ContainerInstance/containerGroups@2022-09-01' = {
  name: 'ci-${name}-prod-003'
  location: location
  properties: {
    containers: [
      {
        name: name
        properties: {
          image: 'hirebarend/kvs-typescript:latest'
          ports: [
            {
              port: 6379
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
          port: 6379
          protocol: 'TCP'
        }
      ]
    }
  }
}

resource containerInstanceContainerGroup1Benchmark 'Microsoft.ContainerInstance/containerGroups@2022-09-01' = {
  name: 'ci-${name}-prod-004'
  location: location
  properties: {
    containers: [
      {
        name: name
        properties: {
          image: 'hirebarend/kvs-benchmark:latest'
          ports: [
            {
              port: 8080
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
              name: 'URL'
              value: 'redis://${containerInstanceContainerGroup1.properties.ipAddress.ip}:6379'
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
          port: 8080
          protocol: 'TCP'
        }
      ]
    }
  }
}

resource containerInstanceContainerGroup2Benchmark 'Microsoft.ContainerInstance/containerGroups@2022-09-01' = {
  name: 'ci-${name}-prod-005'
  location: location
  properties: {
    containers: [
      {
        name: name
        properties: {
          image: 'hirebarend/kvs-benchmark:latest'
          ports: [
            {
              port: 8080
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
              name: 'URL'
              value: 'redis://${containerInstanceContainerGroup2.properties.ipAddress.ip}:6379'
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
          port: 8080
          protocol: 'TCP'
        }
      ]
    }
  }
}

resource containerInstanceContainerGroup3Benchmark 'Microsoft.ContainerInstance/containerGroups@2022-09-01' = {
  name: 'ci-${name}-prod-006'
  location: location
  properties: {
    containers: [
      {
        name: name
        properties: {
          image: 'hirebarend/kvs-benchmark:latest'
          ports: [
            {
              port: 8080
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
              name: 'URL'
              value: 'redis://${containerInstanceContainerGroup3.properties.ipAddress.ip}:6379'
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
          port: 8080
          protocol: 'TCP'
        }
      ]
    }
  }
}
