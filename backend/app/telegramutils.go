package main

import (
	"errors"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func create(update *tgbotapi.Update, db *gorm.DB) (bool, error) {
	// returns true if created new user
	user_id := update.Message.From.ID
	var user = User{ID: user_id}

	user_exists, err := User_exists(user_id, db)
	if err != nil {
		return false, err
	}
	if user_exists {
		return false, nil
	} else {
		result := db.Create(&user)
		if result.Error != nil {
			return false, result.Error
		}
		return true, nil
	}
}

func start(update *tgbotapi.Update, db *gorm.DB) (string, error) {
	// returns the uuid associated with the user so their link can be constructed
	user_id := update.Message.From.ID
	var user = User{ID: user_id}
	user_exists, err := User_exists(user_id, db)
	if err != nil {
		return "", err
	}
	if !user_exists {
		return "", nil
	}
	result := db.First(&user)
	if result.Error != nil {
		return "", result.Error
	}
	return user.UUID.String(), nil
}

func User_exists(user_id int64, db *gorm.DB) (bool, error) {
	var user = User{ID: user_id}
	result := db.First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return false, nil
		} else {
			return false, result.Error
		}
	}
	return true, nil
}

func rotate(update *tgbotapi.Update, db *gorm.DB) (bool, error) {
	// returns true if it rotated, false if it did not (aka user does not exist)
	user_id := update.Message.From.ID
	var user = User{ID: user_id}
	user_exists, err := User_exists(user_id, db)
	if err != nil {
		return false, err
	}
	if !user_exists {
		return false, nil
	}

	if err := db.First(&user).Error; err != nil {
		return false, err
	}

	user.UUID, err = uuid.NewRandom()
	if err != nil {
		return false, err
	}

	if err := db.Save(&user).Error; err != nil {
		return false, err
	}

	return true, nil
}
