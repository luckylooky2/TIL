### Destructuring Arrays([])

```js
const restaurant = {
	name: "Classico Italiano",
	location: "Via Angelo Tavanti 23, Firenze, Italy",
	categories: ["Italian", "Pizzeria", "Vegetarian", "Organic"],
	starterMenu: [
	  "Focaccia",
	  "Bruschetta",
	  "Garlic Bread",
	  "Caprese Salad",
	],
	mainMenu: ["Pizza", "Pasta", "Risotto"],

	order: function (starterIndex, mainIndex) {
	  return [this.starterMenu[starterIndex], this.mainMenu[mainIndex]];
	},
  };

  let [first, second] = restaurant.categories;
  console.log(first, second); // Italian, Pizzeria

  // skipping
  const [f, , s] = restaurant.categories;
  console.log(f, s); // Italian, Vegetarian

  // swapping
  [first, second] = [second, first];
  console.log(first, second); // Pizzeria, Italian

  const [starter, main] = restaurant.order(2, 0);
  console.log(starter, main); // Garlic Bread, Pizza

  // nested array
  const nested = [2, 4, [5, 6]];
  const [x, , [y, z]] = nested;
  console.log(x, y, z); // 2, 5, 6

  // default values
  const [p, q, r = 1] = [8, 9];
  console.log(p, q, r); // 8, 9, 1
```

```js
const books = [
  {
    title: 'Algorithms',
    author: ['Robert Sedgewick', 'Kevin Wayne'],
    publisher: 'Addison-Wesley Professional',
    publicationDate: '2011-03-24',
    edition: 4,
    keywords: ['computer science', 'programming', 'algorithms', 'data structures', 'java', 'math', 'software', 'engineering'],
    pages: 976,
    format: 'hardcover',
    ISBN: '9780321573513',
    language: 'English',
    programmingLanguage: 'Java',
    onlineContent: true,
    thirdParty: {
      goodreads: {
        rating: 4.41,
        ratingsCount: 1733,
        reviewsCount: 63,
        fiveStarRatingCount: 976,
        oneStarRatingCount: 13
      }
    },
    highlighted: true
  },
  {
    title: 'Structure and Interpretation of Computer Programs',
    author: ['Harold Abelson', 'Gerald Jay Sussman', 'Julie Sussman (Contributor)'],
    publisher: 'The MIT Press',
    publicationDate: '2022-04-12',
    edition: 2,
    keywords: ['computer science', 'programming', 'javascript', 'software', 'engineering'],
    pages: 640,
    format: 'paperback',
    ISBN: '9780262543231',
    language: 'English',
    programmingLanguage: 'JavaScript',
    onlineContent: false,
    thirdParty: {
      goodreads: {
        rating: 4.36,
        ratingsCount: 14,
        reviewsCount: 3,
        fiveStarRatingCount: 8,
        oneStarRatingCount: 0
      }
    },
    highlighted: true
  },
  {
    title: 'Computer Systems: A Programmer\'s Perspective',
    author: ['Randal E. Bryant', 'David Richard O\'Hallaron'],
    publisher: 'Prentice Hall',
    publicationDate: '2002-01-01',
    edition: 1,
    keywords: ['computer science', 'computer systems', 'programming', 'software', 'C', 'engineering'],
    pages: 978,
    format: 'hardcover',
    ISBN: '9780130340740',
    language: 'English',
    programmingLanguage: 'C',
    onlineContent: false,
    thirdParty: {
      goodreads: {
        rating: 4.44,
        ratingsCount: 1010,
        reviewsCount: 57,
        fiveStarRatingCount: 638,
        oneStarRatingCount: 16
      }
    },
    highlighted: true
  },
  {
    title: 'Operating System Concepts',
    author: ['Abraham Silberschatz', 'Peter B. Galvin', 'Greg Gagne'],
    publisher: 'John Wiley & Sons',
    publicationDate: '2004-12-14',
    edition: 10,
    keywords: ['computer science', 'operating systems', 'programming', 'software', 'C', 'Java', 'engineering'],
    pages: 921,
    format: 'hardcover',
    ISBN: '9780471694663',
    language: 'English',
    programmingLanguage: 'C, Java',
    onlineContent: false,
    thirdParty: {
      goodreads: {
        rating: 3.9,
        ratingsCount: 2131,
        reviewsCount: 114,
        fiveStarRatingCount: 728,
        oneStarRatingCount: 65
      }
    }
  },
  {
    title: 'Engineering Mathematics',
    author: ['K.A. Stroud', 'Dexter J. Booth'],
    publisher: 'Palgrave',
    publicationDate: '2007-01-01',
    edition: 14,
    keywords: ['mathematics', 'engineering'],
    pages: 1288,
    format: 'paperback',
    ISBN: '9781403942463',
    language: 'English',
    programmingLanguage: null,
    onlineContent: true,
    thirdParty: {
      goodreads: {
        rating: 4.35,
        ratingsCount: 370,
        reviewsCount: 18,
        fiveStarRatingCount: 211,
        oneStarRatingCount: 6
      }
    },
    highlighted: true
  },
  {
    title: 'The Personal MBA: Master the Art of Business',
    author: 'Josh Kaufman',
    publisher: 'Portfolio',
    publicationDate: '2010-12-30',
    keywords: ['business'],
    pages: 416,
    format: 'hardcover',
    ISBN: '9781591843528',
    language: 'English',
    thirdParty: {
      goodreads: {
        rating: 4.11,
        ratingsCount: 40119,
        reviewsCount: 1351,
        fiveStarRatingCount: 18033,
        oneStarRatingCount: 1090
      }
    }
  },
  {
    title: 'Crafting Interpreters',
    author: 'Robert Nystrom',
    publisher: 'Genever Benning',
    publicationDate: '2021-07-28',
    keywords: ['computer science', 'compilers', 'engineering', 'interpreters', 'software', 'engineering'],
    pages: 865,
    format: 'paperback',
    ISBN: '9780990582939',
    language: 'English',
    thirdParty: {
      goodreads: {
        rating: 4.7,
        ratingsCount: 253,
        reviewsCount: 23,
        fiveStarRatingCount: 193,
        oneStarRatingCount: 0
      }
    }
  },
  {
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    publisher: 'Grand Central Publishing',
    publicationDate: '2016-01-05',
    edition: 1,
    keywords: ['work', 'focus', 'personal development', 'business'],
    pages: 296,
    format: 'hardcover',
    ISBN: '9781455586691',
    language: 'English',
    thirdParty: {
      goodreads: {
        rating: 4.19,
        ratingsCount: 144584,
        reviewsCount: 11598,
        fiveStarRatingCount: 63405,
        oneStarRatingCount: 1808
      }
    },
    highlighted: true
  }
];
```

### Destructuring Object ({})

```js
  const restaurant = {
	name: "Classico Italiano",
	location: "Via Angelo Tavanti 23, Firenze, Italy",
	categories: ["Italian", "Pizzeria", "Vegetarian", "Organic"],
	starterMenu: [
	  "Focaccia",
	  "Bruschetta",
	  "Garlic Bread",
	  "Caprese Salad",
	],
	mainMenu: ["Pizza", "Pasta", "Risotto"],

	openingHours: {
	  thu: {
		open: 12,
		close: 22,
	  },
	  fri: {
		open: 11,
		close: 23,
	  },
	  sat: {
		open: 0, // Open 24 hours
		close: 24,
	  },
	},

	orderDelivery: function ({ starterIndex, mainIndex, time, address }) {
	  console.log(
		`Order received! ${this.starterMenu[starterIndex]} and ${this.mainMenu[mainIndex]} will be delivered to ${address} at ${time}`
	  );
	},
  };

  // 순서는 중요하지 않지만, 프로퍼티 이름은 반드시 같아야 한다
  const { name, openingHours, categories } = restaurant;
  console.log(name, openingHours, categories); // Classico Italiano, {thu: {…}, fri: {…}, sat: {…}}, ['Italian', 'Pizzeria', 'Vegetarian', 'Organic']

  // 새로운 변수 이름
  const {
	name: restaurantName,
	openingHours: hours,
	categories: tags,
  } = restaurant;

  // default values
  const { menu = [], starterMenu: starters = [] } = restaurant;
  console.log(menu, starters); // [], ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad']

  // mutating variables
  let a = 111;
  let b = 999;
  const obj = { a: 23, b: 7, c: 14 };
  let { x, y } = obj;
  // JS 엔진은 코드 블록으로 인식하기 때문에 구문 오류 => {a, b} = obj
  ({ a, b } = obj); // 괄호로 감싸야 함
  console.log(a, b); // 23, 7

  // nested objects
  const {
	fri: { open: o, close: c },
	sat,
  } = openingHours;

  console.log(o, c); // 11, 23
  console.log(sat); // {open: 0, close: 24}

  // argument as object : 순서를 기억할 필요가 없음
  restaurant.orderDelivery({
	time: "22:37",
	address: "Via del Sole, 21",
	mainIndex: 2,
	starterIndex: 2,
  });
```

### Spread Operator(...)

```js
  const restaurant = {
	name: "Classico Italiano",
	location: "Via Angelo Tavanti 23, Firenze, Italy",
	categories: ["Italian", "Pizzeria", "Vegetarian", "Organic"],
	starterMenu: [
	  "Focaccia",
	  "Bruschetta",
	  "Garlic Bread",
	  "Caprese Salad",
	],
	mainMenu: ["Pizza", "Pasta", "Risotto"],

	openingHours: {
	  thu: {
		open: 12,
		close: 22,
	  },
	  fri: {
		open: 11,
		close: 23,
	  },
	  sat: {
		open: 0, // Open 24 hours
		close: 24,
	  },
	},

	orderPasta: function (ing1, ing2, ing3) {
	  console.log(
		`Here is your delicious pasta with ${ing1}, ${ing2} and ${ing3}`
	  );
	},
  };

  // Iterable에서 내용물을 열거해주는 연산자
  // - 즉 ","로 연결되어 사용할 수 있는 곳에서만 사용할 수 있다!
  // - arrays, strings, maps, sets
  // - NOT objects
  // - ES2018: objects에서도 사용할 수 있음
  const arr = [7, 8, 9];
  const badNewArr = [1, 2, arr[0], arr[1], arr[2]];
  const newArr = [1, 2, ...arr];
  console.log(badNewArr, newArr); // [1, 2, 7, 8, 9], [1, 2, 7, 8, 9]
  console.log(...newArr); // 1 2 7 8 9

  const str = "Jonas";
  const letters = [...str];
  console.log(letters); // ['J', 'o', 'n', 'a', 's']
  console.log(...letters); // J o n a s
  // ","로 연결되어 사용할 수 있는 곳에서만 사용할 수 있다
  // console.log(`${...letters}`) // Uncaught SyntaxError: Unexpected token '...'

  const newMenu = [...restaurant.mainMenu, "Gnocchi"];

  // copy
  const mainMenuCopy = [...restaurant.mainMenu];

  // join
  const allMenu = [...restaurant.mainMenu, ...restaurant.starterMenu];

  // Real-world examples
  const ingredients = [
	prompt("Let's make pasta! Ingredient 1?"),
	prompt("Ingredient 2?"),
	prompt("Ingredient 3?"),
  ];
  restaurant.orderPasta(...ingredients);

  // also in objects(ES2018)
  const newRestaurant = {
	foundedIn: 1998,
	...restaurant,
	name: "Bistro Roma",
	founder: "Guiseppe",
  };
  console.log(newRestaurant); // {foundedIn: 1998, name: 'Classico Italiano', location: 'Via Angelo Tavanti 23, Firenze, Italy', categories: Array(4), starterMenu: Array(4), …}
```

### Rest Pattern(...)

```js
// 1) Destructuring
// SPREAD
const arr = [1, 2, ...[3, 4]];
console.log(arr); // [1, 2, 3, 4]

// REST
const [a, b, ...others] = [1, 2, 3, 4, 5];
console.log(a, b, others); // 1, 2, [3, 4, 5]

const [a, ...others, b] = [1, 2, 3, 4, 5]; // Uncaught SyntaxError: Rest element must be last element

const [pizza, , risotto, ...otherFood] = [
	...restaurant.mainMenu,
	...restaurant.starterMenu
]
```
- spread, rest 둘 다 똑같이 생겼지만 하는 역할은 정반대이다
- spread
	- `=` 연산자 오른편에서 요소를 나열하는 역할
- rest
	- `=` 연산자 왼편에서 나머지 요소를 묶는 역할
	- 특성 상 가장 오른쪽에 밖에 오지 못함

```js
// 2) Function
// REST
const add = function(...numbers) {
	let sum = 0;
	for (let i = 0; i < numbers.length; i++) {
		sum += numbers[i];
	}
	return sum;
}

add(2, 3);
add(5, 3, 7, 2);
add(8, 1, 2, 33, 18, 2, 9);

const x = [1, 2, 3];
// SPREAD
add(...x);
```
- spread
	- argument로 사용
- rest
	- parameter로 사용

### Short Circuit Evaluation(&&, ||, ??)

```js
// OR
console.log(3 || 'Jonas'); // 3
console.log('' || 'Jonas'); // Jonas
console.log(true || 0); // true
console.log(undefined || null); // null

// AND
console.log(0 && 'Jonas'); // 0
console.log(7 && 'Jonas'); // Jonas
console.log('Hello' && 23 && null && 'Jonas'); // null
```
- *Use ANY data type, Return ANY data type*
	- 반드시 boolean을 반환하는 것이 아니다
- 값을 평가하는 기준?
	- truthy
	- falsy
	- nullish
```js
// truthy : everything except falsy
'Hello', 23;
// falsy
false, undefined, 0, -0, 0n, '', "", ``, null, NaN;
// nullish : null and undefined
undefined, null
```

```js
// OR(||)
const guests1 = restaurant.numGuests ? restaurant.numGuests : 10;
// same as above
const guests2 = restaurant.numGuests || 10;
```
- 이런 비슷한 표현을 많이 사용하는 것 같은데, 막상 Short Circuit Evaluation이 떠오르지 않는다
- 가독성이 더 좋으므로 많이 대체하려고 노력하자

```js
// AND(&&)
if (restaurant.orderPizza) {
	restaurant.orderPizza('mushrooms', 'spinach');
}
// same as above
restaurant.orderPizaa && restaurant.orderPizza('mushrooms', 'spinach');
```

```js
// nullish coalescing operator(??)
// 0은 falsy 값이라도 0 자체 값이 의미를 가진다
const a = 0;
console.log(a ?? 10); // 0

const b = "123";
console.log(b ?? 100); // 123

const c = null;
console.log(c ?? 20); // 20
```
- ES2020
- nullish coalescing operator는 `undefined`와 `null`인지 아닌지를 판단한다
	- 맞다면, 뒤를 실행(반환)
	- 틀리다면, not nullish를 반환
- 즉, 어떤 값이든 할당이 되어 있는지를 확인할 때 사용한다
	- 일부 falsy 값이라도 값 자체가 있으면 유효한 값으로 처리한다

### Logical Assignment Operator(||=, &&=, ??=)

```js
// ||=
const rest1 = {
	name: 'Capri',
	numGuests: 20,
};

const rest2 = {
	name: 'La Piazza',
	owner: 'Giovanni Rossi',
};

// rest1.numGuests = rest1.numGuests || 10;
// rest2.numGuests = rest2.numGuests || 10;
rest1.numGuests ||= 10;
rest2.numGuests ||= 10;

console.log(rest1.numGuests); // 20
console.log(rest2.numGuests); // 10
```
- ES2021
- 연산자를 이용하여 값을 평가하고, 평가한 값을 *할당*할 때 사용한다
- `+=` 연산자와 같이 `a = a + 10` 형식으로 나타낼 수 있을 때 사용한다

```js
const rest1 = {
	name: 'Capri',
	numGuests: 0,
};

const rest2 = {
	name: 'La Piazza',
	owner: 'Giovanni Rossi',
};

rest1.numGuests ||= 10;
rest2.numGuests ||= 10;

console.log(rest1.numGuests); // 10
console.log(rest2.numGuests); // 10
```

```js
// ??=
const rest1 = {
	name: 'Capri',
	numGuests: 0,
};

const rest2 = {
	name: 'La Piazza',
	owner: 'Giovanni Rossi',
};

rest1.numGuests ??= 10;
rest2.numGuests ??= 10;

console.log(rest1.numGuests); // 0
console.log(rest2.numGuests); // 10
```
- 할당하려는 값이 falsy인데 그 값이 유효하기 때문에 유지하려고 하는 경우, nullish를 사용한다

```js
const rest1 = {
  name: "Capri",
  numGuests: 0,
};

const rest2 = {
  name: "La Piazza",
  owner: "Giovanni Rossi",
};

// truthy 일 때만 할당한다
rest1.owner = rest1.owner && "< ANONYMOUS >";
rest2.owner = rest2.owner && "< ANONYMOUS >";
console.log(rest1); // {name: 'Capri', numGuests: 0, owner: undefined}
console.log(rest2); // {name: 'La Piazza', owner: '< ANONYMOUS >'}
```

```js
// &&=
const rest1 = {
  name: "Capri",
  numGuests: 0,
};

const rest2 = {
  name: "La Piazza",
  owner: "Giovanni Rossi",
};

// truthy 일 때만 할당한다
rest1.owner &&= "< ANONYMOUS >";
rest2.owner &&= "< ANONYMOUS >";
console.log(rest1); // {name: 'Capri', numGuests: 0} 
console.log(rest2); // {name: 'La Piazza', owner: '< ANONYMOUS >'}
```
- 위의 예시는 `undefined`가 직접 프로퍼티에 할당이 되었고, 아래의 예시는 그렇지 않다는 점에서 차이가 있다
- 미관상의 차이가 아닐까?
	- 기능상의 차이는 없다

### Enhanced Object Literals(ES6)

```js
 const restaurant = {
	name: "Classico Italiano",
	location: "Via Angelo Tavanti 23, Firenze, Italy",
	categories: ["Italian", "Pizzeria", "Vegetarian", "Organic"],
	starterMenu: [
	  "Focaccia",
	  "Bruschetta",
	  "Garlic Bread",
	  "Caprese Salad",
	],
	mainMenu: ["Pizza", "Pasta", "Risotto"],

	openingHours: {
	  thu: {
		open: 12,
		close: 22,
	  },
	  fri: {
		open: 11,
		close: 23,
	  },
	  sat: {
		open: 0, // Open 24 hours
		close: 24,
	  },
	},
	
	orderPasta: function (ing1, ing2, ing3) {
	  console.log(
		`Here is your delicious pasta with ${ing1}, ${ing2} and ${ing3}`
	  );
	},
  };
```
- ES6에서 추가된 객체 리터럴 작성 방식
	1. Object 변수명으로 프로퍼티 추가하기
	2. function 키워드 없이 함수를 정의
	3. 프로퍼티명을 [] 안에서 expression을 사용할 수 있음

```js
const openingHours = {
  thu: {
	open: 12,
	close: 22,
  },
  fri: {
	open: 11,
	close: 23,
  },
  sat: {
	open: 0, // Open 24 hours
	close: 24,
  },
};

const restaurant = {
	name: "Classico Italiano",
	location: "Via Angelo Tavanti 23, Firenze, Italy",
	categories: ["Italian", "Pizzeria", "Vegetarian", "Organic"],
	starterMenu: [
	  "Focaccia",
	  "Bruschetta",
	  "Garlic Bread",
	  "Caprese Salad",
	],
	mainMenu: ["Pizza", "Pasta", "Risotto"],
	// 1. Object 변수명으로 프로퍼티 추가하기
	// openingHours: openingHours보다 간결하게 사용 가능
	openingHours,
	
	orderPasta: function (ing1, ing2, ing3) {
	  console.log(
		`Here is your delicious pasta with ${ing1}, ${ing2} and ${ing3}`
	  );
	},
  };
```

```js
const restaurant = {
	name: "Classico Italiano",
	location: "Via Angelo Tavanti 23, Firenze, Italy",
	categories: ["Italian", "Pizzeria", "Vegetarian", "Organic"],
	starterMenu: [
	  "Focaccia",
	  "Bruschetta",
	  "Garlic Bread",
	  "Caprese Salad",
	],
	mainMenu: ["Pizza", "Pasta", "Risotto"],

	openingHours: {
	  thu: {
		open: 12,
		close: 22,
	  },
	  fri: {
		open: 11,
		close: 23,
	  },
	  sat: {
		open: 0, // Open 24 hours
		close: 24,
	  },
	},

	// 2. function 키워드 없이 함수를 정의
	orderPasta(ing1, ing2, ing3) {
	  console.log(
		`Here is your delicious pasta with ${ing1}, ${ing2} and ${ing3}`
	  );
	},
  };
```

```js
const week = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
// 3. 프로퍼티명을 [] 안에서 expression을 사용할 수 있음
const openingHours = {
  [week[4]]: {
	open: 12,
	close: 22,
  },
  [`fri`]: {
	open: 11,
	close: 23,
  },
  sat: {
	open: 0, // Open 24 hours
	close: 24,
  },
};

const restaurant = {
	name: "Classico Italiano",
	location: "Via Angelo Tavanti 23, Firenze, Italy",
	categories: ["Italian", "Pizzeria", "Vegetarian", "Organic"],
	starterMenu: [
	  "Focaccia",
	  "Bruschetta",
	  "Garlic Bread",
	  "Caprese Salad",
	],
	mainMenu: ["Pizza", "Pasta", "Risotto"],
	openingHours,
	
	orderPasta: function (ing1, ing2, ing3) {
	  console.log(
		`Here is your delicious pasta with ${ing1}, ${ing2} and ${ing3}`
	  );
	},
  };
```

```js
let value = 'a';
const obj = {
	[value]: true,
};
console.log(obj); // { 'a': true }
value = 'b';
console.log(obj); // { 'a': true }
```
- 프로퍼티 명은 동적으로 바뀌지는 않는다

### Optional chaining(?.)

```js
const openingHours = {
  // 값이 nullish로 평가되고, ?? 연산자에 의해 결과는 'closed'
  mon: {
	open: null,
  },
  // ?. 연산자에 의해 undefined로 평가되고, ?? 연산자에 의해 결과는 'closed'
  tue: null,
  thu: {
	open: 12,
	close: 22,
  },
  fri: {
	open: 11,
	close: 23,
  },
  sat: {
	open: 0, // Open 24 hours
	close: 24,
  },
};
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

for (const day of days) {
	const open = openingHours[day]?.open ?? 'closed';
	console.log(`On ${day}, we open at ${open}`)
}
// On mon, we open at closed
// On tue, we open at closed
// On wed, we open at closed
// On thu, we open at 12
// On fri, we open at 11
// On sat, we open at 0
// On sun, we open at closed
```
- ES2020에 nullish라는 개념이 도입되면서 함께 도입된 연산자
	- `null`, `undefined`
- Nullish coalescing operator(`??`) 과 비슷한 맥락이라고 생각하면 됨
	- `??` : 앞의 표현식 평가값이 nullish면 뒤를 실행
	- `?.` : 앞의 값이 nullish면 표현식을 `undefined`로 평가하고 뒤를 실행하지 않음
- 위의 예제처럼, 보통 `?.`와 `??` 연산자를 함께 사용해야 효과적

```js
let obj = { a: 1 };
console.log(obj.b);  // undefined

let arr = [1, 2, 3];
console.log(arr[3]);  // undefined

let str = "hello";
console.log(str.charAt(10));  // ""

let num = 123;
console.log(num.nonExistentProperty);  // undefined

let bool = true;
console.log(bool.nonExistentProperty);  // undefined

let n = null;
console.log(n.someProperty);  // TypeError: Cannot read property 'someProperty' of null

let u;
console.log(u.someProperty);  // TypeError: Cannot read property 'someProperty' of undefined
```

```js
null.a; // TypeError: Cannot read properties of null (reading 'a')
null?.a; // undefined

undefined.a; // TypeError: Cannot read properties of undefined (reading 'a')
undefined?.a; // undefined

"test".a; // undefined
[].a; // undefined
```
- nullish 값의 접근은 오류를 발생시키기 때문에, 이를 해결하고자 만든 연산자?
- nullish를 제외한 데이터 타입에는 존재하지 않는 프로퍼티에 접근했을 때 오류가 발생하지 않고, `undefined`가 평가됨

- 정리
	1. nullish(`null`, `undefined`) 값에 어떠한 프로퍼티로든 접근하게 되면 에러가 발생
	2. 접근하려는 프로퍼티 앞의 평가된 값이 nullish라면 `undefined`로 평가하고 진행을 멈추는 연산자 `?.`
	3. nullish가 아니라면, 계속 평가를 진행하여 해당 값을 반환

### `Set`

```js
// Set의 인자는 "Iterable"(Array, String ...)
const foodArr = ["Pasta", "Pizza", "Pizza", "Rissoto", "Pasta", "Pizza"];
const orderSet1 = new Set(foodArr);
console.log(orderSet1); // Set(3) {'Pasta', 'Pizza', 'Rissoto'}

// const foodObj = {
//   Pasta: 0,
//   Pizza: 0,
//   Pasta: 0,
//   Pizza: 0,
// };
// const orderSet2 = new Set(foodObj);
// console.log(orderSet2); // TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))

const foodStr = "Pizza";
const orderSet3 = new Set(foodStr);
console.log(orderSet3); // Set(4) {'P', 'i', 'z', 'a'}
```
- ES6에서 추가된 자료 구조: `Set`, `Map`
- `Set`
	- 1) 중복될 수 없는 요소들로 구성된 자료 구조
	- 2) 요소의 순서가 중요하지 않음
	- *고유한 값을 작업해야 할 때 사용*
- `Array`
	- 1) 중복될 수 있음
	- 2) 요소의 순서가 중요
- `Array` 만큼 활용도가 높지 않고, 중요하지 않음

```js
const foodArr = ["Pasta", "Pizza", "Pizza", "Rissoto", "Pasta", "Pizza"];
const orderSet1 = new Set(foodArr);

console.log(orderSet1.size); // 3
console.log(orderSet1.has("Bread"), orderSet1.has("Pizza")); // false, true
orderSet1.add("Garlic Bread");
orderSet1.add("Garlic Bread");
console.log(orderSet1); // Set(4) {'Pasta', 'Pizza', 'Rissoto', 'Garlic Bread'}
orderSet1.delete("Pasta");
console.log(orderSet1); // Set(3) {'Pizza', 'Rissoto', 'Garlic Bread'}
```
- 추가, 삭제 등의 메서드 이름이 현대적이고 직관적

```js
console.log(orderSet1[0]); // undefined
```
- `Set`에는 인덱스가 없음
- 요소의 인덱스를 구할 방법이 없고, 그럴 필요도 없음 : 순서가 중요하지 않기 때문에 값을 순서대로 검색할 필요가 없음
	- 그럴 필요가 있을 때에는 `Array`를 사용

```js
// also Iterable
for (const order of orderSet1) {
	console.log(order)
}
```
- `Object`는 Iterable이 아니지만, `Set`은 Iterable이다

```js
// deal with unique elements
const staff = ["Waiter", "Chef", "Manager", "Waiter", "Chef", "Waiter"];
const staffUniqueArr = [...new Set(staff)];

console.log(staffUniqueArr.length); // 3
console.log(new Set(staff).size); // 3
```
### `Map`

- `Map` : `key`에 `value`를 mapping 하는 자료 구조

```js
const rest = new Map();
// set Method "update" and also "return" Map
rest.set("name", "Classico Italiano");
rest.set(1, "Firenze, Italy");
console.log(rest.set(2, "Lisbon, Portugal")); // Map(3) {'name' => 'Classico Italiano', 1 => 'Firenze, Italy', 2 => 'Lisbon, Portugal'}

// chaining : same result as above
const rest2 = new Map();
console.log(
  rest2
	.set("name", "Classico Italiano")
	.set(1, "Firenze, Italy")
	.set(2, "Lisbon, Portugal")
	.set("categories", ["Italian, Pizzeria", "Vegetarian", "Organic"])
	.set("open", 11)
	.set("close", 23)
	.set(true, "We are open :D")
	.set(false, "We are closed :(")
); // Map(3) {'name' => 'Classico Italiano', 1 => 'Firenze, Italy', 2 => 'Lisbon, Portugal'}
```
- *1) `Map`과 `Object`의 차이점 : `key`의 데이터 타입*
	- `Object`는 `key`로 "문자열"만 설정할 수 있다
	- `Map`은 `key`로 "모든 데이터 타입"을 설정할 수 있다
		- etc. `Object`, `Array`, 다른 `Map`...

```js
// be careful with data types because key differentiates data types
console.log(rest2.get("name")); // Classico Italiano
console.log(rest2.get(1)); // Firenze, Italy
console.log(rest2.get(true)); // We are open :D
console.log(rest2.get("1")); // undefined


// funny examples
const time = 8;
const isValidTime = time > rest2.get("open") && time < rest2.get("close");

console.log(rest2.get(isValidTime)); // We are closed :(
```

```js
// hasOwnProprty
console.log(rest2.has("categories")); // true
// 삭제 메서드는 굉장히 느리기 때문에 권장하지 않음
rest2.delete(2);
console.log(rest2.size); // 7
rest2.clear();
console.log(rest2.size); // 0

// key를 참조 데이터 타입으로 사용할 때 주의할 점
// - 내부적으로 key를 검색할 때, 참조가 같은지 확인한다
const arr = [1, 2, 3];
rest2.set([1, 2], "Test");
rest2.set(arr, "Test2");

console.log(rest2.get([1, 2])); // undefined
console.log(rest2.get(arr)); // Test2
```

```js
// Initialization
const question = new Map([
	['question', 'What is the best programming language in the world?'],
	[1, 'C'],
	[2, 'Java'],
	[3, 'Javascript'],
	['correct', 3],
	[true, 'Correct'],
	[false, 'Try again']
]);

// convert Object to Map
const openingDay = {
	'thu': true,
	'fri': true,
	'sat': false
}
const openingDayMap = new Map(Object.entries(openingDay));
```
- `Set`과 비슷하게 `[key, value]`를 요소로 하는 2차원 배열을 인자로 넘김으로써 `Map`을 생성하면서 초기화할 수 있다
- 인자로 넘기는 2차원 배열은 `Object.entries()` 메서드를 통해 얻을 수도 있다
	- 편하게 `Object`에서 `Map`으로 변환할 수 있다

```js
// convert Object to Map
const openingDay = {
  thu: true,
  fri: true,
  sat: false,
};
const openingDayMap = new Map(Object.entries(openingDay));

for (const [key, value] of question) {
  console.log(key, value); // 1 'C', 2 'Java', ...
}

for (const [key, value] of openingDay) {
  console.log(key, value); // TypeError: openingDay is not iterable
}

for (const elem in openingDay) {
  console.log(elem); // thu, fri, sat
}

// convert map to array
console.log([...question]);
console.log(question.entries()); // MapIterator
console.log(question.keys()); // MapIterator
console.log(question.values()); // MapIterator
console.log([...question.entries()]); // same as [...question]

// object is not iterable, map is iterable
console.log([...openingDay]); // TypeError: openingDay is not iterable
console.log({ ...openingDay }); // {thu: true, fri: true, sat: false}
```
- *2) `Map`과 `Object`의 또 다른 차이점 : Iterable*
	- `Map`
		- iterable
		- `for ... of`, `...` 연산자 사용 가능
	- `Object`
		- NOT iterable
		- `for ... of`, `...` 연산자 사용하지 못함

###  Summary: Which Data Structure to Use?

- 1) Sources of Data
	1. From the program itself
		- 소스 코드에 적힌 데이터(e.g. status messages)
	2. From the UI
		- 사용자 입력 혹은 DOM에 상의 데이터(e.g. tasks in to-do app)
	3. From external sources
		- Web API로부터 불러온 데이터(e.g. JSON)
- 2) Collect Data
- 3) Determine Data Structure
	- BUILT-IN
		- Simple List?
			- `Array` or `Set` or `WeakSet`
		- Key/Value Pair?
			- key(개체)와 values(개체에 대한 설명)이 필요할 때
			- `Object` of `Map` or `WeakMap`
	- NOT BUILT-IN
		- Stack, Queue, Linked List, Tree, Hash Table ...

- `Array` vs. `Set` : 개체에 대한 설명이 필요하지 않을 때 사용
	- `Array`
		- 순서가 중요할 때
		- 중복 값이 필요할 때
			- 중복 값의 순서가 중요하지 않을 때는 Key/Value Pair를 사용해서 나타낼 수도 있음
			- e.g. `['red', 'blue', red']` vs. `{red: 2, blue: 1}`
	- `Set`
		- 고유한 값만 필요할 때
		- 고성능 작업이 필요할 때 : 삽입 삭제가 평균 10배 빠름
- `Object` vs. `Map` : 개체에 대한 설명이 필요할 때 사용
	- `Object`
		- `Map`보다 간단하게 사용할 수 있음 : Object literal, 접근(`.` and `[]`)
		- key 데이터 타입이 `String`으로 충분할 때
		- 프로퍼티로서 함수(메서드)가 필요할 때
		- JSON을 처리해야 할 때
	- `Map`
		- 고성능 작업이 필요할 때
		- key 데이터 타입이 여러 가지일 때
		- 단순히 key와 value를 매핑하는 자료 구조가 필요할 때