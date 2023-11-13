export function useIntersection(){
  
  const observer = ref<IntersectionObserver | null>(null)
  const isIntersection = ref(true)
  const elRef = ref<HTMLElement | null>(null)


  const intersectionObserver = (el: HTMLElement,options = {
    root: null,
    threshold: 0
  }) => {
    observer.value = new IntersectionObserver((entries,obv) => {

      entries.forEach((item) => {
        isIntersection.value = item.isIntersecting
      })

    },options)

    observer.value.observe(el)
  }

  return{
    intersectionObserver,
    elRef,
    isIntersection
  }
}