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

