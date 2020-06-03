export function checkConnection(isConnected) {
  return {
    type: '@network/CHECK_CONNECTION',
    payload: isConnected,
  };
}
