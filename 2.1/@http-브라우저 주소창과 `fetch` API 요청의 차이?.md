### 1. 브라우저 주소창에서 HTTP 요청
- HTML을 받아오는 동기 요청
- 클라이언트와 서버가 SSL를 설정하는 과정에서 서버에서 인증서를 주는데, 해당 인증서를 받은 브라우저에서 "CA에 의해 서명된 인증서"인지 확인
	- 맞다면, SSL 설정 및 교환 과정을 계속함
	- 다르다면, 브라우저에서 신뢰할 수 없는 인증서라는 메시지를 띄움
- 과정
	1. 클라이언트가 서버에 랜덤 데이터 / 암호화 방식을 송신
	2. 서버는 랜덤 데이터 / 암호화 방식 선택 + SSL 인증서를 송신
	3. 클라이언트는 CA 인증서인지 확인
		- 맞다면, SSL 연결 진행
		- 아니라면, 신뢰할 수 없다는 메시지를 띄움 => 계속 진행할 수는 있음
	4. 진행된다면, 클라이언트는 1) 2)에서 받은 랜덤 데이터로 통신을 암호화할 key 생성
	5. 클라이언트가 서버에 임시 key 송신
- 신뢰할 수 없는 인증서임에도 불구하고 계속 하기를 원한다면, HTTPS 연결(SSL 암호화)를 사용하여 통신은 가능
	- CA에 의해 서명된 인증서가 아니라면?
		- 신뢰성 감소 : 자체 서명된 인증서는 일반적으로 CA에 의해 서명된 인증서보다 신뢰성이 낮음
		- 중간자 공격 가능성 : 암호화된 데이터가 노출될(디코딩 당할) 가능성이 증가. 신뢰 기관으로부터 서버가 정당한지 확인할 수 없음
	- 자체 서명된 인증서는 특정 상황에서는 유용할 수 있지만, 보통은 CA에 의해 서명된 인증서를 사용하여 클라이언트에게 서버의 정당성을 보다 확실히 전달하는 것이 안전성과 신뢰성을 높일 수 있습니다
- 브라우저는 내장된 SSL/TLS 인증서 스택을 사용하여 잘 알려진 CA(인증 기관)로부터 서버의 인증서를 검증

### 2. `fetch` API로 HTTP 요청
- JSON 데이터를 받아오는 ajax 즉, 비동기 요청
- 대부분의 HTTP 클라이언트 라이브러리들은 기본적으로 시스템의 SSL/TLS 구성을 사용하며, 이는 대개 운영체제나 런타임에 의해 관리됩니다.
- `fetch` API는 브라우저의 내장된 네트워크 스택을 사용하며, 이 스택은 기본적으로 브라우저가 지원하는 SSL/TLS 인증서 검증을 수행합니다
```js
const h1 = document.querySelector("h1");

fetch("https://self-signed.badssl.com/")
	.then((data) => {
		h1.innerText = data;
	})
	.catch((error) => {
		h1.innerText = error;
	});

// GET https://self-signed.badssl.com/ net::ERR_CERT_AUTHORITY_INVALID
// 요청 자체가 실패함
```

- 어떻게 self-signed 인증서인지 알았는가? 브라우저의 내장된 네트워크 스택을 사용하기 때문에
- self-signed 인증서를 처리하는 방법은 없는가?
	- curl 명령어는 존재함

### 3. curl 명령어로 HTTP 요청

``` shell
curl https://self-signed.badssl.com/

# 실패
curl: (60) SSL certificate problem: self signed certificate
More details here: https://curl.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.

curl https://self-signed.badssl.com/ --insecure

# 성공
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" href="/icons/favicon-red.ico"/>
  <link rel="apple-touch-icon" href="/icons/icon-red.png"/>
  <title>self-signed.badssl.com</title>
  <link rel="stylesheet" href="/style.css">
  <style>body { background: red; }</style>
</head>
<body>
<div id="content">
  <h1 style="font-size: 12vw;">
    self-signed.<br>badssl.com
  </h1>
</div>

</body>
</html>
```
- 기본적으로 `curl` 명령어도 SSL 연결을 진행하므로 CA가 아니라면 오류를 반환한다
- `--insecure` 옵션을 통해 SSL 연결을 하지 않고 진행할 수도 있다
- `--cacert ca.crt` 옵션을 통해 서버가 가지고 있는 인증서를 서명한 루트 인증서(자체 서명 인증서)를 명시한다면, 이 인증서를 통해 정상적으로 서버와 SSL 연결을 할 수 있다
- 추가로, 요청하는 클라이언트가 누구인지를 명시하는 방법으로 `--key --cert` 옵션을 통해 데이터를 함께 전송할 수 있다

https://badssl.com/