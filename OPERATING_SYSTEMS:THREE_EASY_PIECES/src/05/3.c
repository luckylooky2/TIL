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

