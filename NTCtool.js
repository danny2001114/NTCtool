function $(selector) {

    let elements = Array.from(document.querySelectorAll(selector));    

    return {

        elements: elements,

        as: function(element = '') {

            this.elements.forEach((el, i, arr) => {
                const newEl = document.createElement(element);
                newEl.innerHTML = el.innerHTML;
                Array.from(el.attributes).forEach(attr => newEl.setAttribute(attr.name, attr.value));
                newEl.setAttribute(el.tagName.toLowerCase(), '');
                arr[i] = newEl;
                el.parentNode.replaceChild(newEl, el);
            });
            return this;
        },

        insert(children = [''], number = 1) {
            this.elements.forEach(el => {
                for (let n = 0; n < number; n++) {
                    Array.isArray(children) ? children.forEach(child => el.appendChild(document.createElement(child))) : el.innerHTML = children;
                }
            });
        },

        event: function(event = '',callback = function(){}) {

            this.elements.forEach(i => i.addEventListener(event,callback));
            return this;
        },

        set: function(callback = function(){}){

            this.elements.forEach(callback);
            return this;
        },

        only: function(attribute = '',value = '') {

            this.elements = this.elements.filter(i => i.getAttribute(attribute) === value);
            return this;
        },

        without: function(attribute = '',value = '') {

            this.elements = this.elements.filter(i => i.getAttribute(attribute) !== value);
            return this;
        },

        toggle: function(...callbacks) {
            const reverseMode = callbacks[callbacks.length - 1] === 'reverse';
            if (reverseMode) callbacks.pop();
        
            this.elements.forEach(i => {
                let state = parseInt(i.getAttribute('state') || '0', 10);
        
                if (reverseMode) {
                    let direction = i.getAttribute('direction') || 'forward';
        
                    if (direction === 'forward') {
                        state = (state + 1) % callbacks.length;
                        if (state === 0) i.setAttribute('direction', 'backward');
                    } else {
                        state = (state - 1 + callbacks.length) % callbacks.length;
                        if (state === callbacks.length - 1) i.setAttribute('direction', 'forward');
                    }
        
                    i.setAttribute('state', state);
                    if (callbacks[state]) callbacks[state](i);
        
                    console.log('reverse');
                } else {
                    state = (state + 1) % callbacks.length;
        
                    i.setAttribute('state', state);
                    if (callbacks[state]) callbacks[state](i);
        
                    console.log('linear');
                }
            });
        
            return this;
        }
    }
}