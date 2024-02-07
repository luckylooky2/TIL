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
		write(fd, "child", 5);
	} else {
		// parent
		//wait(NULL);
		char buf[10];
		bzero(buf, sizeof(buf));
		read(fd, buf, 1);
		printf("parent : %s\n", buf);
		write(fd, "parent", 6);
	}
}
