<k8s Security>

- k create serviceaccount sa1
- K get serviceaccount

  

- 모든 유저 접근은 kube-apiServer에 의해 관리됨
- 1. 클러스터에 kubectl을 이용해서든지

- kubectl

- 2. API를 직접 이용해서든지

- Curl [https://kube-server-ip:6](https://kube-server-ip:6)443

- 이 모든 요청은 apiServer로 간다
- apiServer는

- 1. 요청(유저)을 authenticate(인증)

- Vs. authorize(인가, 승인)
- How? 아래 정리

- 2. processing request

  

<authentication methods>

- 1. Static password files(w/ username)

- —basic-auth-file=user-details.csv 옵션

- 1. kube-apiserver.service 파일에 추가 => api server restart
- 2. /etc/kubernetes/manifests/kube-apiserver.yaml에 spec > containers > command 에 추가

- User-details.csv

- Password | username | userID
- password123, user1, u0001
- curl -v -k https://localhost:6443/api/v1/pods -u “user1:password123" 로 apiServer에 인증

- 2. Static token file

- —token-auth-file=user-token-details.csv

- 쉽지만 안전하지 않기 때문에 위의 두 개는 추천하지 않음

- Auth file을 넘기기 위해 volume mount가 필요

- 3. Certificates
- 4. Third party authentication protocol(LDAP, Kerberos …)

  

<TLS basic>

- 서버와 클라이언트 사이에 대화를 암호화 해주는 기능
- 동영상 144
- 나중에 정리

  

<securing Kubernetes cluster with TLS certificates>

- Root ceritificates

- Server certificates를 서명할 때 쓰임
- 신뢰할 수 있는 사이트이다
- 신뢰할 수 있는 사이트라는 것은? 서버 관리자의 정보가 있다라는 뜻인가?
- 이 서버 관리자의 신원을 믿을 수 있는가?

- server Certificates

- 서버가 비대칭키를 이용하여 보안적으로 클라이언트와 소통할 때 필요한 것을 지칭
- 서버가 클라이언트에 자신의 퍼블릭 키를 보낼 때, 키가 내장된 인증서를 보낸다!
- 서명 받은 인증서

- Client certificates

- 서버가 클라이언트에게 자신을 요구하라고 할 때 사용

- 이 개념들이 쿠버네티스 클러스터와 어떻게 연관되어 있나?

- 노드와 마스터 노드 간의 소통은 암호화되어야 함

- kubectl 혹은 직접 쿱 API를 이용하여 쿱 클러스터와 소통하려하면

- TLS 커넥션을 맺어야 함

- 두 개의 조건이 필요

- 클러스터 내 다양한 서비스들 간에 서버 인증서(서버에게), 클라이언트 인증서(클라이언트에게)가 필요함
- 누가 누구인지를 입증하기 위해서!

  

- Kube-apiserver

- 다른 컴포넌트, 외부 사용자들에게 클러스터를 관리하기 위해 여러 HTTPS service를 제공하므로 TLS 커넥션이 필요
- 서버 입장 : server certification(apiserver.crt, apiserver.key)
- 클라이언트?

- 1. Kubectl or API를 사용하는 “administrators”

- admin.crt, admin.key

- 2. “Kube-scheduler”

- 스케줄링이 필요한 파드를 찾기 위해 apiServer에 요청
- scheduler.crt, scheduler.key

- 3. Kube-controller-manager

- Contoller-manager.crt, controller-manager.key

- 4. Kube-proxy

- kube-proxy.crt, kube-proxy.key

- ETCD server

- 클러스터의 모든 정보를 포함
- etcdserver.crt, etcdserver.key
- 클라이언트?

- Kube-apiserver

- Etcd 서버와 소통하는 유일한 클라이언트
- Crt, key는 이미 생성된 것을 사용 or 따로 생성해도 됨
- Apiserver-etcd-client.crt, Apiserver-etcd-client.key

- Worker node(kubelet server)

- apiServer와 대화하기 위한 kubeHTTPS API 엔드포인트를 expose
- Kubelet.crt, kubelet.key
- 클라이언트?

- Kube-apiserver

- Crt, key는 이미 생성된 것을 사용 or 따로 생성해도 됨
- Apiserver-kubelet-client.crt, Apiserver-kubelet -client.keyasdCA가 모든 증명서에 서명해야 함

- 클러스터에 최소한 하나의 CA를 가지도록, 여러 CA가 있어도 됨(e.g. Etcd 증명서)

  

  

<How to create certificates>

- EASYRSA
- CFSSL
- OPENSSL
- Root certificates

- Generate keys : Openssl genrsa -out ca.key 2048
- CSR : openssl req -new -key ca.key -subj “/CN=KUBERNETES-CA” -out ca.csr

- 서명이 존재하지 않는 요청서
- 위에서 생성한 Private key를 동봉

- Sign : openssl x509 -req -in ca.csr -signkey ca.key -out ca.crt

- SSC
- 위에서 생성한 private key로 서명
- 이후 모든 증명서에 이 키로 서명할 예정
- Root Certificate

- Client certificates

- Admin

- Generate keys : openssl genrsa -out admin.key 2048
- CSR : openssl req -new -key admin.key -subj “/CN=kube-admin/O=system:masters” -out admin.csr

- CN : kubectl 명령어를 입력하면 audit log에 적히는 이름
- O : 그룹 지정

- Sign : openssl x509 -req -in admin.csr -CA ca.crt -CAkey ca.key -out admin.crt

- 서명을 Server 측에서 생성한 root Certificate으로 서명
- 클러스터 안에서 유효한 증명서가 됨
- 어드민 유저를 다른 유저와 구분하는 방법?
- 증명서에 group detail을 추가!
- e.g. System Masters 그룹은 어드민 권한이 있는 그룹

- apiServer에 접근하는 모든 다른 컴포넌트, 유저에 위와 같은 방법으로 증명서를 발급할 수 있음

- kube-scheduler / kube-controller-manager / kube-proxy

- 쿠버네티스 컨트롤 플레인에 한 부분으로 “시스템 컴포넌트”
- prefix로 SYSTEM을 추가해주자

- 1. 이 증명서는 REST API 호출에서 username, password를 대체할 수 있음

- Curl [https://kube-apiserver:6443/api/v1/pods](https://kube-apiserver:6443/api/v1/pods) —key admin.key —cert admin.crt —cacert ca.crt

- 2. 또한, kube-config.yaml 설정 파일(각각의 컴포넌트 설정 파일)에서 설정하는 방법이 있음
- 브라우저에서 CA root certificates들을 가지고 있어서 서버를 검증하는 것처럼, 서버 혹은 클라이언트 증명서를 만들 때 CA root certificate를 특정해주어야 함
- Server certificates

- ETCD server 
- Kube-api server

- 여러 이름(alternative name)으로 apiserver를 사용할 수 있기 때문에(그룹?), 증명서에 해당 이름을 명시해주어야 함

- openssl.conf > alt_name에 DNS.1 …에 추가

- Generate keys : Openssl genrsa -out apiserver.key 2048
- CSR : openssl req -new -key apiserver.key -subj “/CN=kube-apiserver” -out apiserver.csr
- Sign : openssl x509 -req -in apiserver.csr -CA ca.crt _CAkey ca.key -out apiserver.crt

- Kubelet server

- 각 노드에서 실행되는 HTTPS API 서버
- 각각의 노드마다 증명서와 키가 필요함
- 증명서의 이름은? 모두 kubelet이 아니라 node01, node02 …
- Kubelet config file에서 root cert와 node cert.를 명시해주어야 함(모든 노드에서)
- API server는 어떤 노드가 인증할지 알아야 한다 => 정해진 형식을 따름

- System:node:node01, node02 …
- Group : SYSTME:NODES

  

<View Certificate Details>

- 전체 클러스터에서 모든 증명서에 대한 헬스 체크를 해야 한다
- 어떻게?
- 어려운 방법

- 모든 증명서를 일일이 발급하는 방법 : 이전 강의에서 했던 것처럼
- Cat /etc/systemd/system/kube-apiserver.service에서 —tls-cert-file=/var/lib/kubernetes/kubernetes.pem —tls-private-key-file=/…/kubernetes-key.pem을 일일이 넣어주는 방법

- kubeadm

- 자동 생성
- Cat /etc/kubernetes/manifests/kube-apiserver.yaml

- kube-apiserver를 위한 configuration 파일
- Etcd, kube-scheduler 등 system component config 설정 가능
- apiServer가 사용하는 모든 증명서에 대한 모든 정보를 담아줄 수 있음

- /etc/kubernetes/pki/apiserver.crt

- Openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout

- 증명서를 해독하고 자세한 사항을 보기 위한 명령어
- subject(증명서 이름), alternative name(별명), issuer

  

<테스트>

- cat /etc/kubernetes/pki/apiserver.crt : kube-api server 증명서의 위치
- Cat /etc/kubernetes/pki/apiserver-etcd-client.crt : Identify the Certificate file used to authenticate kube-apiserver as a client to ETCD Server.
- Cat /etc/kubernetes/pki/apiserver-kubelet-client.key : Identify the key used to authenticate kubeapi-server to the kubelet server.
- cat /etc/kubernetes/pki/etcd/server.crt : Identify the ETCD Server Certificate used to host ETCD server.
- Cat /etc/kubernetes/pki/etcd/ca.crt : Identify the ETCD Server CA Root Certificate used to serve ETCD Server.
- openssl x509 -in apiserver.crt -text -noout

Certificate:

    Data:

        Version: 3 (0x2)

        Serial Number: 6324783721850731375 (0x57c62548ee15fb6f)

        Signature Algorithm: sha256WithRSAEncryption

        Issuer: CN = kubernetes

        Validity

            Not Before: Jan 10 11:53:35 2024 GMT

            Not After : Jan  9 11:53:35 2025 GMT

        Subject: CN = kube-apiserver

        Subject Public Key Info:

            Public Key Algorithm: rsaEncryption

                RSA Public-Key: (2048 bit)

                Modulus:

                    00:bd:05:90:2f:d3:11:42:7e:c1:ed:cd:90:d6:f3:

                    a2:bb:d3:ff:24:64:82:11:a9:f6:e3:39:37:e1:d1:

                    ff:b8:17:d8:c7:d4:97:f4:71:d2:44:1f:8a:34:1e:

                    aa:24:eb:87:0d:c7:53:3d:5c:52:1e:89:c2:93:e2:

                    f9:63:77:b2:79:7d:17:a3:cd:b0:a1:ba:f1:fb:f2:

                    a0:ad:86:d4:52:f2:b8:34:0d:0f:53:ba:ab:f7:38:

                    51:a7:37:52:7e:06:a9:0d:93:96:12:2b:ed:40:97:

                    2a:11:c2:00:a2:d9:6b:13:cb:7a:52:55:30:72:b8:

                    ec:6d:b2:35:2d:f2:ee:31:ca:71:b0:33:a2:93:92:

                    67:dc:bf:d5:99:b3:9c:f0:e1:d8:4a:20:13:3d:81:

                    13:26:6a:92:ad:f2:67:88:db:0b:c9:e2:c6:54:79:

                    66:2e:26:ff:e5:62:65:fd:70:0f:93:70:c8:49:e6:

                    6c:3f:eb:c4:dc:36:0b:11:d2:89:e1:ff:c6:27:5d:

                    0e:92:8d:1a:0d:e7:96:45:98:83:ae:8f:11:96:1b:

                    d1:3f:28:28:96:d8:6f:f9:73:4d:69:26:84:cc:c9:

                    da:f8:36:89:39:cb:d5:b7:18:45:93:96:58:53:f9:

                    5b:ea:88:40:86:be:3a:4d:c8:b3:4c:2d:da:d2:2e:

                    92:c1

                Exponent: 65537 (0x10001)

        X509v3 extensions:

            X509v3 Key Usage: critical

                Digital Signature, Key Encipherment

            X509v3 Extended Key Usage: 

                TLS Web Server Authentication

            X509v3 Basic Constraints: critical

                CA:FALSE

            X509v3 Authority Key Identifier: 

                keyid:8A:E7:3F:11:F4:71:A2:75:CE:04:70:66:CD:0A:00:22:E7:7A:CC:D2

  

            X509v3 Subject Alternative Name: 

                DNS:controlplane, DNS:kubernetes, DNS:kubernetes.default, DNS:kubernetes.default.svc, DNS:kubernetes.default.svc.cluster.local, IP Address:10.96.0.1, IP Address:192.25.72.6

    Signature Algorithm: sha256WithRSAEncryption

         7d:e5:6b:40:ad:45:f5:65:5d:9e:31:43:ec:bd:99:65:d1:c9:

         9f:9c:cc:86:d1:5f:0f:17:df:3e:c0:c7:74:72:d0:d5:1e:ef:

         05:06:95:3f:3a:86:e8:bb:5a:ab:cd:7c:6b:a5:63:96:fe:a0:

         97:fd:87:0b:b7:92:a4:47:55:43:9a:81:c5:40:34:fc:df:5b:

         2a:54:5e:97:e4:84:5c:d5:82:15:40:8e:b1:ea:df:b1:2d:e6:

         a0:de:ff:03:08:3d:5f:6e:72:5b:91:dc:2b:ca:0e:f9:94:85:

         2d:58:aa:1c:9d:9f:9b:6e:f5:3b:5e:2d:e8:4f:71:97:ec:97:

         33:e6:83:94:72:33:69:80:dd:89:24:2c:8d:26:ce:a1:03:5b:

         21:13:aa:dc:fa:02:80:fd:52:2b:cc:ac:ae:53:ff:60:9d:cf:

         ea:e8:25:74:9c:9a:93:65:ab:a2:54:63:0a:dc:0e:4b:19:ec:

         bd:0e:90:0a:cc:2c:87:e7:85:9d:6a:9e:18:67:83:16:79:42:

         19:09:71:b7:99:c7:72:d5:f6:8a:6f:29:94:f4:94:8e:61:8f:

         3d:bc:d9:08:a4:f0:6b:b7:a6:38:bd:dc:95:de:68:02:2c:3c:

         89:d2:23:52:54:8c:34:c5:23:85:6b:8e:c8:a5:fd:cc:a0:e7:

         c6:4c:54:42

  

- Vim /etc/kubernetes/manifests/etcd.yaml에서 —cert-file이 잘못 설정되어 있던 것을 확인 => 교체
- crictl ps -a : to identify the kube-api server container
- crictl logs container-id :  to view the logs
- crictl logs fa5e931c73063(kube-apiserver)
- vim /etc/kubernetes/manifests/kube-apiserver.yaml
- —etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt 가 —etcd-cafile=/etc/kubernetes/pki/ca.crt 였었음
- etcd가 서버이고, apiserver가 클라이언트인 상황
- Certificate 확인하는 방법 => config file을 찾는다

- Cat /etc/kubernetes/manifests/kube-apiserver.yaml

- 각각의 컴포넌트의 관계를 통해 클라이언트, 서버 증명서를 추론할 수 있음
- K get pods를 했는데, 연결되어 있지 않다고 뜬다면

- Kube apiServer의 상태를 봐야 함
- 처리하는 곳이 apiServer이기 때문에
- 물론, kubectl 명령어는 사용하지 못함

- 로그 보기

- Docker(crictl) ps -a | grep etcd
- Docker(crictl) logs <container-id>

- Crio instad of docker

- 컨테이너의 상태를 보고, 어떤 문제가 있는지 파악

  

<Certificates API>

- 새로운 어드민 유저를 위해 증명서를 발급해야 하는 상황(클러스터에 접근하기 위해)
- 관리자(어드민)이 새로운 유저의 CSR을 받아 CA의 서명을 통해 증명서 발급 => 발급된 증명서를 새로운 유저에게 전달
- CA 서버

- CA는 사실 비대칭 키와 증명서 파일이 전부
- 이 자원에 접근할 수 있는 사람은 어떤 증명서에도 서명할 수 있어, 해당 증명서를 가지고 클러스터에 접근할 수 있음
- 이 자원은 안전한 곳에 보관하고, 접근에 제한이 되어야 함 => 서명을 하기 위해서는 해당 서버에 로그인해야 함
- 보통 마스터 노드에 저장. 즉, 마스터 노드가 RCA 서버

- 위와 같이 수동으로 할 수 있지만, 더 쉬운 방법으로 증명서를 관리하고 / 서명하는 방법으로 쿠버네티스는 내장 certificates API를 제공

- 마스터 노드에 로그인 하는 대신, API를 호출하여 CSR을 넘겨주면 자동으로 처리해 줌
- CertificateSigningRequest 오브젝트 생성

- 순서

- 1. CertificateSigningRequest 오브젝트 생성

- 새로운 유저가 key / CSR 생성
- CertificateSigningRequest 오브젝트 생성 => manifest 파일(jane-csr.yaml, 항상 존재하는 오브젝트는 아닌듯?)
- 증명서를 생성해주는 일회용 오브젝트?
- Kind : CertificateSigningRequest
- Spec > request : base64 encoded CSR
- 단, CSR을 base64 인코딩 필요

- Cat Jane.csr | base64

- 2. Review requests

- K get csr

- 3. Approve requests

- K certificate approve Jane
- CA 키 페어를 가지고 서명

- 4. Share certs to users

- K get csr Jane -o yaml
- Status > certificate : base64 encoded Certificates
- Echo “” | base64 —decode

- Certificate operated operations 와 관련된 시스템 오브젝트는?

- Controller manager
- CSR-approving, csr-signing 컨트롤러가 존재
- Cat /etc/kubernetes/manifests/kube-controller-manager.yaml

- —cluster-siginig-cert-file / —cluster-signing-key-file

  

<테스트>

cat akshay.csr | base64 -w 0

  

LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ1ZqQ0NBVDRDQVFBd0VURVBNQTBHQTFVRUF3d0dZV3R6YUdGNU1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQTI1KzUraGQwZHFSMXBTbmNPcWYrMTR5NDRRbnhCd3JtLzRSeXdUU0JjQXZFCmduOFRTTkNWOUk4WC83Q25GaVJ5UkdXc1I5LzZINFNmZEZKQ2QvdXNic0xyK0R2ZlQwY0lzM1ZoMXZDNVBKVksKOThqTTV5OUFhMW5CMmgrU3B4TUdyL3Y5RUJtMEVaMmhVbGpjak5xb1ZCc0FLUGZ3YkpDWWRHdVlBeU1KV01jNQpGbTJlVXJVNmV1dkU4RHFvbjY4QUxXMUdRcGYzMGpzSUdnMWVQQ2RUYUF1YXplcVlYcElFaVozazZSWTVCalk2CnByN1h2ZEl6TXhyNTZKa2xuZ0s5ajZoL3FMWDJBays0d0Q1K25WZDZhaFpTSUhFUkF0QlpPNDB6b1dWWUJ6NGYKT3RLVGljUEgrNHZNdldtLzdtWk11YlM0TTZVQmJOTTRKMk8vWmNENXFRSURBUUFCb0FBd0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBRkdmSVlrbURldXM0WCtQT3NFaWxwUzVSS1VSRkVCYmJ3dkI2RnY0YmtUTmNxelJwcnpNCkVVQVdtb3IxUDJKaFpJVHdPTnU4dEJMM2plckFEb0FaTDlSeUk4VEVOWW9ZZ2RGdXlVUnVUSXA2WmNDYmJqNlgKSDVpcHl2Y2VTYnJoWW1KdHhXdEVZYjArOStXM0gzQ1ZBVElNb2I1QnZjQ0ZYQ3QxcFdENEM2L3VYbWN0STB0QQp0N0p5dXloT3Jvd044TVcwVW56T3JXNzhTQnR2b0VVWGh2MlNreVF3U1B1UVA1L3JIcG9oR2ZmNlJmOURDSHdUCjlTWlhsWFZzcFdHNWJoWUVjSmRPZUlXVW4yUE44dGZWNjgrdC9hZmRBSStxN0pYeFlQei9sQVBadTI0d0FnYWoKdnc5RUVZODVXTXRiaHdQOElrQkRHQkN1RjVld2hHVkJacTA9Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=

  

usages:

  - client auth

  

kubectl apply -f akshay.yaml / k create -f akshay.yaml

  

k certificate approve akshay

k describe csr agent-smith

k get csr agent-smith -o yaml

k certificate deny agent-smith

k delete csr agent-smith

  

  

<KubeConfig>

- Curl [https://my-kube-playground:6443/api/v1/pods](https://%EF%BF%BD:6443/api/v1/pods) —key admin.key —cert admin.crt —cacert ca.crt

- 증명서를 이용하여 podList를 조회하는 kubernetes REST API
- 유저를 인증하기 위해 필요한 방식

- K get pods —server my-kube-playground:6443 —client-key admin.key —client-certificate admin.crt —certificate-authority ca.crt

- 위와 같은 방법
- 이 방법은 매번 하기에 너무 힘들기 때문에 kubeConfig 파일에 저장
- $HOME/.kube/config
- K get pods —kubeconfig config로 짧게 해결

- Config

- 세 가지 카테고리
- Clusters : 접근할 여러 클러스터(개발 클러스터, 배포 클러스터 …)
- Contexts : cluster와 user를 이어주는 문맥

- 어떤 유저가 어떤 클러스터에 접근하는지 알려줌
- 여기서는 새로운 유저를 추가하거나 설정을 변경하거나 인증하는 작업을 하지 않음
- 단순히 존재하는 유저/권한과 클러스터를 연결해주는 역할
- e.g. Admin@Production

- Users : user accounts, 클러스터에 접근을 가지고 있는 유저 계정

- 유저마다 클러스터마다 권한이 다름

- 그렇기 때문에 kubectl을 사용할 때 증명서나 서버 주소를 명시하지 않아도 됨
- 설정은 어디로?

- —server my-kube-playground:6443 : Cluster
- —client-key admin.key : Cluster
- —client-certificate admin.crt : Users
- —certificate-authority ca.crt : Users
- MyKubeAdmin@MyKubePlayground : Contexts

- Kind : Config
- 따로 오브젝트를 만들 필요가 없음 As-Is 로 놔두면 됨
- 어떻게 kubectl이 어떤 context를 읽을지 아는가? 여러 컨텍스트가 있는데?

- Current-context: dev-user@google로 지정

- Kubectl config view / cat ~/.kube/config
- Kubectl config use-context prod-user@production
- 클러스터는 내부에 여러 namespaces를 가질 수 있음

- 어떻게 적용?
- Context > namespace에서 특정 ns 적용 가능

  

<테스트>

k config view

kubectl config --kubeconfig=/root/my-kube-config use-context research

- config가 여러 개 있을 때 특정하기 위해

k config -h

export KUBECONFIG=/root/my-kube-config 

cat my-kube-config > .kube/config

  

  

<API Groups>

- Curl [https://kube-master:6443/version](https://kube-master:6443/version) : 버전 가져오기
- Curl [https://kube-master:6443/api/v1/pods](https://kube-master:6443/api/v1/pods) : 파드 정보 가져오기
- 여러 API가 존재

- /metrics : 클러스터의 상태를 보여줌
- /healthz : 클러스터의 상태를 보여줌
- /version : 클러스터의 버전을 보여줌
- /api : core group
- /apis : named group
- /logs : 써드 파티 로깅 애플리케이션을 통합함

- /api

- /v1 아래
- /namespaces, /pods, /rc, /services, /nodes, /bindings 등…

- /apis
- /apps /extensions /networking.k8s.io, /[certificiates.k8s.io](http://certificiates.k8s.io) 등… => API groups

- /apps/v1

- /deployments, /replicasets 등… => Resources

- 각 Resources 아래
- /list, /get, /create, /delete, /update, /watch => Verbs

- /[certificates.k8s.io/v1](http://certificates.k8s.io/v1)

- /cetrificatesigningrequests 등… => Resources 

- API groups view

- Curl [http://localhost:6443](http://localhost:6443) -k

- Resource group view

- Curl [http://localhost:6443](http://localhost:6443)/apis -k | grep “name”

- 자동으로 인증(authentication)이 되지 않는 경우, 권한이 없는 경우 —key, —cert, —cacert를 이용하여 시도
- Kubectl proxy를 이용하여 Kube apiServer를 우회하는 접근하는 방법

- Kube proxy : 파드와 서비스를 노드 위치와 관계없이 연결해주는 것
- Kubectl proxy : kube apiServer에 접근하기 위해 생성하는 프록시

  

  

<Authorization>

- 인가
- 인증은 사용자가 누군지 식별하는 것
- 인가는 인증된 사용자가 특정 권한이 있는지 식별하는 것
- Admin(모든 것 가능)

- Kubectl get pods 가능
- K get nodes 가능
- K delete node worker-2 가능

- Developers

- K get pods / nodes 가능 
- K delete node worker-2 가능하지 않게 하고 싶음

- Bots

- 모든 것을 가능하게 하고 싶지 않음

- 1. Node

- Kube apiServer는 사용자나 kubelet으로부터 요청을 받을 수 있음
- 이러한 작업들은 Node Authorizer라고 하는 오브젝트로부터 핸들링 됨
- 증명서에 system:node라고 붙였던 것은 이러한 Node authorizer 때문

- 2. ABAC

- 특정 사용자나 그룹마다 JSON 포맷의 속성을 적어놓는 방식
- 같은 권한이라 하더라도, 모든 사용자나 그룹마다 파일을 만들어야 하기 때문에, 중복 발생
- 수작업으로 해야하고, apiServer를 restart 해야 함
- 다루기가 꽤 힘듦

- 3. RBAC

- 유저와 권한 묶음을 직접 연관하는 것이 아니라
- 역할이라는 것을 만들고(권한의 묶음), 모든 유저를 이 역할과 연관시킴
- 수정 사항이 생기면 역할의 내용을 변경하면 됨
- 쿱에서 보편적인 방식

- 4. Web hook

- 인가를 도와주는 서드 파티 앱
- 요청이 도착하면, open policy agent에게 허용해도 되는지 물어보고
- 해당 앱은 여부를 apiServer에 알려주는 방식

- 5. Always allow
- 6. Always deny
- 어디서 변경?

- /etc/kubernetes/manifest/kube-apiServer.yaml
- —authroization-mode=Alwaysallow
- —authroization-mode=Node, RBAC, WebHook
- 각각의 모듈을 comma seperated로 연결하면 체인 형식으로 진행
- node에서 실패하면 rbac으로, rbac에서 실패하면 web hook 모듈로 시도

- 체인 앞 쪽에서 성공하면 뒤로 보내지 않음

  

  

<Role Based Access Contol>

- Role 생성 : developer-role.yaml

- Kind :Role
- Rule > apiGroups: [“”]
- Rule > resources: [“pods”]
- Rule > verbs: [“create]
- Rule > resourceNames : [“blue”, “orange”] : 특정 리소스에 이름으로 포함시킬 수 있음
- 여러 Rule 배열을 추가할 수 있음

- Role 추가 : k create -f developer-role.yaml
- RoleBinding 생성 : devuser-developer-binding.yaml

- 역할과 유저를 묶어주는 역할
- Kind : RoleBinding
- Subjects : 묶어줄 유저를 특정
- RoleRef : 묶어줄 역할을 특정

- RoleBinding 추가 : k create -f devuser-developer-binding.yam
- 네임스페이스를 제한하고 싶으면 def 파일에 메타데이터에 추가
- K get roles
- K get rolebindings
- K describe roles
- K describe rolebinding
- K auth can-i create deployments : 권한이 있는지 알아보는 방법
- K auth can-o delete nodes
- 어드민이라면 특정 유저가 권한이 있는지 알아볼 수 있음

- K auth can-i create deployments —as dev-user
- K auth can-i create deployments —as dev-user —namespace test

  

<테스트>

cat /etc/kubernetes/manifests/kube-apiserver.yaml 

k get roles

k get roles -A

k describe roles -A

  

Name:         kube-proxy

Labels:       <none>

Annotations:  <none>

PolicyRule:

  Resources   Non-Resource URLs  Resource Names  Verbs

  ---------   -----------------  --------------  -----

  configmaps  []                 [kube-proxy]    [get]

  

  

k describe rolebindings kube-proxy -n kube-system

k auth can-i list pods --as dev-user(k get pods —as dev-user)

cat > dev-user-role.yaml

apiVersion: rbac.authorization.k8s.io/v1

kind: Role

metadata:

  namespace: default

  name: pod-reader

rules:

- apiGroups: [""] # "" indicates the core API group

  resources: ["pods"]

  verbs: ["get", "watch", "list"]

k create -f dev-user-role.yaml 

  

K create role developer —verb=list, create, delete —resource=pods

  

cat > dev-user-binding.yaml

apiVersion: rbac.authorization.k8s.io/v1

# This role binding allows "jane" to read pods in the "default" namespace.

# You need to already have a Role named "pod-reader" in that namespace.

kind: RoleBinding

metadata:

  name: read-pods

  namespace: default

subjects:

# You can specify more than one "subject"

- kind: User

  name: jane # "name" is case sensitive

  apiGroup: rbac.authorization.k8s.io

roleRef:

  # "roleRef" specifies the binding to a Role / ClusterRole

  kind: Role #this must be Role or ClusterRole

  name: pod-reader # this must match the name of the Role or ClusterRole you wish to bind to

  apiGroup: rbac.authoriz

k create -f dev-user-binding.yaml 

  

K create rolebinding dev-user-binding —role=developer —user=dev-user

  

k auth can-i get pods --as dev-user —namespace=blue

  

> k auth can-i get pods --as dev-user —namespace=blue

  

- role을 새로 만들었는데, edit을 이용하면 있던 것을 수정할 수 있음

apiVersion: rbac.authorization.k8s.io/v1

kind: Role

metadata:

  namespace: blue

  name: developer

rules:

- apiGroups: [""] # "" indicates the core API group

  resources: ["pods"]

  verbs: ["get"]

  resourceNames: [“dark-blue-app”]

  

> k edit role developer -n blue

  

apiVersion: rbac.authorization.k8s.io/v1

kind: Role

metadata:

  namespace: blue

  name: developer

rules:

- apiGroups: [""] # "" indicates the core API group

  resources: ["pods"]

  verbs: ["get"]

  resourceNames: ["dark-blue-app"]

- apiGroups: ["apps"]

  resources: ["deployments"]

  verbs: ["create"]

- Deployments 는 apigroup이 “apps”임을 주의

  

<Cluster roles>

- 역할과 역할 바인딩은 “네임스페이스 내부”에서 생성됨
- namespace를 지정하지 않으면 Default namespace에 생성됨(metadata)
- 노드가 네임스페이스에 배타적으로 귀속될 수 있는가? No

- Cluster-wide, cluser-scoped resources

- resource는 namespaced / cluster-scoped로 지정될 수 있음
- Namespaces

- e.g.
- Pods
- Replicates
- Jobs
- Deployments
- Services
- Secrets
- Roles : 네임스페이스 자원에 유저를 인가하는 방식
- Rolebindings : 네임스페이스 자원에 유저를 인가하는 방식
- Configmaps
- PVC
- View / delete / update 를 하려면 항상 ns를 명시
- K api-resources —namespaced=true

- Cluster-scoped

- e.g.
- Nodes
- PV
- Cluster roles
- Clusterrolebindings
- Cerfificatesigningrequests
- namespaces
- K api-resources —namespaced=false

- Cluster roles, cluster rolebinding은 cluster-scoped 자원들에 인가하기 위한 방식

- Cluster admin role : 노드를 vie, create, delete하기 위한 클러스터 어드민 권한
- Storage admin role : persistent volumes을 생성하기 위한 어드민 권한

- Cluster roles

- Kind: clusterrole
- Resources: [“nodes”]

- cluster rolebinding

- Kind : clusterRoleBinding

- Cluster roles, cluster rolebinding은 namespaced-scoped resource에도 사용할 수 있다

- cf> 모든 네임스페이스에 권한을 사용할 수 있게 된다
- 그러기에 조심하여 사용해야 함

  

<테스트>

>  k get clusterRoles

> k get clusterRoleBindings

> k describe clusterRoleBinding cluster-admin

> k describe clusterRole cluster-admin

> cat > developer-role.yaml

apiVersion: rbac.authorization.k8s.io/v1

kind: ClusterRole

metadata:

  # "namespace" omitted since ClusterRoles are not namespaced

  name: secret-reader

rules:

- apiGroups: [""]

  #

  # at the HTTP level, the name of the resource for accessing Secret

  # objects is "secrets"

  resources: ["secrets"]

  verbs: ["get", "watch", “list"]

> k create -f developer-role.yaml 

  

  

> cat > developer-rolebinding.yaml

apiVersion: rbac.authorization.k8s.io/v1

# This cluster role binding allows anyone in the "manager" group to read secrets in any namespace.

kind: ClusterRoleBinding

metadata:

  name: read-secrets-global

subjects:

- kind: Group

  name: manager # Name is case sensitive

  apiGroup: rbac.authorization.k8s.io

roleRef:

  kind: ClusterRole

  name: secret-reader

  apiGroup: [rbac.authorization.k8s.io](http://rbac.authorization.k8s.io)

  

> k create -f developer-rolebinding.yaml 

> kubectl api-resources

> kubectl api-resources | grep “storageclasses"

> kubectl api-resources | grep "persistentvolumes"

  

 > cat > storage-admin.yaml

apiVersion: rbac.authorization.k8s.io/v1

kind: ClusterRole

metadata:

  # "namespace" omitted since ClusterRoles are not namespaced

  name: secret-reader

rules:

- apiGroups: [""]

  #

  # at the HTTP level, the name of the resource for accessing Secret

  # objects is "secrets"

  resources: ["secrets"]

  verbs: ["get", "watch", “list"]

  

> cat > michelle-storage-admin.yaml

apiVersion: rbac.authorization.k8s.io/v1

# This cluster role binding allows anyone in the "manager" group to read secrets in any namespace.

kind: ClusterRoleBinding

metadata:

  name: read-secrets-global

subjects:

- kind: Group

  name: manager # Name is case sensitive

  apiGroup: rbac.authorization.k8s.io

roleRef:

  kind: ClusterRole

  name: secret-reader

  apiGroup: [rbac.authorization.k8s.io](http://rbac.authorization.k8s.io)

  

---

kind: ClusterRole

apiVersion: rbac.authorization.k8s.io/v1

metadata:

  name: storage-admin

rules:

- apiGroups: [""]

  resources: ["persistentvolumes"]

  verbs: ["get", "watch", "list", "create", "delete"]

- apiGroups: ["storage.k8s.io"]

  resources: ["storageclasses"]

  verbs: ["get", "watch", "list", "create", "delete"]

  

---

kind: ClusterRoleBinding

apiVersion: rbac.authorization.k8s.io/v1

metadata:

  name: michelle-storage-admin

subjects:

- kind: User

  name: michelle

  apiGroup: rbac.authorization.k8s.io

roleRef:

  kind: ClusterRole

  name: storage-admin

  apiGroup: [rbac.authorization.k8s.io](http://rbac.authorization.k8s.io)

  

> k create clusterrole —help

> k get nodes —as Michelle : 항상 권한이 있는지는 can-i와 —as로 알아보기

  

<Service Account>

- SA는 다른 보안 개념(authentication, authorization, RBAC 등..)과 관련이 있음
- SA와 이런 개념들이 어떻게 작동하는지만 알면 된다(SA 자체를 이해하지 않아도 된다)
- User account / service account

- 두 가지 타입의 계정이 존재

- User account

- 사람에 의해서 사용됨
- Admin : administrative task를 하기 위해서
- Developer : application을 배포(deploy)하기 위해

- Service account

- machine에 의해서 사용됨
- Application이 클러스터와 소통하기 위해서 사용됨
- Prometheus : 모니터링 어플리케이션이 성능 메트릭을 위해 kubernetes API를 이용
- Jenkins : 빌드 툴이 어플리케이션을 배포하기 위해 이용
- e.g. 배포할 때 수행하는 모든 작업은 쿠버네티스 API에 요청을 전송하여 쿠버네티스 클러스터의 포드 목록을 검색하고 웹 페이지에 표시하는 것입니다.
- 웹 어플리케이션이 쿠버네티스 API에 쿼리하기 위해서는 “인증”이 필요하다. 그래서 SA를 이용

- K create serviceaccount dashboard-sa(생성)
- K get serviceaccount(조회)
- SA가 생성되면 자동적으로 “토큰”을 생성

- K describe serviceaccount dashboard-sa
- 토큰은 외부 앱이 kube API에 인증하는 과정에서 필요하다
- 토큰은 만료기간이 없고, 어떤 audience에도 제한받지 않음
- 자동으로 default SA를 사용하는 파드에 볼륨 마운트 되는 성질을 가지고 있었음
- 토큰은 비밀 오브젝트로 이름만 알 수 있다

- 토큰을 먼저 생성하고, 비밀 오브젝트를 생성한 후 거기에 담는다
- 이후 SA와 비밀 오브젝트가 링크된다
- K describe secret dashboad-sa-token-kbbdm 으로 토큰을 알 수 있다

- 이 (베어러) 토큰은 kube API로 REST API 요청을 만들 때 사용될 수 있다

- Curl [https://~:6443/api](https://~:6443/api) -insecure —header “Authorization: Bearer ~”로 kube REST API로 요청 가능
- 웹 앱에서 유저가 토큰 필드를 저장하게 하여 인증 수단으로서 요청할 때 사용한다
- (계정당 SA를 발급하게 하는 기능도 필요할 듯?)

- 과정

- SA를 생성하여
- RBAC을 통해 적절한 권한을 설정하고(여기서는 다루지 않음)
- 토큰을 추출하여 사용자에게 전달하고
- 서드 파티 앱에서 이 토큰을 사용하여 kube REST API를 호출하게 한다

- 서드 파티 앱이 클러스터 내부에서 배포되었다면?

- 예를 들어, 대시보드, 모니터링 앱이 클러스터에서 배포된다면? 서비스 시크릿 토큰을 서드 파티 앱이 있는 파드 안에 볼륨으로 마운트 함으로써 간단하게 만들 수 있다
- 일일이 손으로 하지 않아도 되는 과정이 있나?
- 앱이 쉽게 읽을 수 있기 때문에(내부가 아니라면? 외부 디비에서 관리해야 하나?)

- default SA

- ns마다 생성되어 있음
- 파드가 생성되면, default SA와 토큰이 파드에 “자동으로“ 볼륨 마운트 된다
- 파드 def에 명시하지 않아도 describe를 해보면, volume에 deafult-token이 존재
- 마운트된 지점은 /var/run/secrets/[kubernetes.io/serviceaccount](http://kubernetes.io/serviceaccount) (파드 안의 경로)
- K exec -it my-kubernetes-dashboad ls /var/run/secrets/[kubernetes.io/serviceaccount](http://kubernetes.io/serviceaccount)

- Token 파일이 존재

- 하지만 default SA는 매우 제한적이다

- 간단한 기본적인 kube API 쿼리에만 허용이 되어 있음

- 새로운 SA를 파드에 포함하기 위해서는?

- Pod def Spec > serviceAccountName 항목을 추가하면 됨
- 단, 이미 올라간 파드의 SA는 변경할 수 없음(지우고 새로 파드를 생성해야 적용됨)
- 하지만 배포 환경에서는 pod def를 수정할 수 있지만, “deployments”가 자동으로 rollout 되는 것에 주의
- 즉, deployments가 바뀐 SA를 적용하기 위해 rollout

- 자동으로 default SA가 마운트되게 하지 않으려면?

- Pod def Spec > automountServiceAccountToken : false 추가

- Default 토큰은 만료 기간이 없음

- 토큰은 SA가 존재하는 한 유효함

- 1.22 버전에서 tokenRequestedAPI가 추가

- Audiencd/time/object bound, more secure via kube API
- 따라서, 이제 파드가 생성되면 SA 시크릿 토큰에 의존하지 않음
- tokenRequestedAPI에 의해 만료 시간이 존재하고, projected bolume에 저장되는 토큰을 생성

- 1.24 버전에서는 SA 생성 시 자동으로 토큰을 발급하지 않음

- K create token dashboad-sa를 통해 따로 발급해야 함(만료 기간이 존재)

- 이전 버전에서처럼 만료가 없는 토큰을 생성하기 위해서는?

- secret-definition.yml로 시크릿 오브젝트를 작성

- apiVersion: v1
- kind: Secret
- type: [kubernetes.io/service-account-token](http://kubernetes.io/service-account-token)
- metadata:

- Name: mysecretname
- annotaion:

- [kubernetes.io/service-account.name:](http://kubernetes.io/service-account.name:) dashboard-sa

- 위의 예에서는 특정 SA와 관련된 만료가 없는 토큰을 생성하는 방법(SA 생성이 전제됨)
- tokenRequestedAPI이 추천됨

  

<테스트>

> k get sa -n default

> k describe sa default

> k get deployments

> k describe deployments web-dashboard

> k describe pod web-dashboard-97c9c59f6-rmdbk

> k create sa dashboard-sa

> k describe rolebindings / roles

  

---

kind: RoleBinding

apiVersion: rbac.authorization.k8s.io/v1

metadata:

  name: read-pods

  namespace: default

subjects:

- kind: ServiceAccount

  name: dashboard-sa # Name is case sensitive

  namespace: default

roleRef:

  kind: Role #this must be Role or ClusterRole

  name: pod-reader # this must match the name of the Role or ClusterRole you wish to bind to

  apiGroup: rbac.authorization.k8s.io

---

kind: Role

apiVersion: rbac.authorization.k8s.io/v1

metadata:

  namespace: default

  name: pod-reader

rules:

- apiGroups:

  - ''

  resources:

  - pods

  verbs:

  - get

  - watch

  - list

  

> kubectl create token dashboard-sa

  

Use the kubectl edit command for the deployment and specify the serviceAccountName field inside the pod spec.

  

- 웹 페이지에서 수동으로 토큰을 입력하지 않아도 자동으로 마운트된 토큰으로 지정됨
