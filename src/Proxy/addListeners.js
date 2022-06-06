const mc = require('minecraft-protocol')

function addListeners (remoteClient, that) {
  if (remoteClient.isFirstConnection) {
    remoteClient.on('packet', (data, metadata) => {
      if (remoteClient.localClient.state === mc.states.PLAY && metadata.state === mc.states.PLAY) {
        remoteClient.localClient.write(metadata.name, data)
      }
    })
  }

  remoteClient.localClient.on('packet', (data, metadata) => {
    for(let plugin of that.proxyPlugins) {
      if(plugin.hasOwnProperty('alterPacket')) {
        const altered = plugin.alterPacket(data, metadata);
        console.log('altered', altered, plugin)
        data = altered.data;
        metadata = altered.metadata;
      }
    }
    
    if (metadata.name === 'kick_disconnect') return
    if (remoteClient.state === mc.states.PLAY && metadata.state === mc.states.PLAY) {
      remoteClient.write(metadata.name, data)
    }
  })

  remoteClient.localClient.on('kick_disconnect', (data, metadata) => {
    if (that.getFallbackServerName() === remoteClient.currentServer) {
      remoteClient.write(metadata.name, data)
    } else {
      that.fallback(remoteClient.id)
    }
  })
}

module.exports = addListeners
