export const trackEvent = (category, action, label = '') => {
    try {
        window._czc.push(['_trackEvent', category, action, label])
    } catch (e) {}
}

export const trackPageview = () => {
    try {
        window._czc.push('_trackPageview', window.location.href, document.referrer)
    } catch (e) {}
}
