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
		pid_t res = wait(NULL); // 83702
		printf("res : %d\n", res);
	}
}
