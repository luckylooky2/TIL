
## Root Certificate(CA)

```shell
# ca.key 라는 파일 이름으로 비밀 키 생성
openssl genrsa -out ca.key 2048

# ca.csr이라는 파일 이름으로 ca.key 비밀 키를 이용하여 CSR 생성
# 비밀키, 비공개키 => .key
openssl req -new -key ca.key -subj "/CN=MY-KUBERNETES-CA" -out ca.csr

# ca.csr을 ca.key 파일을 이용하여 ca.crt 라는 이름의 Root Certificate 생성
# 공개키 포함 => .crt/.pem
openssl x509 -req -in ca.csr -signkey ca.key -out ca.crt
```

### Client Certificate(admin user)

```shell
# admin.key 라는 파일 이름으로 비밀 키 생성
openssl genrsa -out admin.key 2048

# admin.csr이라는 파일 이름으로 admin.key 비밀 키를 이용하여 CSR 생성
openssl req -new -key admin.key -subj "/CN=kube-admin/O=system:masters" -out admin.csr

# admin.csr을 ca.key 파일을 이용하여 admin.crt 라는 이름의 Client Certificate 생성
openssl x509 -req -CAcreateserial -in admin.csr -CA ca.crt -CAkey ca.key -out admin.crt
```
- https://stackoverflow.com/questions/66357451/why-does-signing-a-certificate-require-cacreateserial-argument
- `CAcreateserial` 옵션은 CAserial 파일이 존재하지 않을 경우 자동으로 생성해주는 역할
- `CAserial` 옵션은 CA에서 발급한 인증서의 일련번호 파일을 지정

### Server Certificate(apiServer)

```shell
# apiserver.key 라는 파일 이름으로 비밀 키 생성
openssl genrsa -out apiserver.key 2048

# apiserver.csr이라는 파일 이름으로 apiserver.key 비밀 키를 이용하여 CSR 생성
openssl req -new -key apiserver.key -subj "/CN=kube-apiserver" -out apiserver.csr

# apiserver.csr을 ca.key 파일을 이용하여 apiserver.crt 라는 이름의 Server Certificate 생성 
openssl x509 -req -in apiserver.csr -CA ca.crt -CAkey ca.key -out apiserver.crt
```

### 새로운 유저 생성 : openssl

```shell
# 클라이언트 인증서 생성
openssl genrsa -out user1.key 2048
openssl req -new -key user1.key -subj "/CN=user1/O=system:masters" -out user1.csr
openssl x509 -req -CAcreateserial -in user1.csr -CA ca.crt -CAkey ca.key -out user1.crt

# O=system:masters를 넣지 않으면 Authorization(인가) 문제 발생
# Error from server (Forbidden): pods is forbidden: User "user1" cannot list resource "pods" in API group "" in the namespace "default"

# 요청 시 인증서 첨부
vim ~/.kube/config

apiVersion: v1
clusters:
- cluster:
    certificate-authority: /etc/kubernets/pki/ca.crt
    server: https://controlplane:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate: /etc/kubernetes/pki/user1.crt
    client-key: /etc/kubernetes/pki/user1.key
```
- kubeconfig 파일에 경로 대신 Base64로 인코딩한 data를 추가하는 방법도 있음
	- 대신 이름 + -data를 붙여야 함

##### kubeconfig에서 Client Certificates을 새로운 CA를 서명한 인증서로 바꿨을 때

```shell
vim ~/.kube/config

apiVersion: v1
clusters:
- cluster:
    certificate-authority: /etc/kubernets/pki/ca.crt
    server: https://controlplane:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate: /tmp/pki/admin.crt
    client-key: /tmp/pki/admin.key

k get pods
# error: You must be logged in to the server (Unauthorized)
```

##### kubeconfig에서 Server Certificates을 새로운 CA를 서명한 인증서로 바꿨을 때

```shell
vim ~/.kube/config

apiVersion: v1
clusters:
- cluster:
    certificate-authority: /tmp/pki/ca.crt
    server: https://controlplane:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate: /etc/kubernetes/pki/admin.crt
    client-key: /etc/kubernetes/pki/admin.key

k get pods
#  Unable to connect to the server: tls: failed to verify certificate: x509: certificate signed by unknown authority
```

##### --client-ca-file=/etc/kubernetes/pki/ca.crt를 바꿨을 때

```shell
vim /etc/kubernetes/manifests/kube-apiserver.yaml

# --client-ca-file=/tmp/pki/ca.crt

k get pods
# The connection to the server controlplane:6443 was refused - did you specify the right host or port?
```

- 현재 구성되어 있는 클러스터에서 CA를 바꾸는 방법은 잘 모르겠음 => 관련되어 있는 모든 설정 파일을 바꾸기 쉽지 않을 듯?

### 새로운 유저 생성 : Certificates API

```shell
openssl genrsa -out user1.key 2048
openssl req -new -key user1.key -subj "/CN=user1/O=system:masters" -out user1.csr
cat user1.csr | base64 | tr -d "\n"
# LS0tLS1CRUdJTiBDRV...
vim user1.yaml

apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: user1
spec:
  request: LS0tLS1CRUdJTiBDRV...
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 86400  # one day
  usages:
  - client auth

k create -f user1.yaml

k get csr

k get csr user1 -o yaml

k certificate approve user1
k certificate deny user1
```

```shell
# CSR 오브젝트를 처리하는 곳은 controller-manager => 서명할 파일을 제공
cat /etc/kubernetes/manifests/kube-controller-manager.yaml
# - --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt
# - --cluster-signing-key-file=/etc/kubernetes/pki/ca.key
```

### Role / RoleBinding

- 특정 리소스에 접근할 수 있도록 인가할 수 있다
```shell
# Role 생성
vim developer-role.yaml

apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: developer
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["create", "delete"]

k create -f developer.yaml

# RoleBinding 생성
k create rolebinding dev-user-binding —role=developer —user=dev-user

or

vim developer-dev-user-binding.yaml

apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: default
  name: dev-user-binding
subjects:
- kind: User
  name: dev-user
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.io

k create -f developer-dev-user-binding.yaml

# context 추가
vim ~/.kube/config
- context:
    cluster: kubernetes
    user: dev-user
  name: dev-user@kubernetes

# 유저 변경
k config use-context dev-user@kubernetes

k get pods --as dev-user
# Error from server (Forbidden): pods is forbidden: User "dev-user" cannot list resource "pods" in API group "" in the namespace "default"

k get rolebindings --as dev-user
# Error from server (Forbidden): rolebindings.rbac.authorization.k8s.io is forbidden: User "dev-user" cannot list resource "rolebindings" in API group "rbac.authorization.k8s.io" in the namespace "default"
```


### AWS에서 Client Certificates을 발행할 수 있는가

- https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/cert-signing.html
- https://github.com/aws/containers-roadmap/issues/1856
- AWS IAM Role과 Policy로 대체?

계정 생성
- 자유로운 가입?
	- 서비스 요청 등을 하고, 관리자가 검토 후(월렛) 이미지를 올릴 수 있는 권한으로 바꿈
- 월렛으로 구입을 하면 ID / PW를 자동으로 생성 후 알려주는 방식?
	- 이 계정에는 이미지를 올릴 수 있는 권한이 주어져 있음

user account / service account 생성, 삭제
- 고객이 첫 번째 image를 올리고 배포할 때 자동으로 user account / service account 다 생성
- 서비스를 내리는 시점(관련된 모든 pod가 내려가는 시점?)에 모두 삭제
### User Account가 필요한가
- 가용중인(돌아가고 있는) 서비스 자원에 접근하기 위해서만 필요
- 다른 서비스 말고 자신의 서비스(Pod)에만 접근 권한 필요 => role.resourceName에 명시하여 Role을 생성
- 서비스마다 namespace로 묶어서 관리할 수도 있을 듯

### Service Account란?
- 외부 Application이 쿠버네티스 클러스터와 소통할 때 사용된다
- 소통할 때, 토큰이 반드시 필요하다
- 생성 시, 특정 pod에 귀속되지는 않는다
	- pod definition file에 serviceAccountName으로 지정한다
- 모든 네임스페이스마다 default SA가 존재
- 순서
	1. SA를 만든다
	2. RBAC 방식으로 Role을 부여한다
	3. pod definition file에 해당 SA를 명시한다
	4. 토큰을 생성한다
	5. 해당 토큰을 export하여 Bearer 방식으로 REST API 헤더로 사용하여 인증한다
- prometheus <-> 42noti
	- 이 사이에도 SA가 필요한가?
- 우리 웹 페이지 <-> prometheus
	- 웹 페이지 또한 Pod로 관리?
	- 웹 앱(Pod) -> apiServer -> 42noti(Pod) -> (service account) -> prometheus container
- IAM ↔ SA ↔ Monitoring의 의미는?

순서
1. k create sa dashboard-sa
2. Role 부여
3. k edit pod web-dashboard-97c9c59f6-v989r
	- serviceAccountName: default
	- serviceAccount: default
	- 마운트 관련 옵션도 해주어야 하나?
4. kubectl create token dashboard-sa
	- k exec -it web-dashboard-97c9c59f6-v989r cat /var/run/secrets/kubernetes.io/serviceaccount/token 으로 내부에 마운트된 토큰은 어떤 토큰인가?
	- 이걸로 API를 보내면 제대로 동작하지 않는데...
	- kubectl create token default로 만든 토큰을 사용해도 제대로 동작하지 않음
5. REST API을 토큰과 함께 호출
	- SA는 default인데 어떻게 dashboard-sa로 생성한 토큰으로 인증이 되는가?
