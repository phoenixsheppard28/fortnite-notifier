package models

type User struct {
	ID           int64      `gorm:"column:id;type:bigint;primaryKey;not null; unique"` // telegram account id num
	FirstName    string     `gorm:"column:first_name;type:varchar;"`
	TrackedItems []UserItem `gorm:"constraint:OnDelete:CASCADE;foreignKey:UserId"`
}

type UserItem struct { // join table
	UserId int64  `gorm:"column:user_id;type:bigint;index;primaryKey"`
	ItemId string `gorm:"column:item_id;type:varchar;index;primaryKey"`
}

type FortniteItem struct {
	ID             string     `gorm:"column:id;type:varchar;primaryKey;not null"`
	Name           string     `gorm:"column:name;type:varchar;not null"`
	Type           string     `gorm:"column:type;type:varchar"`
	Price          uint       `gorm:"column:price;type:uint"`
	Rarity         string     `gorm:"column:rarity;type:varchar;"`         // maybe should make an enum
	Image          string     `gorm:"column:image;type:varchar;"`          // link to image
	SetName        string     `gorm:"column:set;type:varchar"`             // should maybe make it a jsonb since the set is an object, can be null
	LastAppearance string     `gorm:"column:last_appearance;type:varchar"` // form yyyy-mm-dd
	Trackedby      []UserItem `gorm:"constraint:OnDelete:CASCADE;foreignKey:ItemId"`
}
