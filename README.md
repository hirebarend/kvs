# kvs

This repository contains a Key-Value Store implemented in C#, Go and TypeScript, along with a benchmarking tool to compare their performance. The purpose of this project is to evaluate and compare the efficiency and scalability of the implementations.

## Benchmarks (TCP)

### C#

OS: `linux`

Architecture: `x64`

CPU: `Intel(R) Xeon (R) Platinum 8280 CPU @ 2.70GHz`

| COMMAND | # OF EXECUTIONS | DURATION |           |
| ------- | --------------- | -------- | --------- |
| SET/GET | 243             | 147 ms   | 604 ns/op |
| SET/GET | 729             | 348 ms   | 477 ns/op |
| SET/GET | 2187            | 829 ms   | 379 ns/op |
| SET/GET | 6561            | 2313 ms  | 352 ns/op |
| SET/GET | 19683           | 7061 ms  | 358 ns/op |
| SET/GET | 59049           | 20251 ms | 342 ns/op |

### Go

OS: `linux`

Architecture: `x64`

CPU: `Intel(R) Xeon (R) Platinum 8280 CPU @ 2.70GHz`

| COMMAND | # OF EXECUTIONS | DURATION |           |
| ------- | --------------- | -------- | --------- |
| SET/GET | 243             | 133 ms   | 547 ns/op |
| SET/GET | 729             | 379 ms   | 519 ns/op |
| SET/GET | 2187            | 954 ms   | 436 ns/op |
| SET/GET | 6561            | 2740 ms  | 417 ns/op |
| SET/GET | 19683           | 9067 ms  | 460 ns/op |
| SET/GET | 59049           | 26561 ms | 449 ns/op |

### TypeScript

OS: `linux`

Architecture: `x64`

CPU: `Intel(R) Xeon (R) Platinum 8280 CPU @ 2.70GHz`

| COMMAND | # OF EXECUTIONS | DURATION |           |
| ------- | --------------- | -------- | --------- |
| SET/GET | 243             | 143 ms   | 584 ns/op |
| SET/GET | 729             | 402 ms   | 551 ns/op |
| SET/GET | 2187            | 840 ms   | 384 ns/op |
| SET/GET | 6561            | 2469 ms  | 376 ns/op |
| SET/GET | 19683           | 6380 ms  | 324 ns/op |
| SET/GET | 59049           | 18546 ms | 314 ns/op |

## Benchmarks (HTTP)

### TypeScript

OS: `linux`

Architecture: `x64`

CPU: `Intel(R) Xeon (R) Platinum 8280 CPU @ 2.70GHz`

| COMMAND | # OF EXECUTIONS | DURATION  |            |
| ------- | --------------- | --------- | ---------- |
| SET/GET | 243             | 769 ms    | 3164 ns/op |
| SET/GET | 729             | 2022 ms   | 2773 ns/op |
| SET/GET | 2187            | 4988 ms   | 2280 ns/op |
| SET/GET | 6561            | 14729 ms  | 2244 ns/op |
| SET/GET | 19683           | 41245 ms  | 2095 ns/op |
| SET/GET | 59049           | 123964 ms | 2099 ns/op |

## Conclusion

This project aimed to compare the performance of a Key-Value Store implemented in C#, Go and TypeScript. The benchmarking results revealed that the choice of language, C#, Go or TypeScript, had minimal impact on the overall performance. Instead, the protocol and implementation specifics played a more significant role.

The C# implementation achieved an average of 342 nanoseconds per operation, while the JavaScript implementation achieved an average of 314 nanoseconds per operation. These results demonstrate that both languages are capable of providing efficient and comparable performance when using a minimalistic protocol over TCP.

Interestingly, when the TypeScript implementation switched to a traditional HTTP protocol over TCP, the average time per operation increased significantly to 2099 nanoseconds. This highlights the impact of protocol choice on performance. The minimalistic TCP protocol, designed specifically for this project, outperformed the traditional HTTP protocol in terms of efficiency.

In summary, this project emphasizes that the performance of a key-value store implementation is influenced more by the protocol and implementation specifics than the choice of programming language. By developing a minimalistic TCP protocol, both the C# and TypeScript implementations achieved similar levels of performance.

## Contributions

Contributions to this project are welcome! If you have any ideas, improvements, or bug fixes, feel free to open an issue or submit a pull request. Please ensure that your contributions align with the project's goals and follow the established coding standards.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute the code in accordance with the terms and conditions of the license.

## Contact

For any questions, suggestions, or feedback, please contact Barend Erasmus at hirebarend@gmail.com.

Thank you for your interest in this project! We hope it proves useful in evaluating and comparing the performance of C#, Go and TypeScript implementations.
