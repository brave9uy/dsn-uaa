export const readFile = (file: File, receiver = ''): void => {
  const reader = new FileReader()
  reader.onload = (ev: ProgressEvent<FileReader>) => {
    // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
    const bytes = reader.result && typeof reader.result !== 'string' ? new Uint8Array(reader.result) : null
    if (bytes) {
      const length = bytes.byteLength
      for (let i = 0; i < length; i++) {
        receiver += String.fromCharCode(bytes[i])
      }
      console.log(receiver)
    }
  }
  reader.readAsArrayBuffer(file)
}

export const exportFile = (content: string, fileName = 'file.txt'): void => {
  const data = new Blob([content], { type: 'text/plain;charset=UTF-8' })
  const downloadUrl = window.URL.createObjectURL(data)
  const anchor = document.createElement('a')
  anchor.href = downloadUrl
  anchor.download = fileName
  anchor.click()
  window.URL.revokeObjectURL(downloadUrl)
}
