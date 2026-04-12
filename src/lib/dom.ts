/**
 * Utility for DOM manipulations and script loading.
 * Replicates the pattern from the Vue project's dom helper.
 */

const loadedScripts = new Set<string>()

export const dom = {
  /**
   * Loads an external script and returns a Promise that resolves when the script is loaded.
   * Tracks loaded URLs to prevent duplicate injections.
   */
  loadScript: ({
    url,
    attributes,
  }: {
    url: string
    attributes?: { key: string; value: string }[]
  }): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve()
        return
      }

      if (loadedScripts.has(url)) {
        resolve()
        return
      }

      // Check if the script exists in the document but not in our tracking set
      const existingScript = document.querySelector(`script[src="${url}"]`) as HTMLScriptElement
      if (existingScript) {
        if (existingScript.dataset.loaded === 'true') {
          loadedScripts.add(url)
          resolve()
          return
        }
        // If it exists but not loaded yet, wait for it
        const originalOnload = existingScript.onload
        existingScript.onload = (e) => {
          if (originalOnload) (originalOnload as any)(e)
          loadedScripts.add(url)
          resolve()
        }
        return
      }

      const script = document.createElement('script')
      script.src = url
      script.async = true
      script.defer = true

      if (attributes) {
        attributes.forEach((attr) => script.setAttribute(attr.key, attr.value))
      }

      script.onload = () => {
        script.dataset.loaded = 'true'
        loadedScripts.add(url)
        resolve()
      }

      script.onerror = () => {
        console.error(`Failed to load script: ${url}`)
        resolve() // Resolve to avoid hanging, but handle error in components
      }

      document.head.appendChild(script)
    })
  },
}
