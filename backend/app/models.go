package main

import "github.com/google/uuid"

type User struct {
	ID   int64     `gorm:"column:id;type:int64;primaryKey;;not null; unique"`
	UUID uuid.UUID `gorm:"uniqueIndex;column:uuid;type:uuid;default:uuid_generate_v4();not null"`
}
