package main

import (
	"log"
	"net"
	"os"
)

const (
	HOST = "0.0.0.0"
	PORT = "1337"
	TYPE = "tcp"
)

func main() {
	dict := make(map[string]string)

	listener, err := net.Listen(TYPE, HOST+":"+PORT)

	if err != nil {
		log.Fatal(err)

		os.Exit(1)
	}

	defer listener.Close()

	for {
		conn, err := listener.Accept()

		if err != nil {
			log.Fatal(err)

			os.Exit(1)
		}

		go handle(conn, dict)
	}
}

func handle(conn net.Conn, dict map[string]string) {
	buffer := make([]byte, 1024)

	for {
		n, err := conn.Read(buffer)

		if err != nil {
			break
		}

		arr := read(buffer[:n])

		if arr[0] == "GET" {
			conn.Write(bytesToWrite([]string{dict[arr[1]]}))

			continue
		}

		if arr[0] == "SET" {
			dict[arr[1]] = arr[2]

			conn.Write(bytesToWrite([]string{"OK"}))

			continue
		}
	}

	conn.Close()
}

func read(buffer []byte) []string {
	result := make([]string, 3)

	index := 0

	bufferIndex := 0

	for bufferIndex < len(buffer) {
		n := buffer[bufferIndex]

		bytes := buffer[bufferIndex+1 : bufferIndex+1+int(n)]

		bufferIndex = bufferIndex + 1 + int(n)

		str := string(bytes)

		result[index] = str

		index++
	}

	return result
}

func bytesToWrite(arr []string) []byte {
	var bytes []byte = nil

	for _, element := range arr {
		if bytes == nil {
			bytes = append([]byte{byte(len(element))}, []byte(element)...)
		} else {
			bytes = append(bytes, append([]byte{byte(len(element))}, []byte(element)...)...)
		}
	}

	return bytes
}
