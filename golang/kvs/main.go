package main

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

type HashTable struct {
	size    int
	buckets []*bucket
}

type bucket struct {
	entries []Entry
}

type Entry struct {
	key   string
	value interface{}
}

func NewHashTable(size int) *HashTable {
	return &HashTable{
		size:    size,
		buckets: make([]*bucket, size),
	}
}

func (hashTable *HashTable) hash(key string) int {
	var hash uint64 = 5381

	for _, c := range key {
		hash = hash*33 + uint64(c)
	}

	return int(hash % uint64(hashTable.size))
}

func (hashTable *HashTable) Set(key string, value interface{}) {
	index := hashTable.hash(key)

	if hashTable.buckets[index] == nil {
		hashTable.buckets[index] = &bucket{}
	}

	for i, entry := range hashTable.buckets[index].entries {
		if entry.key == key {
			hashTable.buckets[index].entries[i].value = value
			return
		}
	}

	hashTable.buckets[index].entries = append(hashTable.buckets[index].entries, Entry{key: key, value: value})
}

func (hashTable *HashTable) Get(key string) (interface{}, bool) {
	index := hashTable.hash(key)

	if hashTable.buckets[index] != nil {
		for _, entry := range hashTable.buckets[index].entries {
			if entry.key == key {
				return entry.value, true
			}
		}
	}

	return nil, false
}

func (hashTable *HashTable) Delete(key string) {
	index := hashTable.hash(key)

	if hashTable.buckets[index] != nil {
		for i, entry := range hashTable.buckets[index].entries {
			if entry.key == key {
				hashTable.buckets[index].entries = append(hashTable.buckets[index].entries[:i], hashTable.buckets[index].entries[i+1:]...)
				return
			}
		}
	}
}

func measure(start time.Time) {
	elapsed := time.Since(start)
	fmt.Println(elapsed)
}

func main() {
	keys := make([]string, 1_000_000)

	for i := 0; i < 1_000_000; i++ {
		id := uuid.New()

		keys[i] = id.String()
	}

	ht := NewHashTable(1_000_000)

	defer measure(time.Now())

	for j := 0; j < 1_000_000; j++ {
		ht.Set(keys[j], "John")
	}
}
