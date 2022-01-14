// "use strict";

// Set methods for "easier" initialization
// of properties common to all DOM Elem
export function commonToAllElem(_obj) {
    const mxn = {
        insideTxt(_val = String = "") {
            this.innerText = _val;
            return this;
        },
        insideHTML(_val = String = "") {
            this.innerHTML = _val;
            return this;
        },
        addLast(..._items) {
            for (const k of _items) {
                this.append(k);
            }
            return this;
        },
        addFirst(..._items) {
            // WIP: reminder to, maybe, reverse argument first
            // for human readability, when calling method
            for (const k of _items) {
                this.prepend(k);
            }
            return this;
        },
        setClass(_classes = String = "") {
            for (const k of _classes.split(" ")) {
                if (k != "") this.classList.add(k);
            }
            return this;
        },
        setId(_id = String = "") {
            this.id = _id;
            return this;
        }
    };

    Object.assign(_obj, mxn);
    return _obj;
}

// Set methods for "easier" initialization
// of properties common to all inputs
export function commonToAllInputs(_obj) {
    const mxn = {
        setPlaceholder(_val = String = "") {
            this.placeholder = _val;
            return this;
        },

        isRequired(_val = Boolean = false) {
            this.required = _val;
            return this;
        },

        defaultVal(_val) {
            this.value = _val;
            return this;
        }
    };

    Object.assign(_obj, mxn);
}

// of input type text
export function forTxt(_obj) {
    const mxn = {
        minLen(_val = Number = 3) {
            this.minLength = _val;
            return this;
        },
        maxLen(_val = Number = 100) {
            this.maxLength = _val;
            return this;
        }
    };

    Object.assign(_obj, mxn);
}

// of input type number
export function forNum(_obj) {
    const mxn = {
        setMin(_val = Number = 1) {
            this.min = _val;
            return this;
        },
        setMax(_val = Number = 100) {
            this.max = _val;
            return this;
        },
        setStep(_val = Number = 25) {
            this.step = _val;
            return this;
        }
    };
    Object.assign(_obj, mxn);
}

// of input type radio
export function forRadio(_obj) {
    const mxn = {
        setName(_val = String = "") {
            this.name = _val;
            return this;
        },
    };
    Object.assign(_obj, mxn);
}