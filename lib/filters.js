export const fromMatching = items => item => ~items.indexOf(item)

export const toCash = (number, decimals = 2, symbol = '$') => `${symbol || ''}${round(number, decimals).toFixed(decimals).replace(/\.0+$/, '').replace(/(\d+)(\d{3})/, '$1,$2')}`
export const toCents = (number, decimals = 2, symbol = '¢') => `${round(number * 100, decimals).toFixed(decimals)}${symbol || ''}`
export const toIndex = (list, itemOrIndex) => typeof itemOrIndex === 'number' ? itemOrIndex : list.indexOf(itemOrIndex)
export const operate = value => operation => typeof value === 'number' ? operation(value) : value
export const rgb2hex = rgb => {
  const values = rgb.match(/(\d)+/gi)
  if (values.length === 3) {
    return '#' + values.map(hue => {
      const hex = Number(hue).toString(16)
      return hex.length === 1 ? `0${hex}` : hex
    }).join('')
  }
  return rgb
}
export const pluckStyle = (selector, styleName) => {
  const value = window.getComputedStyle(document.querySelector(selector))[styleName]
  return rgb2hex(value)
}
export const pluckFont = selector => {
  const style = window.getComputedStyle(document.querySelector(selector))
  const family = style.fontFamily.split(',')[0]
  const weight = style.fontWeight
  const size = style.fontSize
  const height = style.lineHeight
  return `${family} ${weight} ${size}, line ${height}`
}
export const monthlyKWHUsed = ({lastMonthBill = null, energyRate = null}) => (lastMonthBill && energyRate) ? (lastMonthBill / energyRate) : null
export const monthlySavings = ({lastMonthBill = null, energyRate = null}) => planRate => {
  const usedKWH = monthlyKWHUsed({lastMonthBill, energyRate})
  return isNumeric(usedKWH) ? lastMonthBill - (usedKWH * planRate) : null
}
export const monthlyCost = usedKWH => planRate => isNumeric(usedKWH) ? usedKWH * planRate : null
export const monthlyTermUnit = months => `${months} ${Number(months) === 1 ? 'month' : 'months'}`
export const groupLocationPlans = plans => {
  const locationPlans = []
  plans.slice(0)
  .sort((a, b) => {
    if (a.pricing.supplier.supplierId < b.pricing.supplier.supplierId) {
      return -1
    } else if (a.pricing.supplier.supplierId > b.pricing.supplier.supplierId) {
      return 1
    }
    return 0
  })
  .forEach((plan, index, arr) => {
    const location = {
      name: plan.siteName,
      pricing: plan.pricing,
      supplier: plan.pricing.supplier
    }
    if (!index || arr[index - 1].pricing.supplier.supplierId !== plan.pricing.supplier.supplierId) {
      locationPlans.push({
        locations: [location],
        supplier: plan.pricing.supplier,
        pricing: plan.pricing
      })
    } else {
      locationPlans[locationPlans.length - 1].locations.push(location)
    }
  })
  return locationPlans
}
export const getKeyValue = (item, key) => {
  if (typeof key === 'string') {
    return item[key]
  } else if (key.length === 1) {
    return item[key[0]]
  } else if (key.length > 1) {
    return getKeyValue(item[key[0]], key.slice(1))
  }
  return undefined
}
export const avgByKey = (list, key) => {
  const values = list.map(item => getKeyValue(item, key) || 0)
  return values.reduce((a, b) => a + b) / values.length
}
export const required = (message = 'This field is required.') => v => !!String(v).trim().length || message
export const validateEmail = (message = 'Email is invalid.') => v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || message // eslint-disable-line no-useless-escape
export const trimLower = str => !str ? str : str.trim().toLowerCase()
export const mapResponseData = property => response => response.data.map(item => item[property])
export const siteToLocation = site => Object.assign(pricingLocation({}), {
  siteId: site.id,
  siteName: site.name,
  postalCode: site.location.zip,
  utility: site.utility,
  lastMonthBill: site.monthlySpend,
  energyRate: site.energyRate
})
export const sitesToLocations = sites => sites.map(siteToLocation)
export const locationToSite = location => Object.assign(customerSite(), {
  id: location.siteId,
  name: location.siteName,
  energyRate: location.energyRate,
  monthlySpend: location.lastMonthBill,
  utility: location.utility,
  // TODO: Does not account for street addresses
  location: lookup(location.postalCode)
})
export const locationsToSites = locations => locations.map(locationToSite)
export const matchConditions = (collection, conditions) => {
  return collection.filter(item => {
    const keys = Object.keys(conditions)
    return keys.filter(key => conditions[key] === item[key]).length === keys.length
  })
}