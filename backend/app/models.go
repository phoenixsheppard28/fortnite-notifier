package main

import "github.com/google/uuid"

type User struct {
	ID   int64     `gorm:"column:id;type:int64;primaryKey;"`
	UUID uuid.UUID `gorm:"column:uuid;type:uuid;default:uuid_generate_v4();not null;unique"`
}
