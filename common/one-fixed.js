/**
 * option
 * - elements
 * - fixedClass
 */
module.exports = function onefixed (option) {
    var elements = option.elements

    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements)
    }

    function _hasClass (el, klass) {
        var classList = el.classList
        if (classList) {
            return classList.contains(klass)
        } else {
            return new RegExp(' ' + klass + ' ').test(' ' + el.className + ' ')
        }
    }

    function addClass (el, klass) {
        if (!_hasClass(el, klass)) {
            var classList = el.classList
            if (classList) {
                classList.add(klass)
            } else {
                el.className += ' ' + klass
            }
        }
    }

    function removeClass (el, klass) {
        if (_hasClass(el, klass)) {
            var classList = el.classList
            if (classList) {
                classList.remove(klass)
            } else {
                let newClass = ' ' + el.className.replace(/[\t\r\n]/g, '') + ' '
                while (newClass.indexOf(' ' + klass + ' ') >= 0) {
                    newClass = newClass.replace(' ' + klass + ' ', ' ')
                }
                el.className = newClass.replace(/^\s+|\s+$/g, '')
            }
        }
    }

    function offsetTop (el) {
        var top = 0
        if (el.offsetParent) {
            do {
                top += el.offsetTop
            } while (el = el.offsetParent)
        }
        return top
    }

    var udf
    var lastIndex
    var zones = []
    var offsetWidth
    var offsetHeight

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i]
        if (!offsetHeight) {
            offsetWidth = element.offsetWidth
            offsetHeight = element.offsetHeight
        }
        zones.push(offsetTop(element))
    }

    function getIndex (offset) {
        if (lastIndex !== udf) {
            offset += offsetHeight
        }

        for (var i = 0; i < zones.length; i++) {
            if (i !== zones.length - 1) {
                var head = zones[i]
                var tail = zones[i + 1]
                if (offset >= head && offset <= tail) {
                    return i
                }
            }
        }
    }

    function setStyle (el, style) {
        for (var property in style) {
            el.style[property] = style[property]
        }
    }

    function changeFixedElement (index, lastIndex) {
        var el = elements[index]
        var lastEl = elements[lastIndex]
        var nextIndex = (lastIndex === udf || index > lastIndex) ? index + 1 : lastIndex - 1
        var nextEl = elements[nextIndex]
        var param = {
            index: index,
            lastIndex: lastIndex,
            nextIndex: nextIndex,
            offsetWidth: offsetWidth,
            offsetHeight: offsetHeight
        }

        if (option.beforeChange) {
            option.beforeChange(param)
        }

        if (el) {
            setStyle(el, {
                zIndex: 1,
                width: offsetWidth + 'px'
            })
            addClass(el, option.fixedClass)
        }

        if (nextEl) {
            setStyle(nextEl, {
                zIndex: 2
            })
        }

        if (lastEl) {
            setStyle(lastEl, {
                width: '',
                zIndex: ''
            })
            removeClass(lastEl, option.fixedClass)
        }

        if (option.afterChange) {
            option.afterChange(param)
        }
    }

    document.addEventListener('scroll', function () {
        var scrollTop = window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop || 0

        var index = getIndex(scrollTop)

        if (lastIndex !== index) {
            changeFixedElement(index, lastIndex)
            lastIndex = index
        }
    })
}
