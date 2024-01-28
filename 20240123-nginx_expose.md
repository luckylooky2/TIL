## @kubernetes-nginx expose

https://kubernetes.io/ko/docs/tutorials/services/connect-applications-service/

#### 1. 하나의 Pod에서 Service를 이용하여 expose

```yaml
# nginx-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app.kubernetes.io/name: nginx # 이 부분이 중요
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
          protocol: TCP
```

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  ports:
    - name: nginx
      port: 4242
      targetPort: 80
  selector:
    app.kubernetes.io/name: nginx # 이 부분이 중요
  type: NodePort
```

- `selector.app.kubernetes.io/name` 을 등록하면 직접적으로 특정 pod 이름으로 expose 가능
- 고가용성, 지속성을 생각할 때 이렇게 직접적으로 pod 이름으로 지정하는 것은 좋지 못함
- deployment를 사용하여 service와 deployment를 연결하는 방법이 유연하고 좋음

#### 2. Deployment와 Service로 expose

```yaml
# deploy.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
```

- `spec.selector` 에서 `app: nginx` 대신 `run: nginx` 을 넣었더니 endpoint가 생성되지 않음
- https://kubernetes.io/ko/docs/tasks/debug/debug-application/debug-service/

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  ports:
    - name: nginx
      port: 4242
      targetPort: 80
  selector:
    app: nginx
  type: NodePort
```

```shell
k create -f deploy.yaml
k create -f service.yaml
```

### demo-springboot

https://github.com/seongtaekkim/TIL/blob/master/cloud/jenkins/src/demo/k8s/k8s-deployment.yaml
