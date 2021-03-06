const clickEvent = `undefined` !== typeof document && document.ontouchstart ?
  `touchstart` : `click`

function which(ev) {
  if (typeof window === `undefined`) {
    return false
  }
  let e = ev || window.event
  return e.which === null ? e.button : e.which
}

function sameOrigin(href) {
  if (typeof window === `undefined`) {
    return false
  }

  return href && href.indexOf(window.location.origin) === 0
}

function makeClickListener(push) {
  return function clickListener(event) { // eslint-disable-line
    if (which(event) !== 1) {
      return
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      return
    }

    if (event.defaultPrevented) {
      return
    }

    let element = event.target
    while (element && element.nodeName !== `A`) {
      element = element.parentNode
    }
    if (!element || element.nodeName !== `A`) {
      return
    }

    if (element.hasAttribute(`download`) ||
      element.getAttribute(`rel`) === `external`)
    {
      return
    }

    if (element.target) {
      return
    }

    const link = element.getAttribute(`href`)

    if (link && link.indexOf(`mailto:`) > -1 || link === `#`) {
      return
    }

    if (!sameOrigin(element.href)) {
      return
    }

    event.preventDefault()

    const {pathname, search, hash = ``} = element
    push(pathname + search + hash)
  }
}

function captureClicks(push) {
  const listener = makeClickListener(push)
  if (typeof window !== `undefined`) {
    document.addEventListener(clickEvent, listener, false)
  }
}

export {captureClicks}
