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

// e : 환경변수를 입력받음
// v : vector 형식으로 인자 전달 => *argv[]
// l : list 형식으로 인자 전달 => *arg
// p : PATH 환경 변수에서 실행 파일을 검색