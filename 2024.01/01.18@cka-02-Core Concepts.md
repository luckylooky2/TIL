<Pods>

- `kubectl run nginx —image nginx`
	- 이미지를 이용하여 pod 생성
	- 4개가 생기는 이유? 테스트 환경에서 임의적으로 추가한 것

- `kubectl create -f pod-definition.yml`
	- 선언적으로 pod 생성

- kubectl get pods

- 생성된 pod 확인
- kubectl get pods -o wide

- kubectl describe pod myadd-pod

- 자세한 pod 정보 확인

- kubectl delete pod webapp 

- Pod 삭제

- kubectl apply -f pod-redis.yaml

- 선언적 yaml 파일 재적용
- 에러 메시지가 발생할 수도 있음 : 선언적 파일과 관련이 있는 듯. 나중에 설명

- Kubectl run redis —image=redis123 —dry-run=client -o yaml > redis.yaml

- Generate POD Manifest YAML file
- 해당 이미지 생성의 pod-defintion file을 보여줌
- Pod 생성은 되지 않는 것 같으므로 create 필요

  

<Kubernetes Controllers>

- 쿠버네티스 오브젝트를 모니터하고 실시간으로 설정 및 적용하는 프로세스들
- Replication Controller

- 왜 필요한가? 1) High availability를 달성하기 위해, 하나로 설정해도 하나가 다운될 경우 다시 run하여 1개임을 보장해줄 수 있음
- 왜 필요한가? 2) 로드 밸런싱, 하나에 몰릴 경우 성능 저하가 발생할 수 있으므로 필요, 실시간으로 적용할 수 있으므로 레플리카 개수를 증가시킬 수도 있음
- 실습

- Rc-definition.yml

- Kind : ReplicationController

- Kubectl create -f rc-definition.yml
- Kubectl get replicationcontroller
- Kubectl get pods

  

2. Replicaset

- K get rs에서 나오는 READY가 실제 파드가 돌아가고 있는지 여부(개수)

- 정상적으로 동작하는지?

- K describe rs my-rs에서 Running은 컨테이너가 돌아가고 있는지 여부 인듯?
- 실습

- replicaset-definition.yml

- Kind : ReplicaSet

- Kubectl create -f replicaset-definition.yml
- Kubectl get replicaset
- Kubectl get pods

- Selector : replicaset으로 만들어진 파드가 아니더라도 선택할 수 있음

- replicationContoller에서는 필수 항목이 아님
- pod들을 모니터하는 역할 / label이 필요한 이유도 됨

- 이미 desired 개수의 pod가 띄워진 경우에도 spec-template에 pod 관련 정보를 담아야 할까? 그렇다. 모니터링 중인 pod가 desired 개수 이하로 실패할 경우 새로 만들어주어야 하기 때문이다
- Scale

- Yaml 파일에서 replicas 변경
- Kubectl replace -f replicaset-definition.yml
- Kubectl scale —replicas=6 -f replicaset-definition.yml
- (Or) kubectl scale —replicas=6 replicates myapp-replicaset (type, name)
- 아래 두 명령어는 파일을 6으로 최신화하지는 않음
- Kubectl edit rs new-replica-set에서 변경하는 방법이 존재
- k scale --replicas=2 rs new-replica-set

- Kubectl delete replicaset myapp-replicaset

- 하위에 있는 파드를 모두 지움에 주의

- kubectl describe replicaset new-replica-set
- kubectl delete pod new-replica-set-7cg4l
- Kubectl edit rs new-replica-set

- replicaset의 세팅을 변경하는 커맨드
- 설정을 변경한 후, 현재 파드를 모두 지우면 자동으로 재생성 되는 효과
- replicaset을 지우고 다시 설치해도 됨 : yml 파일이 없는 상황에서는 어떻게?

  

<Deployments>

- 배포 환경에서 애플리케이션을 배포하는 상황을 생각해야 함
- Replicaset보다 상위 계층에 있는 계층

- Replicaset을 자동으로 생성
- 내부적으로 replicaset이 pods를 생성

- 장점

- 인스턴스를 원활하게 업그레이드 및 배포
- 일부 파드만 업데이트
- 롤링 업데이트(여러 파드를 차례대로 업데이트)
- Undo, pause, resume update

- Replicaset 정의 파일과 매우 비슷
- Kind : Deployment
- 실습

- K create -f deployment-definition.yml
- K get deployments
- K get all (deployment, replicaset, pods)

- kubectl create deployment --image=nginx nginx --dry-run=client -o yaml

- Generate Deployment YAML file

  

<Service>

- Pod, replicaset, deployment와 같은 Kubernetes object
- 1) NodePort Service

- (Worker) node에서 특정 포트를 listen하고, 해당 포트를 파드의 포트로 포워딩해주는 기능
- Target port : 파드의 포트
- Port : Service의 포트(Service의 관점)
- NodePort : 노드의 포트(30000~32767)
- Kind : Service
- Spec > type : NodePort
- Spec > ports > targetPort(same as port if missed) : 80, port(required) : 80, nodePort : 30008(random free port if missed)
- Spec > ports 는 Array이기 때문에 [targetPort, port, nodePort]를 여러 쌍 가질 수 있음
- 어떤 파드인지 아나? 지금까지는 포트만 명시

- label과 selector를 이용

- Spec > selector

- e.g. app : my app, type: front-end

- label이 같은 파드가 여러 개 있을 때에는 자동으로 Service가 여러 파드를 연결. 랜덤 알고리즘을 이용하여 마치 내장 로드 밸런서처럼 동작
- 파드가 하나의 노드가 아니라 여러 노드에 걸쳐 존재할 때에는?

- 특별한 설정 없이도 여러 노드에 걸친 Service를 생성함
- 여러 노드의 포트는 같게 설정됨 e.g. 30008

- 실습

- K create -f service-definition.yaml
- K get services
- Curl http://192.168.1.2:30008

- 2) ClusterIP Service

- 보통 웹 서비스는 3-tier
- FE 파드는 BE 파드와 통신을 해야 하는데, 파드는 언제 내려가고 다시 올라올지 모르기 때문에, 정적인 IP로 요청하는 것은 어려움 => 요청을 받아줄 공통적인 인터페이스가 필요함
- clusterIP는 이러한 pod를 그룹화하고 파드에 접근하는 공통적인 하나의 인터페이스를 제공
- 인터페이스에서 연결된 그룹 파드 중 하나에 랜덤하게 요청을 포워드
- Kind : Service
- Spec > type : clusterIP
- Spec > ports : targetPort(target pod exposed) : 80, port(service exposed) : 80
- Spec > selector : target pod label
- 실습

- K create -f service-definition.yml
- K get services

- 3) LoadBalancer Service

- nodePort에서 보았듯이 같은 서비스 파드가 여러 노드에 걸쳐 존재하는 경우 Service는 모든 노드를 span하여 접근할 수 있게 하였다
- 하지만 이 결과로 여러 IP:port 쌍이 생기게 된다(e.g. 192.168.56.70:30008, ~.71.30008 …)
- 하지만 엔드 유저는 이러한 여러 URL을 기억하고 싶지 않다. 오직 하나의 URL만 기억한다
- 이 문제를 해결하기 위해서는 새로운 서버(e.g. nginx)를 두어서 로드 밸런서로 처리함
- 하지만, 특정 네이티브 로드 밸런서를 지원하는 클라우드 플랫폼(GCP, AWS, Azure)과 같은 곳에서는 쿠버네티스가 해당 네이티브 클라우드 로드 밸런서를 이용하여 자동으로 처리할 수 있음
- Kind : LoadBalancer

- Instead of nodePort
- 특정 클라우드 플랫폼에서만 가능
- 지원하지 않을 경우, nodePort와 같은 효과를 냄

  

  

<namespace>

- 기본적으로 아무 것도 설정하지 않는다면, deafult ns로 생각
- default ns에 존재하는 하나의 파드가 dev ns에 존재하는 DB에 연결하기 위해서

- mysql.connect(<servicename>.<namespace>.svc.cluster.local)
- 마지막 cluster.local은 쿠버네티스 클러스터의 default domain name이다

- Default ns에 존재하는 파드가 default ns에 존재하는 DB에 연결하기 위해서

- mysql.connect(“db-service”)

- K get pods

- 나오는 파드들은 default ns에 속하는 파드들만 보여줌

- K get pods —namespace=kube-system
- K get pods —n=kube-system

- 특정 ns에 속하는 파드를 보여줌

- K create -f pod-definition.yml —namespace=dev

- Dev ns에 파드를 생성
- 선언형 파일에 metadata > namespace : dev로 나타낼 수 있음

- Namespace 생성

- namespace-dev.yml
- Kind : Namespace
- K create -f namespace-dev.yml
- K create namespace dev

- 기본 ns를 변경하는 방법

- K config set-context $(kubectl current-context) —namesacpe=dev

- K gert pods —all-namespaces
- K run redid —image=redis -n=finance
- K get pods -A

- K get pods —all-namespaces

  

  

<Declarative>

- 1. Imperative Object Configuration files
- Create

- K create -f nginx.yml

- 반드시 처음 만들 때에만

- Update

- K edit deployment nginx
- K replace -f nginx.yml

- 현재 오브젝트가 존재하는 경우에 사용

- K replace —force -f nginx.yml
- K apply -f nginx.yml

- 현재 config를 보고 어떤 점이 시스템에 적용되어야 하는지 차이점을 찾아냄

- 2. Declarative
- Create

- K apply -f nginx.yml

- 해당 Object가 존재하는지 이미 알고 있음

- K apply -f /path/to/config-files

- 한 번에 생성

- Update

- K apply -f nginx.yaml

- Object가 존재하는지 이미 알고 있음

- k create svc clusterip redis-service —tcp=6379
- k create deployment webapp --image=kodekloud/webapp-color —replicas=3
- k run custom-nginx --image=nginx —port=8080
- k create ns dev-ns
- k create deployment redis-deploy --namespace=dev-ns --image=redis —replicas=2
- k create ns clusterip httpd —tcp=80
- k run httpd --image=httpd:alpine --expose —port=80