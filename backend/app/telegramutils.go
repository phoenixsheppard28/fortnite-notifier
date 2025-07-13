package main

import (
	"errors"
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/models"
	"gorm.io/gorm"
)

func create(update *tgbotapi.Update, db *gorm.DB) (bool, error) {
	// returns true if created new user
	user_id := update.Message.From.ID
	first_name := update.Message.From.FirstName
	var user = models.User{ID: user_id, FirstName: first_name}

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

func User_exists(user_id int64, db *gorm.DB) (bool, error) {
	var user = models.User{ID: user_id}
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

func SetupWebhook(bot *tgbotapi.BotAPI, cfg *models.Config) {
	wh, err := tgbotapi.NewWebhook(cfg.PUBLIC_URL + "/webhook" + cfg.WEBHOOK_OBFUSCATOR) // in dev webbook obfuscator is nothing lol
	if err != nil {
		log.Fatal("Could not create webhook")
	}
	_, err = bot.Request(wh) // register webhook with telegram
	if err != nil {
		panic(err)
	}

	info, err := bot.GetWebhookInfo() // check if it works
	if err != nil {
		panic(err)
	}

	if info.LastErrorDate != 0 {
		log.Printf("Telegram callback failed: %s", info.LastErrorMessage)
	}
}
