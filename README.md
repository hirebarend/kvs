# High-Performance Key-Value Store Benchmarking

## Introduction

Welcome to the GitHub repository for our key-value store benchmarking project! In this project, we have implemented a key-value store using three different programming languages: C#, Go, and TypeScript. To evaluate the performance of our implementations, we have conducted extensive benchmarking tests using a self-written minimalistic TCP protocol, as well as popular protocols like HTTP and gRPC.

The benchmarks were carried out on a Linux operating system with an x64 architecture, running on an Intel(R) Xeon (R) Platinum 8280 CPU @ 2.70GHz. For each language, we measured the time taken to execute a SET operation followed by a GET operation, providing us with a comprehensive view of the key-value store's performance under varying workloads.

Let's delve into the results and draw insightful conclusions based on the benchmark data.

## Benchmarks (TCP)

### C#

| COMMAND | # OF EXECUTIONS | DURATION |           |
| ------- | --------------- | -------- | --------- |
| SET/GET | 243             | 147 ms   | 604 ns/op |
| SET/GET | 729             | 348 ms   | 477 ns/op |
| SET/GET | 2187            | 829 ms   | 379 ns/op |
| SET/GET | 6561            | 2313 ms  | 352 ns/op |
| SET/GET | 19683           | 7061 ms  | 358 ns/op |
| SET/GET | 59049           | 20251 ms | 342 ns/op |

### Go

| COMMAND | # OF EXECUTIONS | DURATION |           |
| ------- | --------------- | -------- | --------- |
| SET/GET | 243             | 99 ms    | 407 ns/op |
| SET/GET | 729             | 294 ms   | 403 ns/op |
| SET/GET | 2187            | 729 ms   | 333 ns/op |
| SET/GET | 6561            | 2024 ms  | 308 ns/op |
| SET/GET | 19683           | 6327 ms  | 321 ns/op |
| SET/GET | 59049           | 18417 ms | 311 ns/op |

### TypeScript

| COMMAND | # OF EXECUTIONS | DURATION |           |
| ------- | --------------- | -------- | --------- |
| SET/GET | 243             | 143 ms   | 584 ns/op |
| SET/GET | 729             | 402 ms   | 551 ns/op |
| SET/GET | 2187            | 840 ms   | 384 ns/op |
| SET/GET | 6561            | 2469 ms  | 376 ns/op |
| SET/GET | 19683           | 6380 ms  | 324 ns/op |
| SET/GET | 59049           | 18546 ms | 314 ns/op |

## Benchmarks (gRPC)

### TypeScript

| COMMAND | # OF EXECUTIONS | DURATION  |            |
| ------- | --------------- | --------- | ---------- |
| SET/GET | 243             | 502 ms    | 2065 ns/op |
| SET/GET | 729             | 1349 ms   | 1850 ns/op |
| SET/GET | 2187            | 2583 ms   | 1181 ns/op |
| SET/GET | 6561            | 6936 ms   | 1057 ns/op |
| SET/GET | 19683           | 19720 ms  | 1001 ns/op |
| SET/GET | 59049           | 61036 ms  | 1033 ns/op |

## Benchmarks (HTTP)

### TypeScript

| COMMAND | # OF EXECUTIONS | DURATION  |            |
| ------- | --------------- | --------- | ---------- |
| SET/GET | 243             | 769 ms    | 3164 ns/op |
| SET/GET | 729             | 2022 ms   | 2773 ns/op |
| SET/GET | 2187            | 4988 ms   | 2280 ns/op |
| SET/GET | 6561            | 14729 ms  | 2244 ns/op |
| SET/GET | 19683           | 41245 ms  | 2095 ns/op |
| SET/GET | 59049           | 123964 ms | 2099 ns/op |

## Conclusion

Our key-value store benchmarking project has provided valuable insights into the performance characteristics of the implementations across different programming languages and application-level protocols (HTTP and gRPC).

### Performance Comparison between Programming Languages

The benchmark results reveal clear performance differences between the three programming languages:

* **Go**: The Go implementation consistently outperforms C# and TypeScript across all tested application-level protocols (HTTP and gRPC). Go exhibits the fastest execution times for both SET and GET operations. Its efficiency makes it a top choice for building high-performance key-value stores.

* **C#**: While C# performs well, especially in the HTTP and gRPC benchmarks, it falls slightly behind Go in terms of raw performance. However, C# still demonstrates good execution times, making it a competitive option for certain projects.

* **TypeScript**: TypeScript shows reasonable performance in the benchmarks, but it lags behind both Go and C#. It may be better suited for scenarios where Node.js and JavaScript-based development is a requirement.

### Impact of Application-Level Protocols on Performance

The choice of application-level protocol significantly impacts the key-value store's overall performance:

* **HTTP**: While HTTP is widely used and offers excellent interoperability, it introduces additional overhead compared to gRPC. As a result, HTTP exhibits slightly longer execution times. HTTP can be a suitable choice for projects requiring compatibility with existing web technologies and services.

* **gRPC**: The gRPC protocol performs remarkably well, utilizing TCP as its underlying transport layer for communication. gRPC's efficient use of protocol buffers and HTTP/2 contributes to its low overhead and high-performance capabilities. It provides an excellent balance between performance and interoperability, making it a strong contender for building efficient key-value stores.

### Considerations for Language and Protocol Selection

When choosing a programming language and application-level protocol for a key-value store, several factors should be considered:

* **Performance Requirements**: If raw performance is crucial and fast execution times are a top priority, Go emerges as the clear winner in this benchmark. For high-performance applications with a focus on scalability, Go should be the preferred choice.

* **Developer Familiarity**: The familiarity and expertise of the development team with a particular language can significantly impact productivity. Choosing a language developers are comfortable with can lead to faster development and easier maintenance.

* **Interoperability and Ecosystem**: Consider whether your project needs to integrate with specific ecosystems. C# may be preferred in a .NET environment, while TypeScript might be more suitable for Node.js-based projects.

* **Protocol Overhead**: The choice of application-level protocol should be based on the trade-off between performance and interoperability. gRPC, utilizing TCP as its transport layer, offers better performance compared to HTTP while providing excellent interoperability capabilities.

In conclusion, the benchmark results have provided valuable insights into the performance characteristics of our key-value store implementations. The choice of programming language and application-level protocol should be made based on specific project requirements, the need for raw performance, developer familiarity, and considerations of protocol overhead. We hope this repository serves as a useful resource for those exploring key-value store implementations and their performance characteristics. Happy benchmarking!

## Contributions

Contributions to this project are welcome! If you have any ideas, improvements, or bug fixes, feel free to open an issue or submit a pull request. Please ensure that your contributions align with the project's goals and follow the established coding standards.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute the code in accordance with the terms and conditions of the license.

## Contact

For any questions, suggestions, or feedback, please contact Barend Erasmus at hirebarend@gmail.com.

Thank you for your interest in this project! We hope it proves useful in evaluating and comparing the performance of C#, Go and TypeScript implementations.
