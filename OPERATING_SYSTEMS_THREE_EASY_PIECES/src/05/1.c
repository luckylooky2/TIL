#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

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
