package models

type FortniteAllAPIResponse struct {
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

// ____________ SHOP___________

type FortniteShopAPIResponse struct {
	Result            bool              `json:"result"`
	FullShop          bool              `json:"fullShop"`
	LastUpdate        LastUpdate        `json:"lastUpdate"`
	CurrentRotation   map[string]string `json:"currentRotation"`
	NextRotation      string            `json:"nextRotation"`
	Carousel          string            `json:"carousel"`
	SpecialOfferVideo string            `json:"specialOfferVideo"`
	CustomBackground  string            `json:"customBackground"`
	Shop              []ShopEntry       `json:"shop"`
}

type LastUpdate struct {
	Uid  string `json:"uid"`
	Date string `json:"date"`
}

type ShopEntry struct {
	MainID              string         `json:"mainId"`
	DisplayName         string         `json:"displayName"`
	DisplayDescription  string         `json:"displayDescription"`
	DisplayType         string         `json:"displayType"`
	MainType            string         `json:"mainType"`
	OfferID             string         `json:"offerId"`
	DevName             string         `json:"devName"`
	OfferDates          OfferDates     `json:"offerDates"`
	Colors              Colors         `json:"colors"`
	DisplayAssets       []DisplayAsset `json:"displayAssets"`
	FirstReleaseDate    string         `json:"firstReleaseDate"`
	PreviousReleaseDate string         `json:"previousReleaseDate"`
	GiftAllowed         bool           `json:"giftAllowed"`
	BuyAllowed          bool           `json:"buyAllowed"`
	Price               Price          `json:"price"`
	Rarity              GenericIdName  `json:"rarity"`
	Series              GenericIdName  `json:"series"`
	Banner              Banner         `json:"banner"`
	OfferTag            struct {
		Id   string `json:"id"`
		Text string `json:"text"`
	} `json:"offerTag"`
	Granted []Cosmetic `json:"granted"`
}

type OfferDates struct {
	Out string `json:"out"`
	In  string `json:"in"`
}

type Colors struct {
	TextBackgroundColor string `json:"textBackgroundColor"`
	Color3              string `json:"color3"`
	Color2              string `json:"color2"`
	Color1              string `json:"color1"`
}

type DisplayAsset struct {
	DisplayAsset      string `json:"displayAsset"`
	MaterialInstance  string `json:"materialInstance"`
	URL               string `json:"url"`
	Flipbook          string `json:"flipbook"`
	BackgroundTexture string `json:"background_texture"`
	Background        string `json:"background"`
	FullBackground    string `json:"full_background"`
}

type Price struct {
	FloorPrice   int `json:"floorPrice"`
	FinalPrice   int `json:"finalPrice"`
	RegularPrice int `json:"regularPrice"`
}

type Banner struct {
	Intensity string `json:"intensity"`
	Name      string `json:"name"`
	ID        string `json:"id"`
}

type Style struct {
	Name           string `json:"name"`
	Channel        string `json:"channel"`
	ChannelName    string `json:"channelName"`
	Tag            string `json:"tag"`
	IsDefault      bool   `json:"isDefault"`
	StartUnlocked  bool   `json:"startUnlocked"`
	HideIfNotOwned bool   `json:"hideIfNotOwned"`
	Image          string `json:"image"`
}
