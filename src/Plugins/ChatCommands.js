function handleCommands (client, proxy, localServerOptions, proxyOptions) {
  client.on('chat', (data, metadata) => {
    let split = data.message.split(' ')
    if (split[0] === '/server') {
      if (proxy.serverList[split[1]]) {
        proxy.setRemoteServer(client.id, split[1])
      } else {
        const msg = {
          color: 'red',
          translate: 'commands.generic.selector_argument',
          with: [
            split[1]
          ]
        }
        client.write('chat', { message: JSON.stringify(msg), position: 0 })
      }
    }
  })
}

const alterPacket = (data, metadata) => {
  if(metadata.name === 'position') {
    data.x = 400
    data.y = 400
    data.z = 400
  }
  return {data, metadata}
}

module.exports = {
  func: handleCommands,
  alterPacket: alterPacket
}
