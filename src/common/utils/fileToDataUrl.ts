interface FileToDataUrl {
  (file: File): Promise<string>
}

interface FilesToDataUrl {
  (files: File[]): Promise<string[]>
}

export const fileToDataUrl: FileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject("Window is not defined")
    }
    if (!file) {
      return reject("Url is not defined")
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      const result = reader.result as string
      return resolve(result)
    }
    reader.onerror = () => {
      return reject("An error occured")
    }
  })
}

export const filesToDataUrls: FilesToDataUrl = async (files: File[]) => {
  const filePromises: Promise<string>[] = []

  for (const file of files) {
    const filePromise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const dataURL = reader.result as string
        resolve(dataURL)
      }

      reader.onerror = () => {
        reject(reader.error)
      }

      reader.readAsDataURL(file)
    })

    filePromises.push(filePromise)
  }

  try {
    const dataURLs = await Promise.all(filePromises)
    return dataURLs
  } catch (error) {
    throw new Error("Failed to convert files to data URLs.")
  }
}
