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
