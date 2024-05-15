### prettier

```json
{
  "singleQuote": true,
  "arrowParens": "avoid"
}
```

- `"singleQuote"`
  - 모든 문자열의 시작과 끝 따옴표를 작은따옴표로 통일한다.
  - e.g. `'a string'`
- `"arrowParens"`
  - 화살표 함수에서 괄호가 필요없을 때(인자가 1개일 때) 괄호를 표시하지 않는다.
  - `always`, `avoid`
  - e.g. `x => x`

### DOM

- DOM : structured "complete" representation of html documents
- DOM Manipulation
  - Javscript를 이용히여 DOM 객체를 조작하는 것을 뜻함
  - e.g. change text / HTML attributues / CSS style
- <U>**따라서 DOM 객체는 HTML과 JS 사이의 연결점이라고 할 수 있다**</U>
- 트리 구조
  - HTML의 부모, 자식 엘리먼트를 DOM에서는 부모, 자식 노드로 표현한다
  - 항상 루트 노드는 특별한 권한을 가진 `document` 노드이다. 즉 DOM의 entry point이다
  - 자식 노드에는 엘리멘트 뿐만 아니라 텍스트, 주석 등 모든 것이 포함된다 => complete representation
- `document.querySelector`과 같은 DOM 메서드는 JS의 일부일까?
  - NO
  - ECMAScript에는 DOM과 관련된 것이 기술되어 있지 않다
  - 대신, Web APIs(브라우저에 구현된 JS 라이브러리. e.g. `timer`, `fetch`)의 일부이다
  - 마찬가지로 DOM 구현에 관한 표준이 존재하고, Web APIs를 지원하는 브라우저는 이 표준에 따른다

### CSS manipulation

```js
// tag로 Element 찾기
document.querySelector('body').style.backgroundColor = 'blue';

// class로 Element 찾기
document.querySelector('.number').style.width = '30rem';
```

- `querySelector` 메서드를 이용해 Element를 찾고, 아래와 같이 해당 Element에 CSS 속성 추가
- Element의 style 프로퍼티(e.g. className, src ...)에 값을 직접 추가하는 방식

```html
<div
  class="pace-progress"
  data-progress-text="100%"
  data-progress="99"
  style="transform: translate3d(100%, 0px, 0px); opacity: 0;"
>
  <div class="pace-progress-inner"></div>
</div>
```

- 단, inline 방식으로 Element의 style 프로퍼티에 추가하는 것이기 때문에 CSS 파일을 바꾸거나 하지는 않는다
- 프로퍼티 이름으로 접근해야 하기 때문에 CSS 속성의
  - 1. 이름을 Camel Case로 : e.g. `body.style.backgroundColor`
  - 2. 값을 문자열로 바꾸어야 함 : e.g. `body.style.width = '30rem'`
