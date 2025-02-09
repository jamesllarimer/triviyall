export function useUntil(ref: Ref<any>) {
  return {
    toBe: (value: any) => {
      return new Promise((resolve) => {
        if (ref.value === value) {
          resolve(true)
          return
        }

        const unwatch = watch(ref, (newValue) => {
          if (newValue === value) {
            unwatch()
            resolve(true)
          }
        })
      })
    }
  }
}
