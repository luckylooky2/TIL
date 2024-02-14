### case 1
```
server {
    listen       4000;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index1.html index.htm;
    }
}

server {
	listen 	     5000;
	server_name  localhost;
	
	location / {
		root   /usr/share/nginx/html;
		index  index2.html index.htm;
	}
}
```

```shell
$> telnet localhost 4000
GET / HTTP/1.1
Host: localhost

index1.html
```

```shell
$> telnet localhost 5000
GET / HTTP/1.1
Host: localhost

index2.html
```

- 포트가 다른 경우, 두 서버 블록 모두 정상적으로 동작

### case 2
```
server {
    listen       4000;
    server_name  example1.com;

    location / {
        root   /usr/share/nginx/html;
        index  index1.html index.htm;
    }
}

server {
	listen 	     5000;
	server_name  example2.com;
	
	location / {
		root   /usr/share/nginx/html;
		index  index2.html index.htm;
	}
}
```

```shell
$> telnet localhost 4000
GET / HTTP/1.1
Host: example2.com

index1.html
```

- Host(server_name)과 일치하는 서버 블록이 없을 경우, 해당 포트로 열린 서버들 중에서 deafult server(가장 처음 블록)을 선택

### case 3
```
server {
    listen       4000;
    server_name  example1.com;

    location / {
        root   /usr/share/nginx/html;
        index  index1.html index.htm;
    }
}

server {
	listen 	     4000;
	server_name  example2.com;
	
	location / {
		root   /usr/share/nginx/html;
		index  index2.html index.htm;
	}
}
```

```shell
$> telnet localhost 4000
GET / HTTP/1.1
Host: example1.com

index1.html
```

```shell
$> telnet localhost 4000
GET / HTTP/1.1
Host: example2.com

index2.html
```

```shell
$> telnet localhost 4000
GET / HTTP/1.1
Host: localhost

index1.html
```

- 같은 포트로 열린 서로 다른 서버 블록의 경우, server_name이 겹치지 않는 한 여러 서버 블록을 생성
- Host(server_name)이 일치하는 경우, 해당 서버 블록을 선택
- Host(server_name)이 일치하지 않는 경우, 위처럼 default server를 선택(가장 상위에 있는 서버 블록)

즉, 어떤 서버 블록을 선택할 것인가를 판단할 때...
1. 해당 클라이언트가 연결된 포트를 가지고 있는 서버 블록을 고른 후
2. 해당 서버 블록 중에 Host와 일치하는 server_name을 가진 서버 블록을 고른다
3. 없다면 해당 포트의 default server 블록을 선택한다

https://nginx.org/en/docs/http/request_processing.html
