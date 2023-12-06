### `fork()` 시스템 콜

- 프로세스 생성에 사용되는 시스템 콜
- Unix 시스템에서 PID는 프로세스의 실행이나 중단과 같이 특정 프로세스를 대 상으로 작업을 해야 할 경우 프로세스를 지칭하기 위해 사용된다.
- 이상한 부분이 있다: `fork()` 호출로 생성된 프로세스가 호출한 프로세스의 복사본이라는 것이다
- 새로 생성된 프로세스는 `main()` 함수 첫 부분부터 시작하지 않았다는 것을 알 수 있다. 자식 프로세스는 `fork ()` 를 호출하면서부터 시작되었다.
- 자식 프로세스는 부모 프로세스와 완전히 동일하지는 않다. 자식 프로세스는 자신의 주소 공간, 자신의 레지스터, 자신의 PC 값을 갖는다
- 하지만 매우 중요한 차이점이 있다. **`fork()` 시스템 콜의 반환 값이 서로 다르다.** `fork()` 로 부터 부모 프로세스는 생성된 자식 프로세스의 PID를 반환받고, 자식 프로세스는 0을 반환받는다.

```shell
$> ./p1
hello world (pid:29146)
hello, I am parent of 29147 (pid:29146)
hello, I am child (pid:29147)

$> ./p1
hello world (pid:29146)
hello, I am child (pid:29147)
hello, I am parent of 29147 (pid:29146)
```

- 이 프로그램 (pl.c)의 출력 결과가 항상 동일하지는 않다.
- 단일 CPU 시스템에서 이 프로그램을 실행하면, 프로세스가 생성되는 시점에는 2개 (부모와 자식) 프로세스 중 하나가 실행된다
- 위의 출력 예에서는 부모 프로세스 실행 후에 자식 프로세스가 실행되었다. 물론 그 반대 경우도 발생할 수 있다
- CPU 스케줄러가 실행할 프로세스를 정책에 따라 결정하기 때문이다. 스케줄러의 동작은 일반적으로 상당히 복잡하고 상황에 따라 다른 선택이 이루어지기 때문에, 어느 프로세스가 먼저 실행된다라고 단정하는 것은 매우 어렵다.
- 이 **비결정성(nondeterminism)** 으로 인해 멀티 쓰레드 프로그램 실행 시 다양한 문제가 발생한다.

### `wait()` 시스템 콜

- 프로세스가 자신이 생성한 프로세스가 종료되기를 기다리기 원하는 경우가 있을 수 있다.
- 부모 프로세스는 `wait()` 시스템 콜을 호출하여 자식 프로세스 종료 시점까지 자신의 실행을 잠시 중지시킨다.
- 자식 프로세스가 종료되면 `wait()` 는 리턴한다.
- `waitpid()`는 `wait()`보다 조금 더 많은 기능을 가진 시스템 콜이다.
- 따라서 부모 프로세스에서 `wait()` 이후의 코드는 자식 프로세스가 끝난 이후에 실행되는 것을 보장한다.

### `exec()` 시스템 콜

- 자기 자신이 아닌 다른 프로그램을 실행해야 할 때 사용한다
- `exec()` 계열의 시스템 콜은 자식 프로세스가 부모와의 연관성을 완전히 끊어서 완전히 새로운 프로그램을 실행할 수 있도록 한다.
- `fork()` 시스템 콜은 자신의 복사본을 생성하여 실행한다. 하지만 자신의 복사본이 아닌 다른 프로그램을 실행해야 할 경우에는 바로 `exec()` 시스템 콜이 그 일을 한다
- 실행 파일의 경로(첫 번째 인자)와 약간의 인자(두 번째 인자)가 주어지면, 해당 실행 파일의 코드와 정적 데이터를 읽어 들여 **현재 실행 중인 프로세스의 코드 세그멘트와 정적 데이터 부분을 덮어 쓴다.** 다시 말해서, 힙과 스택 및 프로그램 다른 주소 공간들로 새로운 프로그램의 실행을 위해 다시 초기화된다.
- 새로운 프로세스를 생성하지는 않는다. 현재 실행 중인 프로그램을 다른 실행 중인 프로그램으로 대체하는 것이다.
- 자식 프로세스가 `exec()` 을 호출한 후에는 이전 프로세스는 전혀 실행되지 않은 것처럼 보인다. `exec()` 시스템 콜이 성공하게 되면 이전 프로세스는 절대로 리턴하지 않는다.
- Unix의 쉘을 구현하기 위해서는 `fork()` 와 `exec()` 을 분리해야 한다. 그래야만 쉘이 `fork()` 를호출하고 `exec()` 를 호출하기 전에 코드를 실행할 수 있다. 이때 실행하는 코드에서 프로그램의 환경을 설정하고, 다양한 기능을 준비한다. 즉, `fork()`와 `exec()`을 분리함으로써 쉘은 많은 유용한 일을 조금 쉽게 할 수 있다.
- 쉘의 동작 방식
  1.  쉘은 프롬프트를 표시하고 사용자가 무언가 입력하기를 기다린다. 그리고 명령어를 입력한다
  2.  대부분의 경우 쉘은 파일 시스템에서 실행 파일의 위치를 찾고 명령어를 실행하기 위하여 `fork()`를 호출하여 새로운 자식 프로세스를 만든다
  3.  그런 후 `exec()`의 변형 중 하나를 호출하여 프로그램을 실행시킨 후 `wait()` 를 호출하여 명령어가 끝나기를 기다린다.
  4.  자식 프로세스가 종료되면 쉘은 `wait()` 로부터 리턴하고 다시 프롬프트를 출력하고 다음 명령어를 기다린다.

### 프로세스 제어와 사용자

- 프로세스 제어는 시그널이라는 형태로 제공되며, 이를 활용하여 작업을 멈추고, 계속 실행하고, 종료시킬 수 있다.
- `kill()` 시스템 콜 : 프로세스에게 멈추거나 끝내기와 같은 시그널(signal)을 보내는데 사용된다.
- 시그널(signal)이라는 운영체제의 메커니즘은 외부 사건을 프로세스에게 전달하는 토대이자 방법이다.
  - control-c : 프로세스에게 SIGINT 시그널을 보내어 종료시키는 단축키
  - control-z : 프로세스에게 SIGSTP 시그널로 실행 도중에 프로세스를 잠시 멈추는 단축키
- 시그널을 받는 것과 보내는 것 모두 가능하다
- 개별적인 프로세스 단위 또는 프로세스 그룹 단위로 시그널을 받거나 처리할 수 있다
- 이와 같은 통신이 가능하기 위해서 프로세스는 `signal()` 시스템 콜을 사용하여 여러 시그널을 잡아야 한다. 그러면 특정 시그널이 프로세스에게 전달되었을 때, 해당 시그널에 정의된 코드를 실행하기 위해 정상적인 실행을 정지시킬 수 있다.
- 누가 프로세스에게 시그널을 보낼 수 있고 또 보낼 수 없는가?
  - 일반적으로 우리가 사용하는 시스템은 동시에 여러 사용자가 접속할 수 있다.
  - 그 사용자 중 누군가가 SIGINT (프로세스에 인터럽트를 걸고 종료시키기 위해) 시그널을 보낼 수 있다.
  - 그렇기 때문에 현대의 시스템에 사용자(user)라는 아주 강력한 개념을 도입하였다.
  - 사용자가 비밀번호를 입력하여 인증을 획득한 후 시스템의 자원에 접근할 수 있는 권한을 얻는다.
  - 사용자는 하나 또는 그 이상의 프로세스들을 시작할 수 있으며, 그 프로세스들에 대한 온전한 제어권을 갖는다(중단하거나 종료하는 등). 일반적으로 사용자는 자기 프로세스 들에 한해서 제어권을 갖고 있다.
  - 관리자는 대부분의 사용자들과 달리 제한을 받지 않는다. 관리자는 자신이 실행시키지 않은 임의의 프로세스(예를 들어 시스템을 악의적으로 사용하는 프로세스)를 종료시킬 수 있다
  - Unix계열의 시스템은 superuser 또는 root에게 이와 같은 특별한 능력을 부여한다.
  - 대부분의 사용자는 다른 사용자의 프로세스를 종료시킬 수 없지만, 슈퍼사용자는 가능하다.

### 숙제

1.

```c
int main() {
	int x = 100;
	int pid = fork();
	if (pid == 0) {
		// child
		printf("child : %d\n", x); // child : 100
		x = 200;
		printf("child : %d\n", x); // child : 200
	} else {
		// parent
		wait(NULL);
		printf("parent : %d\n", x); // parent : 100
	}
}
```

- 자식 프로세스의 x 값은 부모 프로세스와 마찬가지로 100이다.
- 자식 프로세스가 x 값을 변경한다고 해서 부모 프로세스의 x 값이 변하지 않는다.

2.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <string.h>

int main() {
	int fd = open("test.txt", O_RDWR);
	if (fd < 0) return (1);
	int pid = fork();
	if (pid == 0) {
		// child
		char buf[10];
		bzero(buf, sizeof(buf));
		read(fd, buf, 1);
		printf("child : %s\n", buf);
		// write(fd, "child", 5);
	} else {
		// parent
		wait(NULL);
		char buf[10];
		bzero(buf, sizeof(buf));
		read(fd, buf, 1);
		printf("parent : %s\n", buf);
		// write(fd, "parent", 6);
	}
}
```

- 자식과 부모 프로세스가 open() 에 의해 반환된 파일 디스크립터에 접근할 수 있는가? 자식과 부모 모두 파일 디스크립터에 접근할 수 있고, 같은 파일 디스크립터를 공유한다.
- 부모와 자식 프로세스가 동시에 파일에 쓰기 작업을 할 수 있는가? 그렇다.

3.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
	int pid = fork();
	if (pid == 0) {
		// child
		printf("child : hello\n");
	} else {
		// parent
		wait(NULL);
		printf("parent : goodbye\n");
	}
}
```

- 일반적으로는 먼저 parent가 실행되지만, 반드시 그런 것은 아니다.
- `wait()` 시스템 콜 호출을 통해 반드시 자식 프로세스가 먼저 실행되게 만들수는 있다.

4.

```c
#include <unistd.h>
#include <stdio.h>

int main(){
	char *path = "/bin/ls";
	char *command = "ls";
	char *arg1="-al";
	char *arg2="/etc";
	char *argv[]={command,arg1,arg2,NULL};

	//printf("execl호출\n");
	//execl(path, command, arg1, arg2, NULL);

	//printf("execv호출\n");
	//execv(path, argv);

	//printf("execle호출\n");
	//execle(path, command, arg1, arg2, NULL, NULL);

	//printf("execve호출\n");
	//execve(path, argv, NULL);

	//printf("execlp호출\n");
	//execlp(command, command, arg1, arg2, NULL);

	//printf("execvp호출\n");
	//execvp(command,argv);

	return 0;
}
```

- e : 환경변수를 입력받음
- v : vector 형식으로 인자 전달 => \*argv[]
- l : list 형식으로 인자 전달 => \*arg
- p : PATH 환경 변수에서 실행 파일을 검색

5.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
	int pid = fork();
	if (pid == 0) {
		// child
		sleep(10);
	} else {
		// parent
		pid_t res = wait(NULL); // res : 84241
		printf("res : %d\n", res);
	}
}
```

```shell
$> ps
  PID TTY           TIME CMD
67058 ttys001    0:00.51 /bin/zsh -il
84240 ttys001    0:00.00 ./a.out
84241 ttys001    0:00.00 ./a.out
66333 ttys008    0:00.02 -zsh
66341 ttys009    0:00.06 -zsh
```

- `sleep()` 으로 자식 프로세스의 종료를 늦추고 `ps` 명령어로 자식 프로세스의 pid를 확인해 보았을 때, 같음을 알 수 있다

6.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
	int pid = fork();
	if (pid == 0) {
		// child
		sleep(10);
	} else {
		// parent
		pid_t res = 0;
		while (!res)
			res = waitpid(pid, NULL, WNOHANG); // 84723
		printf("res : %d\n", res);
	}
}
```

- 어떤 경우에 `waitpid()` 를 사용하는 것이 좋은가? 특정 pid를 지정하여 자원을 회수할 수 있고, WNOHANG 플래그를 이용하여 비동기적으로 다른 작업을 하며 자원을 회수할 수 있다.

7.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
	int pid = fork();
	if (pid == 0) {
		// child
		close(STDOUT_FILENO);
		int res = printf("hello from child\n");
		fprintf(stderr, "%d\n", res); // 17
		res = fflush(stdout);
		fprintf(stderr, "%d\n", res); // -1
	} else {
		// parent
		wait(NULL);
	}
}
```

- https://stackoverflow.com/questions/59094054/what-will-happen-calling-printf-after-close-stdout
- 터미널에 아무 것도 출력되지 않는다
- `printf()` 는 호출에 성공하여 양수를 리턴한다. 즉, 버퍼에 복사가 되었지만, 표준 출력이 터미널로부터 detached 되었기 때문에 화면에 표시되지는 않는다.
- `fflush()` 를 이용하여 표준 출력에 표시하려하면 -1을 반환하며 실패하는 것을 알 수 있다.
