const addConnectionEventHandler = (namespace, roomTable) => {
  namespace.on("connection", (socket) => {
    
  })
}

export const scheduleNamespaceConstructor = (io, nsp) => {

  // Schedule 관련 실시간 통신을 처리할 Namespace
  const namespace = io.of(nsp)

  // (key: travelId - value: room)으로 묶여 있는 roomTable
  const roomTable = {}



  namespace.on("connection", (socket) => {

  })

}