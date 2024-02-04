## master-node, worker-node 설치
- https://velog.io/@sororiri/k8s-kubeadm-%EC%84%A4%EC%B9%98-big2bz1i#-step-1-%EC%9D%B4%EC%A0%84-step-%EA%B3%BC-%EB%8F%99%EC%9D%BC%ED%95%98%EA%B2%8C-%EC%A7%84%ED%96%89

#### worker-node에 taint 제거
- pending 상태 : 띄우고자 하나는 pod에 taints가 있어 해당 파드에 띄울 수 없는 것
- `kubectl describe node <노드명>`
- `kubectl taint nodes --all node.kubernetes.io/not-ready-` : 모든 노드에서 taint 해제
- `kubectl taint nodes --all node.kubernetes.io/not-ready=:NoSchedule` : 모든 노드에 taint 추가
- master-node에만 taint를 추가해야 하므로 `kubectl taint nodes worker-node node.kubernetes.io/not-ready-`
- https://velog.io/@baeyuna97/%ED%95%B4%EA%B2%B0-01-nodes-are-available-1-nodes-had-taints-that-the-pod-didnt-tolerate

- waiting 상태 : ContainerCreating(reason)


### 설치 방법(성택님)

```
sudo swapoff -a # 현재 시스템에 적용(리부팅하면 재설정 필요)
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab # 리부팅 필수
```

```
# Using Docker Repository
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list

# containerd 설치
sudo apt update
sudo apt install -y containerd.io
# sudo systemctl status containerd # Ctrl + C를 눌러서 나간다.

# Containerd configuration for Kubernetes
cat <<EOF | sudo tee -a /etc/containerd/config.toml
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
SystemdCgroup = true
EOF

sudo sed -i 's/^disabled_plugins \=/\#disabled_plugins \=/g' /etc/containerd/config.toml
	sudo systemctl restart containerd

# 소켓이 있는지 확인한다.
ls /var/run/containerd/containerd.sock
```

```
sudo mkdir /etc/apt/keyrings

cat <<EOF > kube_install.sh
# 1. apt 패키지 색인을 업데이트하고, 쿠버네티스 apt 리포지터리를 사용하는 데 필요한 패키지를 설치한다.
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

# 2. 구글 클라우드의 공개 사이닝 키를 다운로드 한다.
curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-archive-keyring.gpg

# 3. 쿠버네티스 apt 리포지터리를 추가한다.
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

# 4. apt 패키지 색인을 업데이트하고, kubelet, kubeadm, kubectl을 설치하고 해당 버전을 고정한다.
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
EOF

sudo bash kube_install.sh
```

```
ls /var/run/containerd/containerd.sock
```

```
sudo -i
modprobe br_netfilter
echo 1 > /proc/sys/net/ipv4/ip_forward
echo 1 > /proc/sys/net/bridge/bridge-nf-call-iptables
exit
```

```
sudo kubeadm init
```

```
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-arm64.tar.gz
sudo tar xzvfC cilium-linux-arm64.tar.gz /usr/local/bin
rm cilium-linux-arm64.tar.gz
cilium install
```


~~~
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.64.17:6443 --token mkg2qv.0y26bb0ounc0qe5l \
	--discovery-token-ca-cert-hash sha256:5763137f72ea7d4d18921b177ac8b271e6eeb547b5c08ba3ae95d8a2d180268d
~~~


#### VM을 리부트하고 `k get pod` 을 호출하면 아래와 같은 메시지가 뜬다.

```
The connection to the server 192.168.64.17:6443 was refused - did you specify the right host or port?
```

```
sudo -i
swapoff -a
```

를 진행하면 노드가 Ready 상태가 된다.

https://public-cloud.tistory.com/42

#### node NotReady 상태

```shell
k get nodes

NAME     STATUS     ROLES           AGE     VERSION
master   Ready      control-plane   3d16h   v1.28.2
node1    NotReady   <none>          3d16h   v1.28.2
```

를 입력하였을 때, NotReady 상태라면 kubelet을 다시 시작해보자

```shell
systemctl restart kubelet
```
