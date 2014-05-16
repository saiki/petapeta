package whiteboard

import (
	"bytes"
	"encoding/gob"
	"log"
	"os"
)

type Fusen struct {
	Left  int
	Top   int
	Color string
	Body  string
}

func NewFusen(left, top int, color, body string) *Fusen {
	return &Fusen{Left: left, Top: top, Color: color, Body:body}
}

type Whiteboard struct {
	Collection map[int]*Fusen
}

func (self *Whiteboard) Init() *Whiteboard {
	self.Collection = make(map[int]*Fusen)
	return self
}

func (self *Whiteboard) Add(fusen *Fusen) int {
	next := len(self.Collection) + 1
	self.Collection[next] = fusen
	return next
}

func (self *Whiteboard) Export(path string) error {
	var buf bytes.Buffer
	enc := gob.NewEncoder(&buf)
	err := enc.Encode(self)
	if  err != nil {
		log.Fatalln("decode: ", err)
		return err
	}
	os.Remove(path)
	file, err := os.Create(path)
	if err != nil {
		log.Fatalln("create file: ", err)
		return err
	}
	defer file.Close()
	file.Write(buf.Bytes())
	return nil
}

func (self *Whiteboard) Import (path string) error {
	file, err := os.Open(path)
	if err != nil {
		log.Fatalln("open file:", err)
		return err
	}
	dec := gob.NewDecoder(file)
	err = dec.Decode(self)
	if err != nil {
		log.Fatalln("decode file:", err)
		return err
	}
	return nil
}