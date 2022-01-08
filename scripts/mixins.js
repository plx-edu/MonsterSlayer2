// "use strict";

// Set methods for "easier" initialization
// of properties common to all DOM Elem
export function commonToAllElem(_obj){
    const mxn = {
        intrnlTxt(_val = String){
            console.log("boum", this, _val);
            this.innerText = _val;
            return this;
        },
        intrnlHTML(_val = String){
            this.innerHTML = _val;
            return this;
        },
        addLast(..._items){
            for(const k of _items){
                this.append(k);
            }
            return this
        },
        addFirst(..._items){
            for(const k of _items){
                this.append(k);
            }
            return this
        }
    };

    Object.assign(_obj, mxn);
}

// Set methods for "easier" initialization
// of properties common to all inputs
export function commonToAllInputs(_obj){
    const mxn = {
        setPlaceholder(_val = String){
            this.placeholder = _val;
            return this;
        },

        isRequired(_val = Boolean){
            this.required = _val;
            return this;
        }

    };

    Object.assign(_obj, mxn);
}

// of input type text
export function forTxt(_obj){
    const mxn = {
        minLen(_val = Number){
            this.minLength = _val;
            return this;
        },
        maxLen(_val = Number){
            this.maxLength = _val;
            return this;
        }
    };

    Object.assign(_obj, mxn);
}

// of input type number
export function forNum(_obj){
    const mxn = {
        setMin(_val = Number){
            this.min = _val;
            return this;
        },
        setMax(_val = Number){
            this.max = _val;
            return this;
        },
        setStep(_val = Number){
            this.step = _val;
            return this;
        }
    };
    Object.assign(_obj, mxn);
}