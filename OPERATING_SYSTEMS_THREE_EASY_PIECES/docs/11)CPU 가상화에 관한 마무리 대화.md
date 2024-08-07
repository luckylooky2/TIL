- 1. CPU를 가상화하는 방법
  - 하나의 CPU를 여러 개의 프로세스들이 동시에 사용하는 방법
  - 프로세스들이 각자 하나의 CPU를 가지고 있다는 환상을 만듦
  - keyword : 트랩, 트랩 핸들러, 타이머 인터럽트, 그리고 프로세스 전환(문맥 교환)이 일어날 때 운영체제와 하드웨어가 상태를 저장하고 복원하는 방법 등...
- 2. 운영체제의 철학
  - 운영체제는 자신이 컴퓨터를 장악하고 있다는 것을 확인하려고 합니다
  - 프로그램이 가능한 효율적으로 실행되길 원하면서도
  - 운영체제의 효율성에 대한 표현
    - 즉, 시스템의 자원을 최대한 효율적으로 활용하여 프로그램의 실행 속도를 향상시키고자 합니다
  - 잘못되거나 악성 프로세스에게는 “아, 너무 빨리는 말고”라고 말하길 원하는 것 같습니다
    - 운영체제의 보호 기능에 대한 표현
    - 악성이거나 비정상적인 동작을 하는 프로세스에게 일종의 경고 혹은 제한을 가하라는 의미를 담고 있습니다
  - 너무나 세세한 부분까지 주의를 기울인다는 의미에서 "편집증"이라는 비유가 사용되었습니다
- 3. 스케줄러
  - 1. 반환 시간과 응답 시간을 최적화하는 스케줄러
    - FIFO
    - SJF / STCF
    - RR
    - MLFQ : SJF와 RR의 단점(각각 작업의 길이를 미리 알 수 없다/응답 시간이 느리다와 반환 시간이 늦다)을 극복
  - 2. 공정성을 중요시하는 비례 배분 스케줄러
    - 추첨권 스케줄러
    - 보폭 스케줄러
    - Linux CFS
    - O(1)
    - BFS
  - 심지어 우리가 정한 평가 기준조차도 서로 대립될거야. 스케줄러가 반환 시간이 좋으면 응답 시간이 나쁘고, 또 그 반대도 참이지
  - Lampson 이 말했듯이 아마도 목표는 최선의 해결책을 찾는 것이 아니라 사고를 피하는 것이지
