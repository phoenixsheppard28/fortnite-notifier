package main

import (
	"log"
	"os"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/joho/godotenv"
)

type Config struct {
	FN_API_KEY         string
	FN_API_ENDPOINT    string
	DB_STRING          string
	TELEGRAM_TOKEN     string
	PORT               string
	PUBLIC_URL         string
	WEBHOOK_OBFUSCATOR string
}

func GetConfig() *Config {
	if err := godotenv.Load(".env.development"); err != nil {
		log.Fatalf("Could not load env vars: %s", err)
	}
	return &Config{
		FN_API_KEY:         os.Getenv("FN_API_KEY"),
		FN_API_ENDPOINT:    os.Getenv("FN_API_ENDPOINT"),
		DB_STRING:          os.Getenv("DB_STRING"),
		TELEGRAM_TOKEN:     os.Getenv("TELEGRAM_TOKEN"),
		PORT:               os.Getenv("PORT"),
		PUBLIC_URL:         os.Getenv("PUBLIC_URL"),
		WEBHOOK_OBFUSCATOR: os.Getenv("WEBHOOK_OBFUSCATOR"),
	}
}

func SetupWebhook(bot *tgbotapi.BotAPI, cfg *Config) {
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
