# CommonJS

A pack of some interesting functions that may be useful to code on JavaScript.


### Common.textExist

```javascript
// It will return true
let result = common.textExists('hello', 'hello world!');
```

### Common.jPromise

```javascript
common.jPromise(5).then((result) => {
	console.log(result); // 5
});
```


### Common.newObject

```javascript
let a = { "key": "value" };

// It will create a copy of a
// so b keys can be changed without affecting a
let b = common.newObject(a);
```


### Common.cutText

```javascript
// result will equal "Me gusta el jugo de naranja"
let result = common.cutText("<body><div>Me gusta el jugo de naranja</div></body>", "<div>", "</div>");
```


### Common.forEach

```javascript
let array = [1, 2, 3, 4, 5];

function pow(v, callback) {
	callback(v*2);
}

common.forEach(array, function(value, index, onComplete) {
	
	pow(value, function(new_value) {
		array[index] = new_value;
		onComplete();
	});
	
}).then(() => {
	// The result will be shown just after the function
	// received onComplete() for all elements
	console.log(array); // [1, 4, 9, 16, 25];
});
```

### Common.forEachSync

```javascript
// Works similarly as forEach, but the difference is that
// all the elements will be processed at the same time.
// It is faster if there's a use of I/O.
let array = ['1', '2', '3', '4' '5'];

common.forEachSync(array, function(value, index, onComplete) {

	redis.get(value, function(result) {
		array[index] = result;
		onComplete();
	});
	
}).then(() => {
	console.log(array); // will print values of the keys stored in redis.
});
```

### Common.extractor

```javascript
let book = {
    'title': 'How to learn JavaScript',
    'pages': 166,
    'author': 'Ramiz',
    'chapters': {
        '1': 'Introduction',
        '2': 'What it is',
        '3': 'Variables',
        '4': 'Promises',
        '5': 'Conclusion'
    }
};

let some_info = common.extractor(book, [
    'title',
    'author',
    'chapters.3'
    'chapters.4'
]);

/*
    some_info === {
        'title': 'How to learn JavaScript',
        'author': 'Ramiz',
        'chapters': {
            '3': 'Variables',
            '4': 'Promises'
        }
    };
*/
```

### Common.flattenArray

```javascript
let array = [1, [2, [3, [[4, 5], 6], 7], 8, 9]];
let result_array = common.flattenArray(array); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```
