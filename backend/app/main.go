package main

import (
	"log"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func sayHello(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello world!",
	})
}

func main() {
	cfg := GetConfig()
	bot, err := tgbotapi.NewBotAPI(cfg.TELEGRAM_TOKEN)
	if err != nil {
		log.Fatalf("Could not initlaize telgram bot %v", err)
	}
	bot.Debug = true //  logs all interactions w telegram servers
	log.Printf("Authorized on account %s", bot.Self.UserName)
	// tgbotapi.NewWebhook()

	router := gin.Default()
	router.GET("/", sayHello)
	router.Run(cfg.PORT)
}
