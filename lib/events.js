export const publish = events = name => events[name].forEach(callback => callback(events[name])) || true
export const subscribe = events = (name, callback) => (events[name] = events[name] || []) && events[name].push(callback)
export const unsubscribe = events = (name, callback) => (events[name] = events[name] || [])
  && (events[name] = events[name].filter(registeredCallback => registeredCallback !== callback))

export const config = () => ({
  events: {}
})

export const manager = () => {
  const controller = config()
  const { events } = controller
  return Object.assign(controller, {
    publish: publish(events),
    subscribe: subscribe(events),
    unsubscribe: unsubscribe(events)
  })
}

export const EventManager = manager()