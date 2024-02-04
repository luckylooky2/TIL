
1. 쿠버네티스에서는 내부적으로 유저 인증 정보를 저장하지 않습니다
	- 대부분의 웹 서비스나 인증 서버들은 사용자 정보를 내부적으로 저장하여 사용자로부터 인증 정보를 전달 받았을 때 저장된 정보를 바탕으로 인증을 처리합니다. (웹 사이트에서 계정과 비밀번호를 입력 받아 유저 DB를 조회하여 사용자 인증을 처리하는 방법을 떠올릴 수 있습니다.)
	- 쿠버네티스는 따로 인증 정보를 저장하지 않고 각각의 인증 시스템에서 제공해주는 신원 확인 기능들을 활용하여 사용자 인증을 하고 유저를 인식(identify) 합니다
	- 이러한 특징으로 인해 쿠버네티스에서는 쉽게 인증체계를 확장할 수 있습니다
	- 쿠버네티스는 사용자 인증체계를 전부 외부 시스템 (혹은 메커니즘)에 의존한다고 볼 수 있습니다. (X.509, HTTP Auth, Proxy Authentication 등)
	- https://coffeewhale.com/kubernetes/authentication/x509/2020/05/02/auth01/
2. 마스터 노드에서 스스로 서명한 인증서(CA)를 구축하고, 이 루트 인증서로 서버 인증서, 클라이언트 인증서로 서명한다.
	- 같은 루트 인증서로 서명한 서로 다른 인증서들을 가지고 TLS 인증을 진행할 수 있다.
	- 서명된 (서버, 클라이언트) 인증서들은 신분 확인 용도로 상대방에게 전달되어 사실임을 확인하는데 사용된다
		- e.g. chanhyle이라는 유저가 apiServer에게 요청할 때, 마스터 노드에서 서명한 인증서가 아니라면 TLS 연결이 불가능하다

```shell
alias k=kubectl
apt-get update
apt-get install -y vim
```

```shell
k exec -it nginx -- bash
```

### 1. 서버 1에서 프록시 서버에 요청
#### service1
- 서버1에서 서버2를 리버스 프록시로 설정하여 가져오는 시도
- `index.html`
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
	</head>
	<body>
		<button>fetch</button>
	</body>
	<script src="index.js" type="text/javascript"></script>
</html>
```

- `index.js`
```js
const button = document.querySelector("button");
const body = document.querySelector("body");
const newDiv = document.createElement("div");
body.appendChild(newDiv);

button.addEventListener("click", function() {
	const response = fetch("http://192.168.64.17:31950");
	response.then((data) => data.text()).then((data) => {
		newDiv.innerText = data;
	})
});
```

- k8s는 일반적으로 클러스터 내부에서만 접근 가능한 보안된 환경 유지하므로 `https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods` 이 URL에 직접 요청할 수 없음
- 정적 웹서버를 리버스 프록시로 사용하여 시도(여기서는 위의 js 파일을 주는 서버1이 서버2인 리버스 프록시에게 요청)
- CORS 에러 발생
	- 리버스 프록시의 작동 방식을 정확하게 모름
		- 근데 네이버는 됨. why?
	- 목적지인 kube-apiServer에서 CORS와 관련된 헤더를 붙이지 않기 때문에 발생하는 문제인 듯
	- 그렇다면 이런 방식(브라우저)을 직접적으로 사용할 수 없음
		- 백엔드에서 처리하여 CORS 에러를 우회해야 할 듯?
#### service2
- http://192.168.64.18:31472 -> http://192.168.64.17:31950
	- CORS 발생
- http://192.168.64.17:31472 -> http://192.168.64.18:31950
	- 정상 작동 => ?

- `/etc/nginx/conf.d/default.conf`
```nginx
# ...

location / {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
  }

# ...
```
- proxy를 사용하는 방법은 아니고, CORS 오류가 발생할 때 이 헤더를 넣어주면 브라우저에서 CORS 오류가 발생하지 않음

```shell
nginx -s reload
```

- NodePort는 클러스터의 모든 노드에서 지정된 포트를 통해 서비스에 접근할 수 있도록 해주는데, 모든 노드에서 동일한 IP 주소를 사용하고, 동일한 NodePort 번호를 사용하고 있다면 어느 노드에서든 같은 서비스에 접근할 수 있게 됩니다.
- 만약 특정 노드로의 접근을 원하지 않고, 단순히 클러스터 내에서 어떤 노드든 접근 가능하게 하려면, LoadBalancer나 Ingress 등의 다른 서비스 유형을 고려할 수 있습니다.

- 위의 예제는 쿠버네티스의 인증 / 인가를 사용하는 방식이 아닌가?
	- 브라우저가 요청을 하는 예시이다
	- 즉, 쿠버네티스를 사용한 것이 아니다. 쿠버네티스는 파일만 제공하는 서버일 뿐이고, 특별한 인증 / 인가를 담당하지 않는다. => 이렇게 사용하면 안 됨
- 쿠버네티스 apiServer에 요청하여 인증 / 인가를 받아야 한다
	- 앞에서 NodePort를 이용하여 pod을 expose한 것도 쿠버네티스의 service를 이용하여 받아온 것이다.
	- 해당 페이지는 누구나 접근하여 웹 페이지 리소스를 받아와야 하기 때문에 쿠버네티스 인증 / 인가를 받아야 할 필요는 없다
		- 초기 화면은 누구나 접근해야 함,,,
		- 인증 / 인가가 필요한 사항은 백엔드로 요청하여, 백엔드에서 쿠버네티스 apiServer에 요청을 하고 리턴된 값을 프론트에 전달해준다

### 2. 서버2(리버스 프록시)에 직접 요청

```
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

	# 서버로서의 HTTPS 설정
    listen 443 ssl;
    ssl_certificate /root/pki/client.crt;
    ssl_certificate_key /root/pki/client.key;
    
    location / {
		 proxy_pass https://10.96.0.1/api/v1/namespaces/default/pods;
    }
}
```
- 생성한 클라이언트 인증서와 /etc/kubernetes/pki에 있는 CA 인증서를 컨테이너 내로 복사 필요
- 추가) HTTPS 설정
	- pod, service.yaml에 포트번호 443으로 변경 필요
	- 요청시 https://192.168.64.18:31632/

```
# 브라우저에서 직접 서버2로 요청

// 20240202091335
// https://192.168.64.18:31632/

{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {
    
  },
  "status": "Failure",
  "message": "pods is forbidden: User \"system:anonymous\" cannot list resource \"pods\" in API group \"\" in the namespace \"default\"",
  "reason": "Forbidden",
  "details": {
    "kind": "pods"
  },
  "code": 403
}
```
- 위의 예제에서 서버 1을 제외
- `클라이언트 <-> 리버스 프록시 <-> 목적지`
- proxy_pass를 사용하면 리버스 프록시와 목적지 사이에는 아무런 (클라이언트) 설정도 하지 않았는데, 자체 서명 인증서라는 오류가 뜨지 않고 403 상태 코드를 반환한다
	- 일단, SSL 연결은 거절되지 않고 제대로 되었다는 뜻
	- CA 없이 `fetch`나 `curl`을 사용하면 발생하던 문제가 발생하지 않음
	- why?
		- 기본으로 내장되어 있어서?
		- CA를 확인하지 않나?

- pod list를 받아오는 것을 프론트 애플리케이션에서 어떻게 구현할 수 있을까?
	- pod이 직접 curl 명령어를 사용하는 방법?
		- 말이 안 됨
	- 정적 웹 서버에서 처리하는 방법?
		- 위에서 한 방법. 정적 웹 서버로는 처리하기 어려웠음
	- 동적 웹 서버(WAS)에서 처리하는 방법?
		- 백엔드 애플리케이션이 HTTP 요청 라이브러리를 이용하여 요청 후 응답으로 데이터를 받아오는 방법

- 정적 웹 서버에서 처리(실패)
```
proxy_pass https://www.naver.com

add_header 'Access-Control-Allow-Origin' '*';

// 1. 위 조합은 제대로 CORS 에러 없이 받아와짐

proxy_pass https://https://10.96.0.1/api/v1/namespaces/default/pods

add_header 'Access-Control-Allow-Origin' '*';

// 2. 위 조합은 왜 CORS 에러가 발생하는가?
// --insecure을 쓰지 않고 tls는 어떻게 해결하는가?
```


## User Account
### 3. pod 컨테이너에 접속하여 `curl` 명령을 날려보자

```shell
k exec -it nginx -- bash

# KUBERNETES_SERVICE_HOST="10.96.0.1"

curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --header "Authorization: Bearer $TOKEN" --insecure

{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {},
  "status": "Failure",
  "message": "pods is forbidden: User \"system:serviceaccount:default:default\" cannot list resource \"pods\" in API group \"\" in the namespace \"default\"",
  "reason": "Forbidden",
  "details": {
    "kind": "pods"
  },
  "code": 403
}

# --insecure 옵션은 SSL 연결을 사용하지 않겠다는 의미
# --insecure 옵션을 뺴고 --cacert 옵션을 추가
curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --header "Authorization: Bearer $TOKEN" --cacert ca.crt

# 위와 같은 결과 : SSL로 연결은 되었는데(인증), 인가가 안 된 상황

# --cert, --key 옵션을 추가
curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --cert client.crt --key client.key --cacert ca.crt

# pod의 모든 정보를 가져오는데 성공
# 따로 인가 과정이 없었는데 어떻게 가져온거지?
# service account를 default -> test로 바꿨는데 같은 결과
```

- `--cacert` 옵션은 서버의 SSL/TLS 인증서를 검증하기 위해 사용되는 Certificate Authority (CA)의 인증서 파일을 지정하는 데 사용됩니다. 클라이언트가 서버로의 SSL/TLS 통신 시, 서버의 인증서가 신뢰할 수 있는 CA에 의해 서명되었는지를 확인하는 데에 이용됩니다.
- `--cert` 옵션은 클라이언트가 서버로의 요청 시에 사용되는 SSL/TLS 클라이언트 인증서를 지정하는 데 사용됩니다. 클라이언트 인증서는 클라이언트가 서버에 대한 인증을 수행할 때 사용됩니다.
- `--key` 옵션은 `--cert` 옵션과 함께 사용되며, 클라이언트 키 파일을 지정하는 데 사용됩니다. 클라이언트 키 파일은 클라이언트 인증서와 함께 사용되어 서버에 대한 안전한 인증 및 통신을 위해 필요합니다.
- `--cert`, `--key` 옵션을 통해 서버에 클라이언트를 인가한 것?
	- 결과적으로는 맞음
	- service account가 관련된 것은 아니고(user account를 사용하는 방법이기 때문)
	- `client.crt`를 `openssl` 명령어를 통해 해석해보면, CN과 O가 나오는데 이를 통해 kube-apiServer는 RBAC을 이용하여 "인가"하는 것이다

```shell
# 파드 내부의 컨테이너에 접속한 후에...
cd /var/run/secrets/kubernetes.io/serviceaccount
```

### 4. 클라이언트 인증서 발급

```shell
openssl x509 -in client.crt -text -noout
```

```shell
# 1. O만 속하게
openssl genrsa -out chanhyle.key 2048
openssl req -new -key chanhyle.key -subj "/CN=chanhyle/O=system:masters" -out chanhyle.csr
openssl x509 -req -in chanhyle.csr -CA ca.crt -CAkey ca.key -out chanhyle.crt

curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --cert chanhyle.crt --key chanhyle.key --cacert ca.crt

# podlist 조회 가능

# 2. 둘다 속하지 않게
openssl genrsa -out admin.key 2048
openssl req -new -key admin.key -subj "/CN=admin/O=none" -out admin.csr
openssl x509 -req -in admin.csr -CA ca.crt -CAkey ca.key -out admin.crt

curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --cert admin.crt --key admin.key --cacert ca.crt

# podlist 조회 불가
{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {},
  "status": "Failure",
  "message": "pods is forbidden: User \"admin\" cannot list resource \"pods\" in API group \"\" in the namespace \"default\"",
  "reason": "Forbidden",
  "details": {
    "kind": "pods"
  },
  "code": 403
}

# 3. CN만 속하게
openssl genrsa -out admin.key 2048
openssl req -new -key test.key -subj "/CN=kube-admin/O=none" -out test.csr
openssl x509 -req -in test.csr -CA ca.crt -CAkey ca.key -out test.crt

curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --cert test.crt --key test.key --cacert ca.crt

{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {},
  "status": "Failure",
  "message": "forbidden: User \"kube-admin\" cannot get path \"/ai/v1/namespaces/default/pods\"",
  "reason": "Forbidden",
  "details": {},
  "code": 403
}
```

- 클라이언트가 보내는 인증서에는 사용자 정보가 포함되어 있음. 이 정보는 보통 CN(Common Name)과 O(Organization)에 저장되어 있음
- 이 정보를 바탕으로 RBAC 정책을 확인하여 해당 사용자에게 권한을 부여함
	- 이 때, Role / RoleBinding / ClusterRole / ClusterRoleBinding이 사용됨
	- 그러므로 해당 두 정보를 잘 관리하는 것이 중요
	- 위 결과를 보면 CN으로 결정하는 것은 아니고 그룹으로 부여하는 듯
	- CN : k8s에서 사용할 User 리소스의 이름
	- O : Role과 관련이 있음
- 쿠버네티스에서는 내부적으로 유저 인증 정보를 저장하지 않습니다
	- https://coffeewhale.com/kubernetes/authentication/x509/2020/05/02/auth01/
	- 대부분의 웹 서비스나 인증 서버들은 사용자 정보를 내부적으로 저장하여 사용자로부터 인증 정보를 전달 받았을 때 저장된 정보를 바탕으로 인증을 처리합니다. (웹 사이트에서 계정과 비밀번호를 입력 받아 유저 DB를 조회하여 사용자 인증을 처리하는 방법을 떠올릴 수 있습니다.)
	- 쿠버네티스는 따로 인증 정보를 저장하지 않고 각각의 인증 시스템에서 제공해주는 신원 확인 기능들을 활용하여 사용자 인증을 하고 유저를 인식(identify) 합니다
	- 이러한 특징으로 인해 쿠버네티스에서는 쉽게 인증체계를 확장할 수 있습니다
	- 쿠버네티스는 사용자 인증체계를 전부 외부 시스템 (혹은 메커니즘)에 의존한다고 볼 수 있습니다. (X.509, HTTP Auth, Proxy Authentication 등)
- 쿠버네티스 그룹
	- 실제 그룹이라는 리소스가 존재하진 않지만 `RoleBinding` (혹은 `ClusterRoleBinding`) 리소스 내부에서 string match로 그룹에 따른 권한을 부여할 수 있습니다
	- 신규 사용자를 생성할 때, 해당 그룹에 속하여서 만들게 되면 그 그룹이 가지고 있는 권한을 동일하게 사용할 수 있습니다
		- `system:authenticated`: 사용자 인증을 통과한 그룹을 나타냅니다.
		- `system:anonymous`: 사용자 인증을 하지 않은 익명 그룹을 나타냅니다.
		- `system:masters`: 쿠버네티스의 full access 권한을 가진 그룹을 나타냅니다. (admin)
- 

```shell
cat ~/.kube/config | base64 --decode
echo "" | base64 --decode > config.crt
openssl x509 -in config.crt -text -noout

# Subject: O = system:masters, CN = kubernetes-admin
```

- kubectl은 결국 curl 명령어를 호출하는 명령어 클라이언트일 뿐이다
- 결국 curl을 통해서 kube-apiServer와 통신한다

### 5. Role과 연계

```yaml
# test-role.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: admin-role
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["list"]

# test-rolebinding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: default
  name: admin-binding
subjects:
- kind: User
  name: admin
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: admin-role
  apiGroup: rbac.authorization.k8s.io
```

```shell
k create -f test-role.yaml
k create -f test-rolebinding.yaml

# ok
k get pods --as admin

# no
curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --cert admin.crt --key admin.key --cacert ca.crt
```

- `kubectl`을 사용하는 방법은 잘 동작하는데
	- 사용자 또는 그룹의 권한은 `kubeconfig` 파일과 설정된 RBAC 규칙에 따라 결정
	- Organization 필드가 아닌 RBAC에 의해 권한이 부여되기 때문
- `curl`을 사용하는 방법은 잘 동작하지 않음
	- ClusterRole의 RBAC 규칙에 따라 실행
	- 해당 리소스에 접근하는 것은 Role이 아니라 ClusterRole과 관련이 있기 때문(자세하게는 잘 모름)
	- `system:masters` 그룹은 Kubernetes RBAC(Role-Based Access Control) 시스템에서 클러스터의 모든 권한을 가진 최상위 그룹으로 간주됩니다. 이 그룹에 속한 사용자나 서비스 계정은 클러스터의 모든 자원과 API에 대한 최고 권한을 가지게 됩니다.
- `kubectl`과 `curl`이 다르게 동작하는 것이 아니라 접근하는 리소스에 대한 권한이 다른 것
	- `kubectl` 도 `kubeconfig`에 인증서를 저장하고 호출할 때 `curl`을 이용하여 호출
	- `curl`도 `--cert`, `--key` 옵션으로 해당 인증서와 키를 같이 첨부하여 호출
	- 결국 같은 것
- 즉, 어떤 방식으로 해도 k8s의 RBAC + X.509 인증서 방식을 거치게 되어 있다

```yaml
# admin-clusterRoleBinding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-admin-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: admin
```

```shell
# 이제 된다
curl -X GET https://$KUBERNETES_SERVICE_HOST/ai/v1/namespaces/default/pods --cert admin.crt --key admin.key --cacert ca.crt
```
- `cluster-admin`이라는 ClusterRole에 연결되어 관리자 권한을 갖게 된 것
- https://jonnung.dev/kubernetes/2020/06/18/kubernetes-user-authorizations/

## Service Account
### 6. 쿠버네티스의 서비스 어카운트(Service Account)

```shell
# SSL 연결 안 함
curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --header "Authorization: Bearer $TOKEN" --insecure

# SSL 연결
# 하지만 토큰이 없기 때문에 403을 반환(인가 X)
curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --header "Authorization: Bearer $TOKEN" --cacert ca.crt
```

- user account가 client 인증서를 가지고 인증 및 인가를 했던 것에 반해, service account는 발급된 token을 가지고 RBAC 인가를 진행
- 토큰은 namespace와 sa를 기반으로 생성되고 인가됨

```yaml
# sa-rolebinding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: default-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: ""
  kind: ServiceAccount
  name: default
  namespace: default
```

```shell
k create -f sa-rolebinding.yaml
```

```shell
k exec -it springboot-helloworld-7d8fdb7c59-67smm -- bash
cd /var/run/secrets/kubernetes.io/serviceaccount/
export TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6IkM4b1pFYUtDR293VlZFTHprY3NnUjlKOWZaN2YwdHVBSElxZ3BQMXBfRDAifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNzM4NDU3OTU3LCJpYXQiOjE3MDY5MjE5NTcsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJkZWZhdWx0IiwicG9kIjp7Im5hbWUiOiJzcHJpbmdib290LWhlbGxvd29ybGQtN2Q4ZmRiN2M1OS02N3NtbSIsInVpZCI6IjFkMGZhZGJiLTBjMTUtNDdjZS04MDRlLTUxMTgxMWNlYTE2MCJ9LCJzZXJ2aWNlYWNjb3VudCI6eyJuYW1lIjoiZGVmYXVsdCIsInVpZCI6Ijc1OGMzNjE4LTNhOWUtNDRiMC1iMTRkLTY4ZjBiZDJkZWE3ZiJ9LCJ3YXJuYWZ0ZXIiOjE3MDY5MjU1NjR9LCJuYmYiOjE3MDY5MjE5NTcsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZWZhdWx0OmRlZmF1bHQifQ.FwNTxsEJpl-L9CoQNa9O_Q-9gNYvs-k5oPriMvpoWphjZN6BM0WwnpMRBBgiRjmNqIn8ayBtHX7JAd-VApkXK_DBOhmN61jbh48eVbdFhfUqVLIkTu9OyBItgtmQE0ZBPhOIdI54hCLLo6Bm6hSrddZM5oYhWHZi7ZXP_fgMjiX6qIzQapXQnZyceLQPctLnYHvbqOVn4fUsq9gfCBuptvXgFhTQeW3G97htvJ8Gs73wc3IUi6GRpk5uMuPOcMhJhJ-7cm7IkKwiaEgMa3avGj8P8Bi-G1PbcX9h0XiOahxonYBHfBixwI6hE7xXkKb6o5P85ZF8CtvoVnosCoSCyw

curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --header "Authorization: Bearer $TOKEN" --cacert /root/pki/ca.crt

# pod list 출력
```

```
// ca.crt
-----BEGIN CERTIFICATE-----
MIIDBTCCAe2gAwIBAgIIARirUr5BwPIwDQYJKoZIhvcNAQELBQAwFTETMBEGA1UE
AxMKa3ViZXJuZXRlczAeFw0yNDAxMjMwNjU2MDNaFw0zNDAxMjAwNzAxMDNaMBUx
EzARBgNVBAMTCmt1YmVybmV0ZXMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
AoIBAQC9D/iEM1SPhOelOF2htQMXw/asU2BqmzaL6553U6LXQeF+sfYbL0ATeAC0
9Q/jIL3p3+bbzowmkpnwGFyTSLrLtBNkzgc5rLzxgTFGNIecysmr7MMFgHNlpmVm
tps+7igP4YwfG/ZBAv4mUVsEMSCS8GGIH8/cAJctGtyorw6cpXRU3noNm/lZ0th8
AsUNrwexbJIvWqNR6XsXpSpcyy5aS+pq4rkpndus8uClpus01FS9BqxAsaTiqbv3
dqixT9QufvW67R4TAwFJh8vSmhKUbTOz8lOx90Z4xZ0/swcQnJnTCLCMhhGC/IVl
sPyf9oEKHwSRfelfZFUL4Xc3ls+XAgMBAAGjWTBXMA4GA1UdDwEB/wQEAwICpDAP
BgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQns/8WqqwRyyoGPyMsofwvjKdj8jAV
BgNVHREEDjAMggprdWJlcm5ldGVzMA0GCSqGSIb3DQEBCwUAA4IBAQCFnjRwcCcA
QNgc+6vS/Ajv4ujS41WGq1RouD85PeJ64ByUtHyMEAEFFE4EQdikyIswP0/KsNEy
38y3xMBwa2rEbn4eqeSMNhiG5x2NVPLJpMDTHN7uPt6qV41SifvxbSixrGh+6WG1
IIG+SuBDQo+5bcwo9Lq4vue/jV+YCg4Ku9226yUPbGO2/HseOR0y7Bs4hh9q31Oi
ww1HyUQXQv5S5Q08AsQMWCrabKLCWyqjaRdDaraTgCXgj3GQkE8V70Z/hinPUGOk
xeylI7DN6mo9YWbBX/g4QH2zIeFC5GAEOdCc+hdswfveQFbUCaICKlkWpJYRaCsK
Y3eZ8TJfJsWt
-----END CERTIFICATE-----
```

- 현재 default namespace에 default 이름의 sa가 pod에 할당되어 있다면, 다른 pod에서 생성된 token을 가지고도 또 다른 pod에서 `curl` 명령으로 접근 가능함
- 이건 현재 실행되고 있는 pod이 어떤 sa를 가지고 있는가에 문제가 아닌듯
- 즉, namespace와 sa로 만들어진 token은 어디서든 사용하든 상관이 없을 듯 => 다른 sa로 할당된 pod에서도 해당 토큰으로 실행시 그대로 실행된다
	- 다시 말하면, pod과 token을 따로 생성하는데 이 token에 sa, namespace에 관한 내용이 담기는 것인듯!
	- 토큰 분실에 유의해야 할 듯

```yaml
# nginx2-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx2
  labels:
    app.kubernetes.io/name: nginx2
spec:
  serviceAccountName: test
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
          protocol: TCP
```

```shell
k create -f nginx2-pod.yaml
k exec -it nginx2 -- bash
export TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6IkM4b1pFYUtDR293VlZFTHprY3NnUjlKOWZaN2YwdHVBSElxZ3BQMXBfRDAifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNzM4NDU3OTU3LCJpYXQiOjE3MDY5MjE5NTcsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJkZWZhdWx0IiwicG9kIjp7Im5hbWUiOiJzcHJpbmdib290LWhlbGxvd29ybGQtN2Q4ZmRiN2M1OS02N3NtbSIsInVpZCI6IjFkMGZhZGJiLTBjMTUtNDdjZS04MDRlLTUxMTgxMWNlYTE2MCJ9LCJzZXJ2aWNlYWNjb3VudCI6eyJuYW1lIjoiZGVmYXVsdCIsInVpZCI6Ijc1OGMzNjE4LTNhOWUtNDRiMC1iMTRkLTY4ZjBiZDJkZWE3ZiJ9LCJ3YXJuYWZ0ZXIiOjE3MDY5MjU1NjR9LCJuYmYiOjE3MDY5MjE5NTcsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZWZhdWx0OmRlZmF1bHQifQ.FwNTxsEJpl-L9CoQNa9O_Q-9gNYvs-k5oPriMvpoWphjZN6BM0WwnpMRBBgiRjmNqIn8ayBtHX7JAd-VApkXK_DBOhmN61jbh48eVbdFhfUqVLIkTu9OyBItgtmQE0ZBPhOIdI54hCLLo6Bm6hSrddZM5oYhWHZi7ZXP_fgMjiX6qIzQapXQnZyceLQPctLnYHvbqOVn4fUsq9gfCBuptvXgFhTQeW3G97htvJ8Gs73wc3IUi6GRpk5uMuPOcMhJhJ-7cm7IkKwiaEgMa3avGj8P8Bi-G1PbcX9h0XiOahxonYBHfBixwI6hE7xXkKb6o5P85ZF8CtvoVnosCoSCyw

curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --header "Authorization: Bearer $TOKEN" --cacert /root/pki/ca.crt
```
- 잘 출력이 된다
- 이미 default namespace, default sa로 생성된 토큰이기 때문에

### 7. token 생성하기

1. Manually create an API token for a ServiceAccount(TokenRequest API)
	- 현재 clusterrolebinding은 default namespace, default sa로만 바인딩 되어있기 때문에 test sa로 발급한 토큰은 RBAC에 의해 허용되지 않음

```shell
k create token test

eyJhbGciOiJSUzI1NiIsImtpZCI6IkM4b1pFYUtDR293VlZFTHprY3NnUjlKOWZaN2YwdHVBSElxZ3BQMXBfRDAifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNzA2OTMwMTA1LCJpYXQiOjE3MDY5MjY1MDUsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJkZWZhdWx0Iiwic2VydmljZWFjY291bnQiOnsibmFtZSI6InRlc3QiLCJ1aWQiOiI0MjI2NjUxMC0wNzcyLTQ1ZTAtOTg0Zi05ODFlNTU2MDM1ZjYifX0sIm5iZiI6MTcwNjkyNjUwNSwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OmRlZmF1bHQ6dGVzdCJ9.ktygRWoKKKAfJLnjzzSdSPd9eEbs6qz4DXz8cnvMV4y8GGREEgbpiMaXJykgaG3xE32ubZNMU-8c8KNiBoej0Igc1032NWR7Lm8xx8yLtYLMDIIy9h6QLKFwX81hAmMB_4oTHnyzzSXb7XF8dQndAAFbvhneRyCW-163mWzOcp_mg_dnsVbSdW6GqVjaPrxSn73Jg47qQcbEbkes2qGQs1mBW760IHIQPDOu4czamJIIqOOOKaSPquOxzXXjRS3KmF6YmP76Lr2ifpG2_3Q8xAFBk9LCLQU5MhQcYiFW8O5Qf22evM5uJnFDx_QEQw_qmFgUPwDhg3fYCKyW_FhxnA
```

```shell
export TOKEN=eyJhbGciOiJSUzI1NiIsImtpZCI6IkM4b1pFYUtDR293VlZFTHprY3NnUjlKOWZaN2YwdHVBSElxZ3BQMXBfRDAifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxNzA2OTMwMTA1LCJpYXQiOjE3MDY5MjY1MDUsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJkZWZhdWx0Iiwic2VydmljZWFjY291bnQiOnsibmFtZSI6InRlc3QiLCJ1aWQiOiI0MjI2NjUxMC0wNzcyLTQ1ZTAtOTg0Zi05ODFlNTU2MDM1ZjYifX0sIm5iZiI6MTcwNjkyNjUwNSwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OmRlZmF1bHQ6dGVzdCJ9.ktygRWoKKKAfJLnjzzSdSPd9eEbs6qz4DXz8cnvMV4y8GGREEgbpiMaXJykgaG3xE32ubZNMU-8c8KNiBoej0Igc1032NWR7Lm8xx8yLtYLMDIIy9h6QLKFwX81hAmMB_4oTHnyzzSXb7XF8dQndAAFbvhneRyCW-163mWzOcp_mg_dnsVbSdW6GqVjaPrxSn73Jg47qQcbEbkes2qGQs1mBW760IHIQPDOu4czamJIIqOOOKaSPquOxzXXjRS3KmF6YmP76Lr2ifpG2_3Q8xAFBk9LCLQU5MhQcYiFW8O5Qf22evM5uJnFDx_QEQw_qmFgUPwDhg3fYCKyW_FhxnA

curl -X GET https://$KUBERNETES_SERVICE_HOST/api/v1/namespaces/default/pods --header "Authorization: Bearer $TOKEN" --cacert /root/pki/ca.crt

{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {},
  "status": "Failure",
  "message": "pods is forbidden: User \"system:serviceaccount:default:test\" cannot list resource \"pods\" in API group \"\" in the namespace \"default\"",
  "reason": "Forbidden",
  "details": {
    "kind": "pods"
  },
  "code": 403
}
```

2. 자동으로 pod에 토큰 마운트
	- 아직





### 실습 사용 파일

```yaml
# nginx-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: nginx
spec:
  serviceAccountName: test
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 443
          protocol: TCP
```
- SSL 연결이 가능한 nginx 서버

```yaml
# nginx2-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx2
  labels:
    app.kubernetes.io/name: nginx2
spec:
  serviceAccountName: test
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
          protocol: TCP
```
- service account를 지정
- 지정하는 것이 큰 의미가 있나?


https://jonnung.dev/kubernetes/2020/06/18/kubernetes-user-authorizations/
https://somaz.tistory.com/221
https://happycloud-lee.tistory.com/259
https://coffeewhale.com/kubernetes/authentication/x509/2020/05/02/auth01/
	