package main

import (
	"github.com/google/uuid"
)

type User struct {
	ID   int64     `gorm:"column:id;type:int64;primaryKey;;not null; unique"`
	UUID uuid.UUID `gorm:"uniqueIndex;column:uuid;type:uuid;default:uuid_generate_v4();not null"`
}

type FortniteAPIResponse struct {
	Result bool       `json:"result"`
	Pages  int        `json:"pages"`
	Items  []Cosmetic `json:"items"`
}

type Cosmetic struct {
	ID               string    `json:"id"`
	Type             TypeInfo  `json:"type"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	Rarity           Rarity    `json:"rarity"`
	Series           *string   `json:"series"` // Nullable
	Price            int       `json:"price"`
	Added            AddedInfo `json:"added"`
	BuiltInEmote     *string   `json:"builtInEmote"`
	CopyrightedAudio bool      `json:"copyrightedAudio"`
	Upcoming         bool      `json:"upcoming"`
	Reactive         bool      `json:"reactive"`
	ReleaseDate      *string   `json:"releaseDate"`
	LastAppearance   *string   `json:"lastAppearance"`
	Interest         int       `json:"interest"`
	Images           Images    `json:"images"`
	Juno             Icon      `json:"juno"`
	Beans            Icon      `json:"beans"`
	Video            *string   `json:"video"`
	Audio            *string   `json:"audio"`
	Path             string    `json:"path"`
	GameplayTags     []string  `json:"gameplayTags"`
	ApiTags          []string  `json:"apiTags"`
	Battlepass       *string   `json:"battlepass"` // Nullable
	Set              SetInfo   `json:"set"`
}

type TypeInfo struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Rarity struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type AddedInfo struct {
	Date    string `json:"date"`
	Version string `json:"version"`
}

type Images struct {
	Icon           string  `json:"icon"`
	Featured       *string `json:"featured"`
	Background     string  `json:"background"`
	IconBackground string  `json:"icon_background"`
	FullBackground string  `json:"full_background"`
}

type Icon struct {
	Icon string `json:"icon"`
}

type SetInfo struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	PartOf string `json:"partOf"`
}
