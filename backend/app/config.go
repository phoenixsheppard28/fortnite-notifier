package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	FN_API_KEY      string
	FN_API_ENDPOINT string
	DB_STRING       string
	TELEGRAM_TOKEN  string
	PORT            string
	PUBLIC_URL      string
}

func GetConfig() *Config {
	if err := godotenv.Load(".env.development"); err != nil {
		log.Fatalf("Could not load env vars: %s", err)
	}
	return &Config{
		FN_API_KEY:      os.Getenv("FN_API_KEY"),
		FN_API_ENDPOINT: os.Getenv("FN_API_ENDPOINT"),
		DB_STRING:       os.Getenv("DB_STRING"),
		TELEGRAM_TOKEN:  os.Getenv("TELEGRAM_TOKEN"),
		PORT:            os.Getenv("PORT"),
		PUBLIC_URL:      os.Getenv("PUBLIC_URL"),
	}
}
