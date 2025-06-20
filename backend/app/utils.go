package main

import (
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func SetupWebhook(bot *tgbotapi.BotAPI, cfg *Config) {
	wh, err := tgbotapi.NewWebhook(cfg.PUBLIC_URL + "/webhook")
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

func GetStaticResponse(command *string) {

}
