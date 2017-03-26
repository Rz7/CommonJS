var Promise     = require('bluebird'),
    moment      = require('moment');

var common = {
    start: (delay) => {

        if(delay)
            return Promise.delay(delay);

        return Promise.resolve(null);
    },
    waitFunc: (callback, delay) => {
        var self = this;
        return Promise.delay(delay).then(() => {
            if(typeof callback == 'function' && callback())
                return true;
            else
                return common.waitFunc(callback, delay);
        });
    },
    waitFuncResult: (callback, delay, time, count) => {
        var self = this;

        if( ! count)
            count = 0;

        if( ! time)
            time = delay * 10;

        return Promise.delay(delay).then(() => {
            if(typeof callback == 'function' && callback())
                return true;
            else if(++count >= parseInt(time / delay))
                return false;
            else
                return common.waitFunc(callback, delay, time, count);
        });
    },
    jPromise: (value) => {
        return new Promise((resolve) => { resolve(value); });
    },
    textExist: (text, phrase) => {
        return typeof text === 'string' && (text.indexOf(phrase) != -1);
    },
    newObject: (object) => {
        return JSON.parse(JSON.stringify(object));
    },
    cutText: (full_phrase, start_word, end_word) => {
        var start     = { word: start_word,     from: 1 };
        var end     = { word: end_word,     from: 1 };

        if(typeof start_word == 'object')
        {
            start.word = start_word[0];
            start.from = start_word[1];
        }

        if(typeof end_word == 'object')
        {
            end.word = end_word[0];
            end.from = end_word[1];
        }

        if(start.word != "")
        {
            var start_index = 0;
            for(var i = 0; i < start.from; ++i)
            {
                start_index = full_phrase.indexOf(start.word);

                if(start_index == -1)
                    continue;

                full_phrase = full_phrase.substring(start_index + start.word.length);
            }
        }

        if(end.word != "")
        {
            var start_index = 0;
            var _full_phrase = full_phrase;
            for(var i = 0; i < end.from; ++i)
            {
                start_index = full_phrase.indexOf(end.word);

                if(start_index == -1)
                    continue;

                full_phrase = full_phrase.slice(0, start_index);
            }
        }

        return full_phrase;
    },
    getTextsFromText: (full_phrase, start_phrase, end_phrase) => {
        var finalArray = [];

        while(true) {
            var start_index = full_phrase.indexOf(start_phrase);
            if( start_index == -1) break;

            var end_index = full_phrase.indexOf(end_phrase);
            if(end_index == -1) break;
            
            if(start_index < end_index) {
                  finalArray.push(
                      full_phrase.substring(start_index + start_phrase.length).slice(0, end_index - start_index - 1)
                  );
            }

            full_phrase = full_phrase.substring(end_index + 1);
        }

        return finalArray;
    },
    getStickersName: (value) => {
        if(typeof value != 'string')
            return [];

        var prefix = 'Sticker: ';
        var postfix = '</center>';

        if( value.indexOf(prefix) == -1
            || value.indexOf(postfix) == -1)
            return [];

        value = value.substring(value.indexOf(prefix) + prefix.length);
        
        value = value.slice(0, value.indexOf(postfix));

        value = value.trim().split(", ");
        
        return value;
    },
    waiter: (i, count) => {
        var waiting = {
            do: () => {
                return new Promise((resolve, reject) => {
                    waiting.checker = setInterval(() => {
                        waiting.check(resolve);
                    }, 500);
                });
            },
            check: (resolve) => {
                if(++waiting.counter > count * 2 || i())
                    {
                        clearInterval(waiting.checker);
                        resolve();
                    }
            },
            checker: null,
            counter: 0,
        };

        return waiting.do();
    },
    randomNumber: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getDBDate: (delta) => {
        var date = moment.utc();

        if(typeof delta != 'undefined')
        {
            if(delta['minutes'])
                date = date.add(delta['minutes'], 'm');

            if(delta['seconds'])
                date = date.add(delta['seconds'], 's');
        }

        return date.format("YYYY-MM-DD HH:mm:ss");
    },
    getDateWithDelta: (delta) => {
        var date = new Date();

        if(typeof delta != 'undefined')
        {
            if(delta['minutes'])
                date.setMinutes(date.getMinutes() + delta['minutes']);

            if(delta['seconds'])
                date.setSeconds(date.getSeconds() + delta['seconds']);
        }
        
        return date;
    },
    forEach: (array, _func) => {
        return Promise.resolve(null).then(() => {

            if( !array || array.length == 0)
                return null;

            if( typeof _func == 'undefined')
                return null;

            var go = {
                do: () => {
                    return new Promise((resolve, reject) => {
                        var index     = go.counter;
                        var element = array[go.counter];
                        var onComplete = () => { resolve(true); };

                        _func(element, index, onComplete);
                    })
                    .then(() => {
                        if(++go.counter == go.length)
                            return go.done();
                        else
                            return go.do();
                    });
                },
                done: () => {
                    return 'done';
                },
                counter: 0,
                length: array.length
            };

            return go.do();
        });
    },
    forEachAsync: (array, _func) => {
        return Promise.resolve(null).then(() => {

            if( !array || array.length == 0)
                return null;

            if( typeof _func == 'undefined')
                return null;

            var go = {
                do: () => {
                    return Promise.resolve(null).then(() => {
                        array.forEach((element, index) => {
                            _func(element, index, go.complete);
                        });
                    }).then(go.checking);
                },
                complete: () => {
                    ++go.counter;
                },
                checking: () => {
                    return Promise.delay(100).then(() => {
                        if(go.counter == go.length)
                            return 'done';
                        else
                            return go.checking();
                    });
                },
                counter: 0,
                length: array.length
            };

            return go.do();
        });
    },
    isNumeric: (value) => {
        return /^\d+$/.test(value);
    },
    isJsonString: (str) => {
        try { JSON.parse(str); } catch (e) { return false; } return true;
    },
    getPartnerToken: (tradeurl) => {
        var pt = { partner: "", token: "" }

        if(!tradeurl || !tradeurl.length || tradeurl.length < 5)
            return pt;
        
        for(var i = tradeurl.indexOf("r=") + 2; i < tradeurl.length; ++i)
        {
            if(tradeurl[i] == '&')
                break;
              
            pt.partner += tradeurl[i];
        }
        
        for(var i = tradeurl.indexOf("n=") + 2; i < tradeurl.length; ++i)
            pt.token += tradeurl[i];
        
        return pt;
    }
};

module.exports = common;
