# kvs

This repository contains a custom Key-Value Store implemented in both C# and JavaScript, along with a benchmarking tool to compare their performance. The purpose of this project is to evaluate and compare the efficiency and scalability of the two implementations.

## Benchmarks (TCP)

### C#

OS: `linux`

Arch: `x64`

CPU: `Intel(R) Xeon (R) Platinum 8280 CPU @ 2.70GHz`

| COMMAND | # OF EXECUTIONS | DURATION |             |
|---------|-----------------|----------|-------------|
| GET/SET | 243             | 147 ms   | 604 ns/op   |
| GET/SET | 729             | 348 ms   | 477 ns/op   |
| GET/SET | 2187            | 829 ms   | 379 ns/op   |
| GET/SET | 6561            | 2313 ms  | 352 ns/op   |
| GET/SET | 19683           | 7061 ms  | 358 ns/op   |
| GET/SET | 59049           | 20251 ms | 342 ns/op   |

### Node.js

OS: `linux`

Arch: `x64`

CPU: `Intel(R) Xeon (R) Platinum 8280 CPU @ 2.70GHz`

| COMMAND | # OF EXECUTIONS | DURATION |             |
|---------|-----------------|----------|-------------|
| GET/SET | 243             | 143 ms   | 584 ns/op   |
| GET/SET | 729             | 402 ms   | 551 ns/op   |
| GET/SET | 2187            | 840 ms   | 384 ns/op   |
| GET/SET | 6561            | 2469 ms  | 376 ns/op   |
| GET/SET | 19683           | 6380 ms  | 324 ns/op   |
| GET/SET | 59049           | 18546 ms | 314 ns/op   |

## Contributions

Contributions to this project are welcome! If you have any ideas, improvements, or bug fixes, feel free to open an issue or submit a pull request. Please ensure that your contributions align with the project's goals and follow the established coding standards.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute the code in accordance with the terms and conditions of the license.

## Contact

For any questions, suggestions, or feedback, please contact Barend Erasmus at hirebarend@gmail.com.

Thank you for your interest in this project! We hope it proves useful in evaluating and comparing the performance of C# and JavaScript implementations.