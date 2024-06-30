export function decodeBase64(encodedString: string): string {
  try {
    const decodedString = atob(encodedString) // Use the built-in atob function
    return decodedString
  } catch (error) {
    console.error("Error decoding base64:", error)
    return ""
  }
}
