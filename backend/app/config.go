package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/models"
)

func GetConfig() *models.Config {
	if os.Getenv("GO_ENV") == "" { // development
		if err := godotenv.Load(".env.development"); err != nil {
			log.Fatalf("Could not load env vars: %s", err)
		}
	}
	return &models.Config{
		FN_API_KEY:         os.Getenv("FN_API_KEY"),
		FN_API_ENDPOINT:    os.Getenv("FN_API_ENDPOINT"),
		DB_STRING:          os.Getenv("DB_STRING"),
		TELEGRAM_TOKEN:     os.Getenv("TELEGRAM_TOKEN"),
		PORT:               os.Getenv("PORT"),
		PUBLIC_URL:         os.Getenv("PUBLIC_URL"),
		WEBHOOK_OBFUSCATOR: os.Getenv("WEBHOOK_OBFUSCATOR"),
		ADMIN_API_KEY:      os.Getenv("ADMIN_API_KEY"),
		FRONTEND_URL:       os.Getenv("FRONTEND_URL"),
		JWT_SECRET:         os.Getenv("JWT_SECRET"),
	}
}
