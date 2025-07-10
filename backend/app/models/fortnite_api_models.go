package models

type FortniteAPIResponse struct {
	Result bool       `json:"result"`
	Pages  int        `json:"pages"`
	Items  []Cosmetic `json:"items"`
}

// {'audio', 'set', 'releaseDate', 'path', 'battlepass', 'lastAppearance', 'builtInEmote', 'series', 'video'} nullables
type Cosmetic struct {
	ID               string          `json:"id"`
	Type             GenericIdName   `json:"type"`
	Name             string          `json:"name"`
	Description      string          `json:"description"`
	Rarity           GenericIdName   `json:"rarity"`
	Series           GenericIdName   `json:"series"`
	Price            uint            `json:"price"`
	Added            AddedInfo       `json:"added"`
	BuiltInEmote     *BuiltInEmote   `json:"builtInEmote"`
	CopyrightedAudio bool            `json:"copyrightedAudio"`
	Upcoming         bool            `json:"upcoming"`
	Reactive         bool            `json:"reactive"`
	ReleaseDate      *string         `json:"releaseDate"`
	LastAppearance   *string         `json:"lastAppearance"`
	Interest         float32         `json:"interest"`
	Images           Images          `json:"images"`
	Juno             Icon            `json:"juno"`
	Beans            Icon            `json:"beans"`
	Video            *string         `json:"video"`
	Audio            *string         `json:"audio"`
	Path             *string         `json:"path"`
	GameplayTags     []string        `json:"gameplayTags"`
	ApiTags          []string        `json:"apiTags"`
	Battlepass       *BattlepassInfo `json:"battlepass"`
	Set              *SetInfo        `json:"set"`
}

type GenericIdName struct {
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
type BattlepassInfo struct {
	Battlepass struct {
		Season      int    `json:"season"`
		Tier        int    `json:"tier"`
		Page        *int   `json:"page"`
		Type        string `json:"type"`
		DisplayText struct {
			Chapter       string `json:"chapter"`
			Season        string `json:"season"`
			ChapterSeason string `json:"chapterSeason"`
		} `json:"displayText"`
		BattlePassName string `json:"battlePassName"`
	} `json:"battlepass"`
}

type BuiltInEmote struct {
	ID          string         `json:"id"`
	Type        GenericIdName  `json:"type"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Rarity      GenericIdName  `json:"rarity"`
	Series      *GenericIdName `json:"series"`
	Images      Images         `json:"images"`
	Video       *string        `json:"video"` // nullable in your example
}
